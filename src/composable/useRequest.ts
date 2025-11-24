import { ref, computed, onScopeDispose } from "vue";
import type { Result } from "@/utils/client";

export type RequestStatus = "initial" | "loading" | "ready" | "error";


type AwaitedReturn<F> = Awaited<ReturnType<F>>;
type ResultSuccess<R> = R extends { success: true; data: infer T } ? T : never;
type ResultError<R> = R extends { success: false; error: infer E } ? E : never;


export function useRequest<F extends (...args: any[]) => Promise<Result<any, any>>>(
    fn: F
) {
    type RawResult = AwaitedReturn<F>;
    type DataT = ResultSuccess<RawResult>;
    type ErrorT = ResultError<RawResult>;

    const data = ref<DataT | null>(null);
    const error = ref<ErrorT | null>(null);
    const status = ref<RequestStatus>("initial");

    const isLoading = computed(() => status.value === "loading");
    const isError = computed(() => status.value === "error");
    const isReady = computed(() => status.value === "ready");

    const onSuccessListeners = new Set<(data: DataT) => void>();
    const onErrorListeners = new Set<(err: ErrorT) => void>();

    function onSuccess(cb: (data: DataT) => void) {
        onSuccessListeners.add(cb);
        const unsubscribe = () => onSuccessListeners.delete(cb);
        onScopeDispose(unsubscribe);
        return unsubscribe;
    }

    function onError(cb: (err: ErrorT) => void) {
        onErrorListeners.add(cb);
        const unsubscribe = () => onErrorListeners.delete(cb);
        onScopeDispose(unsubscribe);
        return unsubscribe;
    }

    const execute = async (...args: Parameters<F>) => {
        if (isLoading.value) return;

        status.value = "loading";
        error.value = null;

        const result = await fn(...args);

        if (result.success) {
            data.value = result.data;
            for (const cb of onSuccessListeners) cb(result.data);
            status.value = "ready";
            return result.data;
        } else {
            error.value = result.error;
            status.value = "error";
            for (const cb of onErrorListeners) cb(result.error);
            return null;
        }
    };

    return {
        data,
        error,
        status,
        isLoading,
        isError,
        isReady,
        onSuccess,
        onError,
        execute,
    };
}
