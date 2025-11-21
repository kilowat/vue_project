import { ApiClientError } from "./client"

export const errorHandle = (error: unknown) => {
    if (error instanceof ApiClientError) {
        // console.warn("API error:", error)
        return error;
    }

    throw error
}