<template>
  <div class="w-full h-full relative text-[white]">
    <div
      :class="[
        'operation min-w-[500px]  absolute top-[10px] left-[20px] z-10 ',
        'flex flex-col justify-start items-center gap-y-[10px]',
      ]"
    >
      <div
        :class="[' w-full ', 'flex justify-start items-center gap-x-[20px]']"
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
          <!-- <Select
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
          /> -->
        </div>
      </div>
      <div :class="['operation_content w-full h-[250px]']">
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
import { onMounted, ref } from 'vue'

import 'cesium/Build/Cesium/Widgets/widgets.css'
import Button from '../../components/ButtonComponent.vue'
import Select from '../../components/SelectComponent.vue'
import { CesiumController } from './CesiumController'
import { BTNMap, options, MockPointData } from './const'
import DrawFlagContainer from './components/DrawFlagContainer.vue'
import DrawAnimationContainer from './components/DrawAnimationContainer.vue'
import MarkContainer from './components/MarkContainer.vue'

const currenModel = ref('')

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
})
</script>

<style scoped></style>
