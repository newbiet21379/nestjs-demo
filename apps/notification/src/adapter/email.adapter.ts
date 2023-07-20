import {SendEmailCommand, SESClient} from '@aws-sdk/client-ses';
import {EmailAdapterPort} from "./email.adapter.port";
import {Inject} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

export class EmailAdapter implements EmailAdapterPort {
    constructor(@Inject() protected readonly configService: ConfigService) {
    }
    private readonly sesClient = new SESClient({
        region: this.configService.get('AWS_REGION'),
        endpoint: this.configService.get('AWS_ENDPOINT'),
        credentials: {
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
        },
    });

    async sendEmail(to: string, subject: string, text: string): Promise<void> {
        await this.sesClient.send(
            new SendEmailCommand({
                Destination: {ToAddresses: [to]},
                Source: this.configService.get('EMAIL'),
                Message: {
                    Subject: {Data: subject, Charset: 'UTF-8'},
                    Body: {Text: {Data: text, Charset: 'UTF-8'}},
                },
            }),
        );
    }
}
