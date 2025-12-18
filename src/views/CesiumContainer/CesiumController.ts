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
  beijingPosition,
} from './const'
import { getLonLat, LonLatType } from './CesiumUtils'

export class CesiumController {
  static viewer: Cesium.Viewer
  static drawTool: any
  static chinaBorderDataSource: Cesium.GeoJsonDataSource | null = null

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
    // 移除已存在的标记，避免重复
    const labelsToRemove = ['台北', '台中', '高雄', '台南', '莆田', '汕头', '厦门', '南京', '金湖']
    labelsToRemove.forEach((label) => {
      const entities = this.viewer.entities.values
      for (let i = entities.length - 1; i >= 0; i--) {
        if (entities[i].name === label) {
          this.viewer.entities.remove(entities[i])
        }
      }
    })
    // 添加标记
    console.log('taipeiPosition', taipeiPosition)
    // drawPoint(this.viewer, '台北', taipeiPosition)
    // drawPoint(this.viewer, '台中', taizhongPosition)
    // drawPoint(this.viewer, '高雄', gaoxiongPosition)
    // drawPoint(this.viewer, '台南', tainanPosition)
    // drawPoint(this.viewer, '莆田', putianPosition)
    // drawPoint(this.viewer, '汕头', shantouPosition)
    // drawPoint(this.viewer, '厦门', xiamenPosition)
    // drawPoint(this.viewer, '南京', nanjingPosition)
    // drawPoint(this.viewer, '金湖', jinhuPosition)
    showExplosion(this.viewer, tainanPosition)
  }

  static flyToBeijing() {
    if (!this.viewer) return
    const destination: LonLatType = getLonLat(beijingPosition)
    // 使用flyTo定位
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        destination.longitude,
        destination.latitude,
        500000,
      ),
      orientation: {
        heading: Cesium.Math.toRadians(0), // 朝向
        pitch: Cesium.Math.toRadians(-80), // 俯仰角
        roll: 0.0,
      },
      duration: 2, // 飞行时间(秒)
    })
    // 移除已存在的标记，避免重复
    const entities = this.viewer.entities.values
    for (let i = entities.length - 1; i >= 0; i--) {
      if (entities[i].name === '北京') {
        this.viewer.entities.remove(entities[i])
      }
    }
    // 添加标记
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
   * 从本地 GeoData.json 文件读取数据
   * @param geoJsonUrl GeoJSON数据源的URL（可选，默认使用本地文件）
   */
  static async drawChinaBorder(geoJsonUrl?: string) {
    if (!this.viewer) return

    // 使用本地 GeoData.json 文件
    const defaultGeoJsonUrl = '/GeoData.json'
    const url = geoJsonUrl || defaultGeoJsonUrl

    try {
      // 先直接加载原始GeoJSON数据，提取省会信息
      const response = await fetch(url)
      const geoJsonData = await response.json()
      
      // 遍历GeoJSON features，提取省会信息
      if (geoJsonData && geoJsonData.features && Array.isArray(geoJsonData.features)) {
        geoJsonData.features.forEach((feature: any) => {
          if (feature.properties) {
            const props = feature.properties
            const name = props.name
            const adcode = props.adcode
            const level = props.level
            const center = props.center
            
            // 判断是否为省份：level为'province'，或者adcode是省级（后4位为0000且不是100000）
            const isProvince = (level === 'province' || level === '省') || 
                              (adcode && adcode !== 100000 && adcode % 10000 === 0 && adcode < 900000)
            
            if (isProvince && name && center && Array.isArray(center) && center.length >= 2) {
              const [longitude, latitude] = center
              const capitalPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude)
              drawPoint(this.viewer, name, capitalPosition)
              console.log(`标记省会: ${name} (${longitude}, ${latitude})`)
            }
          }
        })
      }
      
      // 然后加载GeoJSON数据到Cesium，使用默认样式
      const geoJsonDataSource = await Cesium.GeoJsonDataSource.load(url)
      
      this.viewer.dataSources.add(geoJsonDataSource)
      this.chinaBorderDataSource = geoJsonDataSource // 保存数据源引用
      
      console.log('加载的实体数量:', geoJsonDataSource.entities.values.length)
      
      // 飞转到中国的大致中心位置
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(104.0, 35.0, 5000000),
        duration: 2,
      })
      
      console.log('边境线已绘制（使用本地GeoData.json文件）')
      return geoJsonDataSource
    } catch (error) {
      console.error('加载GeoJSON数据失败:', error)
      throw error
    }
  }

  /**
   * 移除中国边境线
   */
  static removeChinaBorder() {
    if (!this.viewer) return

    // 移除所有GeoJSON数据源
    const dataSources = this.viewer.dataSources
    for (let i = dataSources.length - 1; i >= 0; i--) {
      const ds = dataSources.get(i)
      if (ds) {
        this.viewer.dataSources.remove(ds)
      }
    }
    this.chinaBorderDataSource = null
  }

  /**
   * 切换中国边境线的显示/隐藏
   */
  static async toggleChinaBorder(show: boolean) {
    if (!this.viewer) return
    
    if (show) {
      // 如果开启且边境线不存在，则重新加载
      if (!this.chinaBorderDataSource) {
        await this.drawChinaBorder()
      } else {
        // 如果已存在，则显示
        this.chinaBorderDataSource.show = true
      }
    } else {
      // 如果关闭，则删除边境线和填充色
      this.removeChinaBorder()
    }
  }
}
