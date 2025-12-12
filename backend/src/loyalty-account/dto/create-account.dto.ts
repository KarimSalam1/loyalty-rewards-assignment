import { IsInt, IsPositive, IsOptional } from 'class-validator';

export class CreateAccountDto {
  @IsInt()
  @IsPositive()
  customerId: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  tenantId?: number;
}
