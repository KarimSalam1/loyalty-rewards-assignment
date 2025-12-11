import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LoyaltyTransaction,
  LoyaltyTransactionSchema,
} from './schemas/loyalty-transaction.schema';
import { LoyaltyTransactionService } from './loyalty-transaction.service';
import { LoyaltyTransactionController } from './loyalty-transaction.controller';
import { LoyaltyAccountModule } from '../loyalty-account/loyalty-account.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoyaltyTransaction.name, schema: LoyaltyTransactionSchema },
    ]),
    LoyaltyAccountModule,
  ],
  controllers: [LoyaltyTransactionController],
  providers: [LoyaltyTransactionService],
  exports: [LoyaltyTransactionService],
})
export class LoyaltyTransactionModule {}
