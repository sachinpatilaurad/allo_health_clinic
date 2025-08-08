// backend/src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { OnModuleInit } from '@nestjs/common'; 

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    // Check if the default admin user already exists
    const adminUser = await this.findOne('admin@allo.com');
    // If the user doesn't exist, create it
    if (!adminUser) {
      console.log('Default admin user not found. Creating one...');
      await this.create('admin@allo.com', 'password123');
      console.log('Default admin user created with email "admin@allo.com" and password "password123"');
    }
  }

  // The only change is here: Promise<User | null>
  async findOne(email: string): Promise<User | null> {
    // This now correctly returns a Promise that resolves to User or null
    return this.usersRepository.findOneBy({ email });
  }

  // This function remains the same
  async create(email: string, pass:string): Promise<User> {
    const newUser = this.usersRepository.create({ email, password: pass });
    return this.usersRepository.save(newUser);
  }
}