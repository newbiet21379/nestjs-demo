import { NestFactory } from '@nestjs/core';
import { ServiceOrdersModule } from './orders.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceOrdersModule);
  await app.listen(4002);
}
bootstrap();
