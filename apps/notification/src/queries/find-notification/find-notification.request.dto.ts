import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, MaxLength, MinLength} from "class-validator";

export class FindNotificationRequestDto {
    @ApiProperty({
        example: 'hq#1sd35@dask1235',
        description: 'Account Id of Sender',
    })
    readonly accountId?: string;

    @ApiProperty({
        example: 'john@gmail.com',
        description: 'User email address',
    })
    @MaxLength(320)
    @MinLength(5)
    @IsEmail()
    readonly to?: string;
    readonly skip: number;
    readonly take: number;
}