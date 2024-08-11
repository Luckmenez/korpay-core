import { Body, Controller, Post } from '@nestjs/common';
import { QuotationService } from './quotations.service';
import { BuyCryptoDto } from './dto/buy-crypto-dto';

@Controller('quotation')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationService) {}

  @Post('buy-crypto')
  async buyCrypto(@Body() body: BuyCryptoDto) {
    return await this.quotationsService.buyCrypto(body);
  }
}
