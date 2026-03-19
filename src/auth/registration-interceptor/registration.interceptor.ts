import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';

@Injectable()
export class RegistrationInterceptor implements NestInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();

    const createUserDto: CreateUserDto = plainToInstance(
      CreateUserDto,
      request.body,
    );

    const user = await this.usersService.create({
      ...createUserDto,
      password: this.authService.hash(createUserDto.password),
    });

    request.body = user;
    return next.handle();
  }
}
