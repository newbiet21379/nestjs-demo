import {Controller, Inject} from '@nestjs/common';
import {
  AccountClosed,
  AccountOpened, AccountPasswordUpdated,
  MessageHandler, Topic
} from "./message.module";
import {CommandBus} from "@nestjs/cqrs";
import {SendNotificationCommand} from "./commands/send-email/send-notification.command";

@Controller()
export class NotificationController {

  constructor(
      @Inject() private readonly commandBus: CommandBus,
      ) {}

  @MessageHandler(Topic.ACCOUNT_OPENED)
  async sendNewAccountEmail(message: AccountOpened): Promise<void> {
    await this.commandBus.execute<SendNotificationCommand, void>(
        new SendNotificationCommand({
          accountId: message.accountId,
          to: message.email,
          subject: 'New account created',
          content: 'New account it opened with this email',
        }),
    );
  }

  @MessageHandler(Topic.ACCOUNT_PASSWORD_UPDATED)
  async sendPasswordUpdatedEmail(
      message: AccountPasswordUpdated,
  ): Promise<void> {
    await this.commandBus.execute<SendNotificationCommand, void>(
        new SendNotificationCommand({
          accountId: message.accountId,
          to: message.email,
          subject: 'Account password updated',
          content: 'Account password is updated',
        }),
    );
  }

  @MessageHandler(Topic.ACCOUNT_CLOSED)
  async sendAccountClosedEmail(message: AccountClosed): Promise<void> {
    await this.commandBus.execute<SendNotificationCommand, void>(
        new SendNotificationCommand({
          accountId: message.accountId,
          to: message.email,
          subject: 'Account closed',
          content: 'Account is closed',
        }),
    );
  }
}
