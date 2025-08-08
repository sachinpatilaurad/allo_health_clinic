import { Doctor } from '../../doctors/entities/doctor.entity';
export declare enum AppointmentStatus {
    BOOKED = "booked",
    COMPLETED = "completed",
    CANCELED = "canceled"
}
export declare class Appointment {
    id: number;
    patientName: string;
    appointmentTime: Date;
    status: AppointmentStatus;
    doctor: Doctor;
}
