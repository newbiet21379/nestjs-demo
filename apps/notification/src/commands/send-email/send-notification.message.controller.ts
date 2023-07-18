import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';

import {IdResponse} from "@libs/common/api/id.response.dto";
import {SendNotificationRequestDto} from "./send-notification.request.dto";
import {SendNotificationCommand} from "./send-notification.command";

@Controller()
export class SendMessageController {
    constructor(private readonly commandBus: CommandBus) {}

    @MessagePattern('send.message') // <- Subscribe to a microservice message
    async create(message: SendNotificationRequestDto): Promise<IdResponse> {
        const command = new SendNotificationCommand(message);

        const id = await this.commandBus.execute(command);

        return new IdResponse(id.unwrap());
    }
}
