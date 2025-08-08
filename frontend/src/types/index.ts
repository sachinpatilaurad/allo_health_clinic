// frontend/src/types/index.ts

// =================================================================
//                      SHARED TYPES & ENUMS
// =================================================================

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  isAvailable: boolean;
  location: string;
  gender: string;
}


// =================================================================
//                      QUEUE MANAGEMENT TYPES
// =================================================================

export enum QueueStatus {
  WAITING = 'Waiting',
  WITH_DOCTOR = 'With Doctor',
  COMPLETED = 'Completed',
}

export interface QueuePatient {
  id: number;
  patientName: string;
  queueNumber: number;
  status: QueueStatus;
  arrivalTime: string; // This is an ISO date string from the backend
  isUrgent: boolean;

  // Optional fields
  contactNumber?: string;
  reasonForVisit?: string;
  assignedDoctor?: Doctor;
}


// =================================================================
//                    APPOINTMENT MANAGEMENT TYPES
// =================================================================

export enum AppointmentStatus {
  BOOKED = 'booked',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export interface Appointment {
  id: number;
  patientName: string;
  appointmentTime: string; // ISO date string from backend
  status: AppointmentStatus;
  doctor: Doctor; // A required nested doctor object
}