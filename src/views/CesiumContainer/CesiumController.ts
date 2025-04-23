import * as Cesium from 'cesium'
import PointTool from './tools/PointTool'
import Polyline from './tools/Polyline'
import LineTool from './tools/LineTool'
import IconTool from './tools/IconTool'

import StragitArrowTool from './tools/StragitArrowTool'
// import Arrow from './tools/drawArrow/drawPlot'
export class CesiumController {
  static viewer: Cesium.Viewer
  static drawTool: any

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
      selectionIndicator: false, // 禁用选择指示器
      infoBox: false, // 禁用右侧信息面板
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
    // Arrow.init(this.viewer);
  }
  static exportData() {
    const res = this.drawTool && this.drawTool.exportData()
    return res
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
    this.drawTool && this.drawTool.clear()
  }
  static clearAllPoints() {
    this.drawTool && this.drawTool.clear()
  }
  static handleAttack(type: string) {
    // Arrow.draw(type);
  }
  static mark(type: string) {
    this.drawTool && this.drawTool._removeAllEvent()
    switch (type) {
      case 'Point':
        this.drawTool = new PointTool(this.viewer)
        this.drawTool.activate(type, (data: any) => {
          console.log('data')
        })
        break
      case 'PointIcon':
        this.drawTool = new IconTool(this.viewer)
        this.drawTool.activate(type, (data: any) => {
          console.log('data')
        })
        break
      case 'Polyline':
        this.drawTool = new Polyline(this.viewer)
        this.drawTool.activate(type, (data: any) => {
          console.log('data')
        })
        break
      case 'Line':
        this.drawTool = new LineTool(this.viewer)
        this.drawTool.activate(type, (data: any) => {
          console.log('data')
        })
        break
      case 'StraightArrow':
        // =方案一
        // this.handleAttack('straightArrow')
        // =方案二
        this.drawTool = new StragitArrowTool(this.viewer)
        this.drawTool.activate(type, (data: any) => {
          console.log('data')
        })
        break
      //   case "StraightArrow":
      //     // =方案一
      //     this.handleAttack("straightArrow");
      //     break;
      //   case "AttackArrow":
      //     this.handleAttack("attackArrow");
      //     break;
      //   case "PincerArrow":
      //     this.handleAttack("pincerArrow");
      //     break;
      default:
        break
    }
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
        uri: '/models/Cesium_Air.glb',
        minimumPixelSize: 64,
        maximumScale: 200000,
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
      10, // 10秒完成移动
      new Cesium.JulianDate(),
    )

    // 设置时钟
    this.viewer.clock.startTime = startTime.clone()
    this.viewer.clock.stopTime = stopTime.clone()
    this.viewer.clock.currentTime = startTime.clone()
    // this.viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 改为CLAMPED确保只播放一次
    this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP // 无限循环

    this.viewer.clock.multiplier = 1

    // 3. 创建位置变化
    modelEntity.position = new Cesium.SampledPositionProperty();
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

    // 5. 添加动画结束监听器
    this.viewer.clock.onTick.addEventListener(() => {
      const currentTime = this.viewer.clock.currentTime
      if (Cesium.JulianDate.compare(currentTime, stopTime) >= 0) {
        // 动画结束时停止跟踪
        this.viewer.trackedEntity = undefined
        // 可选：移除模型
        this.viewer.entities.remove(modelEntity)
      }
    })
  }
  static drawPoints(points: any) {
    points.forEach((point: any) => {
      // 添加点实体
      if (!this.viewer) return
      const pointEntity = this.viewer.entities.add({
        name: '我的点',
        position: Cesium.Cartesian3.fromDegrees(
          point.lon, // 经度
          point.lat, // 纬度
          point.height, // 高度（米）
        ),
        point: {
          color: Cesium.Color.RED,
          pixelSize: 10,
          outlineColor: Cesium.Color.YELLOW,
          outlineWidth: 2,
        },
      })
      //   this.viewer.flyTo(pointEntity);
    })
  }
}
