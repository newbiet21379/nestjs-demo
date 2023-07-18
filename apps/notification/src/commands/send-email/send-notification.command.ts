import {Command, CommandProps} from "@libs/common/ddd";

export class SendNotificationCommand extends Command{
    readonly accountId: string;
    readonly to: string;
    readonly subject: string;
    readonly content: string;

    constructor(props: CommandProps<SendNotificationCommand>) {
        super(props);
        this.accountId = props.accountId;
        this.to = props.to;
        this.subject = props.subject;
        this.content = props.content;
    }
}
