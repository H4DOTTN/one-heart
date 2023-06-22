import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dtos';
import { tokens } from './types';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { RTGuard } from 'src/common/guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signin')
  @Public()
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: LoginDto): Promise<tokens> {
    return this.authService.signin(dto);
  }
  @Post('signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: RegisterDto): Promise<tokens | ForbiddenException> {
    return this.authService.signup(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUser('sub') userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @Post('refresh')
  @UseGuards(RTGuard)
  @HttpCode(HttpStatus.OK)
  refresh(
    @GetCurrentUser('sub') userId: string,
    @GetCurrentUser('refreshToken') rt: string,
  ) {
    return this.authService.refresh(userId, rt);
  }
}
