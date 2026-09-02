import { PriceProviderError } from "../price.errors";

export class KrakenRequestError extends PriceProviderError {
  constructor(message: string, retryable: boolean, options?: ErrorOptions) {
    super(message, retryable, options);
    this.name = "KrakenRequestError";
  }
}
