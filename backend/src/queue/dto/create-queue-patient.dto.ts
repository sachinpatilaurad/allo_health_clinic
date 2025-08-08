// backend/src/queue/dto/create-queue-patient.dto.ts

import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateQueuePatientDto {
  @IsNotEmpty()
  @IsString()
  patientName: string;

  @IsOptional() // Optional field
  @IsString()
  contactNumber?: string;

  @IsOptional() // Optional field
  @IsString()
  reasonForVisit?: string;

  @IsOptional() // Optional field
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional() // Optional field
  @IsNumber()
  assignedDoctorId?: number;
}