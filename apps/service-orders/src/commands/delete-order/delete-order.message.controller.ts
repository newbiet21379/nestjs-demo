import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteOrderCommand } from './delete-order.command';
import { DeleteOrderRequestDto } from './delete-order.request.dto';
import {IdResponse} from "@libs/common/api/id.response.dto";

@Controller()
export class DeleteOrderMessageController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern('user.create') // <- Subscribe to a microservice message
  async create(message: DeleteOrderRequestDto): Promise<IdResponse> {
    const command = new DeleteOrderCommand(message);

    const id = await this.commandBus.execute(command);

    return new IdResponse(id.unwrap());
  }
}
