import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuctionsModule } from './auctions/auctions.module';
import { BidsModule } from './bids/bids.module';

@Module({
  imports: [UsersModule, AuthModule, AuctionsModule, BidsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
