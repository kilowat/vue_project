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

    private static _getClientMessage(error: unknown): string | null {
        // 1. Проверяем CustomException (FetchCategoriesException и т.д.)
        if (error instanceof CustomException) {
            return error.getMessage();
        }

        // 2. Проверяем ApiClientError
        if (error instanceof ApiClientError) {
            // Можно добавить специфичные сообщения по статусам
            switch (error.status) {
                case 401:
                    return 'Необходима авторизация';
                case 403:
                    return 'Доступ запрещён';
                case 404:
                    return 'Ресурс не найден';
                case 500:
                case 502:
                case 503:
                    return 'Сервер недоступен';
                default:
                    return error.message;
            }
        }

        // 3. Можно добавить проверку на сетевые ошибки
        if (error instanceof TypeError) {
            return 'Неверный формат данных';
        }

        // 4. Нет специфичного сообщения
        return null;
    }

    static throw(error: unknown): never {
        // Получаем оригинальную ошибку (разворачиваем CustomException)
        const original = error instanceof CustomException ? error.original : error;

        // Пытаемся получить сообщение
        let message = this._getClientMessage(error); // передаём error, а не original!

        // Если не нашли - дефолтное сообщение
        if (message === null) {
            message = 'Произошла непредвиденная ошибка';
        }

        // Логируем оригинальную ошибку
        logError(original);

        // Бросаем AppError
        throw new AppError(message, original);
    }
}