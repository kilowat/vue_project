import { PostError } from "@/errors/PostError";
import type { Post } from "@/types/post";
import { apiCall, apiClient } from "@/utils/client";


export const getPost = async () => {
    return await apiCall({
        call: () => apiClient.get('todos/122'),
        map: postMapper.fromResponse,
        error: (e) => new PostError(e)
    });
}

export const createPost = async (title: string) => {
    //todo
}

export const postMapper = {
    fromResponse: (raw: any): Post => ({ id: raw.id }),
};