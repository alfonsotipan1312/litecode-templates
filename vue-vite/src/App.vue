<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <div>
    <h1>Vue 3 + Vite + TypeScript</h1>
    <p>Plantilla lista para empezar a desarrollar.</p>
    <button @click="count++">Contador: {{ count }}</button>
  </div>
</template>

<style scoped>
h1 { color: #42b883; }
</style>
