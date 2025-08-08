import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

    @Entity() // This decorator marks the class as a database table entity
    export class Doctor {
      @PrimaryGeneratedColumn() // Marks 'id' as the primary key and auto-increments it
      id: number;

      @Column() // Marks 'name' as a standard column
      name: string;

      @Column()
      specialization: string;

      @Column()
      gender: string;

      @Column()
      location: string;

      @Column({ default: true }) // You can set default values
      isAvailable: boolean;
    }