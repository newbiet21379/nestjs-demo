import { UserEntity } from '../domain/user.entity';
import {PaginatedQueryParams, RepositoryPort} from "@libs/common/ddd";

export interface FindUsersParams extends PaginatedQueryParams {
  readonly country?: string;
  readonly postalCode?: string;
  readonly street?: string;
}

export interface UserRepositoryPort extends RepositoryPort<UserEntity> {
  findOneByEmail(email: string): Promise<UserEntity | null>;
  findOneByAccountIdAndPassword(accountId: string, password: string): Promise<UserEntity | null>;
}
