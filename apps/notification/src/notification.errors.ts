import {ExceptionBase} from "@libs/common/exceptions";

export class MessageSendFailed extends ExceptionBase {
    static readonly message = 'Message send failed';
    public readonly code = 'MESSAGE.SEND_FAILED';

    constructor(cause?: Error, metadata?: unknown) {
        super(MessageSendFailed.message, cause, metadata);
    }

}