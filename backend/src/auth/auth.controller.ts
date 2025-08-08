// backend/src/auth/auth.controller.ts

import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard) // Apply the guard to this route
  @Post('login')
  async login(@Request() req) {
    // Because of the Guard, Passport has already validated the user
    // and attached the user object to the request.
    return this.authService.login(req.user);
  }
}