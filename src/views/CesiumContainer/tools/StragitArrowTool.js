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
    // this._drawnEntities.forEach((entity) => {

    // })

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
      id: `${this.name}${Date.now()}`,
      name: this.name,
      polygon: new Cesium.PolygonGraphics({
        hierarchy: new Cesium.CallbackProperty(update, false),
        show: true,
        fill: true,
        material: this.fillMaterial,
      }),
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
      this._drawPath(e)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
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
  /**
   * 画线
   * @private
   */
  _drawPath(e) {
    const cartesian = getCatesian3FromPX(e.position, this.viewer)
    if (!cartesian) return
    if (this.positions.length == 0) {
      this.firstPoint = this.creatPoint(cartesian)
      this.firstPoint.type = 'firstPoint'
      this.floatPoint = this.creatPoint(cartesian)
      this.floatPoint.type = 'floatPoint'
      this.positions.push(cartesian)
      this.positions.push(cartesian.clone())
    }
    if (this.positions.length == 3) {
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
  }
  // _drawTempPath() {

  // }
  // _drawFinalPath() {

  // }
}
