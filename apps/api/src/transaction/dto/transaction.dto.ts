import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDTO {
  @IsNumber()
  @IsNotEmpty()
  billAmount: number;

  @IsNumber()
  @IsNotEmpty()
  billInterval: number;

  @IsDateString()
  @IsNotEmpty()
  dateInit: Date;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsDateString()
  @IsNotEmpty()
  statusUpdateDate: Date;

  @IsDateString()
  cancelDate: Date | null;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsDateString()
  @IsNotEmpty()
  nextCicle: Date;

  @IsString()
  @IsNotEmpty()
  code: string;
}
