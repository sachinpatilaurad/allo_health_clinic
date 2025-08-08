import { Doctor } from '../../doctors/entities/doctor.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';

// Define the possible statuses for a patient in the queue
export enum QueueStatus {
  WAITING = 'Waiting',
  WITH_DOCTOR = 'With Doctor',
  COMPLETED = 'Completed',
}

@Entity()
export class QueuePatient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientName: string;

  @Column({ nullable: true }) // Contact number is optional
  contactNumber: string;

  @Column({ type: 'text', nullable: true }) // Reason can be longer, also optional
  reasonForVisit: string;

  @Column({ default: false }) // Not urgent by default
  isUrgent: boolean;

  @Column()
  queueNumber: number;

  @Column({
    type: 'enum',
    enum: QueueStatus,
    default: QueueStatus.WAITING,
  })
  status: QueueStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  arrivalTime: Date;

  @ManyToOne(() => Doctor, { nullable: true, eager: true }) // eager: true will auto-load the doctor
  assignedDoctor: Doctor;
}