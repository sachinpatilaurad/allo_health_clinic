
    import { Module } from '@nestjs/common';
    import { QueueService } from './queue.service';
    import { QueueController } from './queue.controller';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { QueuePatient } from './entities/queue-patient.entity';

    @Module({
      imports: [TypeOrmModule.forFeature([QueuePatient])], // Make repository available
      controllers: [QueueController],
      providers: [QueueService],
    })
    export class QueueModule {}