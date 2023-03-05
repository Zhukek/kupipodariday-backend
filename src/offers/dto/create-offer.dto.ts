import { IsBoolean, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;

  @IsNumber()
  itemId: number;
}
