import { Repository } from 'typeorm';
import { QueuePatient } from './entities/queue-patient.entity';
import { CreateQueuePatientDto } from './dto/create-queue-patient.dto';
import { UpdateQueueStatusDto } from './dto/update-queue-status.dto';
export declare class QueueService {
    private queueRepository;
    constructor(queueRepository: Repository<QueuePatient>);
    create(createQueuePatientDto: CreateQueuePatientDto): Promise<QueuePatient>;
    findAll(): Promise<QueuePatient[]>;
    updateStatus(id: number, updateQueueStatusDto: UpdateQueueStatusDto): Promise<QueuePatient>;
    remove(id: number): Promise<void>;
}
