import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BuyCryptoDto {
  @IsNumber()
  @IsNotEmpty()
  actual_spread: number;

  @IsString()
  @IsNotEmpty()
  quote_id: string;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsNotEmpty()
  d: string;
}
