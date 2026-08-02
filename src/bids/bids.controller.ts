import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { CreateAutoBidDto } from './dto/create-autobid.dto';

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

  @Post('auctions/:id/autobid')
  autoBid(
    @Param('id', ParseIntPipe) auctionId: number,
    @Req() req: Request & { user: { userId: number } },
    @Body() createAutoBidDto: CreateAutoBidDto,
  ) {
    return this.bidsService.autoBid(
      auctionId,
      req.user.userId,
      createAutoBidDto,
    );
  }

  @Delete('auctions/autobid')
  deleteAutobid() {
    return this.bidsService.deleteAutoBid();
  }
}
