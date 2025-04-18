import * as Cesium from 'cesium'

export default class DrawTool {
  /**
   * 构造函数
   * @param viewer
   */
  constructor(viewer) {
    this.name = 'Line'
    this.viewer = viewer
    this._drawHandler = null //事件
    this._drawnEntities = []
    this._tempPositions = [] //存储点集合
    this.temppath = null
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

  /**
   * 鼠标事件之绘制线的左击事件
   * @private
   */
  _leftClickEventForPolyline() {
    this._drawHandler.setInputAction((e) => {
      let p = this.viewer.scene.pickPosition(e.position)
      if (!p) return
      this._tempPositions.push(p)
      this._drawPath()
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
        width: 8,
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
        width: 8,
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
      let p = this.viewer.scene.pickPosition(e.endPosition)
      if (!p) return
      this._mousePos = p
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }
}
