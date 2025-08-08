// backend/src/auth/guards/local-auth.guard.ts

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// By using 'local', this Guard will automatically trigger our LocalStrategy
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}