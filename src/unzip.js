const JSZip = require('jszip')

export async function unzip(buffer) {
  const zip = new JSZip()
  await zip.loadAsync(buffer)
  const files = zip.file(/.+/)
  const out = {}
  await Promise.all(
    files.map(async (a) => {
      let result
      if (a.name.slice(-3).toLowerCase() === 'shp' || a.name.slice(-3).toLowerCase() === 'dbf') {
        result = await a.async('nodebuffer')
      } else {
        result = await a.async('text')
      }
      out[a.name] = result
    })
  )
  return out
}
