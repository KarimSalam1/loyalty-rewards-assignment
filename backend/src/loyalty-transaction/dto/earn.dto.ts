import { IsNumber, IsOptional, IsEnum, IsString } from 'class-validator';
import { TransactionCategory } from '../schemas/loyalty-transaction.schema';

export class EarnPointsDto {
  @IsNumber()
  customerId: number;

  @IsEnum(TransactionCategory)
  category: TransactionCategory;

  @IsNumber()
  @IsOptional()
  rentalId?: number;

  @IsNumber()
  @IsOptional()
  rentalDuration?: number;

  @IsNumber()
  @IsOptional()
  milesDriven?: number;

  @IsNumber()
  @IsOptional()
  points?: number;

  @IsString()
  description: string;
}
