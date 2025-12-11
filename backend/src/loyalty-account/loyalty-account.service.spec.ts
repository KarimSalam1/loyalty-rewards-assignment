import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyAccountService } from './loyalty-account.service';

describe('LoyaltyAccountService', () => {
  let service: LoyaltyAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoyaltyAccountService],
    }).compile();

    service = module.get<LoyaltyAccountService>(LoyaltyAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
