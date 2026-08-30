import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  UseInterceptors,
  Req,
  Body,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { UpdateImageDto } from './dto/update-image.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, type: UpdateUserDto })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + file.originalname;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async updateProfile(
    @Req() req: Request & { user: { userId: number } },
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.usersService.update(req.user.userId, updateUserDto, file);
  }

  @Post('me/avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateImageDto })
  @ApiResponse({ status: 200, type: UpdateImageDto })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + file.originalname;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async updateAvatar(
    @Req() req: Request & { user: { userId: number } },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.usersService.updateImage(req.user.userId, file);
  }

  @Get('me/stats')
  async getProfileStats(@Req() req: Request & { user: { userId: number } }) {
    return await this.usersService.getProfileStats(req.user.userId);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
