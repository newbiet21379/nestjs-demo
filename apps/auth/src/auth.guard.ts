import {applyDecorators, CanActivate, ExecutionContext, Inject, UseGuards,} from '@nestjs/common';
import {ApiBasicAuth, ApiForbiddenResponse} from '@nestjs/swagger';
import {Request} from 'express';
import {PASSWORD_GENERATOR, PasswordGeneratorPort} from "@libs/common/module/password.generator.module";
import {USER_REPOSITORY} from "./user.di-tokens";
import {UserRepositoryPort} from "./database/user.repository.port";

class AuthGuard implements CanActivate {
    constructor(
        @Inject(PASSWORD_GENERATOR)
        protected readonly passwordGenerator: PasswordGeneratorPort,
        @Inject(USER_REPOSITORY)
        protected readonly userRepo: UserRepositoryPort) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const authorization = context
            .switchToHttp()
            .getRequest<Request>()
            .header('authorization');
        if (!authorization) return false;

        const [type, base64] = authorization.split(' ', 2);
        if ((type !== 'basic' && type !== 'Basic') || !base64) return false;

        const [accountId, password] = Buffer.from(base64, 'base64')
            .toString('utf8')
            .split(':', 2);
        if (!accountId || !password) return false;

        const account = await this.userRepo.findOneByAccountIdAndPassword(
            accountId,
            this.passwordGenerator.generateKey(password));
        if (!account) return false;

        context.switchToHttp().getRequest<Request>().headers.accountId = accountId;

        return true;
    }
}

export type AuthorizedHeader = Readonly<{ accountId: string }>;

export const Auth = () =>
    applyDecorators(
        UseGuards(AuthGuard),
        ApiBasicAuth(),
        ApiForbiddenResponse({
            description: 'Authorization header validation is failed',
        }),
    );
