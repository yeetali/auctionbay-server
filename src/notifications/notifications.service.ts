import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(readonly prismaService: PrismaService) {}

  async getNotifications(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new BadRequestException('User not found');

    const finishedAuctions = await this.prismaService.auction.findMany({
      where: {
        endDate: {
          lt: new Date(),
        },
        bids: {
          some: { userId },
        },
      },
      include: {
        bids: {
          orderBy: { amount: 'desc' },
          take: 1,
        },
      },
    });

    const activeAuctions = await this.prismaService.auction.findMany({
      where: {
        endDate: {
          gt: new Date(),
        },
        bids: {
          some: { userId },
        },
      },
      include: {
        bids: {
          orderBy: { amount: 'desc' },
          take: 1,
        },
      },
    });

    const activeNotifications = activeAuctions.map((auction) => {
      const status = auction.bids[0]?.userId === userId ? 'Winning' : 'Outbid';
      return { userId, auctionId: auction.id, status: status, auction };
    });

    const finishedNotifications = finishedAuctions.map((auction) => {
      const status = auction.bids[0]?.userId === userId ? 'Won' : 'Lost';
      return { userId, auctionId: auction.id, status: status, auction };
    });

    return [...activeNotifications, ...finishedNotifications];
  }
}
