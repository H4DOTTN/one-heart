import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
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

  async signup(dto: RegisterDto): Promise<tokens | ForbiddenException> {
    const { email, password, name } = dto;
    const hash = await this.hashData(password);
    // check if user exists
    if (await this.checkUserExists(email)) {
      console.log('Email already exists');
      throw new HttpException('Email already exists', 400);
    }
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

  async checkUserExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return !!user;
  }

  async logout(userId: string) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashRT: {
          not: null,
        },
      },
      data: {
        hashRT: null,
      },
    }); // <-- update user here
  }

  async refresh(userId: string, rt: string) {
    console.log(userId, rt);
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    }); // <-- find user here
    if (!user || !user.hashRT) {
      throw new ForbiddenException('Invalid refresh token');
    }
    const isValid = await bcrypt.compare(rt, user.hashRT);
    if (!isValid) {
      throw new ForbiddenException('Invalid refresh token');
    }
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    console.log(tokens);
    return tokens;
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
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: 'rt-secret',
          expiresIn: '7d',
        },
      ),
    ]);
    return { access_token: at, refresh_token: rt };
  }
}
