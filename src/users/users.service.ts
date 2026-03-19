import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

  async update(id: number, updateUserDto: UpdateUserDto) {}

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
