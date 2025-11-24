export abstract class CustomError extends Error {
    constructor(public readonly original: unknown) {
        super();
        this.name = this.constructor.name;
        this.message = this.getMessage();

        // Добавляем original в стек (опционально)
        if (original instanceof Error && original.stack) {
            this.stack = `${this.stack}\n\nCaused by: ${original.stack}`;
        }

        Object.setPrototypeOf(this, new.target.prototype);

    }

    abstract getMessage(): string;
}