<template>
  <div
    id="cesiumContainer"
    class="w-full h-full"
  />
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'

import 'cesium/Build/Cesium/Widgets/widgets.css'
import * as Cesium from 'cesium'
// 设置 Cesium Ion 访问令牌
Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMTQ4ZmRhMS00MjY3LTRlZTgtOGU3Yi01OTY4NTEwN2NkYzciLCJpZCI6Mjk0MTEyLCJpYXQiOjE3NDQ2ODU2OTd9.yMNzVcVvq9NI2sXWePenGj5ZJbshJqiGqctlNlDWEDA'

const init_world = () => {
  console.warn('init_world>????')
  const viewer = new Cesium.Viewer('cesiumContainer', {
    timeline: false, // 是否显示时间线控件
    terrainProvider: Cesium.createWorldTerrain(),
    baseLayerPicker: true,
    //   animation: false, // 可选：关闭动画控件
    //   baseLayerPicker: false, // 可选：关闭底图选择器
    //   shouldAnimate: true,
  });

  // 去除logo
  (viewer.cesiumWidget.creditContainer as HTMLElement).style.display = 'none'
  // 显示帧率
  viewer.scene.debugShowFramesPerSecond = true;
  // viewer.scene.globe.depthTestAgainstTerrain = true;
  (window as any).viewer = viewer
  // 确保地球加载
  viewer.scene.globe.show = true
  //   // 外天空盒
  //   viewer.scene.skyBox = new Cesium.SkyBox({
  //     sources: {
  //       positiveX: "/images/Standard-Cube-Map/px1.png",
  //       negativeX: "/images/Standard-Cube-Map/nx1.png",
  //       positiveY: "/images/Standard-Cube-Map/pz.png",
  //       negativeY: "/images/Standard-Cube-Map/nz1.png",
  //       positiveZ: "/images/Standard-Cube-Map/py.png",
  //       negativeZ: "/images/Standard-Cube-Map/ny1.png",
  //     },
  //   });
  console.log('viewer>>>', viewer.scene.globe)
  console.log('使用 Token:', Cesium.Ion.defaultAccessToken)
}

onMounted(() => {
  init_world()
})
</script>

<style scoped></style>
