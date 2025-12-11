import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoyaltyTier, LoyaltyTierSchema } from './schemas/loyalty-tier.schema';
import { LoyaltyTierService } from './loyalty-tier.service';
import { LoyaltyTierController } from './loyalty-tier.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoyaltyTier.name, schema: LoyaltyTierSchema },
    ]),
  ],
  providers: [LoyaltyTierService],
  controllers: [LoyaltyTierController],
  exports: [LoyaltyTierService],
})
export class LoyaltyTierModule {}
