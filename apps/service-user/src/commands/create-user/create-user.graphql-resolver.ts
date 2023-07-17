import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { CreateUserGqlRequestDto } from './dtos/create-user.gql-request.dto';
import { IdGqlResponse } from './dtos/id.gql-response.dto';
import { Result } from 'oxide.ts';
import {AggregateID} from "@libs/common/ddd";
import {UserAlreadyExistsError} from "../../domain/user.errors";
import {UserEntity} from "../../domain/user.entity";

// If you are Using GraphQL you'll need a Resolver instead of a Controller
@Resolver((of) => UserEntity)
export class CreateUserGraphqlResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => IdGqlResponse)
  async create(
    @Args('input') input: CreateUserGqlRequestDto,
  ): Promise<IdGqlResponse> {
    const command = new CreateUserCommand(input);

    const id: Result<AggregateID, UserAlreadyExistsError> =
      await this.commandBus.execute(command);

    return new IdGqlResponse(id.unwrap());
  }
}
