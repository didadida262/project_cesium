<template>
  <div
    :class="[
      'w-full h-full ',
      'bg-[rgb(18,20,22)]',
      'border-[2px] border-solid border-[#383B45] rounded-md',
      'px-[10px] py-[10px]',
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
