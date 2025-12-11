import { IsNumber } from 'class-validator';

export class CheckTierDto {
  @IsNumber()
  customerId: number;
}
