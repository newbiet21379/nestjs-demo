
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Err, Result } from 'oxide.ts';
import { AggregateID } from '@libs/common/ddd';
import {SendNotificationCommand} from "./send-notification.command";
import {MessageSendFailed} from "../../notification.errors";
import {NotificationEntity} from "../../domain/notification.entity";
import {Inject} from "@nestjs/common";
import {NotificationRepositoryPort} from "../../database/notification.repository.port";
import {EmailAdapter} from "../../adapter/email.adapter";
import {InjectionToken} from "../../notification.di-tokens";

@CommandHandler(SendNotificationCommand)
export class CreateUserService implements ICommandHandler {
    constructor(
        @Inject(InjectionToken.NOTIFICATION_REPOSITORY)
        protected readonly notificationRepo: NotificationRepositoryPort,
        @Inject(InjectionToken.EMAIL_ADAPTER)
        protected readonly emailAdapter: EmailAdapter
    ) {}

    async execute(
        command: SendNotificationCommand,
    ): Promise<Result<AggregateID, MessageSendFailed>> {
        const message = NotificationEntity.create({
            accountId: command.accountId,
            to: command.to,
            content: command.content,
            subject: command.subject,
        });
        try{
            await this.notificationRepo.transaction(async () => this.notificationRepo.insert(message));
            await this.emailAdapter.sendEmail(
                command.to,
                command.subject,
                command.content
            )
            return
        }catch (error: any) {
            return Err(new MessageSendFailed(error))
        }
    }
}
