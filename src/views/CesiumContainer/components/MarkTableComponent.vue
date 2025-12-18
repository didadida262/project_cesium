<template>
  <div class="w-full h-full flex flex-col justify-between items-center">
    <div
      :class="[
        'header w-full h-[28px] text-[12px] flex justify-between items-center px-[10px]',
        'text-[#FB685C] font-semibold',
        'border-b-[2px] border-solid border-[#FB685C]/30',
        'bg-gradient-to-r from-transparent via-[#FB685C]/5 to-transparent',
      ]"
    >
      <div class="w-[calc(48%)] h-full flex items-center">
        名称
      </div>
      <div class="w-[calc(48%)] h-full flex items-center">
        ID
      </div>
    </div>
    <div class="content w-full h-[calc(100%_-_28px)] overflow-y-auto custom-scrollbar px-[4px] py-[4px]">
      <div
        v-for="(item, index) in data"
        :key="index"
        :class="[
          'w-full h-[42px] text-[12px]',
          'flex justify-between items-center px-[10px]',
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
            'w-[calc(48%)] h-full',
            'flex justify-between items-center',
            'select-none',
          ]"
        >
          {{ item.name }}
        </div>
        <div
          :class="[
            'flex items-center',
            'w-[calc(48%)] h-full',
            'select-none',
          ]"
        >
          <component
            :is="getIconComponent(item.key)"
            :class="[
              'w-5 h-5',
              selectedItem === item.key || selectedItem === item
                ? 'text-[#FB685C]'
                : 'text-[#DCF0FF]',
            ]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, h } from 'vue'

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

// 根据key返回对应的图标组件
const getIconComponent = (key: string) => {
  const iconMap: Record<string, any> = {
    Point: () => h('svg', {
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      class: 'w-5 h-5'
    }, [
      h('circle', {
        cx: '12',
        cy: '12',
        r: '4'
      })
    ]),
    Line: () => h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      class: 'w-5 h-5'
    }, [
      h('line', {
        x1: '4',
        y1: '12',
        x2: '20',
        y2: '12'
      })
    ]),
    StraightArrow: () => h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      class: 'w-5 h-5'
    }, [
      h('line', {
        x1: '4',
        y1: '12',
        x2: '16',
        y2: '12'
      }),
      h('polyline', {
        points: '14,8 18,12 14,16'
      })
    ]),
    AttackArrow: () => h('svg', {
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      class: 'w-5 h-5'
    }, [
      h('path', {
        d: 'M3 12 L12 3 L21 12 L12 21 Z'
      })
    ]),
    PincerArrow: () => h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      class: 'w-5 h-5'
    }, [
      h('path', {
        d: 'M3 12 L8 7 L12 12 L16 7 L21 12'
      }),
      h('path', {
        d: 'M3 12 L8 17 L12 12 L16 17 L21 12'
      })
    ])
  }
  
  return iconMap[key] || (() => h('span', {}, key))
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
