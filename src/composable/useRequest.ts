// composables/useRequest.ts
import { ref } from 'vue';
import type { Result } from '@/utils/client';

export function useRequest<F extends (...args: any) => Promise<Result<any, any>>>(fn: F) {
    type FnResult = Awaited<ReturnType<F>>;
    type Data = FnResult extends { success: true; data: infer D } ? D : never;
    type Err = FnResult extends { success: false; error: infer E } ? E : never;

    const data = ref<Data | null>(null);
    const error = ref<Err | null>(null);
    const isLoading = ref(false);

    async function execute(...args: Parameters<F>) {
        isLoading.value = true;
        error.value = null;

        const result = await fn(...args);
        isLoading.value = false;

        if (result.success) {
            data.value = result.data;
        } else {
            error.value = result.error;
        }

        return result; // тоже типизировано
    }

    return {
        data,
        error,
        isLoading,
        execute,
    };
}
