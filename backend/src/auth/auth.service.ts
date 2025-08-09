// backend/src/auth/auth.service.ts  (The Corrected Version)

import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    // --- THIS IS THE FIX ---
    // Instead of the public 'findOne', we use our special 'findOneWithPassword'
    // This guarantees that the user object includes the hashed password.
    const user = await this.usersService.findOneWithPassword(email);

    // Now, user.password will contain the real hash from the database.
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    
    // If the user isn't found or the password doesn't match, fail the validation.
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}