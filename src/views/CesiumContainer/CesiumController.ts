import * as Cesium from 'cesium'

export class CesiumController {
  static viewer: Cesium.Viewer | null | undefined

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
}
