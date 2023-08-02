
export function combine(base, type) {
  if (!type) {
    return base
  }
  const url = new URL(base)
  url.pathname = `${url.pathname}.${type}`
  return url.href
}
