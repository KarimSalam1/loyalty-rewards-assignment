import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  LoyaltyTransaction,
  LoyaltyTransactionDocument,
  TransactionType,
  TransactionCategory,
} from './schemas/loyalty-transaction.schema';
import { LoyaltyAccountService } from '../loyalty-account/loyalty-account.service';
import { CalculatePointsDto } from './dto/calculate.dto';

@Injectable()
export class LoyaltyTransactionService {
  constructor(
    @InjectModel(LoyaltyTransaction.name)
    private transactionModel: Model<LoyaltyTransactionDocument>,

    private readonly accountService: LoyaltyAccountService,
  ) {}

  async earnPoints(data: {
    customerId: number;
    rentalId?: number;
    category: TransactionCategory;
    points?: number;
    rentalDuration?: number;
    milesDriven?: number;
    description: string;
  }) {
    const account = await this.accountService.findByCustomerId(
      data.customerId,
      1,
    );
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    let points: number;

    if (data.category === TransactionCategory.NTM) {
      if (data.rentalDuration === undefined || data.milesDriven === undefined) {
        throw new BadRequestException(
          'NTM requires rentalDuration and milesDriven',
        );
      }

      const calc = await this.calculatePoints({
        customerId: data.customerId,
        rentalDuration: data.rentalDuration,
        milesDriven: data.milesDriven,
      });

      points = calc.total;
    } else if (data.category === TransactionCategory.PROMOTIONAL) {
      points = Number(data.points);

      if (!points || points <= 0) {
        throw new BadRequestException(
          'PROMOTIONAL requires a positive points value',
        );
      }
    } else if (data.category === TransactionCategory.CPC) {
      points = Number(data.points);

      if (!points || points <= 0) {
        throw new BadRequestException('CPC requires a positive points value');
      }
    } else {
      throw new BadRequestException('Unsupported category');
    }

    console.log('Calculated EARN POINTS:', points);

    return this.transactionModel.create({
      tenantId: 1,
      loyaltyAccountId: account._id,
      rentalId: data.rentalId,
      type: TransactionType.EARN,
      category: data.category,
      points,
      description: data.description,
      transactionDate: new Date(),
      expirationDate,
      posted: false,
    });
  }

  async redeemPoints(data: {
    customerId: number;
    points: number;
    description: string;
  }) {
    const { customerId, points, description } = data;

    if (points <= 0) {
      throw new BadRequestException('Points to redeem must be positive');
    }

    const account = await this.accountService.findByCustomerId(customerId, 1);
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    const pendingRedeems = await this.transactionModel.find({
      loyaltyAccountId: account._id,
      type: TransactionType.REDEEM,
      posted: false,
    });

    const pendingRedeemTotal = pendingRedeems.reduce(
      (sum, tx) => sum + Math.abs(tx.points),
      0,
    );

    const effectiveBalance = account.currentBalance - pendingRedeemTotal;

    if (points > effectiveBalance) {
      throw new BadRequestException(
        `Insufficient balance. You have only ${effectiveBalance} points available.`,
      );
    }

    const now = new Date();
    const earnings = await this.transactionModel
      .find({
        tenantId: 1,
        loyaltyAccountId: account._id,
        type: TransactionType.EARN,
        posted: true,
        expirationDate: { $gte: now },
      })
      .sort({ transactionDate: 1 });

    const totalAvailable = earnings.reduce((sum, tx) => sum + tx.points, 0);

    if (totalAvailable < points) {
      throw new BadRequestException(
        `Insufficient balance. Available: ${totalAvailable}, requested: ${points}`,
      );
    }

    let remaining = points;

    const updates: { earnTransactionId: Types.ObjectId; deducted: number }[] =
      [];

    for (const earnTx of earnings) {
      if (remaining <= 0) break;

      const deduct = Math.min(earnTx.points, remaining);

      updates.push({
        earnTransactionId: earnTx._id,
        deducted: deduct,
      });

      remaining -= deduct;
    }

    const redeemTx = await this.transactionModel.create({
      tenantId: 1,
      loyaltyAccountId: account._id,
      type: TransactionType.REDEEM,
      category: TransactionCategory.REDEMPTION,
      points: -points,
      description,
      transactionDate: new Date(),
      posted: false,
    });

    return {
      message: 'Redemption created successfully (pending posting)',
      redeemTransaction: redeemTx,
      fifoBreakdown: updates,
    };
  }

