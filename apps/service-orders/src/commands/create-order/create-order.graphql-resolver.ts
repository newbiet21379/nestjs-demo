import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from './create-order.command';
import { CreateOrderGqlRequestDto } from './dtos/create-order.gql-request.dto';
import { IdGqlResponse } from './dtos/id.gql-response.dto';
import { Result } from 'oxide.ts';
import {AggregateID} from "@libs/common/ddd";
import {UserAlreadyExistsError} from "../../domain/order.errors";

// If you are Using GraphQL you'll need a Resolver instead of a Controller
@Resolver()
export class CreateOrderGraphqlResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => IdGqlResponse)
  async create(
    @Args('input') input: CreateOrderGqlRequestDto,
  ): Promise<IdGqlResponse> {
    const command = new CreateOrderCommand(input);

    const id: Result<AggregateID, UserAlreadyExistsError> =
      await this.commandBus.execute(command);

    return new IdGqlResponse(id.unwrap());
  }
}
