/**
 * shp-geojson（shpUtil）
 * shp 与 GeoJSON 格式转换工具类：支持通过 URL 或二进制数据加载 .zip 压缩包或 .shp/.dbf/.prj/.cpg 等文件，
 * 解析为 GeoJSON。内置 proj4 及 CGCS2000（EPSG:4490~4554）系列坐标系定义。
 *
 * 主要对外接口：
 * - toGeoJSON（getShapefile 别名）：主入口，加载并解析 shp 数据为 GeoJSON
 * - parseZip：解析 zip 压缩包二进制数据
 * - parseShp：解析 .shp 二进制为 geometry 数组
 * - parseDbf：解析 .dbf 二进制为属性数组
 * - combine：几何数组与属性数组合并为 FeatureCollection
 *
 * @module shp-geojson
 */
import proj4 from "proj4"
import parseDbf from "parsedbf"
import { unzip } from "./unzip.js"
import { binaryAjax } from "./binaryajax.js"
import parseShp from "./parseShp.js"
import { getProj4 } from "./proj4"

const URL = globalThis.URL

/**
 * 将任意二进制数据（ArrayBuffer / TypedArray / DataView）统一转换为 Uint8Array。
 * @param {ArrayBuffer|ArrayBufferView} b - 二进制数据。
 * @returns {Uint8Array} 转换后的 Uint8Array。
 * @throws 当未传参数或传入对象不包含二进制缓冲时抛出错误。
 */
