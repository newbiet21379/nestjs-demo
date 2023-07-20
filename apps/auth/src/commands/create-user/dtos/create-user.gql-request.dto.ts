import { ArgsType, Field, InputType } from '@nestjs/graphql';
import {
  IsAlphanumeric,
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

@ArgsType()
@InputType()
export class CreateUserGqlRequestDto {
  @MaxLength(320)
  @MinLength(5)
  @IsEmail()
  @Field()
  readonly email: string;

  @MaxLength(50)
  @MinLength(4)
  @IsString()
  @Matches(/^[a-zA-Z ]*$/)
  @Field()
  readonly country: string;

  @MaxLength(10)
  @MinLength(4)
  @IsAlphanumeric()
  @Field()
  readonly postalCode: string;

  @MaxLength(50)
  @MinLength(5)
  @Matches(/^[a-zA-Z ]*$/)
  @Field()
  readonly street: string;

  @ApiProperty({ example: 'abc1234', description: 'Password field minimum eight and maximum 30 characters, at least one uppercase letter, one lowercase letter, one number and one special character' })
  @MaxLength(30)
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/)
  readonly password: string;
}
