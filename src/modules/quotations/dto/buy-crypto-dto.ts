import { IsNotEmpty, IsString } from 'class-validator';

export class BuyCryptoDto {
  @IsString()
  @IsNotEmpty()
  quote_id: string;

  @IsString()
  @IsNotEmpty()
  amount: string;
}
