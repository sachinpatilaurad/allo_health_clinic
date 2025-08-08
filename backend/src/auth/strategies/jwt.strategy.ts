// backend/src/auth/strategies/jwt.strategy.ts

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Tell Passport how to find the token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Don't allow expired tokens
      ignoreExpiration: false,
      // Use the same secret we used to sign the token
      secretOrKey: 'YOUR_SECRET_KEY', // <-- IMPORTANT: Use the same secret as in auth.module!
    });
  }

  // Passport will call this after it has verified the token's signature.
  // The 'payload' is the decoded JSON from the JWT.
  async validate(payload: any) {
    // We are trusting the token is valid at this point.
    // The object returned here will be attached to the Request object as req.user.
    return { userId: payload.sub, email: payload.email };
  }
}