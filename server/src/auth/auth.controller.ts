import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dtos';
import { tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signin')
  signin(@Body() dto: LoginDto): Promise<tokens> {
    return this.authService.signin(dto);
  }
  @Post('signup')
  signup(@Body() dto: RegisterDto): Promise<tokens> {
    return this.authService.signup(dto);
  }
  @Post('logout')
  logout() {
    this.authService.logout();
  }
  @Post('refresh')
  refresh() {
    this.authService.refresh();
  }
}
