
export function logError(error: unknown) {
    console.error('[App Error]:', error);

    // отправка на Sentry / LogRocket / внешнюю систему
    // Sentry.captureException(error);
}


