import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAuctionDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  startingPrice!: number;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media?: any;

  @IsDateString()
  endDate!: Date;
}
