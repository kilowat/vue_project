import { ApiClientError } from "@/utils/client";
import { logError } from "@/utils/errorLogger";
import { CustomException } from "./CustomException";

export class AppError extends Error {
    constructor(
        message: string,
        public readonly original: unknown,
    ) {
        super(message);
        this.name = 'AppError';
    }
    static from(error: unknown): AppError | never {
        if (error instanceof CustomException) {
            return new AppError(error.getMessage(), error.original);
        }
        if (error instanceof ApiClientError) {
            //if (error.status === 401) throw new UnauthorizedError(error); 
            return new AppError(error.message, error.original);
        }
        // Здесь через if можно будет разные сообщение замутить
        return new AppError('Произошла непредвиденная ошибка.', error);
    }

    static throw(error: unknown): never {
        logError(error);
        throw AppError.from(error);
    }
}

