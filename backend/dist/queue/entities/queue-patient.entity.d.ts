import { Doctor } from '../../doctors/entities/doctor.entity';
export declare enum QueueStatus {
    WAITING = "Waiting",
    WITH_DOCTOR = "With Doctor",
    COMPLETED = "Completed"
}
export declare class QueuePatient {
    id: number;
    patientName: string;
    contactNumber: string;
    reasonForVisit: string;
    isUrgent: boolean;
    queueNumber: number;
    status: QueueStatus;
    arrivalTime: Date;
    assignedDoctor: Doctor;
}
