import { Controller, Post, Body, Param, Req } from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';

@Controller()
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post('auctions/:id/bid')
  create(
    @Param('id') auctionId: number,
    @Req() req: Request & { user: { userId: number } },
    @Body() createBidDto: CreateBidDto,
  ) {
    return this.bidsService.create(auctionId, req.user.userId, createBidDto);
  }
}
