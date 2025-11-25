// composables/useRequests.ts
import { ref, type Ref } from 'vue';
import type { Result } from '@/utils/client';

type AnyFn = (...args: any[]) => Promise<Result<any, any>>;

export function useApi<Fns extends Record<string, AnyFn>>(fns: Fns) {
    const isLoading = ref(false);

    const data = {} as {
        [K in keyof Fns]: Ref<
            Awaited<ReturnType<Fns[K]>> extends { success: true; data: infer D }
            ? D | null
            : null
        >
    };

    const error = {} as {
        [K in keyof Fns]: Ref<
            Awaited<ReturnType<Fns[K]>> extends { success: false; error: infer E }
            ? E | null
            : null
        >
    };

    for (const key in fns) {
        // @ts-ignore
        data[key] = ref(null);
        // @ts-ignore
        error[key] = ref(null);
    }

    const actions = {} as {
        [K in keyof Fns]: (...args: Parameters<Fns[K]>) => Promise<ReturnType<Fns[K]>>
    };

    for (const key in fns) {
        //@ts-ignore
        actions[key] = async (...args: any[]) => {
            if (isLoading.value) {
                return Promise.reject(new Error('Request already in progress'));
            }

            isLoading.value = true;
            //@ts-ignore
            error[key].value = null;
            //@ts-ignore
            const result = await fns[key](...args);
            isLoading.value = false;

            if (result.success) {
                //@ts-ignore
                data[key].value = result.data;
            } else {
                //@ts-ignore
                error[key].value = result.error;
            }

            return result;
        };
    }

    return {
        isLoading,
        data,
        error,
        ...actions,
    };
}
