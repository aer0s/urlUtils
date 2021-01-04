const test = require("ava");
const { Resource } = require("../index");

test("Resource Tests", (t) => {
  const data = {
    method: "GET",
    params: {
      name: "search",
      value: "for something",
    },
    url: "/path/to/endpoint/",
  };
  const entries = Object.assign({}, data, {
    params: [[data.params.name, data.params.value]],
  });

  const url = new Resource("/docs/");
  url.append(data.params);
  url.goTo(data.url);
  url.append({ name: "not", value: "real" });
  t.is(
    url.resolve,
    `${data.url}?not=real&search=for+something`,
    "URL Resolve with not"
  );
  url.remove("not");

  t.is(url.resolve, `${data.url}?search=for+something`, "URL Resolve");
  t.is(url.props.search, data.params.value, "Search Prop Value");
  t.deepEqual(
    url.json,
    { [data.params.name]: data.params.value },
    "JSON export"
  );
  t.deepEqual(url.toJSON(), entries, "JSON generation");
  t.deepEqual(url.entries, entries.params, "Serialized pairs");
  t.deepEqual(
    url.pathEntries,
    [data.url, entries.params],
    "Path with serialized pairs"
  );
});
