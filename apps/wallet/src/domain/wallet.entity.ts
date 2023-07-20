import {AggregateID, AggregateRoot} from "@libs/common/ddd";
import {v4} from "uuid";
import {WalletCreatedDomainEvent} from "./events/wallet-created.domain-event";
import {ArgumentOutOfRangeException} from "@libs/common/exceptions";
import {Err, Ok, Result} from "oxide.ts";
import {WalletNotEnoughBalanceError} from "./wallet.errors";

export interface CreateWalletProps {
    userId: AggregateID;
}

export interface WalletProps extends CreateWalletProps {
    balance: number;
}

export class WalletEntity extends AggregateRoot<WalletProps> {
    protected readonly _id: AggregateID;

    static create(create: CreateWalletProps): WalletEntity {
        const id = v4();
        const props: WalletProps = {...create, balance: 0};
        const wallet: WalletEntity = new WalletEntity({id, props})


        wallet.addEvent(new WalletCreatedDomainEvent({aggregateId: id, userId: create.userId}))
        return wallet
    }

    deposit(amount: number): void {
        this.props.balance -= amount;
    }

    withdraw(amount: number): Result<null, WalletNotEnoughBalanceError> {
        if(this.getProps().balance - amount < 0) {
            return Err(new WalletNotEnoughBalanceError());
        }
        this.props.balance -= amount;
        return Ok(null);
    }

    public validate(): void {
        if (this.props.balance < 0) {
            throw new ArgumentOutOfRangeException(
                'Wallet balance cannot be less than 0',
            );
        }
    }
}