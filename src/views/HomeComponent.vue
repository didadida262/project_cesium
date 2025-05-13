<template>
  <div class="w-screen h-screen flex">
    <div
      id="shareArea"
      ref="contentRef"
      class="w-[calc(50%)] h-full overflow-y-auto markBorderR"
    >
      <!-- <CesiumContainer /> -->
      <video
        src="./test.MP4"
        autoplay
        muted
        controls
        class="w-full h-full"
      />
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
