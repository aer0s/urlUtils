const test = require("ava");
const { Resource } = require("../index");
const { render } = require("alpine-test-utils");

test("Resource observable test", (t) => {
  const data = {
    foo: "bar",
    url: new Resource("https://httpbin.org/json").append([
      { name: "arg", value: "one" },
      { name: "next", value: "two" },
      { name: "search", value: "something" },
    ]),
  };
  const component = render(
    `<div x-data="">
            <span x-text="foo"></span>
            <input id="search" type="text" x-model="url.props.search"></input>
            <div class="tags">
              <template x-for="(row, index) in url.params" :key="index">
                <span class="tag" x-text"row.value" x-ref="row.name"></span>
              </template>
            </div>
        </div>`,
    data
  );
  t.is(component.querySelector("span").textContent, "bar", "content rendered");
  t.is(data.url.props.search, "something", "js props");
  t.is(
    component.querySelector("#search").value,
    "something",
    "inital prop value"
  );
  data.url.props.search = "else";
  t.is(component.querySelector("#search").value, "else", "prop updated in js");
  component.querySelector("#search").value = "altogether";
  t.is(data.url.props.search, "altogether", "prop updated in html");
  t.is(component.querySelectorAll(".tag").length, 2, "parameter rendering");
});
