<script setup lang="ts">
import { apiClient } from '@/api/client';
import { onMounted } from 'vue';

onMounted( async ()=>{
  const data = await apiClient.get('todos/1');
data;
})
</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<style scoped></style>
