import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://91.134.88.76',
    methods: 'GET',
    allowedHeaders: 'Content-Type, Accept, Range',
  });
  await app.listen(8000);
}
bootstrap();
