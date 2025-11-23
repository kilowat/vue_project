export abstract class CustomException {
    constructor(public original: unknown) { }

    abstract getMessage(): string;
}