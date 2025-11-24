
<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import * as postAPI from '@/api/post';
import { useRequest } from '@/composable/useRequest';


const { 
  data: post, 
  isLoading, 
  execute: fetchPost,
  error,
  onError
} = useRequest(postAPI.getPost);

//onError((error)=>{ console.log(error) })

onMounted(()=> {

  fetchPost();
})

</script>

<template>
  <h1>You did it!</h1>
  {{ error}}
  <div v-if="isLoading">...Загрузка</div>

  <div v-if="post">
    {{ JSON.stringify(post) }}
  </div>
  
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>