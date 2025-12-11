import { IsNumber, IsString } from 'class-validator';

export class RedeemPointsDto {
  @IsNumber()
  customerId: number;

  @IsNumber()
  points: number;

  @IsString()
  description: string;
}
