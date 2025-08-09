
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    console.log("--- DEPLOYMENT MARKER V7: STARTING WITH FINAL AUTH LOGIC ---");

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
        'http://localhost:3000', // For your local frontend
        // Vercel will give you a URL like this. You can add it later.
        'https://allo-health-clinic.vercel.app' 
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
// Simple CORS is fine for local
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT||3001);
  console.log(`✅ Backend is running on: ${await app.getUrl()}`);
}
bootstrap();