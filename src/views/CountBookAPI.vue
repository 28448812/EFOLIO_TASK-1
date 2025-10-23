
<template>
    <div v-html="apires"></div>
</template>

<script setup lang="js">
import { onMounted, ref } from 'vue'
import axios from 'axios'

const apires=ref('')

onMounted(()=>{
  axios.get('https://us-central1-cxre-423d7.cloudfunctions.net/countItems').then(e=>{
    console.log(e.data)
    apires.value=JSON.stringify(e.data)
  })
})
</script>

<style scoped>

</style>