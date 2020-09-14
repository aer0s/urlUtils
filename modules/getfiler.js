export class GETfiler {
  constructor(baseURL, options = {}) {
    let base = baseURL || window.location.href
    const is_rel = base.search(/^\w+:/i) === -1
    this.options = Object.assign(
      {},
      {
        listToken: "__in",
        joinChar: ",",
        trailingSlash: true,
        relPath: is_rel
      },
      options
    )
    this.url = new URL(is_rel ? `null:${base}`: base)
    this.json = {}
    if (this.url.search) {
      const init = Object.fromEntries(this.url.searchParams)
      this.append(init)
    }
    return this
  }

  append(valueObject = {}) {
    if (!valueObject || typeof valueObject !== "object") {
      throw new Error("Parameter is not an object")
    }
    for (const [key, value] of Object.entries(valueObject)) {
      if (!value) {
        this.remove(key)
      } else if (`${key}`.endsWith(this.options.listToken)) {
        const strs = this.json[key]
          ? `${this.json[key]}`.split(this.options.joinChar)
          : []
        const vals =
          value.constructor === Array
            ? value
            : `${value}`.split(this.options.joinChar)
        strs.push(...new Set(vals))
        this.json[key] = strs.join(this.options.joinChar)
      } else {
        this.json[key] = value
      }
    }
    this.resolve()
    return this
  }

  remove(values) {
    if (values) {
      switch (values.constructor) {
        case Array:
          for (const key of values) {
            delete this.json[key]
          }
          break
        case Object:
          for (const [key, value] of Object.entries(values)) {
            if (`${key}`.endsWith(this.options.listToken) && value) {
              this.json[key] = this.json[key]
                .split(this.options.joinChar)
                .filter((v) => v !== `${value}`)
                .join(this.options.joinChar)
            } else {
              delete this.json[key]
            }
          }
          break
        default:
          delete this.json[values]
      }
      this.resolve()
    }
    return this
  }

  goTo(path) {
    this.url.pathname = path || "/"
    return this
  }

  resolve() {
    if (this.options.trailingSlash && !this.url.pathname.endsWith("/")) {
      this.url.pathname += "/"
    }
    this.url.search = new URLSearchParams(this.json).toString()
    const url = this.url.toString()
    if (this.options.relPath) {
      return `${this.url.pathname}${this.url.search}`
    }
    return this.url.toString()
  }

  get entries() {
    return Object.entries(this.json)
  }
}
