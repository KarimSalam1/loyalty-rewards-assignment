import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyTransactionController } from './loyalty-transaction.controller';

describe('LoyaltyAccountController', () => {
  let controller: LoyaltyTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoyaltyTransactionController],
    }).compile();

    controller = module.get<LoyaltyTransactionController>(
      LoyaltyTransactionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
