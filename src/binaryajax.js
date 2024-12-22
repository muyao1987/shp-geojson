import { combine } from "./combine.js"

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
