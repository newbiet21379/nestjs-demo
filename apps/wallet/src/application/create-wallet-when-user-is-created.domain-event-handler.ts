import {Injectable} from "@nestjs/common";

@Injectable()
export class CreateWalletWhenUserIsCreatedDomainEventHandler {
    constructor(
        private readonly walletRepo
    ) {
    }
}