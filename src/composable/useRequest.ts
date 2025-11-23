import { ref, computed, onScopeDispose } from "vue"
import { AppError } from "@/errors/AppError"

export type RequestStatus =
    | "initial"
    | "loading"
    | "ready"
    | "error"

export function useRequest<F extends (...args: any[]) => Promise<any>>(
    fn: F,
) {
    type Result = Awaited<ReturnType<F>>

    const data = ref<Result | null>(null)
    const status = ref<RequestStatus>("initial")
    const error = ref<AppError | null>(null)

    const isLoading = computed(() => status.value === "loading")
    const isError = computed(() => status.value === "error")
    const isReady = computed(() => status.value === "ready")

    const onSuccessListeners = new Set<(data: Result) => void>()
    const onErrorListeners = new Set<(err: AppError) => void>()

    function onSuccess(cb: (data: Result) => void) {
        onSuccessListeners.add(cb)
        const unsubscribe = () => onSuccessListeners.delete(cb)
        onScopeDispose(unsubscribe)

        return unsubscribe
    }

    function onError(cb: (err: unknown) => void) {
        onErrorListeners.add(cb)
        const unsubscribe = () => onErrorListeners.delete(cb)
        onScopeDispose(unsubscribe)

        return unsubscribe
    }


    const execute = async (...args: Parameters<F>) => {
        if (isLoading.value) return;

        status.value = "loading"
        error.value = null

        try {
            const result = await fn(...args)

            data.value = result
            for (const cb of onSuccessListeners) cb(result)
            return result
        } catch (e) {
            error.value = e as AppError;
            status.value = "error"
            for (const cb of onErrorListeners) cb(error.value)


        } finally {
            status.value = "ready";
        }
    }

    return {
        data,
        status,
        error,
        isLoading,
        isError,
        isReady,
        onError,
        onSuccess,
        execute,
    }
}
