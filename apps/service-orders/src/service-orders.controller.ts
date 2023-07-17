import { Controller, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller()
export class ServiceOrdersController {
  constructor(private readonly serviceOrdersService: OrdersService) {}

  @Get()
  getHello(): string {
    return this.serviceOrdersService.getHello();
  }
}
