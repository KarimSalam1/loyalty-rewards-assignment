import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LoyaltyAccount,
  LoyaltyAccountSchema,
} from './schemas/loyalty-account.schema';
import { LoyaltyAccountController } from './loyalty-account.controller';
import { LoyaltyAccountService } from './loyalty-account.service';
import { LoyaltyTierModule } from 'src/loyalty-tier/loyalty-tier.module';
import { LoyaltyTransactionModule } from '../loyalty-transaction/loyalty-transaction.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoyaltyAccount.name, schema: LoyaltyAccountSchema },
    ]),
    LoyaltyTierModule,
    forwardRef(() => LoyaltyTransactionModule),
  ],
  controllers: [LoyaltyAccountController],
  providers: [LoyaltyAccountService],
  exports: [LoyaltyAccountService],
})
export class LoyaltyAccountModule {}
