import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateOrderCommand } from './update-order.command';
import { UpdateOrderRequestDto } from './update-order.request.dto';
import {IdResponse} from "@libs/common/api/id.response.dto";

@Controller()
export class UpdateOrderMessageController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern('user.create') // <- Subscribe to a microservice message
  async create(message: UpdateOrderRequestDto): Promise<IdResponse> {
    const command = new UpdateOrderCommand(message);

    const id = await this.commandBus.execute(command);

    return new IdResponse(id.unwrap());
  }
}
