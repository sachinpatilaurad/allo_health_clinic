import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoctorsModule } from './doctors/doctors.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
       TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost', // Or your DB host
          port: 3306,
          username: 'root', // Replace with your MySQL username
          password: '', // Replace with your MySQL password
          database: 'allo_health_clinic', // The name of the database to create in MySQL
          entities: [__dirname + '/**/*.entity{.ts,.js}'], // Auto-detect all entity files
          synchronize: true, // IMPORTANT: true for development only. Auto-creates DB tables.
        }),
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
