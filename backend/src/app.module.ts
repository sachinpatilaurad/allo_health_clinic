import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoctorsModule } from './doctors/doctors.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { QueueModule } from './queue/queue.module';

// --- 1. Import the necessary Config modules ---
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // --- 2. Load the .env file and make it available globally ---
    // This should be the first import.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Explicitly tell it to load the .env file
    }),

    // --- 3. Configure TypeORM to read the DATABASE_URL from the environment ---
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get<string>('DATABASE_URL'), // Reads the variable from .env
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // For this project, this is fine. In production, use migrations.
        ssl: configService.get<string>('DATABASE_URL')?.includes('railway.app') 
          ? { rejectUnauthorized: false } 
          : false, // Important for Railway DB connection
      }),
      inject: [ConfigService],
    }),

    // --- The rest of your application modules ---
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