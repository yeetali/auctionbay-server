import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAutoBidDto {
  @IsNumber()
  @IsNotEmpty()
  increment!: number;

  @IsNumber()
  @IsNotEmpty()
  maxPrice!: number;
}
