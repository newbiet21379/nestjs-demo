import {ExceptionBase} from "@libs/common/exceptions";

export class WalletNotEnoughBalanceError extends ExceptionBase {
    static readonly message = 'Wallet balance not enough';
    readonly code = 'WALLET.NOT_ENOUGH'

    constructor(metadata?: unknown) {
        super(WalletNotEnoughBalanceError.message, undefined, metadata);
    }
}