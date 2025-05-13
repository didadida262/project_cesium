<template>
  <div class="w-screen h-screen flex">
    <div
      id="shareArea"
      ref="contentRef"
      class="w-[calc(50%)] h-[100px] overflow-y-auto markBorderR"
    >
      <!-- <CesiumContainer /> -->
      <p>这是一段文本1</p>
      <p>这是一段文本2</p>
      <p>这是一段文本3</p>
      <p>这是一段文本4</p>
      <p>这是一段文本5</p>
      <p>这是一段文本6</p>
      <p>这是一段文本7</p>
      <p>这是一段文本89</p>
    </div>
    <div class="w-[calc(50%)] h-full">
      <PicShare />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CesiumContainer from './CesiumContainer/index.vue'
import TestShare from './StreamDom/TestShare.vue'
import PicShare from './StreamDom/PicShare.vue'
const contentRef = ref<HTMLDivElement | null>(null)
</script>
