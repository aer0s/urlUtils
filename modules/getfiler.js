class GETfiler {
  constructor(baseURL, options = {}) {
    let base = baseURL || window.location.href
    const is_rel = base.search(/^\w+:/i) === -1
    this.options = Object.assign(
      {},
      {
        listToken: "__in",
        joinChar: ",",
        trailingSlash: true,
        relPath: is_rel,
        method: "GET"
      },
      options
    )
    this.url = new URL(is_rel ? `null:${base}`: base)
    this.params = {}
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
        const strs = this.params[key]
          ? `${this.params[key]}`.split(this.options.joinChar)
          : []
        const vals =
          value.constructor === Array
            ? value
            : `${value}`.split(this.options.joinChar)
        strs.push(...new Set(vals))
        this.params[key] = strs.join(this.options.joinChar)
      } else {
        this.params[key] = value
      }
    }
    this.toString()
    return this
  }

  remove(values) {
    if (values) {
      switch (values.constructor) {
        case Array:
          for (const key of values) {
            delete this.params[key]
          }
          break
        case Object:
          for (const [key, value] of Object.entries(values)) {
            if (`${key}`.endsWith(this.options.listToken) && value) {
              this.params[key] = this.params[key]
                .split(this.options.joinChar)
                .filter((v) => v !== `${value}`)
                .join(this.options.joinChar)
            } else {
              delete this.params[key]
            }
          }
          break
        default:
          delete this.params[values]
      }
      this.toString()
    }
    return this
  }

  goTo(path) {
    this.url.pathname = path || "/"
    return this
  }

  getUrl(withSearch=true) {
    if (this.options.trailingSlash && !this.url.pathname.endsWith("/")) {
      this.url.pathname += "/"
    }
    let path = null
    if(withSearch && this.options.method == "GET") {
      return (
        this.options.relPath ? 
        `${this.url.pathname}${this.url.search}` : 
        this.url.toString()
      )
    } else {
      return `${!this.options.relPath ? this.url.origin : ''}${this.url.pathname}`
    }
  }
  
  toString() {
    this.url.search = new URLSearchParams(this.params).toString()
    const url = this.url.toString()
    return this.getUrl()
  }

  toJSON(options={}) {
    this.options.method = options.method || this.options.method;
    const name = this.options.method === "GET" ? "params" : "data";
    return Object.assign({}, {
      url: this.getUrl(false),
      [name]: this.params,
      method: this.options.method
    }, options)
  }

  get resolve() {
    return this.toString()
  }

  get json() {
    return this.params
  }

  get entries() {
    return Object.entries(this.params)
  }
  
  get pathEntries() {
    return [
      this.getUrl(false),
      this.params,
    ]
  }
}

module.exports = GETfiler;