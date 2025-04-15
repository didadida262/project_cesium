<template>
  <div class="w-full h-full relative text-[white]">
    <div
      :class="[
        'operation w-[calc(50%)]  absolute top-[10px] left-[20px] z-10',
        'flex justify-start items-center gap-x-[20px]',
      ]"
    >
      <div
        :class="[
          'px-[5px] py-[5px] bg-[rgb(55,55,61)] w-[180px] h-[50px] flex justify-center items-center',
          'hover:cursor-pointer hover:opacity-75',
        ]"
        type="primary"
        @click="handleJump"
      >
        跳转至目标地点
      </div>
      <div
        :class="[
          'px-[5px] py-[5px] bg-[rgb(55,55,61)] w-[180px] h-[50px] flex justify-center items-center',
          'hover:cursor-pointer hover:opacity-75',
        ]"
        type="primary"
        @click="handleMark"
      >
        标注
      </div>
      <div
        :class="[
          'px-[5px] py-[5px] bg-[rgb(55,55,61)] w-[180px] h-[50px] flex justify-center items-center',
          'hover:cursor-pointer hover:opacity-75',
        ]"
        type="primary"
        @click="handleMark"
      >
        动态演示
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
import * as Cesium from 'cesium'
import DrawTool from '../../utils/drawGraphic.js'
// 设置 Cesium Ion 访问令牌
Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMTQ4ZmRhMS00MjY3LTRlZTgtOGU3Yi01OTY4NTEwN2NkYzciLCJpZCI6Mjk0MTEyLCJpYXQiOjE3NDQ2ODU2OTd9.yMNzVcVvq9NI2sXWePenGj5ZJbshJqiGqctlNlDWEDA'

// const currentHeight = ref("") as any;
// const clickedPosition = ref(null) as any;

let viewer = null as any
//   let scene = null;
//   let handler = null;

const handleMark = () => {
  const drawTool = new DrawTool(viewer)
  drawTool.activate('Polygon', (data: any) => {
    console.log('data>>>', data)
  })
  //   drawTool.activate("Polyline");
}
const handleJump = () => {
  // 定位到台湾
  flyToTaiwan()
  // 设置垂直视角查看台湾全岛
  //   setupTaiwanView();
}
const flyToTaiwan = () => {
  // 台湾的经纬度坐标（台北）
  const taiwanPosition = Cesium.Cartesian3.fromDegrees(
    120.64405,
    24.15814000000001,
    500000,
  )
  const taiwanLabelPosition = Cesium.Cartesian3.fromDegrees(
    121.5654,
    25.033,
    100000,
  )

  // 使用flyTo定位
  viewer.camera.flyTo({
    destination: taiwanPosition,
    orientation: {
      heading: Cesium.Math.toRadians(0), // 朝向
      pitch: Cesium.Math.toRadians(-90), // 俯仰角
      roll: 0.0,
    },
    duration: 2, // 飞行时间(秒)
  })

  // 可选：添加标记
  viewer.entities.add({
    name: 'Taiwan',
    position: taiwanLabelPosition,
    point: {
      pixelSize: 10,
      color: Cesium.Color.RED,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2,
    },
    label: {
      text: '台湾',
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -10),
    },
  })
}

const init_world = () => {
  console.warn('init_world>????')
  viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
      url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
    }),

    timeline: false, // 是否显示时间线控件
    baseLayerPicker: false,
    animation: false, // 可选：关闭动画控件
    shouldAnimate: false,
  });

  // 去除logo
  (viewer.cesiumWidget.creditContainer as HTMLElement).style.display = 'none'
  // 显示帧率
  viewer.scene.debugShowFramesPerSecond = true;
  (window as any).viewer = viewer

  console.log('viewer>>>', viewer.scene.globe)
  console.log('使用 Token:', Cesium.Ion.defaultAccessToken)
}

onMounted(() => {
  init_world()
})
</script>

<style scoped></style>
