<template>
  <div class="w-full h-full flex flex-col justify-between items-center">
    <div
      :class="[
        'header w-full h-[28px] text-[12px] flex items-center px-[10px]',
        'text-[#FB685C] font-semibold',
        'border-b-[2px] border-solid border-[#FB685C]/30',
        'bg-gradient-to-r from-transparent via-[#FB685C]/5 to-transparent',
      ]"
    >
      地点名称
    </div>
    <div class="content w-full h-[calc(100%_-_28px)] overflow-y-auto custom-scrollbar px-[4px] py-[4px]">
      <div
        v-for="(item, index) in data"
        :key="index"
        :class="[
          'w-full h-[42px] text-[12px]',
          'flex items-center px-[10px]',
          'rounded-md transition-all duration-300',
          'border',
          'hover:cursor-pointer',
          'border-b-[1px] border-solid border-[#383B45]/50',
          'mb-[6px]',
          selectedItem === item.key || selectedItem === item
            ? 'text-[#FB685C] border-[#FB685C] bg-[#FB685C]/15'
            : 'text-[#DCF0FF] border-transparent hover:border-[#FB685C]/50 hover:bg-gradient-to-r hover:from-[#FB685C]/10 hover:to-transparent hover:shadow-[0_2px_8px_rgba(251,104,92,0.3)]',
        ]"
        @click="handleRowClick(item)"
      >
        <div
          :class="[
            'w-full h-full',
            'flex items-center',
            'select-none',
          ]"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{
  data: any;
  color: string;
  lightColor: string;
  onClick: (data: any) => void;
}>()

const selectedItem = ref<any>(null)

const handleRowClick = (item: any) => {
  selectedItem.value = item.key || item
  props.onClick(item)
}
</script>
<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(56, 59, 69, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(251, 104, 92, 0.5);
  border-radius: 3px;
  transition: background 0.2s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(251, 104, 92, 0.7);
}

/* Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(251, 104, 92, 0.5) rgba(56, 59, 69, 0.3);
}
</style>

