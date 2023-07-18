
import {ExceptionBase} from "@libs/common/exceptions";

export class OrderUpdateFailed extends ExceptionBase {
  static readonly message = 'Order update failed';

  public readonly code = 'ORDER.UPDATE_FAILED';

  constructor(cause?: Error, metadata?: unknown) {
    super(OrderUpdateFailed.message, cause, metadata);
  }
}
