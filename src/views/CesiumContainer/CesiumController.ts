import * as Cesium from 'cesium'
import PointTool from './tools/PointTool'
import LineTool from './tools/LineTool'
import IconTool from './tools/IconTool'
import StragitArrowTool from './tools/StragitArrowTool'
import Polyline from './tools/Polyline'

import { handleAnimation, moveAToBGLBV2 } from './animation/Animations'
import { drawPoint, showExplosion } from './CesiumUtils'
import {
  taipeiPosition,
  taizhongPosition,
  gaoxiongPosition,
  tainanPosition,
  xiamenPosition,
  putianPosition,
  shantouPosition,
  nanjingPosition,
  jinhuPosition,
} from './const'
import { getLonLat, LonLatType } from './CesiumUtils'

export class CesiumController {
  static viewer: Cesium.Viewer
  static drawTool: any

  static remove() {
    this.drawTool && this.drawTool._removeAllEvent()
  }
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
      animation: false, // 可选：关闭动画控件
      shouldAnimate: true,
    });

    // 去除logo
    (this.viewer.cesiumWidget.creditContainer as HTMLElement).style.display =
      'none'
    // 显示帧率
    this.viewer.scene.debugShowFramesPerSecond = true;
    (window as any).viewer = this.viewer
  }
  static exportData() {
    const res = this.drawTool && this.drawTool.exportData()
    return res
  }
  static flyToTaiwan() {
    if (!this.viewer) return
    const destination: LonLatType = getLonLat(gaoxiongPosition)
    // 使用flyTo定位
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        destination.longitude,
        destination.latitude,
        900000,
      ),
      orientation: {
        heading: Cesium.Math.toRadians(0), // 朝向
        pitch: Cesium.Math.toRadians(-80), // 俯仰角
        roll: 0.0,
      },
      duration: 2, // 飞行时间(秒)
    })
    // 可选：添加标记
    console.log('taipeiPosition', taipeiPosition)
    drawPoint(this.viewer, '台北', taipeiPosition)
    drawPoint(this.viewer, '台中', taizhongPosition)
    drawPoint(this.viewer, '高雄', gaoxiongPosition)
    drawPoint(this.viewer, '台南', tainanPosition)
    drawPoint(this.viewer, '莆田', putianPosition)
    drawPoint(this.viewer, '汕头', shantouPosition)
    drawPoint(this.viewer, '厦门', xiamenPosition)
    drawPoint(this.viewer, '南京', nanjingPosition)
    drawPoint(this.viewer, '金湖', jinhuPosition)
    showExplosion(this.viewer, tainanPosition)
  }

  static clearAllMark() {
    this.drawTool && this.drawTool.clear()
  }
  static clearAllPoints() {
    this.drawTool && this.drawTool.clear()
  }
  static handleAttack(type: string) {
    console.log('//.///')
  }
  static mark(type: string, data?: any) {
    this.drawTool && this.drawTool._removeAllEvent()
    switch (type) {
      case 'Point':
        this.drawTool = new PointTool(this.viewer)
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
      case 'PointIcon':
        this.drawTool = new IconTool(this.viewer, data.icon)
        this.drawTool.activate(type, (data: any) => {
          console.log('data')
        })
        break
      case 'StraightArrow':
        // =方案二
        this.drawTool = new StragitArrowTool(this.viewer)
        this.drawTool.activate(type, (data: any) => {
          console.log('data')
        })
        break
      //   case "Polyline":
      //     this.drawTool = new Polyline(this.viewer);
      //     this.drawTool.activate(type, (data: any) => {
      //       console.log("data");
      //     });
      //     break;

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

  static async showSituation(item: any) {
    await handleAnimation(this.viewer, item)
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
