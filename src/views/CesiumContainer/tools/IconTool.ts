// cesium：点绘制
import * as Cesium from 'cesium'

interface PointData {
  lon: number;
  lat: number;
  height: number;
}

export default class DrawTool {
  private name: string
  private viewer: Cesium.Viewer
  private _drawHandler: Cesium.ScreenSpaceEventHandler | null
  private _drawnEntities: Cesium.Entity[]
  private iconpath: string

  /**
   * 构造函数
   * @param viewer Cesium 查看器实例
   */
  constructor(viewer: Cesium.Viewer, icon: string) {
    this.name = 'IconTool'
    this.viewer = viewer
    this._drawHandler = null // 事件处理器
    this._drawnEntities = [] // 存储绘制的实体
    this.iconpath = icon
  }

  /**
   * 激活绘制工具
   * @param drawType 绘制类型（未使用）
   * @param callback 回调函数（未使用）
   */
  activate(drawType?: string, callback?: () => void): void {
    this._registerEvents(callback) // 注册鼠标事件
  }

  /**
   * 注册鼠标事件
   * @param callback 回调函数（未使用）
   */
  private _registerEvents(callback?: () => void): void {
    this._drawHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas,
    )
    this.viewer.scene.globe.depthTestAgainstTerrain = true // 开启深度测试
    this._leftClickEventForPoint()
  }

  /**
   * 鼠标事件之绘制点的左击事件
   */
  private _leftClickEventForPoint(): void {
    this._drawHandler?.setInputAction(
      (e: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        // this.viewer._element.style.cursor = "pointer";
        const p = this.viewer.scene.pickPosition(e.position)
        if (!p) return

        // 手动提高50m，也可以取消
        const cartoPt = Cesium.Cartographic.fromCartesian(p)
        const p1 = [
          Cesium.Math.toDegrees(cartoPt.longitude),
          Cesium.Math.toDegrees(cartoPt.latitude),
          cartoPt.height + 50,
        ]
        this._addPoint(p1)
      },
      Cesium.ScreenSpaceEventType.LEFT_CLICK,
    )
  }

  /**
   * 画点
   * @param p 点的坐标 [经度, 纬度, 高度]
   */
  private _addPoint(p: any): void {
    const point = this.viewer.entities.add({
      id: `${this.name}${Date.now()}`,
      name: this.name,
      position: Cesium.Cartesian3.fromDegrees(p[0], p[1], p[2]),
      billboard: {
        image: this.iconpath, // 替换成你自己的图标
        scale: 0.5,
        // color: Cesium.Color.GREEN, // 设置为红色

        // 根据相机距离自动缩放（距离近大，距离远小）
        scaleByDistance: new Cesium.NearFarScalar(
          100.0,
          1.5, // 100 米内放大 1.5 倍
          10000.0,
          0.3, // 超过 10000 米缩小到 0.3 倍
        ),
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    })
    this._drawnEntities.push(point)
  }

  /**
   * 移除所有鼠标事件
   */
  private _removeAllEvent(): void {
    if (this._drawHandler) {
      this._drawHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK,
      )
      this._drawHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.MOUSE_MOVE,
      )
      this._drawHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.RIGHT_CLICK,
      )
      this._drawHandler.destroy()
      this._drawHandler = null
    }
  }

  /**
   * 清除所有绘制的点
   */
  clear(): void {
    this._drawnEntities.forEach((entity) => {
      if (entity.name === this.name) {
        this.viewer.entities.remove(entity)
      }
    })
    this._drawnEntities = []
  }

  /**
   * 导出所有点的数据
   * @returns 包含所有点坐标的数组
   */
  exportData(): PointData[] {
    const result: PointData[] = []

    this._drawnEntities.forEach((entity) => {
      if (entity.name === this.name && entity.position) {
        const cartesian = entity.position.getValue(
          Cesium.JulianDate.now(),
        ) as Cesium.Cartesian3
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
