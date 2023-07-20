import {Inject} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {UserRepositoryPort} from "../../database/user.repository.port";
import {AuthenticationException, NotFoundException} from "@libs/common/exceptions";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {SignInCommand} from "./sign-in.command";
import {JwtResponseDto} from "../../dtos/jwt.response.dto";
import {Ok, Result} from "oxide.ts";

@CommandHandler(SignInCommand)
export class SignInService implements ICommandHandler{
    constructor(
        @Inject() private jwtService: JwtService,
        @Inject() private userRepo: UserRepositoryPort
    ) {
    }
    async execute(
        command: SignInCommand
    ): Promise<Result<JwtResponseDto, AuthenticationException>> {
        const user = await this.userRepo.findOneByEmail(command.email);
        if(!user) {
            throw new NotFoundException();
        }
        if(user.getProps().password !== command.password){
            throw new AuthenticationException();
        }
        const payload = { sub: user.id, username: user.getProps().email}
        const response = new JwtResponseDto();
        response.email = command.email
        response.jwt = await this.jwtService.signAsync(payload)
        return Ok(response);
    }
}