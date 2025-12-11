import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoyaltyTierDocument = LoyaltyTier & Document;

export type TierName = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

@Schema({ collection: 'loyaltytiers', timestamps: true })
export class LoyaltyTier {
  @Prop({ required: true })
  tenantId: number;

  @Prop({
    required: true,
    enum: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'],
  })
  tierName: TierName;

  @Prop({ required: true })
  minPoints: number;

  @Prop({ required: true })
  earnMultiplier: number;

  @Prop()
  benefits?: string;
}

export const LoyaltyTierSchema = SchemaFactory.createForClass(LoyaltyTier);
