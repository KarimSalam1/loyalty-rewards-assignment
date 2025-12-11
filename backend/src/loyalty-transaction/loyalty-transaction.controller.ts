import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { LoyaltyTransactionService } from './loyalty-transaction.service';
import { TransactionCategory } from './schemas/loyalty-transaction.schema';
import { CalculatePointsDto } from './dto/calculate.dto';
import { CheckTierDto } from './dto/check-tier.dto';

@Controller('loyalty')
export class LoyaltyTransactionController {
  constructor(private readonly service: LoyaltyTransactionService) {}

  @Post('earn')
  earn(@Body() body: any) {
    return this.service.earnPoints({
      customerId: Number(body.customerId),
      rentalId: body.rentalId,
      category: body.category,
      points: body.points,
      description: body.description,
      rentalDuration: body.rentalDuration,
      milesDriven: body.milesDriven,
    });
  }

  @Get('transactions')
  getTransactions(@Query('customerId') customerId: number) {
    return this.service.getTransactions(Number(customerId));
  }

  @Post('redeem')
  redeem(@Body() body: any) {
    return this.service.redeemPoints({
      customerId: Number(body.customerId),
      points: Number(body.points),
      description: body.description,
    });
  }

  @Post('batch-post')
  batchPost() {
    return this.service.batchPostTransactions();
  }

  @Post('calculate')
  calculate(@Body() dto: CalculatePointsDto) {
    return this.service.calculatePoints(dto);
  }

  @Post('check-tier')
  checkTier(@Body() dto: CheckTierDto) {
    return this.service.checkTier(Number(dto.customerId));
  }
}
