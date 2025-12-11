import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { LoyaltyTierService } from './loyalty-tier.service';
import type { TierName } from './schemas/loyalty-tier.schema';

@Controller('loyalty/tiers')
export class LoyaltyTierController {
  constructor(private readonly tierService: LoyaltyTierService) {}

  @Get()
  async getAllTiers() {
    return this.tierService.findAll(1);
  }

  @Get(':tierName')
  async getTier(@Param('tierName') tierName: TierName) {
    const tier = await this.tierService.findByTierName(tierName, 1);

    if (!tier) {
      throw new NotFoundException(`Tier '${tierName}' not found`);
    }

    return tier;
  }
}
