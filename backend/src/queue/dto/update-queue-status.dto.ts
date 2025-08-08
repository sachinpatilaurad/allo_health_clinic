import { IsEnum, IsNotEmpty } from 'class-validator';
    import { QueueStatus } from '../entities/queue-patient.entity';

    export class UpdateQueueStatusDto {
      @IsNotEmpty()
      @IsEnum(QueueStatus)
      status: QueueStatus;
    }