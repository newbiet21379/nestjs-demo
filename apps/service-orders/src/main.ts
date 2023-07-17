import { NestFactory } from '@nestjs/core';
import { ServiceOrdersModule } from './service-orders.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceOrdersModule);
  await app.listen(4002);
}
bootstrap();
