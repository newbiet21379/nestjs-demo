import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {ApolloGatewayDriver, ApolloGatewayDriverConfig} from "@nestjs/apollo";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        serviceList: [
          {
            name: 'users',
            url: process.env.USER_ENDPOINT || 'http://localhost:4001/graphql',
          },
          // {
          //   name: 'orders',
          //   url: process.env.ORDERS_ENDPOINT || 'http://localhost:4002/graphql',
          // },
        ],
      },
    }),
  ],
})
export class AppModule {}
