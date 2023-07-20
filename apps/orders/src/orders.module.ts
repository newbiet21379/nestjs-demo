import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import {APP_GUARD} from "@nestjs/core";
import {AuthGuard} from "../../auth/src/auth.guard";

@Module({
  providers: [
      OrdersResolver,
      OrdersService,
      {
        provide: APP_GUARD,
        useClass: AuthGuard
      }
  ]
})
export class OrdersModule {}
