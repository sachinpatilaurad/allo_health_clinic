import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService implements OnModuleInit {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    onModuleInit(): Promise<void>;
    findOne(email: string): Promise<User | null>;
    findOneWithPassword(email: string): Promise<User | undefined>;
    create(email: string, pass: string): Promise<User>;
}
