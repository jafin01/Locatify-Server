import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'colors';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4040, () =>
    console.log('listening to http://localhost:4040'.cyan.underline),
  );
}
bootstrap();
