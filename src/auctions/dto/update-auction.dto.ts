import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateAuctionDto } from './create-auction.dto';

export class UpdateAuctionDto extends PartialType(
  OmitType(CreateAuctionDto, ['startingPrice']),
) {}
