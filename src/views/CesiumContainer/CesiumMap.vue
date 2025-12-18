<template>
  <div class="w-full h-full relative text-[white]">
    <div
      ref="operationPanelRef"
      :class="[
        'operation absolute z-10',
        'flex flex-col justify-start items-center gap-y-[10px]',
        'bg-gradient-to-br from-[rgb(18,20,22)] via-[rgb(22,24,28)] to-[rgb(18,20,22)]',
        'border-[2px] border-solid border-[#383B45] rounded-xl',
        'shadow-[0_8px_32px_rgba(0,0,0,0.6)]',
        'p-[12px]',
        'overflow-hidden',
        isDragging ? 'shadow-[0_12px_48px_rgba(251,104,92,0.4)] border-[#FB685C]/50 will-change-transform' : 'backdrop-blur-sm',
        !isCollapsed && 'min-w-[500px]',
        isCollapsed ? 'panel-collapsed' : 'panel-expanded',
      ]"
      :style="{
        top: panelPosition.y + 'px',
        left: panelPosition.x + 'px',
        willChange: isDragging ? 'transform' : 'auto',
      }"
    >
      <!-- 拖拽手柄和收起按钮 -->
      <div
        :class="[
          'w-full mb-[4px] flex items-center justify-between gap-x-[8px]',
        ]"
      >
        <div
          :class="[
            'drag-handle flex-1 h-[8px] rounded-full',
            'bg-gradient-to-r from-transparent via-[#FB685C]/30 to-transparent',
            'cursor-move hover:via-[#FB685C]/50',
            'transition-all duration-300',
            'flex items-center justify-center',
          ]"
          @mousedown="handleMouseDown"
        >
          <div class="w-[40px] h-[2px] bg-[#FB685C]/50 rounded-full" />
        </div>
        <div
          :class="[
            'collapse-btn w-[24px] h-[24px] rounded-md',
            'flex items-center justify-center',
            'cursor-pointer transition-all duration-300',
            'hover:bg-[#FB685C]/20 hover:border-[#FB685C]/50',
            'border border-transparent',
          ]"
          @click="toggleCollapse"
        >
          <svg
            :class="[
              'w-[16px] h-[16px] text-[#FB685C] transition-transform duration-300',
              isCollapsed ? 'rotate-180' : '',
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <!-- 按钮区域 -->
      <div
        :class="['w-full flex justify-start items-center gap-x-[20px]']"
      >
        <div
          v-for="item in BTNMap"
          :key="item.key"
          class="flex justify-start items-center gap-x-[10px]"
          @click="handleClickBTN(item)"
        >
          <Button
            :text="item.text"
            :curren-model="currenModel"
          />
        </div>
      </div>

      <!-- 内容区域 -->
      <div
        v-show="!isCollapsed"
        :class="[
          'operation_content w-full h-[250px]',
          'rounded-lg overflow-hidden',
        ]"
      >
        <MarkContainer
          v-if="currenModel === '标注模式'"
          :on-click="handleSelectMark"
        />
        <DrawFlagContainer
          v-if="currenModel === '图标绘制'"
          :on-click="handleSelectFlag"
        />
        <DrawAnimationContainer
          v-if="currenModel === '动效演示'"
          :on-click="handleSelectAnimation"
        />
      </div>
    </div>

    <div
      id="cesiumContainer"
      class="w-full h-full"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'

import 'cesium/Build/Cesium/Widgets/widgets.css'
import Button from '../../components/ButtonComponent.vue'
import Select from '../../components/SelectComponent.vue'
import { CesiumController } from './CesiumController'
import { BTNMap, options, MockPointData } from './const'
import DrawFlagContainer from './components/DrawFlagContainer.vue'
import DrawAnimationContainer from './components/DrawAnimationContainer.vue'
import MarkContainer from './components/MarkContainer.vue'

const currenModel = ref('')
const operationPanelRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const isCollapsed = ref(true)
const panelPosition = ref({ x: 20, y: 10 })
const dragStartPos = ref({ x: 0, y: 0 })
const panelStartPos = ref({ x: 0, y: 0 })
let rafId: number | null = null
let panelWidth = 500
let panelHeight = 300

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleMouseDown = (e: MouseEvent) => {
  if (!operationPanelRef.value) return
  isDragging.value = true
  dragStartPos.value = { x: e.clientX, y: e.clientY }
  panelStartPos.value = { ...panelPosition.value }
  
  // 缓存尺寸，避免频繁计算
  panelWidth = operationPanelRef.value.offsetWidth
  panelHeight = operationPanelRef.value.offsetHeight
  
  document.addEventListener('mousemove', handleMouseMove, { passive: false })
  document.addEventListener('mouseup', handleMouseUp)
  e.preventDefault()
  e.stopPropagation()
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return
  
  e.preventDefault()
  
  // 使用 requestAnimationFrame 节流更新
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
  }
  
  rafId = requestAnimationFrame(() => {
    const deltaX = e.clientX - dragStartPos.value.x
    const deltaY = e.clientY - dragStartPos.value.y
    
    panelPosition.value = {
      x: Math.max(0, Math.min(window.innerWidth - panelWidth, panelStartPos.value.x + deltaX)),
      y: Math.max(0, Math.min(window.innerHeight - panelHeight, panelStartPos.value.y + deltaY)),
    }
    
    rafId = null
  })
}

const handleMouseUp = () => {
  isDragging.value = false
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
  }
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})

const handleSelectFlag = (item: any) => {
  console.log('item>>>>', item)
  CesiumController.mark('PointIcon', item)
}
const handleSelectAnimation = (item: any) => {
  console.log('item>>>>', item)
  //   CesiumController.flyToTaiwan();
  CesiumController.showSituation(item)
}

const exportData = () => {
  const res = CesiumController.exportData()
  console.log('导出数据>>>', res)
}
const handleClear = () => {
  CesiumController.clearAllMark()
}
const handleSelectMark = (item: any) => {
  CesiumController.mark(item.key)
}
const handleClickBTN = (btn: any) => {
  currenModel.value = btn.text
  CesiumController.remove()
  
  // 如果点击的是带有表格的按钮（标注模式、动效演示、图标绘制），且当前处于收起状态，则自动展开
  if ((btn.key === 'mark' || btn.key === 'situation' || btn.key === 'drawFlag') && isCollapsed.value) {
    isCollapsed.value = false
  }
  
  switch (btn.key) {
    case 'jump':
      CesiumController.flyToTaiwan()
      break
    // case "situation":
    //   CesiumController.showSituation();
    //   CesiumController.flyToTaiwan();
    //   break;
    default:
      break
  }
}

onMounted(() => {
  CesiumController.init_world('cesiumContainer')
  //   CesiumController.drawPoints(MockPointData)
  // 绘制中国边境线
  CesiumController.drawChinaBorder()
})
</script>

<style scoped>
.operation {
  transition: max-height 0.3s ease, opacity 0.3s ease;
}

.panel-collapsed {
  max-height: 120px;
}

.panel-expanded {
  max-height: 500px;
}

.operation_content {
  min-height: 250px;
}
</style>
