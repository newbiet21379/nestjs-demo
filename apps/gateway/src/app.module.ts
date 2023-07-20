import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {ApolloGatewayDriver, ApolloGatewayDriverConfig} from "@nestjs/apollo";
import {IntrospectAndCompose} from "@apollo/gateway";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        cors: true,
      },
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'users',
              url:'localhost:4001/graphql'
            },
            {
              name: 'orders',
              url: 'localhost:4002/graphql'
            }
          ]
        })
      }
    }),
  ],
})
export class AppModule {}
