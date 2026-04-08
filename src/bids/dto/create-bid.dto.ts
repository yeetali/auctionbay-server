import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  @IsNotEmpty()
  amount!: number;
}
