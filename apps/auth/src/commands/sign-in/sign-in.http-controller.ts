import {Body, Controller, Delete, HttpStatus} from "@nestjs/common";
import {routesV1} from "@libs/common/configs/app.routes";
import {CommandBus} from "@nestjs/cqrs";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {NotFoundException} from "@libs/common/exceptions";
import {ApiErrorResponse} from "@libs/common/api/api-error.response";
import {Public} from "@libs/common/api/global.routes";
import {match, Result} from "oxide.ts";
import {NotFoundException as NotFoundHttpException} from "@nestjs/common/exceptions/not-found.exception";
import {SignInRequestDto} from "./sign-in.request.dto";
import {SignInCommand} from "./sign-in.command";
import {AuthenticationError} from "../../domain/user.errors";

@Controller(routesV1.version)
export class SignInHttpController {
    constructor(private readonly commandBus: CommandBus) {}
    @ApiOperation({ summary: 'Sign in a user' })
    @ApiResponse({
        description: 'User login successfully',
        status: HttpStatus.OK,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        type: ApiErrorResponse,
    })
    @Public()
    @Delete(routesV1.user.sign_in)
    async signIn(@Body() body: SignInRequestDto): Promise<any> {
        const command = new SignInCommand(body);
        const result: Result<boolean, AuthenticationError> =
            await this.commandBus.execute(command);

        match(result, {
            Ok: (isOk: boolean) => isOk,
            Err: (error: Error) => {
                if (error instanceof AuthenticationError)
                    throw new AuthenticationError(error.message);
                if (error instanceof NotFoundException)
                    throw new NotFoundHttpException(error.message);
                throw error;
            },
        });
    }

}