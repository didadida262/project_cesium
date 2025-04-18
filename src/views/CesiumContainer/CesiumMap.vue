<template>
  <div class="w-full h-full relative text-[white]">
    <div
      :class="[
        'operation min-w-[calc(20%)]  absolute top-[10px] left-[20px] z-10 ',
      ]"
    >
      <div
        :class="[
          'header w-full h-[80px] ',
          'flex justify-start items-center gap-x-[20px] ',
        ]"
      >
        <div
          v-for="item in BTNMap"
          :key="item.key"
          class="flex justify-start items-center gap-x-[10px]"
          @click="handleClickBTN(item)"
        >
          <Button
            :data="item"
            :curren-model="currenModel"
          />
          <Select
            v-if="item.key === 'mark' && currenModel === 'mark'"
            :options="options"
            :on-click="handleSelectMark"
          />

          <Button
            v-if="item.key === 'mark' && currenModel === 'mark'"
            :data="{ text: '清除' }"
            classname="!h-[36px] !w-[100px]"
            @click.stop="handleClear"
          />
          <Button
            v-if="item.key === 'mark' && currenModel === 'mark'"
            :data="{ text: '提交数据' }"
            classname="!h-[36px] !w-[100px]"
            @click.stop="exportData"
          />
        </div>
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

const handleSelectFlag = (item: any) => {
  console.log('handleSelectFlag>>>', item)
  CesiumController.markFlag(item.icon)
}

const exportData = () => {
  const res = CesiumController.exportData()
  console.log('导出数据>>>', res)
}
const handleClear = () => {
  CesiumController.clearAllMark()
}
const handleSelectMark = (e: any, item: any) => {
  e.stopPropagation()
  console.log('handleSelectMark>>>', item)
  CesiumController.mark(item.key)
}
const handleClickBTN = (btn: any) => {
  console.log('handleClickBTN')
  if (currenModel.value === btn.key) {
    currenModel.value = ''
    return
  }
  currenModel.value = btn.key
  console.log('currenModel.value>>>', currenModel.value)
  switch (btn.key) {
    case 'jump':
      CesiumController.flyToTaiwan()
      break
    case 'situation':
      CesiumController.showSituation()
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
