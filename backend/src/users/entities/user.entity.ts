// backend/src/users/entities/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // Every user must have a unique email
  email: string;

  @Column()
  password: string;

  // This is a special hook from TypeORM.
  // It will automatically run the hashPassword method before a new user is saved.
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}