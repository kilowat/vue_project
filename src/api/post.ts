import { PostError } from "@/errors/PostError";
import type { Post } from "@/types/post";
import { apiCall } from "@/utils/client";


export const getPost = async () => {
    return await apiCall({
        call: (api) => api.get('todos/122'),
        map: postMapper.fromResponse,
        error: (e) => {
            return new PostError(e)
        }
    });
}

export const createPost = async (title: string) => {
    return await apiCall({
        call: (api) => api.get('todos/122'),
        map: postMapper.fromResponse,
        error: (e) => new PostError(e)
    });
}

export const postMapper = {
    fromResponse: (raw: any): Post => ({ id: raw.id }),
};