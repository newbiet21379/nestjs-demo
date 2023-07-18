import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import {MessageModule} from "./message.module";
import {RequestStorageMiddleware} from "./request.storage.middleware";

@Module({
  imports: [MessageModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestStorageMiddleware).forRoutes('*');
  }

}
