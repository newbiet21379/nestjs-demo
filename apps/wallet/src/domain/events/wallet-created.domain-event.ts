import {DomainEvent, DomainEventProps} from "@libs/common/ddd";

export class WalletCreatedDomainEvent extends DomainEvent{
    readonly userId: string;


    constructor(props: DomainEventProps<WalletCreatedDomainEvent>) {
        super(props);
        this.userId = props.userId;
    }
}
