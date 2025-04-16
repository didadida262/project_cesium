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
        @click="handleClickBTN(item)"
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
const handleClickBTN = (btn: any) => {
  currenModel.value = btn.text
  switch (btn.key) {
    case 'jump':
      CesiumController.flyToTaiwan()
      break
    case 'mark':
      CesiumController.markArea()
      break
    case 'situation':
      CesiumController.showSituation()
      break
  }
}

onMounted(() => {
  CesiumController.init_world('cesiumContainer')
})
</script>

<style scoped></style>
