<script setup lang="ts">
import { apiClient } from '@/api/client';
import { onMounted } from 'vue';

interface UserResponse {
  ID: string
}

interface User {
  id: string
}

const userMap = (raw: UserResponse):User => ( {id: raw.ID});


const getUsers = async () => {
    const data = await apiClient.get<User>('todos/1', {}, {
    convert: (raw: UserResponse) => ({id: raw.ID})
  });

  const data2 = await apiClient.get('todos/1', {}, {
    convert: userMap,
  });

    const data3 = await apiClient.get('todos2/1', {}, {
      convert: (raw: UserResponse) => ({id: raw.ID})
  });
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
