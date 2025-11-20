import ky from 'ky';
import type { KyInstance } from 'ky';

const kyClient = ky.create({
    prefixUrl: import.meta.env.API_URL || 'https://jsonplaceholder.typicode.com',
    headers: {
        'Content-Type': 'application/json',
    },
});


type RequestOptions = {
    transformData?: (raw: any) => any;
    transformError?: (raw: any) => any;
};

export type Result<T> = {
    data: T | null;
    error: T | null;
};

export class ApiClient {
    private client: KyInstance;

    constructor(client: KyInstance) {
        this.client = client;
    }

    private async exec<T>(
        promise: Promise<Response>,
        options?: RequestOptions
    ): Promise<Result<T>> {
        try {
            const res = await promise;
            let raw = await res.json();

            if (options?.transformData) {
                raw = options.transformData(raw);
            }

            return { data: raw as T, error: null };
        } catch (e: any) {

            if (options?.transformError) {
                e = options.transformError(e);
            }

            return { data: null, error: e };
        }
    }

    get<T>(url: string, params?: Record<string, any>, options?: RequestOptions) {
        return this.exec<T>(this.client.get(url, { searchParams: params }), options);
    }

    post<T>(url: string, body?: any, options?: RequestOptions) {
        return this.exec<T>(this.client.post(url, { json: body }), options);
    }

    put<T>(url: string, body?: any, options?: RequestOptions) {
        return this.exec<T>(this.client.put(url, { json: body }), options);
    }

    patch<T>(url: string, body?: any, options?: RequestOptions) {
        return this.exec<T>(this.client.patch(url, { json: body }), options);
    }

    delete<T>(url: string, options?: RequestOptions) {
        return this.exec<T>(this.client.delete(url), options);
    }

    upload<T>(
        url: string,
        file: File | Blob,
        fieldName = "file",
        extra?: Record<string, any>,
        options?: RequestOptions
    ) {
        const fd = new FormData();
        fd.append(fieldName, file);

        if (extra) {
            for (const [k, v] of Object.entries(extra)) {
                fd.append(k, v as any);
            }
        }

        return this.exec<T>(this.client.post(url, { body: fd }), options);
    }
}


export const apiClient = new ApiClient(kyClient);
