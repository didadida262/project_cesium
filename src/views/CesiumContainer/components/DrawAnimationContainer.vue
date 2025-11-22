<template>
  <div
    :class="[
      'w-full h-full',
      'bg-gradient-to-br from-[rgb(18,20,22)] via-[rgb(20,22,26)] to-[rgb(18,20,22)]',
      'border-[2px] border-solid border-[#383B45] rounded-lg',
      'shadow-[0_4px_20px_rgba(0,0,0,0.5)]',
      'backdrop-blur-sm',
    ]"
  >
    <AnimationTableComponent
      :data="MockScriptTableData"
      color="#FB685CFF"
      light-color="rgb(23,16,28)"
      :on-click="onClick"
    />
  </div>
</template>

<script setup lang="ts">
import AnimationTableComponent from './AnimationTableComponent.vue'
import { MockScriptTableData } from '../const'

const props = defineProps<{
  onClick: (data: any) => void;
}>()
</script>
