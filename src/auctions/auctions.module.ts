import { Module } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AuctionsController],
  providers: [AuctionsService, PrismaService],
})
export class AuctionsModule {}
