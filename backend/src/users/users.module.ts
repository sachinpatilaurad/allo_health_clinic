// backend/src/users/users.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Make the User repository available
  providers: [UsersService],
  exports: [UsersService], // IMPORTANT: Export the service
})
export class UsersModule {}