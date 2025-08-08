// backend/src/appointments/dto/update-appointment.dto.ts

import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDateString()
  appointmentTime?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus) // Ensures the status is one of our defined values
  status?: AppointmentStatus;
}