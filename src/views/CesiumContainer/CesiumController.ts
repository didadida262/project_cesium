import * as Cesium from 'cesium'
import DrawTool from './drawGraphic.js'

export class CesiumController {
  static viewer: Cesium.Viewer | null | undefined
  static drawTool: DrawTool | null | undefined

  // 台南和台北的坐标
  static tainanPosition = Cesium.Cartesian3.fromDegrees(120.213, 22.997) // 台南
  static taipeiPosition = Cesium.Cartesian3.fromDegrees(121.565, 25.033) // 台北
  static nanjingPosition = Cesium.Cartesian3.fromDegrees(
    118.78211699999997,
    32.03577000000001,
  ) // 南京

  static init_world(containerId: string) {
    Cesium.Ion.defaultAccessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMTQ4ZmRhMS00MjY3LTRlZTgtOGU3Yi01OTY4NTEwN2NkYzciLCJpZCI6Mjk0MTEyLCJpYXQiOjE3NDQ2ODU2OTd9.yMNzVcVvq9NI2sXWePenGj5ZJbshJqiGqctlNlDWEDA'
    this.viewer = new Cesium.Viewer(containerId, {
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
      }),

      timeline: false, // 是否显示时间线控件
      baseLayerPicker: false,
      animation: true, // 可选：关闭动画控件
      shouldAnimate: true,
    });

    // 去除logo
    (this.viewer.cesiumWidget.creditContainer as HTMLElement).style.display =
      'none'
    // 显示帧率
    this.viewer.scene.debugShowFramesPerSecond = true;
    (window as any).viewer = this.viewer
  }
  static flyToTaiwan() {
    if (!this.viewer) return
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
    this.viewer.camera.flyTo({
      destination: taiwanPosition,
      orientation: {
        heading: Cesium.Math.toRadians(0), // 朝向
        pitch: Cesium.Math.toRadians(-90), // 俯仰角
        roll: 0.0,
      },
      duration: 2, // 飞行时间(秒)
    })

    // 可选：添加标记
    this.viewer.entities.add({
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
  static clearAllMark() {
    this.drawTool && this.drawTool.clearAll()
  }
  static mark(type: string) {
    console.log('mark>>', type)
    this.drawTool = new DrawTool(this.viewer)
    this.drawTool.activate(type, (data: any) => {
      console.log('data>>>', data)
    })
  }
  static async showSituation() {
    await this.setupModelAnimation()
  }
  static async setupModelAnimation() {
    if (!this.viewer) return
    // 1. 加载模型
    const modelEntity = this.viewer.entities.add({
      name: '飞机',
      position: this.tainanPosition,
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
    this.viewer.clock.startTime = startTime.clone()
    this.viewer.clock.stopTime = stopTime.clone()
    this.viewer.clock.currentTime = startTime.clone()
    this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP // 播放一次后停止
    this.viewer.clock.multiplier = 1 // 实时速度

    // 3. 创建位置变化
    modelEntity.position = new Cesium.SampledPositionProperty();

    // 添加开始和结束位置
    (modelEntity.position as Cesium.SampledPositionProperty).addSample(
      startTime,
      this.tainanPosition,
    );
    (modelEntity.position as Cesium.SampledPositionProperty).addSample(
      stopTime,
      this.taipeiPosition,
    )

    // 4. 设置相机跟随
    this.viewer.trackedEntity = modelEntity

    // 5. 添加路线可视化
    this.viewer.entities.add({
      polyline: {
        positions: [this.tainanPosition, this.taipeiPosition],
        width: 2,
        material: Cesium.Color.RED.withAlpha(0.5),
        arcType: Cesium.ArcType.GEODESIC,
      },
    })
  }
}
