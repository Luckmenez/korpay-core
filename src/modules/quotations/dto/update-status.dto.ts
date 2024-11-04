import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Status } from '../models/status.enum';

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @IsNotEmpty()
  @IsNumber()
  id: number;
}
