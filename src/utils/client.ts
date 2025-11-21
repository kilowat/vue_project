import ky, { HTTPError } from 'ky';
import type { KyInstance } from 'ky';

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

        if (error instanceof SyntaxError) {
            throw error;
        }

        throw new ApiClientError({
            message: 'Network/unknown error',
            original: error,
        });
    };

    get<T>(url: string, params?: Record<string, any>) {
        return this.exec<T>(this.client.get(url, { searchParams: params }));
    }

    post<T>(url: string, body?: any) {
        return this.exec<T>(this.client.post(url, { json: body }));
    }

    put<T>(url: string, body?: any) {
        return this.exec<T>(this.client.put(url, { json: body }));
    }

    patch<T>(url: string, body?: any) {
        return this.exec<T>(this.client.patch(url, { json: body }));
    }

    delete<T>(url: string) {
        return this.exec<T>(this.client.delete(url));
    }

    upload<T>(
        url: string,
        file: File | Blob,
        fieldName = "file",
        extra?: Record<string, any>,
        onProgress?: (progress: { percent: number; transferred: number; total?: number }) => void,
    ) {
        const fd = new FormData();
        fd.append(fieldName, file);

        if (extra) {
            for (const [k, v] of Object.entries(extra)) {
                fd.append(k, v as any);
            }
        }

        return this.exec<T>(
            this.client.post(url, {
                body: fd,
                hooks: {
                    beforeRequest: [],
                    beforeRetry: [],
                    afterResponse: [],
                },
                onUploadProgress: onProgress
                    ? (progress) => {
                        onProgress({
                            percent: progress.percent,
                            transferred: progress.transferredBytes,
                            total: progress.totalBytes,
                        });
                    }
                    : undefined
            })
        );
    }
}



export const apiClient = new ApiClient(
    ky.create({
        prefixUrl: import.meta.env.API_URL || 'https://jsonplaceholder.typicode.com',
        headers: { 'Content-Type': 'application/json' },
    })
);
