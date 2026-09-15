import { ApiProperty } from '@nestjs/swagger';
import { AuctionResponseDto } from 'src/auctions/dto/auction-response.dto';

export class NotificationDto {
  @ApiProperty()
  userId!: number;

  @ApiProperty()
  auctionId!: number;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  auction!: AuctionResponseDto;
}
