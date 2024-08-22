import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { QuotationType } from '../@types/quotations.type';
import { BuyCryptoDto } from './dto/buy-crypto-dto';

@Injectable()
export class QuotationService {
  private readonly url = process.env.KORPAY_API_URL;
  private readonly userId = process.env.CLIENT_ID;
  private readonly password = process.env.CLIENT_SECRET;
  private lastQuotations: QuotationType | null = null;
  constructor() {}

  @Cron('*/5 * * * * *')
  async getQuotations() {
    const authToken = Buffer.from(`${this.userId}:${this.password}`).toString(
      'base64',
    );
    const config = {
      headers: {
        accept: 'application/json',
        Authorization: `Basic ${authToken}`,
      },
    };

    try {
      const { data } = await axios.get<{ data: QuotationType }>(
        `${this.url}quotation`,
        config,
      );
      this.lastQuotations = data.data;
    } catch (error) {
      console.error('Failed to fetch quotation:', error);
    }
  }

  async getLastQuotations() {
    return this.lastQuotations;
  }

  async buyCrypto({ amount, quote_id, d }: BuyCryptoDto) {
    const authToken = Buffer.from(`${this.userId}:${this.password}`).toString(
      'base64',
    );

    const config = {
      headers: {
        accept: 'application/json',
        Authorization: `Basic ${authToken}`,
      },
    };

    console.log('buyCrypto', { amount, quote_id, d });

    const body = {
      quote_id,
      amount,
      settlement: d,
      currency_in_value: 'BRL',
      currency_exchange: 'USDT',
    };

    try {
      const { data } = await axios.post(`${this.url}confirm`, body, config);
      return data.data;
    } catch (error) {
      console.log('Failed to buy crypto:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
