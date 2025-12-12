import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { LoyaltyAccountService } from './loyalty-account.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('loyalty/accounts')
export class LoyaltyAccountController {
  constructor(private readonly accountService: LoyaltyAccountService) {}

  @Post()
  create(@Body() dto: CreateAccountDto) {
    return this.accountService.createAccount(dto.customerId, dto.tenantId ?? 1);
  }

  @Get(':customerId')
  async getAccount(@Param('customerId') customerId: number) {
    const account = await this.accountService.findByCustomerId(customerId);

    if (!account) {
      throw new NotFoundException(
        `No account found for customer ${customerId}`,
      );
    }

    return account;
  }
}
