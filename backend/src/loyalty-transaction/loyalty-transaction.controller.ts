import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { LoyaltyTransactionService } from './loyalty-transaction.service';
import { EarnPointsDto } from './dto/earn.dto';
import { RedeemPointsDto } from './dto/redeem.dto';
import { CalculatePointsDto } from './dto/calculate.dto';
import { CheckTierDto } from './dto/check-tier.dto';

@Controller('loyalty')
export class LoyaltyTransactionController {
  constructor(private readonly service: LoyaltyTransactionService) {}

  @Post('earn')
  earn(@Body() body: EarnPointsDto) {
    return this.service.earnPoints(body);
  }

  @Get('transactions')
  getTransactions(
    @Query('customerId') customerId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.service.getTransactions(
      Number(customerId),
      Number(page),
      Number(limit),
    );
  }

  @Post('redeem')
  redeem(@Body() body: RedeemPointsDto) {
    return this.service.redeemPoints(body);
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
