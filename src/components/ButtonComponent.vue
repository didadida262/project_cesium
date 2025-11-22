<template>
  <div
    :class="[
      'px-[8px] py-[4px] min-w-[120px] flex justify-center items-center h-[36px]',
      'border-[2px] border-solid border-[#383B45] rounded-md',
      'hover:cursor-pointer transition-all duration-300',
      'text-[14px] whitespace-nowrap',
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
