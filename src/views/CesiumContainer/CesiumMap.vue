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
        class="flex justify-start items-center gap-x-[10px]"
        @click="handleClickBTN(item)"
      >
        <Button
          :text="item.text"
          :curren-model="currenModel"
        />
        <Select
          v-if="item.key === BTNMap[1].key && currenModel === BTNMap[1].text"
          :options="options"
          :on-click="handleSelectMark"
        />

        <Button
          v-if="item.key === BTNMap[1].key && currenModel === BTNMap[1].text"
          text="清除"
          classname="!h-[36px] !w-[100px]"
          :on-click="handleClear"
        />
        <Button
          v-if="item.key === BTNMap[1].key && currenModel === BTNMap[1].text"
          text="提交数据"
          classname="!h-[36px] !w-[100px]"
          :on-click="exportData"
        />
      </div>
      <div :class="['operation w-full h-[400px] markBroderR']">
        <DrawFlagContainer
          v-if="currenModel === 'drawFlag'"
          :on-click="handleSelectFlag"
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
import Select from '../../components/SelectComponent.vue'
import { CesiumController } from './CesiumController'
import { BTNMap, options, MockPointData } from './const'
import DrawFlagContainer from './components/DrawFlagContainer.vue'

const currenModel = ref('')

const handleSelectFlag = (data: any) => {
  console.log('data>>>>', data)
}

const exportData = () => {
  const res = CesiumController.exportData()
  console.log('导出数据>>>', res)
}
const handleClear = () => {
  CesiumController.clearAllMark()
}
const handleSelectMark = (item: any) => {
  console.log('handleSelectMark>>>', item)
  console.log('handleSelectMark>>>2', item.key)
  CesiumController.mark(item.key)
}
const handleClickBTN = (btn: any) => {
  currenModel.value = btn.text
  switch (btn.key) {
    case 'jump':
      CesiumController.flyToTaiwan()
      break
    case 'situation':
      CesiumController.showSituation()
      CesiumController.flyToTaiwan()

      break
    default:
      break
  }
}

onMounted(() => {
  CesiumController.init_world('cesiumContainer')
  //   CesiumController.drawPoints(MockPointData)
})
</script>

<style scoped></style>
