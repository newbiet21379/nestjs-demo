import {
    CanActivate,
    ExecutionContext,
    Inject, Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import {PASSWORD_GENERATOR, PasswordGeneratorPort} from "./password.generator.module";
import {USER_REPOSITORY} from "./user.di-tokens";
import {UserRepositoryPort} from "./database/user.repository.port";
import {JwtService} from "@nestjs/jwt";
import { Request } from 'express';
import {Reflector} from "@nestjs/core";
import {IS_PUBLIC_KEY} from "@libs/common/api/global.routes";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(PASSWORD_GENERATOR) protected readonly passwordGenerator: PasswordGeneratorPort,
        @Inject(USER_REPOSITORY) protected readonly userRepo: UserRepositoryPort,
        @Inject() protected readonly jwtService: JwtService,
        @Inject() protected readonly reflector: Reflector,
        @Inject() protected readonly configService: ConfigService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const request = context
            .switchToHttp()
            .getRequest<Request>();
        const token = this.extractTokenFromHeader(request);
        if(!token) {
            throw new UnauthorizedException();
        }
        try {
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = await this.jwtService.verifyAsync(
                token,
                {
                    secret: this.configService.get('JWT_CONSTANT')
                }
            );
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}

export type AuthorizedHeader = Readonly<{ accountId: string }>;