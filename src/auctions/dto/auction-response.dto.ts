import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BidResponseDto } from 'src/bids/dto/bid-response.dto';

export class AuctionResponseDto {
  @IsNumber()
  @IsNotEmpty()
  id!: number;

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
  @ApiProperty({ type: 'string', required: false })
  image?: string;

  @IsDateString()
  endDate!: Date;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: 'number' })
  authorId!: number;

  @IsArray()
  @ApiProperty({ type: [BidResponseDto] })
  bids?: BidResponseDto[];
}
