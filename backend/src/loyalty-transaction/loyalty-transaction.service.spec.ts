import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyTransactionService } from './loyalty-transaction.service';

describe('LoyaltyAccountService', () => {
  let service: LoyaltyTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoyaltyTransactionService],
    }).compile();

    service = module.get<LoyaltyTransactionService>(LoyaltyTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
