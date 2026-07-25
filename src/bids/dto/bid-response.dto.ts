import { IsDateString, IsNotEmpty, IsObject } from 'class-validator';

export class BidUserDto {
  firstName!: string;
  lastName!: string;
  image?: string;
}

export class BidResponseDto {
  @IsNotEmpty()
  id!: number;

  @IsNotEmpty()
  amount!: number;

  @IsDateString()
  createdAt!: Date;

  @IsNotEmpty()
  userId!: number;

  @IsNotEmpty()
  auctionId!: number;

  @IsObject()
  user!: BidUserDto;
}
