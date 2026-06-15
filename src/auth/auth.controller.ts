import {
  Controller,
  Post,
  Req,
  UseInterceptors,
  UseGuards,
  Get,
  Patch,
  Body,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { RegistrationInterceptor } from './registration-interceptor/registration.interceptor';
import { IsPublic } from './decorators/is-public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/generated/prisma/client';
import { UsersService } from 'src/users/users.service';
import { UpdatePasswordDto } from 'src/users/dto/update-password.dto';
import { ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBody({
    type: SignInDto,
    description: 'Login with existing user credentials',
  })
  @Post('login')
  @UseGuards(AuthGuard('local'))
  @IsPublic()
  signin(
    @Req() req: Request & { user: User },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = this.authService.signToken({
      email: req.user.email,
      userId: req.user.id,
    });
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
    });
  }

  @Get('me')
  async getProfile(@Req() req: Request & { user: { userId: number } }) {
    return await this.usersService.findOne(req.user.userId);
  }

  @ApiBody({ type: CreateUserDto, description: 'Register a new user' })
  @UseInterceptors(RegistrationInterceptor)
  @IsPublic()
  @Post('signup')
  signup(
    @Req() req: Request & { user: User },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = this.authService.signToken({
      email: req.user.email,
      userId: req.user.id,
    });
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
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
