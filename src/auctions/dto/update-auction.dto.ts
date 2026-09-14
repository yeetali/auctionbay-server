import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateAuctionDto } from './create-auction.dto';
import { IsOptional } from 'class-validator';

export class UpdateAuctionDto extends PartialType(
  OmitType(CreateAuctionDto, ['startingPrice']),
) {
  @IsOptional()
  currentImage?: string;
}
