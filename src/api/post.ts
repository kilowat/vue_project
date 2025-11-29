import { PostError } from "@/errors/PostError";
import type { Post } from "@/types/post";
import { apiClient } from "@/utils/client";



export const fetchPost = async (id: string) => {
    try {
        const data = await apiClient.get(`todos/${id}`);
        return postMapper.fromResponse(data);
    } catch (e) {
        throw new PostError(e);
    }
}
export const postMapper = {
    fromResponse: (raw: any): Post => ({ id: raw.id }),
};