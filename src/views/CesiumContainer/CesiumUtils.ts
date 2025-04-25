import * as Cesium from 'cesium'

// 删除指定path
export const removePath = (viewer: Cesium.Viewer, path: any) => {
  viewer.entities.remove(path)
  path = null
}

export const drawPoint = (
  viewer: Cesium.Viewer,
  label: string,
  position: any,
) => {
  viewer.entities.add({
    name: label,
    position: position,
    point: {
      pixelSize: 10,
      color: Cesium.Color.RED,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2,
    },
    label: {
      text: label,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -10),
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
