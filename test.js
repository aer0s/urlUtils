const test = require("ava");
const { GETfiler } = require("./index");

test('getfiler', t => {
	const data = {
		method: "GET",
		params: {
			search: "for something",
		},
		url: "/path/to/endpoint/",
	}
	const url = new GETfiler("/docs/");
	url.append(data.params);
	url.append({not: "real"});
	url.remove("not");
	url.goTo(data.url);

	t.is(url.resolve, `${data.url}?search=for+something`);
	t.is(url.params.search, data.params.search);
	t.deepEqual(url.json, data.params);
	t.deepEqual(url.toJSON(), data);
	t.deepEqual(url.entries, [["search", data.params.search]]);
	t.deepEqual(url.pathEntries, [data.url, data.params]);
});
