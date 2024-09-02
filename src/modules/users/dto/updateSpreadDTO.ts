import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class updateSpreadDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  spread: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
