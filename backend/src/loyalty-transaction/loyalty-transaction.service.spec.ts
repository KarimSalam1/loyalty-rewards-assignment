import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyTransactionService } from './loyalty-transaction.service';
import { getModelToken } from '@nestjs/mongoose';
import {
  LoyaltyTransaction,
  TransactionCategory,
  TransactionType,
} from './schemas/loyalty-transaction.schema';
import { LoyaltyAccountService } from '../loyalty-account/loyalty-account.service';
import { BadRequestException } from '@nestjs/common';

describe('LoyaltyTransactionService', () => {
  let service: LoyaltyTransactionService;
  let accountService: LoyaltyAccountService;
  let transactionModel: any;

  beforeEach(async () => {
    transactionModel = {
      create: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoyaltyTransactionService,
        {
          provide: getModelToken(LoyaltyTransaction.name),
          useValue: transactionModel,
        },
        {
          provide: LoyaltyAccountService,
          useValue: {
            findByCustomerId: jest.fn(),
            findById: jest.fn(),
            reduceBalance: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LoyaltyTransactionService>(LoyaltyTransactionService);
    accountService = module.get<LoyaltyAccountService>(LoyaltyAccountService);
  });

  describe('calculatePoints', () => {
    it('calculates NTM points correctly with SILVER tier multiplier', async () => {
      jest.spyOn(accountService, 'findByCustomerId').mockResolvedValue({
        tier: 'SILVER',
      } as any);

      const result = await service.calculatePoints({
        customerId: 123,
        rentalDuration: 5,
        milesDriven: 100,
      });

      expect(result.ntmPoints).toBe(150);
      expect(result.total).toBe(150);
      expect(result.tier).toBe('SILVER');
      expect(result.tierMultiplier).toBe(1.25);
    });

    it('calculates NTM points correctly for BRONZE tier', async () => {
      jest.spyOn(accountService, 'findByCustomerId').mockResolvedValue({
        tier: 'BRONZE',
      } as any);

      const result = await service.calculatePoints({
        customerId: 123,
        rentalDuration: 2,
        milesDriven: 50,
      });

      expect(result.ntmPoints).toBe(50);
      expect(result.total).toBe(50);
      expect(result.tierMultiplier).toBe(1.0);
    });

    it('throws if account is not found', async () => {
      jest.spyOn(accountService, 'findByCustomerId').mockResolvedValue(null);

      await expect(
        service.calculatePoints({
          customerId: 999,
          rentalDuration: 3,
          milesDriven: 20,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('earnPoints', () => {
    it('creates an NTM earn transaction', async () => {
      jest.spyOn(accountService, 'findByCustomerId').mockResolvedValue({
        _id: 'acc1',
        tier: 'BRONZE',
      } as any);

      jest.spyOn(service, 'calculatePoints').mockResolvedValue({
        total: 100,
      } as any);

      transactionModel.create.mockResolvedValue({});

      await service.earnPoints({
        customerId: 1,
        category: TransactionCategory.NTM,
        rentalDuration: 3,
        milesDriven: 50,
        description: 'NTM earn',
      });

      expect(transactionModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: TransactionType.EARN,
          category: TransactionCategory.NTM,
          points: 100,
          posted: false,
        }),
      );
    });

    it('creates a PROMOTIONAL earn transaction', async () => {
      jest.spyOn(accountService, 'findByCustomerId').mockResolvedValue({
        _id: 'acc1',
      } as any);

      transactionModel.create.mockResolvedValue({});

      await service.earnPoints({
        customerId: 1,
        category: TransactionCategory.PROMOTIONAL,
        points: 500,
        description: 'Promo bonus',
      });

      expect(transactionModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          category: TransactionCategory.PROMOTIONAL,
          points: 500,
        }),
      );
    });

    it('throws if account is not found', async () => {
      jest.spyOn(accountService, 'findByCustomerId').mockResolvedValue(null);

      await expect(
        service.earnPoints({
          customerId: 999,
          category: TransactionCategory.PROMOTIONAL,
          points: 100,
          description: 'Promotional bonus',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('redeemPoints', () => {
    it('redeems points using FIFO order', async () => {
      jest
        .spyOn(service, 'cleanupExpiredPoints')
        .mockResolvedValue({ expiredCount: 0, expiredPoints: 0 } as any);

      jest.spyOn(accountService, 'findByCustomerId').mockResolvedValue({
        _id: 'acc1',
        currentBalance: 300,
      } as any);

      transactionModel.find.mockResolvedValueOnce([]).mockReturnValueOnce({
        sort: jest.fn().mockResolvedValue([
          { _id: 'e1', points: 100 },
          { _id: 'e2', points: 200 },
        ]),
      });

      transactionModel.create.mockResolvedValue({});

      const result = await service.redeemPoints({
        customerId: 1,
        points: 250,
        description: 'Redeem FIFO',
      });

      expect(result.fifoBreakdown).toEqual([
        { earnTransactionId: 'e1', deducted: 100 },
        { earnTransactionId: 'e2', deducted: 150 },
      ]);
    });

    it('throws if balance is insufficient', async () => {
      jest
        .spyOn(service, 'cleanupExpiredPoints')
        .mockResolvedValue({ expiredCount: 0, expiredPoints: 0 } as any);

      jest.spyOn(accountService, 'findByCustomerId').mockResolvedValue({
        _id: 'acc1',
        currentBalance: 100,
      } as any);

      transactionModel.find.mockResolvedValue([]);

      await expect(
        service.redeemPoints({
          customerId: 1,
          points: 200,
          description: 'Over redeem',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
  describe('cleanupExpiredPoints', () => {
    it('expires earned points and updates account balance', async () => {
      const expiredTxs = [
        { points: 300, expired: false, save: jest.fn() },
        { points: 200, expired: false, save: jest.fn() },
      ];

      transactionModel.find = jest.fn().mockResolvedValue(expiredTxs);

      const account = {
        _id: 'acc1',
        currentBalance: 600,
        save: jest.fn(),
      };

      jest.spyOn(accountService, 'findById').mockResolvedValue(account as any);

      const result = await service.cleanupExpiredPoints('acc1' as any);

      expect(result.expiredCount).toBe(2);
      expect(result.expiredPoints).toBe(500);

      expect(accountService.reduceBalance).toHaveBeenCalledWith('acc1', 500);

      expect(expiredTxs[0].expired).toBe(true);
      expect(expiredTxs[1].expired).toBe(true);
    });

    it('does nothing if no expired transactions exist', async () => {
      transactionModel.find = jest.fn().mockResolvedValue([]);

      const result = await service.cleanupExpiredPoints('acc1' as any);

      expect(result.expiredCount).toBe(0);
      expect(result.expiredPoints).toBe(0);
    });

    it('does not allow balance to go negative', async () => {
      const expiredTxs = [{ points: 500, expired: false, save: jest.fn() }];

      transactionModel.find = jest.fn().mockResolvedValue(expiredTxs);

      const account = {
        _id: 'acc1',
        currentBalance: 200,
        save: jest.fn(),
      };

      jest.spyOn(accountService, 'findById').mockResolvedValue(account as any);

      await service.cleanupExpiredPoints('acc1' as any);

      expect(accountService.reduceBalance).toHaveBeenCalledWith('acc1', 500);
    });
  });
});
