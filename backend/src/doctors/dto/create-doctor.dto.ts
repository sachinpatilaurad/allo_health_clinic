import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

    export class CreateDoctorDto {
      @IsString()
      @IsNotEmpty()
      name: string;

      @IsString()
      @IsNotEmpty()
      specialization: string;

      @IsString()
      @IsNotEmpty()
      gender: string;

      @IsString()
      @IsNotEmpty()
      location: string;

      @IsBoolean()
      @IsOptional() // This property is not required
      isAvailable?: boolean;
    }