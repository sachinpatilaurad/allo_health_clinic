// backend/src/doctors/dto/update-doctor.dto.ts

import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDoctorDto {
  @IsOptional() // This decorator marks the property as optional.
  @IsString()
  @IsNotEmpty() // This still runs if the 'name' field is provided.
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  specialization?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  gender?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}