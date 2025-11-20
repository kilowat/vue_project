import ky, { HTTPError } from 'ky';
import type { KyInstance } from 'ky';

const kyClient = ky.create({
    prefixUrl: import.meta.env.API_URL || 'https://jsonplaceholder.typicode.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

export class ApiClient {
    constructor(private client: KyInstance) { }

    private async exec<T>(request: Promise<Response>): Promise<T> {
        try {
            const response = await request;
            return await response.json() as T;
        } catch (error) {
            // Можно тут логировать ошибку централизованно
            console.error('[ApiClient Error]:', error);
            throw error; // неизвестные ошибки летят наверх
        }
    }

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
}

export const apiClient = new ApiClient(kyClient);
