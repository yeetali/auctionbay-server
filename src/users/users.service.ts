import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prismaService.user.create({
        data: createUserDto,
        select: {
          firstName: true,
          lastName: true,
          email: true,
          image: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(
    userId: number,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ) {
    return await this.prismaService.user.update({
      where: { id: userId },
      data: {
        ...updateUserDto,
        ...(file && { image: file.filename }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
      },
    });
  }

  async updateImage(userId: number, file?: Express.Multer.File) {
    return await this.prismaService.user.update({
      where: { id: userId },
      data: {
        image: file?.filename,
      },
      select: {
        image: true,
      },
    });
  }

  async getProfileStats(userId: number) {
    try {
      const finishedAuctions = await this.prismaService.auction.findMany({
        where: {
          authorId: userId,
          endDate: { lt: new Date() },
        },
        include: {
          bids: {
            orderBy: { amount: 'desc' },
            take: 1,
          },
        },
      });
      const earnings = finishedAuctions.reduce((sum, auction) => {
        return sum + (auction.bids[0]?.amount ?? 0);
      }, 0);

      const postedAuctions = await this.prismaService.auction.findMany({
        where: {
          authorId: userId,
          endDate: { gt: new Date() },
        },
      });

      const biddingAuctions = await this.prismaService.auction.findMany({
        where: {
          endDate: { gt: new Date() },
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
      const currentlyWinning = biddingAuctions.filter(
        (auction) => auction.bids[0]?.userId === userId,
      );

      const expiredAuctions = await this.prismaService.auction.findMany({
        where: {
          endDate: { lt: new Date() },
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

      const wonAuctions = expiredAuctions.filter(
        (auction) => auction.bids[0]?.userId === userId,
      );

      return {
        earnings,
        postedAuctions,
        biddingAuctions,
        currentlyWinning,
        wonAuctions,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      return await this.prismaService.user.findMany();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          image: true,
        },
      });
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);
      return user;
    } catch (error) {
      console.log(error);

      throw new BadRequestException(error);
    }
  }

  async resetPassword(id: number, dto: UpdatePasswordDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = bcrypt.compareSync(dto.currentPassword, user.password);

    if (!isMatch)
      throw new UnauthorizedException('Current password is incorrect');

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(dto.newPassword, salt);

    await this.prismaService.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
    return { message: 'Password updated successfully' };
  }

  async remove(id: number) {
    try {
      return await this.prismaService.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
