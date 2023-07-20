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
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {AuthGuard} from "./auth.guard";
import {z} from "zod";

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
    SlonikModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connectionUri: `postgres://${configService.get('DB_USER')}:${configService.get('DB_PASSWORD')}@${configService.get('DB_HOST')}/${configService.getOrThrow('DB_NAME')}`
      }),
      inject: [ConfigService]
    }),
    CqrsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: {
        federation: 2
      },
    }),
      ConfigModule.forRoot({
        isGlobal: true,
        validationSchema: z.object({
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
        envFilePath: './apps/auth/.env',
        cache: true,
      }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_KEY'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService]
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
