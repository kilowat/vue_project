import { AppError } from "@/errors/AppError";
import { CustomException } from "@/errors/CustomException";
import type { Post } from "@/types/post";
import { apiClient } from "@/utils/client";

interface PostResponse {
    id: string
}

class PostException extends CustomException {
    getMessage(): string {
        return "Post error";
    }
}

export const getPost = async () => {
    try {
        const data = await apiClient.get<PostResponse>('todos/122');
        return postMapper.fromResponse(data);
    } catch (e) {
        AppError.throw(new PostException(e));
    }
}


export const createPost = async (title: string) => {
    //todo
}

export const postMapper = {
    fromResponse: (raw: any): Post => ({ id: raw.test.id }),
};