const toUint8Arr = (b) => {
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

/**
 * 将 parseShp 解析出的几何体数组与 parseDbf 解析出的属性数组，按记录顺序组合为标准的 GeoJSON FeatureCollection。
 *
 * @param {Array} parts - 长度为 2 的数组 [shp, dbf]，也可仅传几何数组。
 * @param {Array<Object|null>} parts.0 - parseShp 返回的 geometry 对象数组。
 * @param {Array<Object>} [parts.1] - parseDbf 返回的属性对象数组，可省略（省略或长度不足时对应 properties 为空对象）。
 * @returns {Object} GeoJSON FeatureCollection，形如 { type: "FeatureCollection", features: [{ type: "Feature", geometry, properties }] }。
 *
 * @example // 将几何数组与属性数组组合为 FeatureCollection
 * const geojson = shpUtil.combine([geometries, properties])
 */
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

/**
 * 解析 shp 压缩包（zip）的二进制数据为 GeoJSON。
 * 包内自动识别 .shp/.dbf/.prj/.cpg/.json 文件（忽略 __MACOSX 目录）；.json 文件按 GeoJSON 直接解析返回，
 * whiteList 中指定的其他扩展名文件也会按 JSON 解析后返回。
 *
 * @param {ArrayBuffer|ArrayBufferView} buffer - zip 文件的二进制数据（如 fetch 的 arrayBuffer、File API 读取结果等）。
 * @param {Array<String>} [whiteList] - 额外允许解析的文件扩展名白名单（不包含点号），如 ["json"]。
 * @param {String} [encoding] - dbf 属性表编码，如 "utf-8"、"gbk"；未指定时尝试使用包内 .cpg 文件的编码。
 * @param {String} [crs] - 指定坐标系（EPSG 编码或 proj4 定义串）；未指定时使用包内 .prj 文件；两者解析失败时按 EPSG:4326 处理并在控制台提示。
 * @returns {Promise<Object|Array<Object>>} 解析结果：包内只有一个图层时返回 GeoJSON FeatureCollection（或 JSON 对象），多个图层时返回数组；每个结果附带 fileName 属性标识来源文件名。
 * @throws 当包内未找到任何可解析的图层时抛出 "no layers founds"。
 *
 * @example // 解析 zip 二进制数据
 * const response = await fetch('//data.mars3d.cn/file/shp/test.zip')
 * const geojson = await shpUtil.parseZip(await response.arrayBuffer())
 */
export const parseZip = async function (buffer, whiteList, encoding, crs) {
  let key
  buffer = toUint8Arr(buffer)
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

/** 下载 zip 文件并解析为 GeoJSON（内部辅助函数）。 */
async function getZip(base, whiteList, encoding, crs) {
  const a = await binaryAjax(base)
  return parseZip(a, whiteList, encoding, crs)
}

/** 下载 base.shp 与 base.prj 并解析为 geometry 数组（prj 缺失或解析失败时不做投影转换）（内部辅助函数）。 */
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

/** 下载 base.dbf 与 base.cpg 并解析为属性数组（dbf 缺失时返回 undefined）（内部辅助函数）。 */
const handleDbf = async (base) => {
  const [dbf, cpg] = await Promise.all([binaryAjax(base, "dbf"), binaryAjax(base, "cpg")])
  if (!dbf) {
    return
  }
  return parseDbf(dbf, cpg)
}

/** 判断 URL 路径的扩展名是否为指定后缀（内部辅助函数）。 */
const checkSuffix = (base, suffix) => {
  const url = new URL(base, globalThis?.document?.location)
  return url.pathname.slice(-4).toLowerCase() === suffix
}
/** 解析 { shp, dbf, cpg, prj } 形式的二进制对象数据（内部辅助函数）。 */
const fromObject = ({ shp, dbf, cpg, prj }) => {
  const things = [_parseShp(shp, prj)]
  if (dbf) {
    things.push(_parseDbf(dbf, cpg))
  }
  return combine(things)
}

/**
 * 加载并解析 shapefile 数据为 GeoJSON（本库主入口）。
 * 根据入参类型自动识别数据源：
 * - 字符串 URL：以 .zip 结尾时按压缩包解析；以 .shp 结尾或无后缀时，按 `base.shp`、`base.dbf`、`base.prj`、`base.cpg` 地址分别请求并解析；
 * - 二进制数据（ArrayBuffer / TypedArray / DataView）：按 zip 压缩包解析；
 * - 对象：按 { shp, dbf, cpg, prj } 形式传入各部分的二进制数据。
 *
 * @param {String|ArrayBuffer|ArrayBufferView|Object} base - 数据源，具体支持形式见函数说明。
 * @param {Array<String>} [whiteList] - 仅 zip 解析时有效，额外允许解析的文件扩展名白名单。
 * @param {String} [encoding] - dbf 属性表编码，如 "utf-8"、"gbk"。
 * @param {String} [crs] - 指定坐标系（EPSG 编码或 proj4 定义串），仅 zip 解析时有效，优先于包内 .prj 文件。
 * @returns {Promise<Object|Array<Object>>} GeoJSON FeatureCollection；zip 内含多个图层时返回数组。
 * @throws {TypeError} base 不是字符串、二进制数据，也不是包含 shp 属性的对象时抛出。
 *
 * @example <caption>直接加载 zip 链接</caption>
 * shpUtil.toGeoJSON('//data.mars3d.cn/file/shp/test.zip').then((geojson) => {
 *   console.log(geojson)
 * })
 *
 * @example <caption>传入 zip 二进制数据（如通过 File API 获得的 arrayBuffer）</caption>
 * shpUtil.toGeoJSON(buffer).then((geojson) => {
 *   console.log(geojson)
 * })
 */
export const getShapefile = async function (base, whiteList, encoding, crs) {
  if (typeof base !== "string") {
    if (isArrayBuffer(base) || ArrayBuffer.isView(base) || isDataView(base)) {
      return parseZip(base, whiteList, encoding, crs)
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

/**
 * getShapefile 的别名，参数与用法完全相同，推荐使用该名称。
 *
 * @function toGeoJSON
 * @param {String|ArrayBuffer|ArrayBufferView|Object} base - 数据源（同 getShapefile）。
 * @param {Array<String>} [whiteList] - zip 解析时的文件扩展名白名单。
 * @param {String} [encoding] - dbf 属性表编码。
 * @param {String} [crs] - 指定坐标系。
 * @returns {Promise<Object|Array<Object>>} GeoJSON FeatureCollection（多图层时为数组）。
 *
 * @example // 直接加载 url
 * shpUtil.toGeoJSON('//data.mars3d.cn/file/shp/test.zip').then((geojson) => {
 *   console.log(geojson)
 * })
 */
export const toGeoJSON = getShapefile

/**
 * 解析 .shp 二进制数据，返回几何体数组（不含属性信息）。
 *
 * @param {ArrayBuffer|ArrayBufferView} shp - .shp 文件的二进制数据。
 * @param {String|Object|boolean} [prj] - 坐标系信息：可为 proj4 定义串 / EPSG 编码字符串、proj4 转换对象，或 false（不进行投影转换，按原坐标输出）。
 * @returns {Array<Object|null>} GeoJSON geometry 对象数组（Point/LineString/Polygon/MultiPoint/MultiLineString/MultiPolygon 等），空记录对应 null。
 *
 * @example // 解析 shp 二进制，并指定投影为 CGCS2000 经纬度
 * const geometries = shpUtil.parseShp(shpBuffer, 'EPSG:4490')
 */
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
/**
 * 解析 .dbf 二进制属性表数据，返回属性对象数组（顺序与 .shp 记录一一对应）。
 *
 * @param {ArrayBuffer|ArrayBufferView} dbf - .dbf 文件的二进制数据。
 * @param {String} [cpg] - 属性表编码，如 "utf-8"、"gbk"（也可传入 .cpg 文件的文本内容）。
 * @returns {Array<Object>} 属性对象数组。
 *
 * @example // 解析 dbf 二进制，按 gbk 编码读取
 * const properties = shpUtil.parseDbf(dbfBuffer, 'gbk')
 */
const _parseDbf = function (dbf, cpg) {
  dbf = toDataView(dbf)
  cpg = toString(cpg)
  return parseDbf(dbf, cpg)
}

// export default getShapefile
export { _parseDbf as parseDbf, _parseShp as parseShp }
