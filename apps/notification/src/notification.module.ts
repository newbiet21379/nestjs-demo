import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { NotificationController } from './notification.controller';
import {MessageModule} from "./message.module";
import {RequestStorageMiddleware} from "./request.storage.middleware";
import {ConfigModule} from "@nestjs/config";
import {z} from "zod";

@Module({
  imports: [
      MessageModule,
      ConfigModule.forRoot({
        isGlobal: true,
        validationSchema: z.object({
          AWS_REGION: z.string().nonempty(),
          AWS_ENDPOINT: z.string().nonempty(),
          AWS_ACCESS_KEY: z.string().nonempty(),
          AWS_SECRET_ACCESS_KEY: z.string().nonempty(),
          AWS_SQS_QUEUE_URL: z.string().nonempty(),
          DATABASE_LOGGING: z.string().nonempty(),
          DB_HOST: z.string().nonempty(),
          DB_PORT: z.string().nonempty(),
          DB_NAME: z.string().nonempty(),
          DB_USER: z.string().nonempty(),
          DB_PASSWORD: z.string().nonempty(),
          DATA_SYNC: z.string(),
          JWT_KEY: z.string().nonempty(),
          PORT: z.string().nonempty()
        }),
        // validate,
        envFilePath: './apps/notification/.env',
        cache: true,
      })
  ],
  controllers: [NotificationController],
  providers: [],
})
export class NotificationModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestStorageMiddleware).forRoutes('*');
  }

}
