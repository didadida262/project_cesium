<template>
  <div
    :class="[
      'px-[8px] py-[4px] min-w-[120px] flex justify-center items-center h-[36px]',
      'border-[2px] border-solid rounded-md',
      'hover:cursor-pointer transition-all duration-300',
      'text-[14px] whitespace-nowrap font-medium',
      'relative overflow-hidden select-none',
      currenModel === text
        ? 'bg-gradient-to-r from-[#FB685C]/20 to-[#FB685C]/10 border-[#FB685C] shadow-[0_0_12px_rgba(251,104,92,0.4)]'
        : 'bg-gradient-to-br from-[rgb(18,20,22)] to-[rgb(22,24,28)] border-[#383B45] hover:border-[#FB685C]/50 hover:shadow-[0_0_8px_rgba(251,104,92,0.2)]',
      classname,
    ]"
    @click="onClick"
  >
    <span
      :class="[
        'relative z-10',
        currenModel === text ? 'text-[#FB685C]' : 'text-[#DCF0FF]',
      ]"
    >
      {{ text }}
    </span>
    <!-- 选中时的光晕效果 -->
    <div
      v-if="currenModel === text"
      class="absolute inset-0 bg-gradient-to-r from-transparent via-[#FB685C]/10 to-transparent animate-pulse"
    />
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
