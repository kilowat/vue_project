import { ApiClientError } from "@/utils/client";

export class AppError extends Error {
    constructor(
        message: string,
        public readonly original: unknown,
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export function toAppError(error: unknown): AppError {
    if (error instanceof ApiClientError) {
        return new AppError(error.message, error.original);
    }
    // Здесь через if можно будет разные сообщение замутить
    return new AppError('Произошла непредвиденная ошибка.', error);
}