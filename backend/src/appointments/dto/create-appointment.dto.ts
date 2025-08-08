// backend/src/appointments/dto/create-appointment.dto.ts

import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  patientName: string;

  @IsNotEmpty()
  @IsDateString() // Validates that the input is a valid ISO 8601 date string
  appointmentTime: string;

  @IsNotEmpty()
  @IsNumber() // We expect the ID of the doctor
  doctorId: number;
}