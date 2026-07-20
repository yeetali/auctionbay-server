import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BidsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(auctionId: number, userId: number, createBidDto: CreateBidDto) {
    const auction = await this.prismaService.auction.findUnique({
      where: { id: auctionId },
    });
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    if (auction.endDate < new Date()) {
      throw new BadRequestException('Auction has already ended');
    }

    if (auction.authorId === userId) {
      throw new BadRequestException('You cannot bid on your own auction');
    }

    const highestBid = await this.prismaService.bid.findFirst({
      where: { auctionId },
      orderBy: { amount: 'desc' },
      select: { amount: true },
    });

    const currentPrice = highestBid ? highestBid.amount : auction.startingPrice;

    if (createBidDto.amount <= currentPrice) {
      throw new BadRequestException(`Bid must be higher than ${currentPrice}`);
    }

    const bid = await this.prismaService.bid.create({
      data: {
        amount: createBidDto.amount,
        auctionId,
        userId,
      },
      select: { amount: true, userId: true },
    });

    return bid;
  }
}
