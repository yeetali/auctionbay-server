import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (user && this.dehash(password, user.password)) {
      const { password: _pass, ...result } = user;
      return result;
    }
    return null;
  }

  signToken(user: { email: string; userId: number }) {
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  hash(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  dehash(password: string, hashedPassword: string) {
    return bcrypt.compareSync(password, hashedPassword);
  }
}
