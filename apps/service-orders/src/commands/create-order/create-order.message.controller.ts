import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from './create-order.command';
import { CreateOrderRequestDto } from './create-order.request.dto';
import {IdResponse} from "@libs/common/api/id.response.dto";

@Controller()
export class CreateOrderMessageController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern('user.create') // <- Subscribe to a microservice message
  async create(message: CreateOrderRequestDto): Promise<IdResponse> {
    const command = new CreateOrderCommand(message);

    const id = await this.commandBus.execute(command);

    return new IdResponse(id.unwrap());
  }
}
