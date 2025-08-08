// backend/src/appointments/appointments.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Doctor } from '../doctors/entities/doctor.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
  ) {}

  // CREATE a new appointment
  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const { doctorId, patientName, appointmentTime } = createAppointmentDto;

    // We need to create a "dummy" doctor object with the given ID
    // TypeORM is smart enough to use this ID to create the relationship
    const doctor = new Doctor();
    doctor.id = doctorId;

    const newAppointment = this.appointmentsRepository.create({
      patientName,
      appointmentTime: new Date(appointmentTime),
      doctor, // Assign the doctor object here
    });

    return this.appointmentsRepository.save(newAppointment);
  }

  // FIND ALL appointments
  async findAll(): Promise<Appointment[]> {
    // 'relations' tells TypeORM to also fetch the related 'doctor' object for each appointment
    return this.appointmentsRepository.find({ relations: ['doctor'] });
  }

  // FIND ONE appointment by its ID
  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID #${id} not found`);
    }
    return appointment;
  }

  // UPDATE an appointment (e.g., reschedule or change status)
  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    // The 'preload' method creates a new object from the DTO and merges it
    // with an existing entity it finds in the database by ID.
    const appointment = await this.appointmentsRepository.preload({
      id: id,
      ...updateAppointmentDto,
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID #${id} not found to update`);
    }

    return this.appointmentsRepository.save(appointment);
  }

  // DELETE (cancel) an appointment
  async remove(id: number): Promise<void> {
    const result = await this.appointmentsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Appointment with ID #${id} not found to delete`);
    }
  }
}