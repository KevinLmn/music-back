import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.REACT_APP_API_URL,
    methods: 'GET',
    allowedHeaders: 'Content-Type, Accept, Range',
  });
  await app.listen(8000);
}
bootstrap();
