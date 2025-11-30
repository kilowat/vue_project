export abstract class AppError<T extends string> extends Error {
    cause: unknown;
    name: T;
    constructor({ name, cause }: { name: T, cause: unknown }) {
        super("");
        this.name = name;
        this.cause = cause;

        this.message = this.getMessage();
    }

    abstract getMessage(): string;
}

/*
export abstract class AppError extends Error {
  cause: unknown;

  constructor(cause: unknown) {
    super(""); // зададим message позже
    this.name = this.constructor.name;

    this.cause = cause; // ← вручную сохраняем cause

    this.message = this.getMessage();
  }

  abstract getMessage(): string;
}
  */
