<template>
  <div
    :class="[
      'w-full h-full',
      'bg-gradient-to-br from-[rgb(18,20,22)] via-[rgb(20,22,26)] to-[rgb(18,20,22)]',
      'border-[2px] border-solid border-[#383B45] rounded-lg',
      'shadow-[0_4px_20px_rgba(0,0,0,0.5)]',
      'backdrop-blur-sm',
      'flex flex-col',
    ]"
  >
    <div class="w-full px-[16px] py-[12px]">
      <div class="flex items-center justify-between">
        <span class="text-[#DCF0FF] text-[14px]">显示中国边境线</span>
        <div
          :class="[
            'relative w-[44px] h-[24px] rounded-full cursor-pointer transition-all duration-300',
            isBorderVisible
              ? 'bg-[#FB685C]'
              : 'bg-[#383B45]',
          ]"
          @click="toggleBorder"
        >
          <div
            :class="[
              'absolute top-[2px] left-[2px] w-[20px] h-[20px] rounded-full bg-white transition-all duration-300',
              isBorderVisible ? 'translate-x-[20px]' : 'translate-x-0',
            ]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CesiumController } from '../CesiumController'

const isBorderVisible = ref(true)

const toggleBorder = async () => {
  isBorderVisible.value = !isBorderVisible.value
  await CesiumController.toggleChinaBorder(isBorderVisible.value)
}

// 检查边境线数据源状态
const checkBorderStatus = () => {
  // 如果数据源存在，说明边境线已加载，开关应该是开启状态
  isBorderVisible.value = CesiumController.chinaBorderDataSource !== null
}

onMounted(() => {
  // 初始化时检查边境线是否已加载
  checkBorderStatus()
  // 如果还没加载，延迟检查（边境线在2秒后加载）
  setTimeout(() => {
    checkBorderStatus()
  }, 2500)
})
</script>

