let proj4 = require('proj4')
const _parseDbf = require('parsedbf')
const Promise = require('lie')
const Cache = require('lru-cache')
const Buffer = require('buffer').Buffer

import { unzip } from './unzip'
import { binaryAjax } from './binaryajax'
import { parseShp as _parseShp } from './parseShp'

if (proj4.default) {
  proj4 = proj4.default
}

function getProj4(value) {
  if (window.proj4) {
    return window.proj4(value)
  }
  if (window.mars3d && window.mars3d.proj4) {
    return window.mars3d.proj4(value)
  }
  return proj4(value)
}

const cache = new Cache({ max: 20 })

function toBuffer(b) {
  if (!b) {
    throw new Error('forgot to pass buffer')
  }
  if (Buffer.isBuffer(b)) {
    return b
  }
  if (isArrayBuffer(b)) {
    return Buffer.from(b)
  }
  if (isArrayBuffer(b.buffer)) {
    if (b.BYTES_PER_ELEMENT === 1) {
      return Buffer.from(b)
    }
    return Buffer.from(b.buffer)
  }
}

function isArrayBuffer(subject) {
  return subject instanceof global.ArrayBuffer || Object.prototype.toString.call(subject) === '[object ArrayBuffer]'
}

export function toGeoJSON(base, whiteList, encoding, crs) {
  if (typeof base === 'string' && cache.has(base)) {
    return Promise.resolve(cache.get(base))
  }
  return getShapefile(base, whiteList, encoding, crs).then(function (resp) {
    if (typeof base === 'string') {
      cache.set(base, resp)
    }
    return resp
  })
}

export function combine([shp, dbf]) {
  const out = {}
  out.type = 'FeatureCollection'
  out.features = []
  let i = 0
  const len = shp.length
  if (!dbf) {
    dbf = []
  }
  while (i < len) {
    out.features.push({
      type: 'Feature',
      geometry: shp[i],
      properties: dbf[i] || {},
    })
    i++
  }
  return out
}

export async function parseZip(buffer, whiteList, encoding, crs) {
  let key
  buffer = toBuffer(buffer)
  const zip = await unzip(buffer)
  const names = []
  whiteList = whiteList || []
  for (key in zip) {
    if (key.indexOf('__MACOSX') !== -1) {
      continue
    }
    if (key.slice(-3).toLowerCase() === 'shp') {
      names.push(key.slice(0, -4))
      zip[key.slice(0, -3) + key.slice(-3).toLowerCase()] = zip[key]
    } else if (key.slice(-3).toLowerCase() === 'prj') {
      let nowProj
      try {
        nowProj = getProj4(crs || zip[key])
      } catch (e) {
        console.error('该坐标系proj4未解析,将原样转出', e)
        nowProj = getProj4('EPSG:4326')
      }
      zip[key.slice(0, -3) + key.slice(-3).toLowerCase()] = nowProj
    } else if (key.slice(-4).toLowerCase() === 'json' || whiteList.indexOf(key.split('.').pop()) > -1) {
      names.push(key.slice(0, -3) + key.slice(-3).toLowerCase())
    } else if (key.slice(-3).toLowerCase() === 'dbf' || key.slice(-3).toLowerCase() === 'cpg') {
      zip[key.slice(0, -3) + key.slice(-3).toLowerCase()] = zip[key]
    }
  }
  if (!names.length) {
    throw new Error('no layers founds')
  }
  const geojson = names.map(function (name) {
    let parsed, dbf
    const lastDotIdx = name.lastIndexOf('.')
    if (lastDotIdx > -1 && name.slice(lastDotIdx).indexOf('json') > -1) {
      parsed = JSON.parse(zip[name])
      parsed.fileName = name.slice(0, lastDotIdx)
    } else if (whiteList.indexOf(name.slice(lastDotIdx + 1)) > -1) {
      parsed = zip[name]
      parsed.fileName = name
    } else {
      if (zip[name + '.dbf']) {
        dbf = parseDbf(zip[name + '.dbf'], encoding || zip[name + '.cpg'])
      }
      parsed = combine([parseShp(zip[name + '.shp'], zip[name + '.prj']), dbf])
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

export async function getZip(base, whiteList, encoding, crs) {
  const a = await binaryAjax(base)
  return parseZip(a, whiteList, encoding, crs)
}

async function handleShp(base) {
  const args = await Promise.all([binaryAjax(base, 'shp'), binaryAjax(base, 'prj')])
  let prj = false
  try {
    if (args[1]) {
      prj = getProj4(args[1])
    }
  } catch (e) {
    prj = false
  }
  return parseShp(args[0], prj)
}

async function handleDbf(base) {
  const [dbf, cpg] = await Promise.all([binaryAjax(base, 'dbf'), binaryAjax(base, 'cpg')])
  if (!dbf) {
    return
  }
  return parseDbf(dbf, cpg)
}

function checkSuffix(base, suffix) {
  return base.toLowerCase().endsWith(suffix)
}

export async function getShapefile(base, whiteList, encoding, crs) {
  if (typeof base !== 'string') {
    return parseZip(base, whiteList, encoding, crs)
  }
  if (checkSuffix(base, '.zip')) {
    return getZip(base, whiteList, encoding, crs)
  }
  const results = await Promise.all([handleShp(base), handleDbf(base)])
  return combine(results)
}

export function parseShp(shp, prj) {
  shp = toBuffer(shp)
  if (Buffer.isBuffer(prj)) {
    prj = prj.toString()
  }
  if (typeof prj === 'string') {
    try {
      prj = getProj4(prj)
    } catch (e) {
      prj = false
    }
  }
  return _parseShp(shp, prj)
}

export function parseDbf(dbf, cpg) {
  dbf = toBuffer(dbf)
  return _parseDbf(dbf, cpg)
}
