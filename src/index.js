import proj4 from "proj4"
import parseDbf from "parsedbf"
import { unzip } from "./unzip.js"
import { binaryAjax } from "./binaryajax.js"
import parseShp from "./parseShp.js"
import { getProj4 } from "./proj4"

const URL = globalThis.URL

const toUitn8Arr = (b) => {
  if (!b) {
    throw new Error("forgot to pass buffer")
  }
  if (isArrayBuffer(b)) {
    return new Uint8Array(b)
  }
  if (isArrayBuffer(b.buffer)) {
    if (b.BYTES_PER_ELEMENT === 1) {
      return b
    }
    return new Uint8Array(b.buffer, b.byteOffset, b.byteLength)
  }
  throw new Error("invalid buffer like object")
}
const txtDecoder = new TextDecoder()
const toString = (possibleString) => {
  if (!possibleString) {
    return
  }
  if (typeof possibleString === "string") {
    return possibleString
  }
  if (isArrayBuffer(possibleString) || ArrayBuffer.isView(possibleString) || isDataView(possibleString)) {
    return txtDecoder.decode(possibleString)
  }
}
const toDataView = (b) => {
  if (!b) {
    throw new Error("forgot to pass buffer")
  }
  if (isDataView(b)) {
    return b
  }
  if (isArrayBuffer(b)) {
    return new DataView(b)
  }
  if (isArrayBuffer(b.buffer)) {
    return new DataView(b.buffer, b.byteOffset, b.byteLength)
  }
  throw new Error("invalid buffer like object")
}

function isArrayBuffer(subject) {
  return subject instanceof globalThis.ArrayBuffer || Object.prototype.toString.call(subject) === "[object ArrayBuffer]"
}
function isDataView(subject) {
  return subject instanceof globalThis.DataView || Object.prototype.toString.call(subject) === "[object DataView]"
}

export const combine = function ([shp, dbf]) {
  const out = {}
  out.type = "FeatureCollection"
  out.features = []
  let i = 0
  const len = shp.length
  if (!dbf) {
    dbf = []
  }
  while (i < len) {
    out.features.push({
      type: "Feature",
      geometry: shp[i],
      properties: dbf[i] || {}
    })
    i++
  }
  return out
}

export const parseZip = async function (buffer, whiteList, encoding, crs) {
  let key
  buffer = toUitn8Arr(buffer)
  const zip = await unzip(buffer)
  const names = []
  whiteList = whiteList || []
  for (key in zip) {
    if (key.indexOf("__MACOSX") !== -1) {
      continue
    }
    if (key.slice(-4).toLowerCase() === ".shp") {
      names.push(key.slice(0, -4))
      zip[key.slice(0, -3) + key.slice(-3).toLowerCase()] = zip[key]
    } else if (key.slice(-4).toLowerCase() === ".prj") {
      let nowProj
      try {
        nowProj = getProj4(crs || zip[key])
      } catch (e) {
        console.error("该坐标系proj4未解析,将原样转出", e)
        nowProj = getProj4("EPSG:4326")
      }
      zip[key.slice(0, -3) + key.slice(-3).toLowerCase()] = proj4(nowProj)
    } else if (key.slice(-5).toLowerCase() === ".json" || whiteList.indexOf(key.split(".").pop()) > -1) {
      names.push(key.slice(0, -3) + key.slice(-3).toLowerCase())
    } else if (key.slice(-4).toLowerCase() === ".dbf" || key.slice(-4).toLowerCase() === ".cpg") {
      zip[key.slice(0, -3) + key.slice(-3).toLowerCase()] = zip[key]
    }
  }
  if (!names.length) {
    throw new Error("no layers founds")
  }
  const geojson = names.map(function (name) {
    let parsed, dbf
    const lastDotIdx = name.lastIndexOf(".")
    if (lastDotIdx > -1 && name.slice(lastDotIdx).indexOf("json") > -1) {
      parsed = JSON.parse(zip[name])
      parsed.fileName = name.slice(0, lastDotIdx)
    } else if (whiteList.indexOf(name.slice(lastDotIdx + 1)) > -1) {
      parsed = zip[name]
      parsed.fileName = name
    } else {
      if (zip[name + ".dbf"]) {
        dbf = parseDbf(zip[name + ".dbf"], encoding || zip[name + ".cpg"])
      }
      parsed = combine([parseShp(zip[name + ".shp"], zip[name + ".prj"]), dbf])
      parsed.fileName = name
    }
    return parsed
  })
  if (geojson.length === 1) {
    return geojson[0]
  } else {
    return geojson
  }
}

async function getZip(base, whiteList, encoding, crs) {
  const a = await binaryAjax(base)
  return parseZip(a, whiteList, encoding, crs)
}

const handleShp = async (base) => {
  const args = await Promise.all([binaryAjax(base, "shp"), binaryAjax(base, "prj")])
  let prj = false
  try {
    if (args[1]) {
      prj = proj4(args[1])
    }
  } catch (e) {
    prj = false
  }
  return parseShp(args[0], prj)
}

const handleDbf = async (base) => {
  const [dbf, cpg] = await Promise.all([binaryAjax(base, "dbf"), binaryAjax(base, "cpg")])
  if (!dbf) {
    return
  }
  return parseDbf(dbf, cpg)
}

const checkSuffix = (base, suffix) => {
  const url = new URL(base, globalThis?.document?.location)
  return url.pathname.slice(-4).toLowerCase() === suffix
}
const fromObject = ({ shp, dbf, cpg, prj }) => {
  const things = [_parseShp(shp, prj)]
  if (dbf) {
    things.push(_parseDbf(dbf, cpg))
  }
  return combine(things)
}

export const getShapefile = async function (base, whiteList, encoding, crs) {
  if (typeof base !== "string") {
    if (isArrayBuffer(base) || ArrayBuffer.isView(base) || isDataView(base)) {
      return parseZip(base)
    }
    if (base.shp) {
      return fromObject(base)
    }
    throw new TypeError("must be a string, some sort of Buffer, or an object with at least a .shp property")
  }
  if (checkSuffix(base, ".zip")) {
    return getZip(base, whiteList, encoding, crs)
  }
  if (checkSuffix(base, ".shp")) {
    base = base.slice(0, -4)
  }
  const results = await Promise.all([handleShp(base), handleDbf(base)])
  return combine(results)
}

export const toGeoJSON = getShapefile

const _parseShp = function (shp, prj) {
  shp = toDataView(shp)
  prj = toString(prj)
  if (typeof prj === "string") {
    try {
      prj = proj4(prj)
    } catch (e) {
      prj = false
    }
  }
  return parseShp(shp, prj)
}
const _parseDbf = function (dbf, cpg) {
  dbf = toDataView(dbf)
  cpg = toString(cpg)
  return parseDbf(dbf, cpg)
}

// export default getShapefile
export { _parseDbf as parseDbf, _parseShp as parseShp }
