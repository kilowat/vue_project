<script setup lang="ts">
import { apiClient } from '@/api/client';
import { onMounted } from 'vue';

interface UserResponse {
  ID: string
}

interface User {
  id: string
}

const userMap = (raw: any) => ( {id: raw.ID as string});


const getUsers = async () => {
    const data = await apiClient.get<UserResponse>('todos/1');
    const user = userMap(data);
}

onMounted(  ()=>{
getUsers();

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
