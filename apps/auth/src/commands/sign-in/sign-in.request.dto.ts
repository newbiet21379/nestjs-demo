import {IsEmail, MaxLength, MinLength} from "class-validator";

export class SignInRequestDto {
    readonly password: string;
    @MaxLength(320)
    @MinLength(5)
    @IsEmail()
    readonly email: string;
}