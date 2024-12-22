import { iter } from "but-unzip"

const regex = /.+\.(shp|dbf|json|prj|cpg)$/i

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
