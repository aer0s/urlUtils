class Resource {
  constructor(baseURL, options = {}) {
    let base = baseURL || window.location.href;
    const is_rel = base.search(/^\w+:/i) === -1;
    this.options = Object.assign(
      {},
      {
        allowMultiple: false,
        listConcat: true,
        listToken: "__in",
        joinChar: ",",
        trailingSlash: true,
        relPath: is_rel,
        method: "GET",
        methods: ["GET", "OPTIONS"],
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        encodeBody: true,
        nameField: "name",
        valueField: "value",
        props: ["search", "page", "pageSize"],
        _fetch: globalThis.fetch,
      },
      options
    );
    this.url = new URL(is_rel ? `null:${base}` : base);
    this.params = [];
    this.props = {};
    this.http = {};
    if (this.url.searchParams) {
      const paramList =
        this.url.searchParams.entries() ||
        Object.entries(this.url.searchParams);
      for (const [name, value] of paramList) {
        if (this.options.props.indexOf(name) > -1) {
          this.props[name] = value;
          continue;
        } else {
          if (
            this.options.listConcat &&
            name.endsWith(this.options.listToken)
          ) {
            for (const val of `${value}`.split(this.options.joinChar)) {
              this.append({
                [this.options.nameField]: name,
                [this.options.valueField]: val,
              });
            }
          }
          this.append({
            [this.options.nameField]: name,
            [this.options.valueField]: value,
          });
        }
      }
    }
    for (const method of this.options.methods) {
      this.http[method.toLowerCase()] = (op = {}) =>
        this.fetch(Object.assign({}, op, { method: method }));
    }
    return this;
  }

  append(valueObject = {}) {
    if (!valueObject || typeof valueObject !== "object") {
      throw new Error("Parameter is not an object");
    }
    if (valueObject.constructor == Array) {
      for (const obj of valueObject) {
        this.append(obj);
      }
    } else {
      const [key, value, field] = [
        valueObject[this.options.nameField],
        valueObject[this.options.valueField],
        this.options.nameField,
      ];
      if (key) {
        if (
          [...Object.keys(this.props), ...this.options.props].indexOf(key) > -1
        ) {
          this.props[key] = value;
        } else {
          const entryIndex = this.params.findIndex((r) => r[field] === key);
          if (entryIndex == -1) {
            this.params.push(valueObject);
          } else if (
            this.options.allowMultiple ||
            (this.options.listConcat && key.endsWith(this.options.listToken))
          ) {
            this.params.push(valueObject);
          }
        }
        this.reconstructUrl();
      }
    }
    return this;
  }

  remove(values) {
    let entryIndex = -1;
    if ([undefined, null, ""].indexOf(values) == -1) {
      switch (values.constructor) {
        case Array:
          for (const row of values) {
            this.remove(row);
          }
          break;
        case Object:
          const [key, value] = [
            values[this.options.nameField],
            values[this.options.valueField],
          ];
          entryIndex = this.params.findIndex(
            (r) =>
              r[this.options.nameField] === key &&
              r[this.options.valueField] === value
          );
          if (entryIndex > -1) {
            this.remove(entryIndex);
          }
          break;
        case String:
          if ([...Object.keys(this.props)].indexOf(values) > -1) {
            delete this.props[values];
            return this;
          }
          entryIndex = this.params.findIndex(
            (r) => r[this.options.nameField] === values
          );
          if (entryIndex > -1) {
            this.remove(entryIndex);
          }
          break;
        case Number:
          this.params.splice(values, 1);
          this.reconstructUrl();
          break;
      }
    }
    return this;
  }

  goTo(path) {
    this.url.pathname = path || "/";
    return this;
  }

  getUrl(withSearch = true) {
    if (this.options.trailingSlash && !this.url.pathname.endsWith("/")) {
      this.url.pathname += "/";
    }
    let path = null;
    if (withSearch && this.options.method == "GET") {
      return this.options.relPath
        ? `${this.url.pathname}${this.url.search}`
        : this.url.toString();
    } else {
      return `${!this.options.relPath ? this.url.origin : ""}${
        this.url.pathname
      }`;
    }
  }

  reconstructUrl() {
    const search = new URLSearchParams();
    const concat = {};
    for (const row of this.params) {
      if (
        this.options.listConcat &&
        `${row[this.options.nameField]}`.endsWith(this.options.listToken)
      ) {
        if (!concat[this.options.nameField]) {
          concat[this.options.nameField] = [];
        }
        concat[this.options.nameField].push(row[this.options.valueField]);
        if (search.has(this.options.nameField)) {
          search.remove(this.options.nameField);
        }
        search.append(
          row[this.options.nameField],
          [...new Set(concat[this.options.nameField])].join(
            this.options.ListToken
          )
        );
      } else {
        search.append(
          row[this.options.nameField],
          row[this.options.valueField]
        );
      }
    }
    for (const [prop, value] of Object.entries(this.props)) {
      if (search.has(prop)) {
        search.delete(prop);
      }
      search.append(prop, value);
    }
    this.url.search = search.toString();
  }

  toString() {
    return this.getUrl();
  }

  toJSON(options = {}) {
    this.options.method = options.method || this.options.method;
    const name = this.options.method === "GET" ? "params" : "data";
    return Object.assign(
      {},
      {
        url: this.getUrl(false),
        [name]: this.entries,
        method: this.options.method,
      },
      options
    );
  }

  fetch(options = {}) {
    const opts = Object.assign(
      {},
      { method: this.options.method, headers: this.options.headers },
      options
    );
    if (opts.headers["Content-Type"] === "application/json") {
      if (this.options.encodeBody && opts.body) {
        opts.body = JSON.stringify(opts.body);
      }
      return this.options
        ._fetch(this.toString(), opts)
        .then((d) => Object.assign({}, d, { data: d.json() }));
    }
    return fetch(this.toString(), opts);
  }

  get resolve() {
    return this.toString();
  }

  get json() {
    return Object.fromEntries(this.entries);
  }

  get entries() {
    return [
      ...this.params.map((r) => [
        r[this.options.nameField],
        r[this.options.valueField],
      ]),
      ...Object.entries(this.props),
    ];
  }

  get pathEntries() {
    return [this.getUrl(false), this.entries];
  }
}

module.exports = Resource;
