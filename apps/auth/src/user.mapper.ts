import { Mapper } from '@libs/common/ddd';
import { UserModel, userSchema } from './database/user.repository';
import { Address } from './domain/value-objects/address.value-object';
import { UserEntity } from './domain/user.entity';
import { Injectable } from '@nestjs/common';
import {UserResponseDto} from "./dtos/user.response.dto";

/**
 * Mapper constructs objects that are used in different layers:
 * Record is an object that is stored in a database,
 * Entity is an object that is used in application domain layer,
 * and a ResponseDTO is an object returned to a user (usually as json).
 */

@Injectable()
export class UserMapper
  implements Mapper<UserEntity, UserModel, UserResponseDto>
{
  toPersistence(entity: UserEntity): UserModel {
    const copy = entity.getProps();
    const record: UserModel = {
      id: copy.id,
      created_at: copy.createdAt,
      updated_at: copy.updatedAt,
      email: copy.email,
      country: copy.address.country,
      postal_code: copy.address.postalCode,
      street: copy.address.street,
      role: copy.role,
    };
    return userSchema.parse(record);
  }

  toDomain(record: UserModel): UserEntity {
    const entity = new UserEntity({
      id: record.id,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      props: {
        email: record.email,
        role: record.role,
        address: new Address({
          street: record.street,
          postalCode: record.postal_code,
          country: record.country,
        }),
        password: record.password
      },
    });
    return entity;
  }

  toResponse(entity: UserEntity): UserResponseDto {
    const props = entity.getProps();
    const response = new UserResponseDto(entity);
    response.email = props.email;
    response.country = props.address.country;
    response.postalCode = props.address.postalCode;
    response.street = props.address.street;
    return response;
  }

  /* ^ Data returned to the user is whitelisted to avoid leaks.
     If a new property is added, like password or a
     credit card number, it won't be returned
     unless you specifically allow this.
     (avoid blacklisting, which will return everything
      but blacklisted items, which can lead to a data leak).
  */
}
