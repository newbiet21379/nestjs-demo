import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import {RmqService} from "@libs/common/rmq/rmq.service";

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('NOTIFICATION'))
  await app.startAllMicroservices()
}
bootstrap();
