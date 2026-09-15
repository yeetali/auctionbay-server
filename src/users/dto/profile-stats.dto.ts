import { ApiProperty } from '@nestjs/swagger';
import { AuctionResponseDto } from 'src/auctions/dto/auction-response.dto';

export class ProfileStatsDto {
  @ApiProperty()
  earnings!: number;

  @ApiProperty({ type: [AuctionResponseDto] })
  postedAuctions!: AuctionResponseDto[];

  @ApiProperty({ type: [AuctionResponseDto] })
  biddingAuctions!: AuctionResponseDto[];

  @ApiProperty({ type: [AuctionResponseDto] })
  currentlyWinning!: AuctionResponseDto[];

  @ApiProperty({ type: [AuctionResponseDto] })
  wonAuctions!: AuctionResponseDto[];
}
