import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { QuotationType } from '../@types/quotations.type';
import { BuyCryptoDto } from './dto/buy-crypto-dto';
import { BuyCryptoResponse } from 'src/@types/apiBuyReposponse';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class QuotationService {
  private readonly url = process.env.KORPAY_API_URL;
  private readonly userId = process.env.CLIENT_ID;
  private readonly password = process.env.CLIENT_SECRET;
  private lastQuotations: QuotationType | null = null;
  constructor(private readonly prismaService: PrismaService) {}

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

  async updateStatus({ status, id }: UpdateStatusDto) {
    return this.prismaService.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

  async buyCrypto({
    amount,
    quote_id,
    d,
    actual_spread,
    price,
    user_id,
  }: BuyCryptoDto) {
    const authToken = Buffer.from(`${this.userId}:${this.password}`).toString(
      'base64',
    );

    const config = {
      headers: {
        accept: 'application/json',
        Authorization: `Basic ${authToken}`,
      },
    };

    const body = {
      quote_id,
      amount,
      settlement: d,
      currency_in_value: 'BRL',
      currency_exchange: 'USDT',
    };

    try {
      const { data } = await axios.post<BuyCryptoResponse>(
        `${this.url}confirm`,
        body,
        config,
      );

      await this.prismaService.order.create({
        data: {
          actual_spread: actual_spread,
          amount: parseFloat(amount),
          price: parseFloat(price),
          capitual_id: data.data.order_id,
          userId: user_id,
        },
      });
      return data.data;
    } catch (error) {
      throw new HttpException(error.response.data, HttpStatus.BAD_REQUEST);
    }
  }
}
