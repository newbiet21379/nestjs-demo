import {
  Body,
  ConflictException as ConflictHttpException,
  Controller,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { match, Result } from 'oxide.ts';
import { CreateOrderCommand } from './create-order.command';
import { CreateOrderRequestDto } from './create-order.request.dto';
import {routesV1} from "@libs/common/configs/app.routes";
import {IdResponse} from "@libs/common/api/id.response.dto";
import {UserAlreadyExistsError} from "../../domain/order.errors";
import {ApiErrorResponse} from "@libs/common/api/api-error.response";
import {AggregateID} from "@libs/common/ddd";


@Controller(routesV1.version)
export class CreateOrderHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: UserAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @Post(routesV1.user.root)
  async create(@Body() body: CreateOrderRequestDto): Promise<IdResponse> {
    const command = new CreateOrderCommand(body);

    const result: Result<AggregateID, UserAlreadyExistsError> =
      await this.commandBus.execute(command);

    // Deciding what to do with a Result (similar to Rust matching)
    // if Ok we return a response with an id
    // if Error decide what to do with it depending on its type
    return match(result, {
      Ok: (id: string) => new IdResponse(id),
      Err: (error: Error) => {
        if (error instanceof UserAlreadyExistsError)
          throw new ConflictHttpException(error.message);
        throw error;
      },
    });
  }
}
