
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Err, Ok, Result } from 'oxide.ts';
import { CreateUserCommand } from './create-user.command';
import { AggregateID } from '@libs/common/ddd';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../user.di-tokens';
import {UserRepositoryPort} from "../../database/user.repository.port";
import {UserAlreadyExistsError} from "../../domain/user.errors";
import {UserEntity} from "../../domain/user.entity";
import {Address} from "../../domain/value-objects/address.value-object";
import {ConflictException} from "@libs/common/exceptions";
import {PASSWORD_GENERATOR, PasswordGeneratorPort} from "@libs/common/module/password.generator.module";

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepo: UserRepositoryPort,
    @Inject(PASSWORD_GENERATOR)
    protected readonly passwordGenerator: PasswordGeneratorPort,
  ) {}

  async execute(
    command: CreateUserCommand,
  ): Promise<Result<AggregateID, UserAlreadyExistsError>> {
    const user = UserEntity.create({
      email: command.email,
      address: new Address({
        country: command.country,
        postalCode: command.postalCode,
        street: command.street,
      }),
      password: this.passwordGenerator.generateKey(command.password),
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
