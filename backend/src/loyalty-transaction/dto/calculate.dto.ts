import { IsNumber } from 'class-validator';

export class CalculatePointsDto {
  @IsNumber()
  customerId: number;

  @IsNumber()
  rentalDuration: number;

  @IsNumber()
  milesDriven: number;
}
