import { errorHandle as defaultErrorHandle } from "@/utils/errorHandler"
import { ref } from "vue"

type ErrorHandler = (error: unknown) => any

interface UseRequestOptions {
    errorHandler?: ErrorHandler
}

export function useRequest<F extends (...args: any[]) => Promise<any>>(
    fn: F,
    options: UseRequestOptions = {}
) {
    type Result = Awaited<ReturnType<F>>

    const { errorHandler = defaultErrorHandle } = options

    const data = ref<Result | null>(null)
    const loading = ref(false)
    const error = ref<unknown>(null)

    const execute = async (...args: Parameters<F>) => {
        loading.value = true
        error.value = null

        try {
            const result = await fn(...args).catch(errorHandler)
            data.value = result
            return result
        } catch (e) {
            error.value = e
            throw e
        } finally {
            loading.value = false
        }
    }

    return { data, loading, error, execute }
}