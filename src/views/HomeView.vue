<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Post } from '@/types/post';
import {  getPost } from '@/api/post';
import type { PostError } from '@/errors/PostError';

const post = ref<Post | null>(null);
const error = ref<PostError | null>(null);
const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  const result = await getPost();
  isLoading.value = false;

  if (result.success) {
    post.value = result.data;
  } else {
    error.value = result.error;
  }
});
</script>

<template>
  <div v-if="isLoading">Загрузка...</div>
  <div v-if="error">{{ error.getMessage() }}</div>
  <div v-if="post">{{ post.id }}</div>
</template>
