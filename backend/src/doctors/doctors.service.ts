// backend/src/doctors/doctors.service.ts

// 1. Import NotFoundException
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
  ) {}

  create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const doctor = this.doctorsRepository.create(createDoctorDto);
    return this.doctorsRepository.save(doctor);
  }

  findAll(): Promise<Doctor[]> {
    return this.doctorsRepository.find();
  }

  // --- MODIFIED FUNCTION ---
  async findOne(id: number): Promise<Doctor> {
    // 2. Await the result of the database query
    const doctor = await this.doctorsRepository.findOneBy({ id });

    // 3. Check if the doctor was found
    if (!doctor) {
      // 4. If not found, throw the exception
      throw new NotFoundException(`Doctor with ID #${id} not found`);
    }

    // 5. If found, return the doctor
    return doctor;
  }

  // --- MODIFIED FUNCTION ---
  async update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    // The 'update' method first tries to update, then fetches the result.
    // A better way is to first load the entity, then save it.
    // This also implicitly checks if the doctor exists via findOne.
    const doctor = await this.findOne(id); // This will throw an error if not found

    // Merge the old entity with the new data
    const updatedDoctor = this.doctorsRepository.merge(doctor, updateDoctorDto);

    // Save the updated entity back to the database
    return this.doctorsRepository.save(updatedDoctor);
  }

  // --- MODIFIED FUNCTION ---
  async remove(id: number): Promise<void> {
    // First, check if the doctor exists. This will throw 404 if not.
    await this.findOne(id);
    // If it exists, then delete it.
    await this.doctorsRepository.delete(id);
  }
}