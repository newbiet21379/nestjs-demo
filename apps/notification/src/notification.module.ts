import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { NotificationController } from './notification.controller';
import {MessageModule} from "./message.module";
import {RequestStorageMiddleware} from "./request.storage.middleware";

@Module({
  imports: [MessageModule],
  controllers: [NotificationController],
  providers: [],
})
export class NotificationModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestStorageMiddleware).forRoutes('*');
  }

}
