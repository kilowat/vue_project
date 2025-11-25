import ky, { HTTPError } from 'ky';
import type { KyInstance } from 'ky';
import { logError } from './errorLogger';

export class ApiClientError extends Error {
    status?: number;
    body?: unknown;
    original?: unknown;

    constructor(params: { message: string; status?: number; body?: unknown; original?: unknown }) {
        super(params.message);
        this.status = params.status;
        this.body = params.body;
        this.original = params.original;
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
                original: error,
            });
        }

        throw new ApiClientError({
            message: 'Unknown error',
            original: error,
        });
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

export type Result<T, E> =
    | { success: true; data: T }
    | { success: false; error: E };

export interface ApiCallOptions<Raw, Mapped, Err> {
    call: (client: ApiClient) => Promise<Raw>;
    map?: (raw: Raw) => Mapped;
    error?: (error: ApiClientError) => Err;
}


export function createApiCall(client: ApiClient, logger?: (e: any) => void) {
    return async function apiCall<Raw, Mapped = Raw, Err = ApiClientError>(
        options: ApiCallOptions<Raw, Mapped, Err>
    ): Promise<Result<Mapped, Err>> {
        try {
            const raw = await options.call(client);
            const mapped = options.map ? options.map(raw) : (raw as Mapped);

            return { success: true, data: mapped };
        } catch (e) {
            const err = options.error ? options.error(e as ApiClientError) : (e as Err);
            if (logger) logger(err);

            return { success: false, error: err };
        }
    };
}

export const apiClient = new ApiClient(
    ky.create({
        prefixUrl: import.meta.env.API_URL || 'https://jsonplaceholder.typicode.com',
        headers: { 'Content-Type': 'application/json' },
    })
);


export const apiCall = createApiCall(apiClient, logError);
