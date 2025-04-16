<template>
  <div class="w-full h-full relative text-[white]">
    <div
      :class="[
        'operation w-[calc(50%)]  absolute top-[10px] left-[20px] z-10',
        'flex justify-start items-center gap-x-[20px]',
      ]"
    >
      <div
        v-for="item in BTNMap"
        :key="item.key"
        @click="handleClickBTN(item.key)"
      >
        <Button
          :text="item.text"
          :curren-model="currenModel"
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
import { onMounted, ref } from 'vue'

import 'cesium/Build/Cesium/Widgets/widgets.css'
import Button from '../../components/ButtonComponent.vue'
import { CesiumController } from './CesiumController'
import { BTNMap } from './const'

const currenModel = ref('')
const handleClickBTN = (key: string) => {
  switch (key) {
    case 'jump':
      handleJump()
      break
    case 'mark':
      handleMark()
      break
    case 'situation':
      handleSituation()
      break
  }
}
const handleSituation = async () => {
  currenModel.value = '动态演示'
  CesiumController.showSituation()
}
const handleMark = () => {
  currenModel.value = '标注'
  CesiumController.markArea()

  //   drawTool.activate("Polyline");
}
const handleJump = () => {
  currenModel.value = '跳转至目标地点'
  CesiumController.flyToTaiwan()
}

onMounted(() => {
  CesiumController.init_world('cesiumContainer')
})
</script>

<style scoped></style>
