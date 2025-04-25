<template>
  <div class="w-screen h-screen">
    <CesiumContainer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CesiumContainer from './CesiumContainer/index.vue'

const msg = ref('vue3_template')
</script>
