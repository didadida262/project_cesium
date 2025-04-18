import * as Cesium from 'cesium'

// 删除指定path
export const removePath = (viewer: Cesium.Viewer, path: any) => {
  viewer.entities.remove(path)
  path = null
}

export const showPoint = (viewer: Cesium.Viewer, point: any) => {
  viewer.entities.add({
    position: point,
    point: {
      color: Cesium.Color.RED,
      pixelSize: 10,
      outlineColor: Cesium.Color.YELLOW,
      outlineWidth: 2,
      // heightReference:Cesium.HeightReference.CLAMP_TO_GROUND
    },
  })
}

export const getCatesian3FromPX = (point: any, viewer: Cesium.Viewer) => {
  const picks = viewer.scene.drillPick(point)
  let cartesian
  let isOn3dtiles = true
  for (let i = 0; i < picks.length; i++) {
    if (
      (picks[i] && picks[i].primitive) ||
      picks[i] instanceof Cesium.Cesium3DTileFeature
    ) {
      //模型上拾取
      isOn3dtiles = true
    }
  }
  if (isOn3dtiles) {
    cartesian = viewer.scene.pickPosition(point)
  } else {
    const ray = viewer.camera.getPickRay(point)
    if (!ray) return null
    cartesian = viewer.scene.globe.pick(ray, viewer.scene)
  }
  return cartesian
}

export const cartesianToLatlng = (viewer: Cesium.Viewer, cartesian: any) => {
  const latlng =
    viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
  const lat = Cesium.Math.toDegrees(latlng.latitude)
  const lng = Cesium.Math.toDegrees(latlng.longitude)
  return [lng, lat]
}