  async getTransactions(customerId: number) {
    const account = await this.accountService.findByCustomerId(customerId, 1);
    if (!account) throw new BadRequestException('Account not found');

    return this.transactionModel.find({
      loyaltyAccountId: account._id,
    });
  }

  async batchPostTransactions() {
    const pendingTx = await this.transactionModel.find({
      tenantId: 1,
      posted: false,
    });

    if (pendingTx.length === 0) {
      return { message: 'No pending transactions to post' };
    }

    const batchId = `BATCH-${Date.now()}`;

    let totalEarned = 0;
    let totalRedeemed = 0;

    for (const tx of pendingTx) {
      const account = await this.accountService.findById(tx.loyaltyAccountId);

      if (!account) continue;

      if (tx.type === TransactionType.EARN) {
        account.currentBalance += tx.points;
        account.totalPointsEarned += tx.points;
        account.tierQualifyingPoints += tx.points;

        totalEarned += tx.points;
      } else if (tx.type === TransactionType.REDEEM) {
        account.currentBalance += tx.points;
        account.pointsRedeemed += Math.abs(tx.points);

        totalRedeemed += Math.abs(tx.points);
      }

      await account.save();

      tx.posted = true;
      tx.batchId = batchId;
      await tx.save();
    }

    return {
      message: 'Batch posting completed',
      batchId,
      processed: pendingTx.length,
      totalEarned,
      totalRedeemed,
    };
  }

  async calculatePoints(dto: CalculatePointsDto) {
    const { customerId, rentalDuration, milesDriven } = dto;

    const account = await this.accountService.findByCustomerId(customerId);
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    const tierMultipliers: { [key: string]: number } = {
      BRONZE: 1.0,
      SILVER: 1.25,
      GOLD: 1.5,
      PLATINUM: 2.0,
    };

    const multiplier = tierMultipliers[account.tier] ?? 1.0;

    const POINTS_PER_DAY = 20;
    const POINTS_PER_MILE = 0.2;

    const baseFromDays = rentalDuration * POINTS_PER_DAY;
    const baseFromMiles = milesDriven * POINTS_PER_MILE;

    const ntmPoints = Math.floor((baseFromDays + baseFromMiles) * multiplier);

    return {
      ntmPoints,
      promotional: 0,
      total: ntmPoints,
      calculation: `${rentalDuration} days × ${POINTS_PER_DAY} = ${baseFromDays} + ${milesDriven} × ${POINTS_PER_MILE} = ${baseFromMiles}`,
      tier: account.tier,
      tierMultiplier: multiplier,
    };
  }

  async checkTier(customerId: number) {
    const account = await this.accountService.findByCustomerId(customerId, 1);
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    const thresholds = {
      BRONZE: 0,
      SILVER: 1000,
      GOLD: 5000,
      PLATINUM: 10000,
    };

    const currentPoints = account.tierQualifyingPoints;

    let newTier = account.tier;

    if (currentPoints >= thresholds.PLATINUM) newTier = 'PLATINUM';
    else if (currentPoints >= thresholds.GOLD) newTier = 'GOLD';
    else if (currentPoints >= thresholds.SILVER) newTier = 'SILVER';
    else newTier = 'BRONZE';

    const upgraded = newTier !== account.tier;

    if (upgraded) {
      account.tier = newTier;
      account.tierDate = new Date();
      await account.save();
    }

    return {
      upgraded,
      oldTier: account.tier,
      newTier,
      tierQualifyingPoints: currentPoints,
    };
  }
}
