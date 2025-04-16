<template>
  <div
    :class="[
      'px-[5px] py-[5px] w-[180px] h-[50px] flex justify-center items-center bg-[rgb(55,55,61)]',
      'hover:cursor-pointer hover:scale-105 transition-transform duration-300',
      currenModel === text ? 'selected' : '',
    ]"
    @click="onClick"
  >
    {{ text }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string;
  currenModel: string;
  onClick: () => void;
}>()
</script>
