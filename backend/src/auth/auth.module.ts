import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Import UsersModule
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule, // Gives us access to UsersService
    PassportModule,
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY', // <-- IMPORTANT: Change this to a real secret!
      signOptions: { expiresIn: '60m' }, // Token will be valid for 60 minutes
    }),
  ],
  providers: [AuthService,LocalStrategy,JwtStrategy], // We will add more providers here soon
  controllers: [AuthController],
})
export class AuthModule {}