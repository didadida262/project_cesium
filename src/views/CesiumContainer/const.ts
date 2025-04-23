import * as Cesium from 'cesium'

const tainanPosition = Cesium.Cartesian3.fromDegrees(120.213, 22.997) // 台南
const taipeiPosition = Cesium.Cartesian3.fromDegrees(121.565, 25.033) // 台北
const putianPosition = Cesium.Cartesian3.fromDegrees(119.138, 25.292) // 莆田
const shantouPosition = Cesium.Cartesian3.fromDegrees(116.686, 23.358) // 汕头
const taizhongPosition = Cesium.Cartesian3.fromDegrees(120.648, 24.163) // 台中
const xiamenPosition = Cesium.Cartesian3.fromDegrees(118.116, 24.468) // 厦门
const nanjingPosition = Cesium.Cartesian3.fromDegrees(
  118.78211699999997,
  32.03577000000001,
) // 南京
export const ways = [
  {
    name: '1',
    startPosition: putianPosition,
    endPosition: taipeiPosition,
    model: '/models/Cesium_Air.glb',
  },
  {
    name: '2',
    startPosition: xiamenPosition,
    endPosition: taizhongPosition,
    model: '/models/Cesium_Air.glb',
  },
  {
    name: 'follow',
    startPosition: shantouPosition,
    endPosition: tainanPosition,
    model: '/models/Cesium_Air.glb',
  },
]

export const BTNMap = [
  {
    text: '跳转至目标地点',
    key: 'jump',
  },

  {
    text: '标注模式',
    key: 'mark',
  },
  {
    text: '动效演示',
    key: 'situation',
  },
  {
    text: '图标绘制',
    key: 'drawFlag',
  },
]
export const options = [
  {
    label: '绘制点',
    key: 'Point',
  },

  {
    label: '绘制线段',
    key: 'Line',
  },
  //   {
  //     label: '直线箭头',
  //     key: 'StraightArrow',
  //   },
  //   {
  //     label: "直线箭头",
  //     key: "StraightArrow",
  //   },
  //   {
  //     label: "攻击箭头",
  //     key: "AttackArrow",
  //   },
  //   {
  //     label: "钳形箭头",
  //     key: "PincerArrow",
  //   },

  //   {
  //     label: "绘制多段线",
  //     key: "Polyline",
  //   },

  //   {
  //     label: "绘制区域",
  //     key: "Polygon",
  //   },

  //   {
  //     label: "测量",
  //     key: "measure",
  //   },
]

export const MockPointData = [
  { lon: 121.5654, lat: 25.033000000000005, height: 99999.99999997854 },
  {
    lon: 120.44284378603572,
    lat: 23.718834525216245,
    height: 49.9703782274476,
  },
  {
    lon: 120.36979188737665,
    lat: 23.684609396995818,
    height: 49.94755060794172,
  },
  {
    lon: 120.34727084010676,
    lat: 23.640036419478168,
    height: 49.815015555840766,
  },
  {
    lon: 120.40425107610908,
    lat: 23.62479788925661,
    height: 49.91505409535976,
  },
  {
    lon: 120.46221982225876,
    lat: 23.67681529612735,
    height: 49.98082774137771,
  },
]

export const MockredTableData = [
  {
    name: '红旗',
    icon: '/images/icon/flagRed.svg',
  },
  {
    name: '绿旗',
    icon: '/images/icon/flagGreen.svg',
  },
]
