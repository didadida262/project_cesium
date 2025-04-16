import * as Cesium from 'cesium'

export default class DrawTool {
  /**
   * 构造函数
   * @param viewer
   */
  constructor(viewer) {
    this.name = 'Point'
    this.viewer = viewer
    this._drawHandler = null //事件
    this._drawnEntities = []
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
    this._leftClickEventForPoint()
  }

  /**
   * 鼠标事件之绘制点的左击事件
   * @private
   */
  _leftClickEventForPoint() {
    this._drawHandler.setInputAction((e) => {
      this.viewer._element.style.cursor = 'pointer'
      let p = this.viewer.scene.pickPosition(e.position)
      if (!p) return
      //手动给他提高50m，也可以取消哈
      let carto_pt = Cesium.Cartographic.fromCartesian(p)
      let p1 = [
        Cesium.Math.toDegrees(carto_pt.longitude),
        Cesium.Math.toDegrees(carto_pt.latitude),
        carto_pt.height + 50,
      ]
      this._addPoint(p1)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
  /**
   * 画点
   * @param p
   */
  _addPoint(p) {
    const point = this.viewer.entities.add({
      id: 'Point-' + Date.now(),
      name: 'Point',
      position: Cesium.Cartesian3.fromDegrees(p[0], p[1], p[2]),
      point: {
        color: Cesium.Color.RED,
        pixelSize: 10,
        outlineColor: Cesium.Color.YELLOW,
        outlineWidth: 2,
        // heightReference:Cesium.HeightReference.CLAMP_TO_GROUND
      },
    })
    this._drawnEntities.push(point)
  }

  /**
   * 移除所有鼠标事件
   * @private
   */
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

  // 清除点
  clear() {
    this._drawnEntities.forEach((entity) => {
      this.viewer.entities.remove(entity)
    })
  }

  // 导出数据
  exportData() {
    const entities = this.viewer.entities.values
    const result = []
    entities.forEach((entity) => {
      console.log('entity>>>', entity)
      if (entity.name === this.name && entity.position) {
        const cartesian = entity.position.getValue(Cesium.JulianDate.now())
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
        const lon = Cesium.Math.toDegrees(cartographic.longitude)
        const lat = Cesium.Math.toDegrees(cartographic.latitude)
        const height = cartographic.height
        result.push({ lon, lat, height })
      }
    })

    return result
  }
}
