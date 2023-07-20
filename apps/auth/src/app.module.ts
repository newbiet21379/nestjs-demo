import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SlonikModule } from 'nestjs-slonik';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RequestContextModule } from 'nestjs-request-context';
import {APP_GUARD, APP_INTERCEPTOR} from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import {ContextInterceptor} from "@libs/common/application/context/ContextInterceptor";
import {ExceptionInterceptor} from "@libs/common/application/interceptors/exception.interceptor";
import {UserModule} from "./user.module";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {ConfigModule} from "@nestjs/config";
import {Config} from "@libs/common/configs/dotenv.config";
import {JwtModule} from "@nestjs/jwt";
import {AuthGuard} from "./auth.guard";

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ExceptionInterceptor,
  },
  {
    provide: APP_GUARD,
    useClass: AuthGuard
  }
];

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    RequestContextModule,
    SlonikModule.forRoot({
      connectionUri: `postgres://${Config.DATABASE_USER}:${Config.DATABASE_PASSWORD}@${Config.DATABASE_HOST}/${Config.DATABASE_NAME}`
    }),
    CqrsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: {
        federation: 2
      },
    }),
    JwtModule.register({
      global: true,
      secret: Config.JWT_CONSTANT,
      signOptions: { expiresIn: '60s' },
    }),
    UserModule,
    ConfigModule.forRoot({
      cache: true,
    })
  ],
  controllers: [],
  providers: [...interceptors],
})
export class AppModule {}
