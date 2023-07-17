import { Module } from '@nestjs/common';
import { ServiceOrdersController } from './service-orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [],
  controllers: [ServiceOrdersController],
  providers: [OrdersService],
})
export class ServiceOrdersModule {}
