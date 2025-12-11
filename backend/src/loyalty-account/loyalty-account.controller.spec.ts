import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyAccountController } from './loyalty-account.controller';

describe('LoyaltyAccountController', () => {
  let controller: LoyaltyAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoyaltyAccountController],
    }).compile();

    controller = module.get<LoyaltyAccountController>(LoyaltyAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
