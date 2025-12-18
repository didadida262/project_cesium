import * as Cesium from 'cesium'
import PointTool from './tools/PointTool'
import LineTool from './tools/LineTool'
import IconTool from './tools/IconTool'
import StragitArrowTool from './tools/StragitArrowTool'
import AttackArrow from './tools/AttackArrow'
import PincerArrow from './tools/PincerArrow'

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
    // Cesium.Ion.defaultAccessToken =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMTQ4ZmRhMS00MjY3LTRlZTgtOGU3Yi01OTY4NTEwN2NkYzciLCJpZCI6Mjk0MTEyLCJpYXQiOjE3NDQ2ODU2OTd9.yMNzVcVvq9NI2sXWePenGj5ZJbshJqiGqctlNlDWEDA";

    const imageryProviderV1 = new Cesium.ArcGisMapServerImageryProvider({
      url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
    })
    const imageryProviderv2_GeoQ = new Cesium.UrlTemplateImageryProvider({
      url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}',
    })

    const imageryProvider_tianditu =
      new Cesium.WebMapTileServiceImageryProvider({
        url: 'http://t0.tianditu.gov.cn/img_w/wmts?tk=wW719713496',
        layer: 'img',
        style: 'default',
        format: 'tiles',
        tileMatrixSetID: 'w',
        maximumLevel: 18,
      })
    //   ok
    const imageryProvider_gaode = new Cesium.UrlTemplateImageryProvider({
      url: 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      minimumLevel: 3,
      maximumLevel: 18,
    })

    this.viewer = new Cesium.Viewer(containerId, {
      selectionIndicator: false, // 禁用选择指示器
      infoBox: false, // 禁用右侧信息面板
      imageryProvider: imageryProviderV1,

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
      case 'AttackArrow':
        this.drawTool = new AttackArrow(this.viewer)
        this.drawTool.activate(type, (data: any) => {
          console.log('data')
        })
        break
      case 'PincerArrow':
        this.drawTool = new PincerArrow(this.viewer)
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

  /**
   * 绘制中国边境线
   * @param geoJsonUrl GeoJSON数据源的URL（可选）
   */
  static async drawChinaBorder(geoJsonUrl?: string) {
    if (!this.viewer) return

    // 如果提供了GeoJSON URL，则使用GeoJSON数据源加载
    if (geoJsonUrl) {
      try {
        const geoJsonDataSource = await Cesium.GeoJsonDataSource.load(geoJsonUrl, {
          stroke: Cesium.Color.YELLOW,
          strokeWidth: 3,
          fill: Cesium.Color.YELLOW.withAlpha(0.1),
        })
        this.viewer.dataSources.add(geoJsonDataSource)
        
        // 飞转到中国的大致中心位置（北京附近）
        this.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(104.0, 35.0, 5000000),
          duration: 2,
        })
        
        return geoJsonDataSource
      } catch (error) {
        console.error('加载GeoJSON数据失败:', error)
      }
    } else {
      // 使用简化的边界线坐标（中国主要边界关键点）
      // 这是一个简化的示例，实际应用中建议使用完整的GeoJSON数据
      const borderPositions = [
        // 东北地区
        Cesium.Cartesian3.fromDegrees(124.0, 53.5, 0), // 黑龙江东部
        Cesium.Cartesian3.fromDegrees(130.0, 50.0, 0),
        Cesium.Cartesian3.fromDegrees(135.0, 48.0, 0), // 黑龙江与俄罗斯交界
        Cesium.Cartesian3.fromDegrees(125.0, 43.0, 0), // 吉林
        Cesium.Cartesian3.fromDegrees(121.0, 40.5, 0), // 辽宁
        // 华北地区
        Cesium.Cartesian3.fromDegrees(117.5, 39.0, 0), // 北京附近
        Cesium.Cartesian3.fromDegrees(111.0, 40.0, 0), // 内蒙古
        Cesium.Cartesian3.fromDegrees(106.0, 42.0, 0),
        // 西北地区
        Cesium.Cartesian3.fromDegrees(96.0, 43.0, 0), // 新疆北部
        Cesium.Cartesian3.fromDegrees(80.0, 45.0, 0), // 新疆最西
        Cesium.Cartesian3.fromDegrees(73.0, 39.0, 0), // 新疆西南
        Cesium.Cartesian3.fromDegrees(78.0, 35.0, 0), // 新疆南部
        Cesium.Cartesian3.fromDegrees(82.0, 32.0, 0), // 西藏西部
        // 西南地区
        Cesium.Cartesian3.fromDegrees(85.0, 30.0, 0), // 西藏中部
        Cesium.Cartesian3.fromDegrees(91.0, 29.0, 0), // 西藏
        Cesium.Cartesian3.fromDegrees(98.0, 31.0, 0), // 西藏东部
        Cesium.Cartesian3.fromDegrees(103.0, 28.0, 0), // 云南
        Cesium.Cartesian3.fromDegrees(106.0, 23.0, 0), // 云南南部
        // 华南地区
        Cesium.Cartesian3.fromDegrees(108.0, 21.5, 0), // 广西
        Cesium.Cartesian3.fromDegrees(110.0, 20.0, 0), // 海南岛北部
        Cesium.Cartesian3.fromDegrees(114.0, 22.0, 0), // 广东
        Cesium.Cartesian3.fromDegrees(118.0, 24.5, 0), // 福建
        // 华东地区
        Cesium.Cartesian3.fromDegrees(121.0, 31.0, 0), // 上海
        Cesium.Cartesian3.fromDegrees(120.0, 36.0, 0), // 山东
        Cesium.Cartesian3.fromDegrees(117.0, 38.0, 0), // 河北
        // 回到起点
        Cesium.Cartesian3.fromDegrees(124.0, 53.5, 0),
      ]

      const borderEntity = this.viewer.entities.add({
        name: '中国边境线',
        polyline: {
          positions: borderPositions,
          width: 4,
          material: Cesium.Color.YELLOW,
          clampToGround: true,
        },
      })

      return borderEntity
    }
  }

  /**
   * 移除中国边境线
   */
  static removeChinaBorder() {
    if (!this.viewer) return
    
    // 移除所有名为"中国边境线"的实体
    const entities = this.viewer.entities.values
    for (let i = entities.length - 1; i >= 0; i--) {
      if (entities[i].name === '中国边境线') {
        this.viewer.entities.remove(entities[i])
      }
    }

    // 移除所有GeoJSON数据源
    const dataSources = this.viewer.dataSources
    for (let i = dataSources.length - 1; i >= 0; i--) {
      const ds = dataSources.get(i)
      if (ds && ds.name && ds.name.includes('China')) {
        this.viewer.dataSources.remove(ds)
      }
    }
  }
}
