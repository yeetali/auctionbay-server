import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private config: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: config.get<string>('DATABASE_URL'),
    });
    super({ adapter });
  }
}
