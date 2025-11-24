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

        if (error instanceof SyntaxError) {
            throw error;
        }

        throw new ApiClientError({
            message: 'Network/unknown error',
            original: error,
        });
    };

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


export type Result<T, E> =
    | { success: true; data: T }
    | { success: false; error: E };

export interface ApiCallOptions<Raw, Mapped, Err> {
    call: () => Promise<Raw>;
    map?: (raw: Raw) => Mapped;
    error?: (error: unknown) => Err;
}

export async function apiCall<Raw, Mapped = Raw, Err = unknown>(
    options: ApiCallOptions<Raw, Mapped, Err>
): Promise<Result<Mapped, Err>> {
    try {
        const raw = await options.call();

        const mapped = options.map ? options.map(raw) : (raw as unknown as Mapped);

        return {
            success: true,
            data: mapped,
        };
    } catch (e) {
        const error = options.error ? options.error(e) : (e as Err);
        logError(error);
        return {
            success: false,
            error,
        };
    }
}

export const apiClient = new ApiClient(
    ky.create({
        prefixUrl: import.meta.env.API_URL || 'https://jsonplaceholder.typicode.com',
        headers: { 'Content-Type': 'application/json' },
    })
);