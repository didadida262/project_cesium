<template>
  <div
    :class="[
      'w-full h-full ',
      'bg-[rgb(18,20,22)]',
      'border-[2px] border-solid border-[#383B45] rounded-md',
      'px-[10px] py-[10px]',
    ]"
  >
    <MarkTableComponent
      :data="MockMarkTableData"
      color="#FB685CFF"
      light-color="rgb(23,16,28)"
      :on-click="onClick"
    />
  </div>
</template>

<script setup lang="ts">
import MarkTableComponent from './MarkTableComponent.vue'
import { MockMarkTableData } from '../const'

const props = defineProps<{
  onClick: (data: any) => void;
}>()
</script>
