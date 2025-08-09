import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * This method runs once the module has been initialized.
   * It checks for a default admin user and creates one if it doesn't exist.
   */
  async onModuleInit() {
    const adminUser = await this.findOne('admin@allo.com');
    if (!adminUser) {
      console.log('Default admin user not found. Creating one...');
      // Use the create method which now handles hashing
      await this.create('admin@allo.com', 'password123');
      console.log('Default admin user created with email "admin@allo.com" and password "password123"');
    }
  }

  /**
   * Finds a user by their email address.
   * @param email The email of the user to find.
   * @returns A Promise that resolves to the User object or null if not found.
   */
  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  /**
   * Creates a new user with a hashed password.
   * @param email The email for the new user.
   * @param pass The plain text password for the new user.
   * @returns A Promise that resolves to the newly created User object.
   */
  async create(email: string, pass: string): Promise<User> {
    // 1. Generate a salt
    const salt = await bcrypt.genSalt();
    // 2. Hash the password with the salt
    const hashedPassword = await bcrypt.hash(pass, salt);

    // 3. Create the new user with the hashed password
    const newUser = this.usersRepository.create({ 
      email, 
      password: hashedPassword, // Save the HASHED password
    });

    // 4. Save the user to the database
    return this.usersRepository.save(newUser);
  }
}