// backend/src/auth/strategies/jwt.strategy.ts

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // --- The simple, hardcoded secret ---
      secretOrKey: 'this-is-a-super-secret-for-local-development-123',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}