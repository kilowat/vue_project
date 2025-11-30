import ky, { HTTPError } from 'ky';
import type { KyInstance } from 'ky';

export class ApiClientError extends Error {
    status?: number;
    body?: unknown;
    cause: unknown;

    constructor(params: { message: string; status?: number; body?: unknown; cause?: unknown }) {
        super(params.message);
        this.status = params.status;
        this.body = params.body;
        this.cause = params.cause;
    }
}

export class ApiClient {
    constructor(private client: KyInstance) { }

    private async exec<T>(request: Promise<Response>): Promise<T> {
        try {
            const response = await request;
            return await response.json() as T;

        } catch (error) {
            return await this.handleError(error);
        }
    }

    private async handleError(error: unknown): Promise<never> {
        if (error instanceof HTTPError) {
            const status = error.response.status;
            let body;

            try {
                body = await error.response.json();
            } catch {
                body = undefined;
            }

            throw new ApiClientError({
                message: `HTTP ${status}`,
                status,
                body,
                cause: error,
            });
        }

        throw error;
    }

    get<T = any>(url: string, params?: Record<string, any>) {
        return this.exec<T>(this.client.get(url, { searchParams: params }));
    }

    post<T = any>(url: string, body?: any) {
        return this.exec<T>(this.client.post(url, { json: body }));
    }

    put<T = any>(url: string, body?: any) {
        return this.exec<T>(this.client.put(url, { json: body }));
    }

    patch<T = any>(url: string, body?: any) {
        return this.exec<T>(this.client.patch(url, { json: body }));
    }

    delete<T = any>(url: string) {
        return this.exec<T>(this.client.delete(url));
    }
}

export const apiClient = new ApiClient(
    ky.create({
        prefixUrl: import.meta.env.API_URL || 'https://jsonplaceholder.typicode.com',
        headers: { 'Content-Type': 'application/json' },
    })
);


