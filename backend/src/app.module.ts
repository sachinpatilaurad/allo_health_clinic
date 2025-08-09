// backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// --- Import Your Feature Modules ---
import { DoctorsModule } from './doctors/doctors.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { QueueModule } from './queue/queue.module';

// --- Import All Your Entities with CORRECT paths ---
import { User } from './users/entities/user.entity';
import { Doctor } from './doctors/entities/doctor.entity';
// Assuming the appointment entity is named 'appointment.entity.ts' inside the 'entities' folder
import { Appointment } from './appointments/entities/appointment.entity'; 
// This is the main correction based on your screenshot
import { QueuePatient } from './queue/entities/queue-patient.entity'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get<string>('DATABASE_URL'),
        
        // Use the correct entity class names here
        entities: [User, Doctor, Appointment, QueuePatient], 

        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),

    // --- Your application's feature modules ---
    DoctorsModule,
    UsersModule,
    AuthModule,
    AppointmentsModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}