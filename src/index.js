import shp from '@mars3d/shpjs'

//shp转geojson
export function toGeoJSON(base, whiteList, encoding) {
  return shp(base, whiteList, encoding)
}

export function parseShp(shp, prj) {
  return shp.parseShp(shp, prj)
}

export function parseDbf(dbf, cpg) {
  return shp.parseDbf(dbf, cpg)
}

export function parseZip(buffer, whiteList, encoding) {
  return shp.parseZip(buffer, whiteList, encoding)
}

export function getShapefile(base, whiteList, encoding) {
  return shp.getShapefile(base, whiteList, encoding)
}

export function combine(arr) {
  return shp.combine(arr)
}
