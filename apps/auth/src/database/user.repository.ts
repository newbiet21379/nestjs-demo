import { InjectPool } from 'nestjs-slonik/dist';
import { DatabasePool, sql } from 'slonik';
import { UserRepositoryPort } from './user.repository.port';
import { z } from 'zod';
import { UserMapper } from '../user.mapper';
import { UserRoles } from '../domain/user.types';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from '../domain/user.entity';
import {SqlRepositoryBase} from '@libs/common/db/sql-repository.base';

/**
 * Runtime validation of user object for extra safety (in case database schema changes).
 * https://github.com/gajus/slonik#runtime-validation
 * If you prefer to avoid performance penalty of validation, use interfaces instead.
 */
export const userSchema = z.object({
  id: z.string().uuid(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()),
  email: z.string().email(),
  country: z.string().min(1).max(255),
  postal_code: z.string().min(1).max(20),
  street: z.string().min(1).max(255),
  role: z.nativeEnum(UserRoles),
  password: z.string().min(8).max(30)
});

export type UserModel = z.TypeOf<typeof userSchema>;

/**
 *  Repository is used for retrieving/saving domain entities
 * */
@Injectable()
export class UserRepository
  extends SqlRepositoryBase<UserEntity, UserModel>
  implements UserRepositoryPort
{
  protected tableName = 'users';

  protected schema = userSchema;

  constructor(
    @InjectPool()
    pool: DatabasePool,
    mapper: UserMapper,
    eventEmitter: EventEmitter2,
  ) {
    super(pool, mapper, eventEmitter, new Logger(UserRepository.name));
  }

  async updateAddress(user: UserEntity): Promise<void> {
    const address = user.getProps().address;
    const statement = sql.type(userSchema)`
    UPDATE "users" SET
    street = ${address.street}, country = ${address.country}, "postalCode" = ${address.postalCode}
    WHERE id = ${user.id}`;

    await this.writeQuery(statement, user);
  }

  async findOneByAccountIdAndPassword(accountId: string, password: string) {
    const user= await this.pool.one(
        sql.type(userSchema)`
        SELECT * FROM "users" WHERE accountId = ${accountId} AND password = ${password}
        `,
    );

    return this.mapper.toDomain(user);
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.pool.one(
      sql.type(userSchema)`SELECT * FROM "users" WHERE email = ${email}`,
    );

    return this.mapper.toDomain(user);
  }
}
