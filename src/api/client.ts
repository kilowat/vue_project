import ky, { HTTPError } from 'ky';
import type { KyInstance } from 'ky';

const kyClient = ky.create({
    prefixUrl: import.meta.env.API_URL || 'https://jsonplaceholder.typicode.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface RequestOptions<TOut> {
    convert?: (raw: any) => TOut;
}

export interface Result<T> {
    data: T | null;
    error: unknown;
}

export class ApiClient {
    constructor(private client: KyInstance) { }

    private async exec<TOut>(
        request: Promise<Response>,
        options?: RequestOptions<TOut>
    ): Promise<Result<TOut>> {
        try {
            const response = await request;
            const raw = await response.json();

            const data = options?.convert
                ? options.convert(raw)
                : raw;

            return { data: data as TOut, error: null };

        } catch (error) {
            return {
                data: null,
                error
            };
        }
    }

    get<TOut = unknown>(
        url: string,
        params?: Record<string, any>,
        options?: RequestOptions<TOut>
    ) {
        return this.exec<TOut>(
            this.client.get(url, { searchParams: params }),
            options
        );
    }

    post<TOut = unknown>(url: string, body?: any, options?: RequestOptions<TOut>) {
        return this.exec<TOut>(this.client.post(url, { json: body }), options);
    }

    put<TOut = unknown>(url: string, body?: any, options?: RequestOptions<TOut>) {
        return this.exec<TOut>(this.client.put(url, { json: body }), options);
    }

    patch<TOut = unknown>(url: string, body?: any, options?: RequestOptions<TOut>) {
        return this.exec<TOut>(this.client.patch(url, { json: body }), options);
    }

    delete<TOut = unknown>(url: string, options?: RequestOptions<TOut>) {
        return this.exec<TOut>(this.client.delete(url), options);
    }
}

export const apiClient = new ApiClient(kyClient);
