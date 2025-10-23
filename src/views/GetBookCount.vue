<template>
  <div class="book-counter">
    <h1>Book Counter</h1>
    <button @click="incrementBookCount">Get Book Count</button>
    <p>Total number of books: {{ bookCount }}</p>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import axios from 'axios'


const bookCount = ref(0);

function incrementBookCount() {
    axios.get('https://us-central1-cxre-423d7.cloudfunctions.net/countItems').then(e=>{
    console.log(e.data)
    bookCount.value=e.data.totalItems;
  })
}

onMounted(()=>{

})

</script>

<style scoped>
/* Styles for the Book Counter component */

.book-counter {
  width: 100%;
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  padding: 20px;
}

h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 30px;
  position: relative;
  padding-bottom: 15px;
}

h1::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background-color: #3498db;
  border-radius: 2px;
}

button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 28px;
  font-size: 1.1em;
  cursor: pointer;
  border-radius: 30px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(52, 152, 219, 0.2);
}

button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(52, 152, 219, 0.3);
}

button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(52, 152, 219, 0.2);
}

p {
  margin-top: 25px;
  font-size: 1.3em;
  color: #34495e;
  font-weight: 500;
  padding: 10px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>
