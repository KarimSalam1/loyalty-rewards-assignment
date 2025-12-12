import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyTierService } from './loyalty-tier.service';
import { getModelToken } from '@nestjs/mongoose';
import { LoyaltyTier } from './schemas/loyalty-tier.schema';
import { LoyaltyAccountDocument } from '../loyalty-account/schemas/loyalty-account.schema';
import { Model } from 'mongoose';

describe('LoyaltyTierService', () => {
  let service: LoyaltyTierService;
  let tierModel: jest.Mocked<Partial<Model<LoyaltyTier>>>;

  beforeEach(async () => {
    tierModel = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoyaltyTierService,
        {
          provide: getModelToken(LoyaltyTier.name),
          useValue: tierModel,
        },
      ],
    }).compile();

    service = module.get<LoyaltyTierService>(LoyaltyTierService);
  });

  function mockDetermineTier(tierName: string) {
    (tierModel.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ tierName }),
      }),
    });
  }

  it('does not upgrade tier if determined tier is the same', async () => {
    mockDetermineTier('BRONZE');

    const account: Partial<LoyaltyAccountDocument> = {
      tier: 'BRONZE',
      tierQualifyingPoints: 500,
      save: jest.fn(),
    };

    const result = await service.evaluateTierForAccount(
      account as LoyaltyAccountDocument,
    );

    expect(result.tier).toBe('BRONZE');
    expect(account.save).not.toHaveBeenCalled();
  });

  it('upgrades tier when threshold is crossed', async () => {
    mockDetermineTier('SILVER');

    const account: Partial<LoyaltyAccountDocument> = {
      tier: 'BRONZE',
      tierQualifyingPoints: 1200,
      save: jest.fn(),
    };

    const result = await service.evaluateTierForAccount(
      account as LoyaltyAccountDocument,
    );

    expect(result.tier).toBe('SILVER');
    expect(account.save).toHaveBeenCalledTimes(1);
  });

  it('upgrades from GOLD to PLATINUM', async () => {
    mockDetermineTier('PLATINUM');

    const account: Partial<LoyaltyAccountDocument> = {
      tier: 'GOLD',
      tierQualifyingPoints: 15000,
      save: jest.fn(),
    };

    const result = await service.evaluateTierForAccount(
      account as LoyaltyAccountDocument,
    );

    expect(result.tier).toBe('PLATINUM');
    expect(account.save).toHaveBeenCalledTimes(1);
  });
});
