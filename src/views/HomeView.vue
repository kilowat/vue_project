<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { usePost } from '@/composable/usePost';

const id = ref('12');
const {data: post, isLoading, error } = usePost(id)

</script>

<template>
  <div v-if="isLoading">Загрузка...</div>
  <div v-if="error">{{ error.message}}</div>
  <div v-if="post">{{ post.id }}</div>
</template>
