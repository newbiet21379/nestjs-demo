import { ApiProperty } from '@nestjs/swagger';
import {ResponseBase} from "@libs/common/api/response.base";

export class NotificationResponseDto extends ResponseBase {
    @ApiProperty({
        example: 'joh-doe@gmail.com',
        description: "Receiver email address",
    })
    to: string;

    @ApiProperty({
        example: 'joh-doe@gmail.com',
        description: "Receiver email address",
    })
    send: string;

    @ApiProperty({
        example: 'John Doe Invitation',
        description: 'Message subject',
    })
    subject: string;

    @ApiProperty({
        example: 'Visit John Doe',
        description: 'Content of message for Receiver',
    })
    content: string;
}
