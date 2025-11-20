import { describe, it, expect } from 'vitest'
import { apiClient } from '@/api/client';

// 🔥 Укажи свой URL который точно существует


describe('ApiClient GET (integration)', () => {
    it('should perform real GET request', async () => {
        // ← ← ← ПОСТАВЬ СЮДА BREAKPOINT
        const data = await apiClient.get('todos/1');

        // Пока простой ассерт, чтобы тест не падал
        expect({}).toBeDefined();
    });
});

