import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { LoyaltyAccountService } from './loyalty-account.service';
import { LoyaltyAccount } from './schemas/loyalty-account.schema';
import { LoyaltyTierService } from '../loyalty-tier/loyalty-tier.service';
import { LoyaltyTransactionService } from '../loyalty-transaction/loyalty-transaction.service';

describe('LoyaltyAccountService', () => {
  let service: LoyaltyAccountService;

  const mockAccountModel = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
  };

  const mockTierService = {
    evaluateTierForAccount: jest.fn(),
  };

  const mockTransactionService = {
    cleanupExpiredPoints: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoyaltyAccountService,
        {
          provide: getModelToken(LoyaltyAccount.name),
          useValue: mockAccountModel,
        },
        {
          provide: LoyaltyTierService,
          useValue: mockTierService,
        },
        {
          provide: LoyaltyTransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    service = module.get<LoyaltyAccountService>(LoyaltyAccountService);

    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    it('should create a new account when none exists', () => {
      mockAccountModel.findOne.mockResolvedValue(null);

      mockAccountModel.find.mockReturnValueOnce({
        sort: () => ({
          limit: () => Promise.resolve([]),
        }),
      });

      mockAccountModel.findOne.mockResolvedValue(null);

      mockAccountModel.create.mockResolvedValue({
        customerId: 1,
        accountNumber: 'LOY-1-000001',
      });
    });

    it('should throw if account already exists', async () => {
      mockAccountModel.findOne.mockResolvedValue({ customerId: 123 });

      await expect(service.createAccount(123)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findByCustomerId', () => {
    it('should return null if account not found', async () => {
      mockAccountModel.findOne.mockResolvedValue(null);

      const result = await service.findByCustomerId(999);

      expect(result).toBeNull();
    });

    it('should cleanup expired points and evaluate tier', async () => {
      const mockAccount = { _id: 'abc', tier: 'BRONZE' };

      mockAccountModel.findOne.mockResolvedValue(mockAccount);

      const result = await service.findByCustomerId(123);

      expect(mockTransactionService.cleanupExpiredPoints).toHaveBeenCalledWith(
        mockAccount._id,
      );
      expect(mockTierService.evaluateTierForAccount).toHaveBeenCalledWith(
        mockAccount,
      );
      expect(result).toEqual(mockAccount);
    });
  });
});
