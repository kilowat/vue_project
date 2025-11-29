
import { fetchPost } from '@/api/post'
import { useQuery } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'


export const usePost = (id: MaybeRefOrGetter<string>) => {
    return useQuery({
        queryKey: ['usePost', id],
        queryFn: async () => fetchPost(toValue(id)),
        enabled: !!toValue(id),
    });
}
