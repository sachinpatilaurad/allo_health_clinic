// backend/src/users/users.service.ts (The FINAL version)

import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    const adminUser = await this.findOne('admin@allo.com');
    if (!adminUser) {
      console.log('Default admin user not found. Creating one...');
      await this.create('admin@allo.com', 'password123');
      console.log('Default admin user created with email "admin@allo.com" and password "password123"');
    }
  }

  // This method is for public use (e.g., checking if a user exists)
  // It does NOT select the password.
  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  // --- THIS IS THE MISSING METHOD ---
  // This is a special method ONLY for the AuthService to use during login.
  // It guarantees the password hash is retrieved from the database.
  async findOneWithPassword(email:string): Promise<User | undefined> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  // Your 'create' method is PERFECT. It lets the entity's hook do the hashing.
  async create(email: string, pass: string): Promise<User> {
    const newUser = this.usersRepository.create({ email, password: pass });
    return this.usersRepository.save(newUser);
  }
}