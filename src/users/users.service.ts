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

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prismaService.user.create({ data: createUserDto });
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
