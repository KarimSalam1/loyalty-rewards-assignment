import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LoyaltyTier,
  LoyaltyTierDocument,
  TierName,
} from './schemas/loyalty-tier.schema';
import { LoyaltyAccountDocument } from '../loyalty-account/schemas/loyalty-account.schema';

@Injectable()
export class LoyaltyTierService implements OnModuleInit {
  constructor(
    @InjectModel(LoyaltyTier.name)
    private readonly tierModel: Model<LoyaltyTierDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.tierModel.countDocuments({ tenantId: 1 });

    if (count === 0) {
      await this.tierModel.insertMany([
        {
          tenantId: 1,
          tierName: 'BRONZE',
          minPoints: 0,
          earnMultiplier: 1.0,
          benefits: 'Base tier',
        },
        {
          tenantId: 1,
          tierName: 'SILVER',
          minPoints: 1000,
          earnMultiplier: 1.25,
          benefits: 'Priority support, small perks',
        },
        {
          tenantId: 1,
          tierName: 'GOLD',
          minPoints: 5000,
          earnMultiplier: 1.5,
          benefits: 'Free upgrades, better perks',
        },
        {
          tenantId: 1,
          tierName: 'PLATINUM',
          minPoints: 10000,
          earnMultiplier: 2.0,
          benefits: 'Top tier benefits',
        },
      ]);
    }
  }

  async findAll(tenantId = 1) {
    return this.tierModel.find({ tenantId }).sort({ minPoints: 1 }).exec();
  }

  async findByTierName(tierName: TierName, tenantId = 1) {
    return this.tierModel.findOne({ tenantId, tierName }).exec();
  }

  async getMultiplierForTier(
    tierName: TierName,
    tenantId = 1,
  ): Promise<number> {
    const tier = await this.findByTierName(tierName, tenantId);
    return tier?.earnMultiplier ?? 1.0;
  }

  async determineTier(points: number, tenantId = 1) {
    return this.tierModel
      .findOne({
        tenantId,
        minPoints: { $lte: points },
      })
      .sort({ minPoints: -1 })
      .exec();
  }

  async evaluateTierForAccount(
    account: LoyaltyAccountDocument,
    tenantId = 1,
  ): Promise<LoyaltyAccountDocument> {
    const newTier = await this.determineTier(
      account.tierQualifyingPoints,
      tenantId,
    );

    if (!newTier) return account;

    const oldTier = account.tier;

    if (newTier.tierName !== oldTier) {
      account.tier = newTier.tierName;
      account.tierDate = new Date();
      await account.save();
    }

    return account;
  }

  async getTiers(tenantId = 1) {
    return this.tierModel.find({ tenantId }).sort({ minPoints: 1 });
  }
}
