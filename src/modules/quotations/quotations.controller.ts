import { Body, Controller, Post, Put } from '@nestjs/common';
import { QuotationService } from './quotations.service';
import { BuyCryptoDto } from './dto/buy-crypto-dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('quotation')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationService) {}

  @Post('buy-crypto')
  async buyCrypto(@Body() body: BuyCryptoDto) {
    return await this.quotationsService.buyCrypto(body);
  }

  @Put('update-status')
  async updateStatus(@Body() body: UpdateStatusDto) {
    return await this.quotationsService.updateStatus(body);
  }
}
