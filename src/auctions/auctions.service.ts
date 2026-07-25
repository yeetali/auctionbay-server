import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAuctionDto } from './dto/update-auction.dto';

@Injectable()
export class AuctionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    userId: number,
    dto: CreateAuctionDto,
    file?: Express.Multer.File,
  ) {
    try {
      if (new Date(dto.endDate) <= new Date()) {
        throw new BadRequestException('Invalid end date');
      }
      return await this.prismaService.auction.create({
        data: {
          ...dto,
          authorId: userId,
          image: file ? file.filename : null,
        },
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    return await this.prismaService.auction.findMany({
      where: {
        endDate: {
          gt: new Date(),
        },
      },
      orderBy: {
        endDate: 'asc',
      },
      include: {
        bids: {
          orderBy: { amount: 'desc' },
          take: 1,
          select: { amount: true, userId: true },
        },
      },
    });
  }

  async findAuction(id: number) {
    const auction = await this.prismaService.auction.findUnique({
      where: { id },
      include: {
        bids: {
          orderBy: { amount: 'desc' },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }
    return auction;
  }

  async updateAuction(
    userId: number,
    auctionId: number,
    dto: UpdateAuctionDto,
    file?: Express.Multer.File,
  ) {
    const auction = await this.prismaService.auction.findUnique({
      where: { id: auctionId },
    });

    if (!auction?.endDate)
      throw new BadRequestException('Auction date missing');
    if (new Date(auction?.endDate) < new Date())
      throw new BadRequestException('Auction ended');
    if (!auction) throw new NotFoundException('Auction not found');
    if (auction.authorId !== userId)
      throw new ForbiddenException('You can only update your own auctions');

    return await this.prismaService.auction.update({
      where: { id: auctionId },
      data: {
        ...dto,
        image: file ? file.filename : null,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} auction`;
  }
}
