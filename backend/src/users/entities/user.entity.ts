import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class User {
@PrimaryGeneratedColumn()
id: number;
@Column({ unique: true })
email: string;
@Column()
password: string;
// The @BeforeInsert hook and hashPassword method are GONE.
}