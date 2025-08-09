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
      console.log('--- PLAIN TEXT MODE: Creating default admin user. ---');
      await this.create('admin@allo.com', 'password123');
    }
  }

  // This method is now used for everything.
  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  // This method now saves the password as plain text.
  async create(email: string, pass: string): Promise<User> {
    const newUser = this.usersRepository.create({ email, password: pass });
    return this.usersRepository.save(newUser);
  }

  // The findOneWithPassword method is no longer needed.
}
