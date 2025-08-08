  import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { DoctorsService } from './doctors.service';
    import { DoctorsController } from './doctors.controller';
    import { Doctor } from './entities/doctor.entity'; // Import the entity

    @Module({
      imports: [TypeOrmModule.forFeature([Doctor])], // Make the Doctor repository available
      controllers: [DoctorsController],
      providers: [DoctorsService],
    })
    export class DoctorsModule {}