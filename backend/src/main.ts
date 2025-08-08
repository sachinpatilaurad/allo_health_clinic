import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';
    import { ValidationPipe } from '@nestjs/common'; // Import this

    async function bootstrap() {
      const app = await NestFactory.create(AppModule);

       app.enableCors({
    origin: '*', // Allows requests from any origin. For production, you might restrict this to your frontend's URL.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
 
      app.useGlobalPipes(new ValidationPipe()); // Add this line

      await app.listen(process.env.PORT || 3001); // Let's use port 3001 for the backend
    }
    bootstrap();