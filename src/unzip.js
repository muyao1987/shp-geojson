import { iter } from "but-unzip"

const regex = /.+\.(shp|dbf|json|prj|cpg)$/i

/**
 * 解压 zip 压缩包，提取其中 shp 相关的文件（内部辅助函数）。
 * 仅保留扩展名为 .shp/.dbf/.json/.prj/.cpg 的条目。
 * @param {Uint8Array} buffer - zip 文件的二进制数据。
 * @returns {Promise<Object>} 以文件名为 key 的对象：.shp/.dbf 对应 DataView，.prj/.cpg/.json 对应解码后的文本字符串。
 */
export async function unzip(buffer) {
  const files = {}
  const proms = []
  const zipItem = iter(buffer)
  for (const entry of zipItem) {
    if (!regex.test(entry.filename)) {
      continue
    }
    proms.push(Promise.resolve(entry.read()).then((bytes) => (files[entry.filename] = bytes)))
  }
  await Promise.all(proms)
  const out = {}
  const decoder = new TextDecoder()
  for (const [key, value] of Object.entries(files)) {
    if (key.slice(-3).toLowerCase() === "shp" || key.slice(-3).toLowerCase() === "dbf") {
      out[key] = new DataView(value.buffer, value.byteOffset, value.byteLength)
    } else {
      out[key] = decoder.decode(value)
    }
  }
  return out
}
