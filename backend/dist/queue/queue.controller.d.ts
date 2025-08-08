import { QueueService } from './queue.service';
import { CreateQueuePatientDto } from './dto/create-queue-patient.dto';
import { UpdateQueueStatusDto } from './dto/update-queue-status.dto';
export declare class QueueController {
    private readonly queueService;
    constructor(queueService: QueueService);
    create(createQueuePatientDto: CreateQueuePatientDto): Promise<import("./entities/queue-patient.entity").QueuePatient>;
    findAll(): Promise<import("./entities/queue-patient.entity").QueuePatient[]>;
    updateStatus(id: number, updateQueueStatusDto: UpdateQueueStatusDto): Promise<import("./entities/queue-patient.entity").QueuePatient>;
    remove(id: number): Promise<void>;
}
