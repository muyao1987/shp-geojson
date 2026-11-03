import { combine } from "./combine.js"

/**
 * 请求下载 shapefile 相关文件（内部辅助函数）。
 * @param {String} _url - 文件基础地址（不含扩展名）。
 * @param {String} [type] - 要请求的文件类型后缀：shp/dbf/prj/cpg；省略时直接请求 _url 本身。
 * @returns {Promise<DataView|String|boolean>} shp/dbf 返回 DataView；prj/cpg 为可选文本文件，返回文本内容；prj/cpg/dbf 请求失败时返回 false，shp 请求失败时向上抛出错误。
 */
export async function binaryAjax(_url, type) {

  const url = combine(_url, type)
  const isOptionalTxt = type === "prj" || type === "cpg"
  try {
    const resp = await fetch(url)
    if (resp.status > 399) {
      throw new Error(resp.statusText)
    }
    if (isOptionalTxt) {
      return resp.text()
    }
    const parsed = await resp.arrayBuffer()
    return new DataView(parsed)
  } catch (e) {
    if (isOptionalTxt || type === "dbf") {
      return false
    }
    throw e
  }
};
