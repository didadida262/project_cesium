<template>
  <div class="w-full h-full relative text-[white]">
    <div
      :class="[
        'operation w-[calc(50%)]  absolute top-[10px] left-[20px] z-10',
        'flex justify-start items-center gap-x-[20px]',
      ]"
    >
      <Button
        text="跳转至目标地点"
        :on-click="handleJump"
        :curren-model="currenModel"
      />
      <Button
        text="标注"
        :on-click="handleMark"
        :curren-model="currenModel"
      />
      <Button
        text="动态演示"
        :on-click="handleSituation"
        :curren-model="currenModel"
      />
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
import * as Cesium from 'cesium'
import DrawTool from '../../utils/drawGraphic.js'
// 设置 Cesium Ion 访问令牌
Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMTQ4ZmRhMS00MjY3LTRlZTgtOGU3Yi01OTY4NTEwN2NkYzciLCJpZCI6Mjk0MTEyLCJpYXQiOjE3NDQ2ODU2OTd9.yMNzVcVvq9NI2sXWePenGj5ZJbshJqiGqctlNlDWEDA'
const currenModel = ref('')
let viewer = null as any
//   let scene = null;
//   let handler = null;

// 台南和台北的坐标
const tainanPosition = Cesium.Cartesian3.fromDegrees(120.213, 22.997) // 台南
const taipeiPosition = Cesium.Cartesian3.fromDegrees(121.565, 25.033) // 台北
const nanjingPosition = Cesium.Cartesian3.fromDegrees(
  118.78211699999997,
  32.03577000000001,
) // 南京

function addLocationMarker(position: Cesium.Cartesian3, name: string) {
  viewer.entities.add({
    position: position,
    billboard: {
      image: '/images/marker.png', // 替换为你的标记图片
      width: 32,
      height: 32,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    },
    label: {
      text: name,
      font: '14pt sans-serif',
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      pixelOffset: new Cesium.Cartesian2(0, 20),
    },
  })
}
async function setupModelAnimation() {
  // 1. 加载模型
  const modelEntity = viewer.entities.add({
    name: '飞机',
    position: tainanPosition,
    // cylinder: {
    //   length: 100000,
    //   topRadius: 0,
    //   bottomRadius: 5000,
    //   material: Cesium.Color.RED.withAlpha(0.5),
    //   // 指向正北方向作为参考
    //   orientation: Cesium.Quaternion.fromHeadingPitchRoll(
    //     new Cesium.HeadingPitchRoll(0, 0, 0)
    //   ),
    // },
    model: {
      uri: '/models/Cesium_Air.glb', // 替换为你的模型路径
      minimumPixelSize: 64,
      maximumScale: 20000,
    },
    path: {
      leadTime: 0,
      trailTime: 60,
      width: 10,
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.2,
        color: Cesium.Color.YELLOW,
      }),
    },
  })
  modelEntity.orientation = new Cesium.VelocityOrientationProperty(
    modelEntity.position as Cesium.SampledPositionProperty,
  )
  // 2. 创建位置属性随时间变化的函数
  const startTime = Cesium.JulianDate.fromDate(new Date())
  const stopTime = Cesium.JulianDate.addSeconds(
    startTime,
    10, // 30秒完成移动
    new Cesium.JulianDate(),
  )

  // 添加到时钟中
  viewer.clock.startTime = startTime.clone()
  viewer.clock.stopTime = stopTime.clone()
  viewer.clock.currentTime = startTime.clone()
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP // 播放一次后停止
  viewer.clock.multiplier = 1 // 实时速度

  // 3. 创建位置变化
  modelEntity.position = new Cesium.SampledPositionProperty();

  // 添加开始和结束位置
  (modelEntity.position as Cesium.SampledPositionProperty).addSample(
    startTime,
    tainanPosition,
  );
  (modelEntity.position as Cesium.SampledPositionProperty).addSample(
    stopTime,
    taipeiPosition,
  )

  // 4. 设置相机跟随
  viewer.trackedEntity = modelEntity

  // 5. 添加路线可视化
  viewer.entities.add({
    polyline: {
      positions: [tainanPosition, taipeiPosition],
      width: 2,
      material: Cesium.Color.RED.withAlpha(0.5),
      arcType: Cesium.ArcType.GEODESIC,
    },
  })

  // 6. 添加起点和终点标记
  addLocationMarker(tainanPosition, '台南')
  addLocationMarker(taipeiPosition, '台北')
}

const handleSituation = async () => {
  currenModel.value = '动态演示'

  await setupModelAnimation()
}
const handleMark = () => {
  currenModel.value = '标注'

  const drawTool = new DrawTool(viewer)
  drawTool.activate('Polygon', (data: any) => {
    console.log('data>>>', data)
  })
  //   drawTool.activate("Polyline");
}
const handleJump = () => {
  currenModel.value = '跳转至目标地点'
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
    animation: true, // 可选：关闭动画控件
    shouldAnimate: true,
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
