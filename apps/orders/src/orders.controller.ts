import { Controller, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {Auth} from "../../auth/src/auth.guard";

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Auth()
  getHello(): string {
    return this.ordersService.findAll();
  }
}
