import {
  Controller,
  Get,
  Param,
  Delete,
  Patch,
  UseInterceptors,
  Req,
  Body,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Patch('me')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserDto })
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
