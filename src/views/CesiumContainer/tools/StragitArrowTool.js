import * as Cesium from 'cesium'
import ms from 'milsymbol'
import { getCatesian3FromPX, cartesianToLatlng } from '../CesiumUtils'
import { xp } from './drawArrow/algorithm'

export default class DrawTool {
  /**
   * 构造函数
   * @param viewer
   */
  constructor(viewer) {
    this.name = 'StragitArrow'
    this.viewer = viewer
    this._drawHandler = null //事件
    this._drawnEntities = []
    this._tempPositions = [] //存储点集合
    this.temppath = null
    this.fillMaterial = Cesium.Color.YELLOW.withAlpha(0.8)
    this.firstPoint = null
    this.floatPoint = null
    this.positions = []
    this.arrowEntity = null
  }
  /**
   * 注册鼠标事件
   */
  _registerEvents(callback) {
    this._drawHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas,
    )
    this.viewer.scene.globe.depthTestAgainstTerrain = true //开启深度测试
    this._leftClickEventForPolyline()
    this._mouseMoveEventForPolyline()
  }

  _removeAllEvent() {
    this._drawHandler &&
      (this._drawHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK,
      ),
      this._drawHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.MOUSE_MOVE,
      ),
      this._drawHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.RIGHT_CLICK,
      ),
      this._drawHandler.destroy(),
      (this._drawHandler = null))
  }

  // 清除数据
  clear() {
    this._drawnEntities.forEach((entity) => {
      if (entity.name === this.name) {
        this.viewer.entities.remove(entity)
      }
    })
    this._drawnEntities = []
  }

  // 导出数据
  exportData() {
    const result = []
    this._drawnEntities.forEach((entity) => {
      if (entity.name === this.name && entity.polyline.positions) {
        const positions = entity.polyline.positions.getValue() // 获取坐标数组（Cartesian3）
        // 提取起点和终点
        const startCartesian = positions[0]
        const endCartesian = positions[positions.length - 1]
        // 转换为经纬度
        const startCartographic =
          Cesium.Cartographic.fromCartesian(startCartesian)
        const endCartographic = Cesium.Cartographic.fromCartesian(endCartesian)

        result.push({
          start: {
            lon: Cesium.Math.toDegrees(startCartographic.longitude),
            lat: Cesium.Math.toDegrees(startCartographic.latitude),
            height: startCartographic.height,
          },
          end: {
            lon: Cesium.Math.toDegrees(endCartographic.longitude),
            lat: Cesium.Math.toDegrees(endCartographic.latitude),
            height: endCartographic.height,
          },
          entity: entity, // 可选：保留实体引用
        })
      }
    })

    return result
  }

  /**
   * 激活点线面
   * @param drawType
   */
  activate(drawType, callback) {
    this._registerEvents(callback) //注册鼠标事件
  }

  /**
   * 绘制
   * @private
   */
  showArrowOnMap(positions) {
    const that = this
    const update = function () {
      console.log('update>>>>>>>>>')
      if (positions.length < 2) {
        return null
      }
      const p1 = positions[1]
      const p2 = positions[2]
      const firstPoint = cartesianToLatlng(that.viewer, p1)
      const endPoints = cartesianToLatlng(that.viewer, p2)

      const arrow = []
      const res = xp.algorithm.fineArrow(
        [firstPoint[0], firstPoint[1]],
        [endPoints[0], endPoints[1]],
      )
      const index = JSON.stringify(res).indexOf('null')
      if (index != -1) return []
      for (let i = 0; i < res.length; i++) {
        let c3 = new Cesium.Cartesian3(res[i].x, res[i].y, res[i].z)
        arrow.push(c3)
      }
      return new Cesium.PolygonHierarchy(arrow)
    }
    return that.viewer.entities.add({
      polygon: new Cesium.PolygonGraphics({
        hierarchy: new Cesium.CallbackProperty(update, false),
        show: true,
        fill: true,
        material: this.fillMaterial,
      }),
    })
  }

  drawSymbol(p) {
    // 绘制军事符号

    // 1. 创建符号
    const symbol = new ms.Symbol('SFG-UCI----D', {
      size: 30,
      fillColor: '#00FFFF', // 友军蓝色
      strokeColor: '#000000',
    })

    // 2. 添加到Cesium
    this.viewer.entities.add({
      position: p,
      billboard: {
        image: symbol.toDataURL(),
        scale: 2,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
      },
      label: {
        text: '指挥中心',
        font: '14pt sans-serif',
        fillColor: Cesium.Color.WHITE,
      },
    })
  }

  creatPoint(cartesian) {
    const point = this.viewer.entities.add({
      position: cartesian,
      billboard: {
        image: this.pointImageUrl,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        //heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    })
    point.attr = 'editPoint'
    return point
  }
  /**
   * 鼠标事件之绘制线的左击事件
   * @private
   */
  _leftClickEventForPolyline() {
    this._drawHandler.setInputAction((e) => {
      //单机开始绘制

      const cartesian = getCatesian3FromPX(e.position, this.viewer)
      if (!cartesian) return
      console.log('cartesian>>>', cartesian)
      if (this.positions.length == 0) {
        console.warn('触发1>>>>>>>>>>>>>')
        this.firstPoint = this.creatPoint(cartesian)
        this.firstPoint.type = 'firstPoint'
        this.floatPoint = this.creatPoint(cartesian)
        this.floatPoint.type = 'floatPoint'
        this.positions.push(cartesian)
        this.positions.push(cartesian.clone())
      }
      if (this.positions.length == 3) {
        console.warn('触发2>>>>>>>>>>>>>')
        this.firstPoint.show = false
        this.floatPoint.show = false
        this.positions = []
        const clonedEntity = new Cesium.Entity({
          polygon: {
            hierarchy: this.arrowEntity.polygon.hierarchy,
            material: this.arrowEntity.polygon.material,
            show: this.arrowEntity.polygon.show,
            fill: this.arrowEntity.polygon.fill,
          },
          name: this.arrowEntity.name, // 复制其他属性
        })
        // 3. 添加到场景
        this.viewer.entities.add(clonedEntity)
        this._drawnEntities.push(clonedEntity)
        this.viewer.entities.remove(this.arrowEntity)
        this.arrowEntity = null
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }

  /**
   * 画线
   * @private
   */
  _drawPath() {
    if (this._tempPositions.length === 1) {
      this._drawTempPath()
    } else {
      this._drawFinalPath()
    }
  }
  _drawTempPath() {
    this.temppath = this.viewer.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty(() => {
          let c = Array.from(this._tempPositions)
          if (this._mousePos) {
            c.push(this._mousePos)
          }
          return c
        }, false),
        clampToGround: true, //贴地
        width: 3,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.RED.withAlpha(0.5),
        ),
        depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.YELLOW,
        }),
      },
    })
  }
  _drawFinalPath() {
    const line = this.viewer.entities.add({
      id: this.name + Date.now(),
      name: this.name,
      polyline: {
        positions: this._tempPositions,
        clampToGround: true, //贴地
        width: 3,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.RED.withAlpha(0.5),
        ),
        depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.YELLOW,
        }),
      },
    })
    this._tempPositions = []
    this.viewer.entities.remove(this.temppath)
    this.temppath = null
    this._drawnEntities.push(line)
  }
  /**
   * 鼠标事件之绘制线的移动事件
   * @private
   */
  _mouseMoveEventForPolyline() {
    this._drawHandler.setInputAction((e) => {
      //移动时绘制面
      if (this.positions.length < 1) return
      const cartesian = getCatesian3FromPX(e.endPosition, this.viewer)
      if (!cartesian) return
      this.floatPoint.position.setValue(cartesian)
      if (this.positions.length >= 2) {
        if (!Cesium.defined(this.arrowEntity)) {
          this.positions.push(cartesian)
          this.arrowEntity = this.showArrowOnMap(this.positions)
        } else {
          this.positions.pop()
          this.positions.push(cartesian)
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }
}
