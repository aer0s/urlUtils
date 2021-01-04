const test = require("ava");
const fetch = require("node-fetch");
const { Resource } = require("../index");
const { waitFor } = require("alpine-test-utils");

test("Resource http test", async (t) => {
  const url = new Resource("https://httpbin.org/json", { _fetch: fetch });
  // t.plan(2);
  //
  t.pass();

  url.http.get().then((d) => {
    t.deepEqual(response.data, {
      slideshow: {
        author: "Yours Truly",
        date: "date of publication",
        slides: [
          {
            title: "Wake up to WonderWidgets!",
            type: "all",
          },
          {
            items: [
              "Why <em>WonderWidgets</em> are great",
              "Who <em>buys</em> WonderWidgets",
            ],
            title: "Overview",
            type: "all",
          },
        ],
        title: "Sample Slide Show",
      },
    });
  });
});
