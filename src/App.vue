<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { getPost } from './api/post';
import type { Post } from './types/post';
import { useRequest } from './composable/useRequest';

const { data: post, error, loading, execute:fetchPost } = useRequest(getPost)


onMounted(()=> {
  fetchPost();
})

</script>

<template>
  <h1>You did it!</h1>
  <div>{{ loading }}</div>

  <div v-if="post">
    {{ JSON.stringify(post) }}
  </div>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<style scoped></style>
