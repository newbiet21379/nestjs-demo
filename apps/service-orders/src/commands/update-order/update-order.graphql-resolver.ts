import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateOrderCommand } from './update-order.command';
import { UpdateOrderGqlRequestDto } from './dtos/update-order.gql-request.dto';
import { IdGqlResponse } from './dtos/id.gql-response.dto';
import { Result } from 'oxide.ts';
import {AggregateID} from "@libs/common/ddd";
import {UserAlreadyExistsError} from "../../domain/order.errors";

// If you are Using GraphQL you'll need a Resolver instead of a Controller
@Resolver()
export class UpdateOrderGraphqlResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => IdGqlResponse)
  async create(
    @Args('input') input: UpdateOrderGqlRequestDto,
  ): Promise<IdGqlResponse> {
    const command = new UpdateOrderCommand(input);

    const id: Result<AggregateID, UserAlreadyExistsError> =
      await this.commandBus.execute(command);

    return new IdGqlResponse(id.unwrap());
  }
}
