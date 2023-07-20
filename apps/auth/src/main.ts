import {ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {AppModule} from "./app.module";
import {NestFactory} from "@nestjs/core";
import {RmqService} from "@libs/common/rmq/rmq.service";
import {RmqOptions} from "@nestjs/microservices";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('AUTH', true))
  const options = new DocumentBuilder().build(), document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableShutdownHooks();

  const configService = app.get(ConfigService);
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'), () => {
    console.log("running on port: 4001")
  });
}
bootstrap();
