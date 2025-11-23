import { AppError, toAppError } from "@/errors/AppError";
import type { Post } from "@/types/post";
import { apiClient } from "@/utils/client";

interface PostResponse {
    id: string
}

export const getPost = async () => {
    const data = await apiClient.get<PostResponse>('todos/122');
    return postMapper.fromResponse(data);

}


export const createPost = async (title: string) => {
    //todo
}

export const postMapper = {
    fromResponse: (raw: PostResponse): Post => ({ id: raw.id }),
};