import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoyaltyAccountModule } from './loyalty-account/loyalty-account.module';
import { LoyaltyTransactionModule } from './loyalty-transaction/loyalty-transaction.module';
import { LoyaltyTierModule } from './loyalty-tier/loyalty-tier.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRoot(process.env.MONGO_URI!),
    LoyaltyAccountModule,
    LoyaltyTransactionModule,
    LoyaltyTierModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
