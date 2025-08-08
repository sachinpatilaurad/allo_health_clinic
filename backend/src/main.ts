import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';
    import { ValidationPipe } from '@nestjs/common'; // Import this

    async function bootstrap() {
      const app = await NestFactory.create(AppModule);
      app.enableCors();
 
      app.useGlobalPipes(new ValidationPipe()); // Add this line

      await app.listen(3001); // Let's use port 3001 for the backend
    }
    bootstrap();