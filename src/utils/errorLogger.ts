import { CustomException } from "@/errors/CustomException";
import { ApiClientError } from "./client";

export function logError(error: unknown) {
    if (error instanceof ApiClientError) {
        console.warn('[API warning]:', error.message, {
            status: error.status,
            original: error.original
        });
        return;
    }

    if (error instanceof CustomException) {
        console.warn('[API warning]:', error.getMessage(), {
            original: error.original
        });
        return;
    }
    console.error('[App Error]:', error);

    // отправка на Sentry / LogRocket / внешнюю систему
    // Sentry.captureException(error);
}


