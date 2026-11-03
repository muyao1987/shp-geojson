
/**
 * 为基础 URL 拼接指定类型的文件扩展名（内部辅助函数；注意与 index.js 导出的同名 combine 函数用途不同）。
 * @param {String} base - 基础 URL。
 * @param {String} [type] - 要拼接的扩展名（不含点号），如 "shp"；省略时原样返回 base。
 * @returns {String} 拼接扩展名后的完整 URL。
 */
export function combine(base, type) {
  if (!type) {
    return base
  }
  const url = new URL(base)
  url.pathname = `${url.pathname}.${type}`
  return url.href
}
