import {
  Controller,
  Post,
  Req,
  UseInterceptors,
  UseGuards,
  Get,
  Patch,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { RegistrationInterceptor } from './registration-interceptor/registration.interceptor';
import { IsPublic } from './decorators/is-public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/generated/prisma/client';
import { UsersService } from 'src/users/users.service';
import { UpdatePasswordDto } from 'src/users/dto/update-password.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @IsPublic()
  signin(@Req() req: Request & { user: User }) {
    console.log(req.user);

    return this.authService.signToken({
      email: req.user.email,
      userId: req.user.id,
    });
  }

  @Get('me')
  async getProfile(@Req() req: Request & { user: { userId: number } }) {
    return await this.usersService.findOne(req.user.userId);
  }

  @UseInterceptors(RegistrationInterceptor)
  @IsPublic()
  @Post('signup')
  signup(@Req() req: Request & { user: User }) {
    return this.authService.signToken({
      email: req.user.email,
      userId: req.user.id,
    });
  }

  @Patch('me/update-password')
  updatePassword(
    @Req() req: Request & { user: { userId: number } },
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.usersService.resetPassword(req.user.userId, dto);
  }
}
