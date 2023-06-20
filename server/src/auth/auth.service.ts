import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dtos';
import * as bcrypt from 'bcrypt';
import { tokens } from './types';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signin(dto: LoginDto): Promise<tokens> {
    const { email, password } = dto;
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Email or Password is incorrect');
    }
    const isValid = await bcrypt.compare(password, user.hash);
    if (!isValid) {
      throw new ForbiddenException('Email or Password is incorrect');
    }
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
  async signup(dto: RegisterDto): Promise<tokens> {
    const { email, password, name } = dto;
    const hash = await this.hashData(password);
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        hash,
      },
    }); // <-- create user here
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
  logout() {
    return 'Logout';
  }
  refresh() {
    return 'Refresh';
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashRT: hash,
      },
    });
  }

  hashData = (data: string) => {
    return bcrypt.hash(data, 10);
  };

  async getTokens(userId: string, email: string): Promise<tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: 'at-secret',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: 'rt-secret',
        },
      ),
    ]);
    return { access_token: at, refresh_token: rt };
  }
}
