export abstract class CustomException extends Error {
    constructor(public original: unknown) {
        super();
    }

    abstract getMessage(): string;
}