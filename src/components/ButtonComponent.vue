<template>
  <div
    :class="[
      'px-[10px] py-[5px] w-[150px]  flex justify-center items-center h-[50px]',
      'border-[2px] border-solid border-[#383B45] rounded-md',
      'hover:cursor-pointer hover:scale-105 transition-transform duration-300',
      currenModel === text
        ? 'bg-[rgb(30,32,34)] selected'
        : 'bg-[rgb(18,20,22)]',
      classname,
    ]"
    @click="onClick"
  >
    {{ text }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string;
  classname?: string;
  currenModel?: string;
  onClick?: () => void;
}>()
</script>
