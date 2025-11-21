import type { Post } from "@/types/post";
import { apiClient } from "@/utils/client";

interface PostResponse {
    id: string
}

export const getPost = async () => {
    const data = await apiClient.get<PostResponse>('todos/122');
    return postMapper.fromResponse(data);
}

export const postMapper = {
    fromResponse: (raw: PostResponse): Post => ({ id: raw.id }),
};