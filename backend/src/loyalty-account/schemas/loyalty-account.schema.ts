import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoyaltyAccountDocument = LoyaltyAccount & Document;

@Schema({ timestamps: true })
export class LoyaltyAccount {
  @Prop({ required: true })
  tenantId: number;

  @Prop({ required: true, unique: false })
  customerId: number;

  @Prop({ required: true })
  accountNumber: string;

  @Prop({ required: true, default: 'BRONZE' })
  tier: string;

  @Prop({ required: true, default: 0 })
  currentBalance: number;

  @Prop({ required: true, default: 0 })
  totalPointsEarned: number;

  @Prop({ required: true, default: 0 })
  pointsRedeemed: number;

  @Prop({ required: true, default: 0 })
  tierQualifyingPoints: number;

  @Prop({ required: true, default: () => new Date() })
  joinDate: Date;

  @Prop({ required: true, default: () => new Date() })
  tierDate: Date;
}

export const LoyaltyAccountSchema =
  SchemaFactory.createForClass(LoyaltyAccount);

LoyaltyAccountSchema.index({ tenantId: 1, customerId: 1 }, { unique: true });
