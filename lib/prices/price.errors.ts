export class PriceProviderError extends Error {
  readonly retryable: boolean;

  constructor(message: string, retryable: boolean, options?: ErrorOptions) {
    super(message, options);
    this.name = "PriceProviderError";
    this.retryable = retryable;
  }
}

export class PriceServiceError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "PriceServiceError";
  }
}
