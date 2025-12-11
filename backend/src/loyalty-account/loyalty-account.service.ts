import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  LoyaltyAccount,
  LoyaltyAccountDocument,
} from './schemas/loyalty-account.schema';
import { LoyaltyTierService } from 'src/loyalty-tier/loyalty-tier.service';

@Injectable()
export class LoyaltyAccountService {
  constructor(
    @InjectModel(LoyaltyAccount.name)
    private accountModel: Model<LoyaltyAccountDocument>,
    private readonly tierService: LoyaltyTierService,
  ) {}

  async createAccount(customerId: number, tenantId = 1) {
    const existing = await this.accountModel.findOne({ tenantId, customerId });
    if (existing) {
      throw new BadRequestException(
        `Account already exists for customer ${customerId}`,
      );
    }

    const accountNumber = await this.generateAccountNumber(tenantId);

    const newAccount = new this.accountModel({
      tenantId,
      customerId,
      accountNumber,
      tier: 'BRONZE',
      tierQualifyingPoints: 0,
      currentBalance: 0,
      totalPointsEarned: 0,
      pointsRedeemed: 0,
      tierDate: new Date(),
      joinDate: new Date(),
    });

    return newAccount.save();
  }

  async findByCustomerId(customerId: number, tenantId = 1) {
    const account = await this.accountModel.findOne({ customerId, tenantId });
    if (!account) return null;

    await this.tierService.evaluateTierForAccount(account);

    return account;
  }

  async findById(id: string | Types.ObjectId, tenantId = 1) {
    const account = await this.accountModel.findOne({ _id: id, tenantId });
    if (!account) return null;

    await this.tierService.evaluateTierForAccount(account);

    return account;
  }

  private async generateAccountNumber(tenantId: number) {
    const last = await this.accountModel
      .find({ tenantId })
      .sort({ createdAt: -1 })
      .limit(1);

    const next = last.length
      ? Number(last[0].accountNumber.split('-')[2]) + 1
      : 1;

    return `LOY-${tenantId}-${String(next).padStart(6, '0')}`;
  }

  async getAccountIdByCustomer(customerId: number, tenantId = 1) {
    const account = await this.accountModel
      .findOne({ customerId, tenantId })
      .exec();
    if (!account) return null;
    return account._id;
  }
}
