import {
  Controller,
  Delete,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteUserCommand } from './delete-user.service';
import { match, Result } from 'oxide.ts';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {routesV1} from "@libs/common/configs/app.routes";
import {NotFoundException} from "@libs/common/exceptions";
import {ApiErrorResponse} from "@libs/common/api/api-error.response";
import {Public} from "@libs/common/api/global.routes";

@Controller(routesV1.version)
export class DeleteUserHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    description: 'User deleted',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: NotFoundException.message,
    type: ApiErrorResponse,
  })
  @Delete(routesV1.user.delete)
  async deleteUser(@Param('id') id: string): Promise<void> {
    const command = new DeleteUserCommand({ userId: id });
    const result: Result<boolean, NotFoundException> =
      await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof NotFoundException)
          throw new NotFoundHttpException(error.message);
        throw error;
      },
    });
  }
}
