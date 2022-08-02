import shp from 'shpjs'

//shp转geojson
export function toGeoJSON(param) {
  if (!param) return Promise.reject('参数不能为空')

  return shp(param)
}
