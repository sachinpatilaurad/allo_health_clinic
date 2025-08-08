// backend/src/appointments/entities/appointment.entity.ts

import { Doctor } from '../../doctors/entities/doctor.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

// We can define the possible statuses for an appointment.
// This ensures data consistency.
export enum AppointmentStatus {
  BOOKED = 'booked',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientName: string;

  @Column({ type: 'datetime' }) // Use a specific type for dates and times
  appointmentTime: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.BOOKED,
  })
  status: AppointmentStatus;

  // This is the most important part: The Relationship
  @ManyToOne(() => Doctor) // Defines the many-to-one relationship
  doctor: Doctor;
}