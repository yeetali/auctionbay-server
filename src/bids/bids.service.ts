import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAutoBidDto } from './dto/create-autobid.dto';
import { Bid } from 'src/generated/prisma/client';

@Injectable()
export class BidsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    auctionId: number,
    userId: number,
    createBidDto: CreateBidDto,
  ): Promise<Bid | void> {
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
    });

    const autoBid = await this.prismaService.autoBid.findFirst({
      where: {
        auctionId,
        userId: { not: userId },
      },
      orderBy: { maxPrice: 'desc' },
    });

    if (autoBid) {
      const nextBidAmount = bid.amount + autoBid.increment;
      if (nextBidAmount <= autoBid.maxPrice) {
        return await this.autoBid(auctionId, autoBid.userId, {
          increment: autoBid.increment,
          maxPrice: autoBid.maxPrice,
        });
      }
    }
    return bid;
  }

  async autoBid(
    auctionId: number,
    userId: number,
    dto: CreateAutoBidDto,
  ): Promise<Bid | void> {
    const auction = await this.prismaService.auction.findUnique({
      where: { id: auctionId },
    });
    if (!auction) throw new NotFoundException('Auction not found');
    if (auction.authorId === userId) {
      throw new BadRequestException('You cannot autobid on your own auction');
    }

    const highestBid = await this.prismaService.bid.findFirst({
      where: { auctionId },
      orderBy: { amount: 'desc' },
      select: { amount: true },
    });

    const amount = highestBid
      ? highestBid.amount + dto.increment
      : auction.startingPrice + dto.increment;

    if (amount > dto.maxPrice) {
      return;
    }
    await this.prismaService.autoBid.upsert({
      where: {
        userId_auctionId: { userId, auctionId },
      },
      update: {
        increment: dto.increment,
        maxPrice: dto.maxPrice,
      },
      create: {
        auctionId,
        userId,
        increment: dto.increment,
        maxPrice: dto.maxPrice,
      },
    });
    return await this.create(auctionId, userId, { amount });
  }

  async deleteAutoBid() {
    await this.prismaService.autoBid.deleteMany({});
  }
}
