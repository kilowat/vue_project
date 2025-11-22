
import { AppError, toAppError } from "@/errors/AppError"
import { ref } from "vue"


export function useRequest<F extends (...args: any[]) => Promise<any>>(
    fn: F,
) {
    type Result = Awaited<ReturnType<F>>

    const data = ref<Result | null>(null)
    const loading = ref(false)
    const error = ref<AppError | null>(null)

    const execute = async (...args: Parameters<F>) => {
        loading.value = true
        error.value = null
        try {
            const result = await fn(...args);
            data.value = result
            return result
        } catch (e) {
            error.value = toAppError(e)
        } finally {
            loading.value = false
        }
    }

    return { data, loading, error, execute }
}