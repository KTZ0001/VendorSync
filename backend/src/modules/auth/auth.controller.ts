import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and get JWT token' })
  async login(@Body() body: any) {
    return this.authService.login(body);
  }
}
