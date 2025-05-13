<template>
  <div class="w-screen h-screen flex">
    <!-- <div class="w-[calc(50%)] h-full" ref="contentRef" id="shareArea">
      <CesiumContainer />
    </div> -->
    <div class="w-full h-full">
      <TestShare />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CesiumContainer from './CesiumContainer/index.vue'
import TestShare from './StreamDom/TestShare.vue'
const contentRef = ref<HTMLDivElement | null>(null)
</script>
