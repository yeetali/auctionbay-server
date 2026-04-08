import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BidsController],
  providers: [BidsService, PrismaService],
})
export class BidsModule {}
