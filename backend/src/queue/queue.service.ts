// backend/src/queue/queue.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueuePatient } from './entities/queue-patient.entity';
import { CreateQueuePatientDto } from './dto/create-queue-patient.dto';
import { UpdateQueueStatusDto } from './dto/update-queue-status.dto';
import { Doctor } from 'src/doctors/entities/doctor.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(QueuePatient)
    private queueRepository: Repository<QueuePatient>,
  ) {}

  // ADD a new patient to the queue
  async create(createQueuePatientDto: CreateQueuePatientDto): Promise<QueuePatient> {
    const { assignedDoctorId, ...restOfDto } = createQueuePatientDto;

    const lastPatients = await this.queueRepository.find({
      order: { queueNumber: 'DESC' },
      take: 1,
    });

    const lastPatient = lastPatients[0]; // The result of find() is an array

    const newQueueNumber = lastPatient ? lastPatient.queueNumber + 1 : 1;

    // 3. Create the new patient entity.
    // const newPatient = this.queueRepository.create({
    //   ...createQueuePatientDto,
    //   queueNumber: newQueueNumber,
    // });
     const newPatientData: Partial<QueuePatient> = {
      ...restOfDto,
      queueNumber: newQueueNumber,
    };
    if (assignedDoctorId) {
      const doctor = new Doctor();
      doctor.id = assignedDoctorId;
      newPatientData.assignedDoctor = doctor;
    }

    const newPatient = this.queueRepository.create(newPatientData);
    // 4. Save it to the database.
    return this.queueRepository.save(newPatient);
  }

  // GET the entire current queue
  async findAll(): Promise<QueuePatient[]> {
    return this.queueRepository.find({
      order: { queueNumber: 'ASC' },
    });
  }

  // UPDATE a patient's status
  async updateStatus(
    id: number,
    updateQueueStatusDto: UpdateQueueStatusDto,
  ): Promise<QueuePatient> {
    const patient = await this.queueRepository.preload({
      id: id,
      ...updateQueueStatusDto,
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID #${id} not found in queue`);
    }

    return this.queueRepository.save(patient);
  }

  // REMOVE a patient from the queue
  async remove(id: number): Promise<void> {
    const result = await this.queueRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Patient with ID #${id} not found to remove`);
    }
  }
}