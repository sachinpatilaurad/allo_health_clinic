import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // This is the simplified validation logic.
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    // No more bcrypt! Just a simple, direct comparison.
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}