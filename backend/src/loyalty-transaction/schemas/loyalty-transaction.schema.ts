import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LoyaltyTransactionDocument = LoyaltyTransaction & Document;

export enum TransactionType {
  EARN = 'EARN',
  REDEEM = 'REDEEM',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum TransactionCategory {
  NTM = 'NTM',
  PROMOTIONAL = 'PROMOTIONAL',
  CPC = 'CPC',
  REDEMPTION = 'REDEMPTION',
}

@Schema({ timestamps: true })
export class LoyaltyTransaction {
  @Prop({ required: true })
  tenantId: number;

  @Prop({ type: Types.ObjectId, ref: 'LoyaltyAccount', required: true })
  loyaltyAccountId: Types.ObjectId;

  @Prop()
  rentalId?: number;

  @Prop({ required: true, enum: TransactionType })
  type: TransactionType;

  @Prop({ required: true, enum: TransactionCategory })
  category: TransactionCategory;

  @Prop({ required: true })
  points: number;

  @Prop()
  description: string;

  @Prop({ required: true, default: () => new Date() })
  transactionDate: Date;

  @Prop()
  expirationDate?: Date;

  @Prop()
  batchId?: string;

  @Prop({ required: true, default: false })
  posted: boolean;

  @Prop({ default: false })
  expired: boolean;
}

export const LoyaltyTransactionSchema =
  SchemaFactory.createForClass(LoyaltyTransaction);
