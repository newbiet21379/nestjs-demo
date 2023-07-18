
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Err, Ok, Result } from 'oxide.ts';
import { UpdateOrderCommand } from './update-order.command';
import { AggregateID } from '@libs/common/ddd';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../user.di-tokens';
import {UserRepositoryPort} from "../../database/user.repository.port";
import {UserAlreadyExistsError} from "../../domain/order.errors";
import {UserEntity} from "../../domain/user.entity";
import {Address} from "../../domain/value-objects/address.value-object";
import {ConflictException} from "@libs/common/exceptions";

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderService implements ICommandHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(
    command: UpdateOrderCommand,
  ): Promise<Result<AggregateID, UserAlreadyExistsError>> {
    const user = UserEntity.create({
      email: command.email,
      address: new Address({
        country: command.country,
        postalCode: command.postalCode,
        street: command.street,
      }),
    });

    try {
      /* Wrapping operation in a transaction to make sure
         that all domain events are processed atomically */
      await this.userRepo.transaction(async () => this.userRepo.insert(user));
      return Ok(user.id);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new UserAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
