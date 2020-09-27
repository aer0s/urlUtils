# urlUtils
Javascript URL Utilities Collection

## **GETfiler**: URL GET Parameter manipulation class
[View Examples on Observable](https://observablehq.com/@aer0s/getfiler-url-get-parameter-manipulation-tool)

A simple js object for managing URL parameters. The main focus of this class library is to provide simple manipulation of URL parameters, so objects and arrays returned are of the paramenters. The full updated URL object is available on the url property of the instantiated class.

### Interface `GETFiler(@urlPath, @{options})`
```js
import { GETFiler } from urlUtils;

const path = "https://example.com/api/"
const opts = {
    listToken: "__in", // default
    joinChar: ",", // default
    trailingSlash: true, // default
    relPath: true, // default detects if path is fqdn
    method: "GET"  // default
}
const url = new GETFiler(path, opts)
```
### Methods
> #### `url.append(valueObject = {})`
> Function to add or modify params. This method is **listToken** aware and will append to **listToken** params instead of overwriting them.
>
> *@valueObject:* [Object] Parameter Object, *{key: value}*
>
> *RETURN:* **GETFiler** Instance.
> #### `url.remove(values)`
> Function to remove one or more params. This method is **listToken** aware and will remove items from **listToken** params preserving the rest.
>
> *@values:* [String, Array, Object], *"key"* or *["key", ...]* or *{key: key2}*
>
> *RETURN:* **GETFiler** Instance.
> #### `url.goTo(path)`
> Function to alter the underling URL object pathname and enforce the **trailingSlash** instance option.
>
> *@path:* [String], URL pathname.
>
> *RETURN:* **GETFiler** Instance.
>
> #### `url.getUrl(withSearch=true)`
> Function to return the current URL Object as a string.
>
> *@path:* [Boolean], Inclue URL searchpath.
>
> *RETURN:* [String] URL or URI
>
> #### `url.toString()`
> Function to return URL Object as string similar to **getUrl()**, except it refreshes the URL params prior to retuning
>
> *RETURN:* [String] URL or URI
>
> #### `url.toJSON(options={})`
> Function to return URL, Params, and Method as JSON object.
>
> *@options:* [Object], Additional key/vals to add or modify.
>
> *RETURN:* [Object] Serialized object.

### Getters
> #### `url.resolve`
> Getter to return updated URL as string.
>
> *RETURN:* [String] URL or URI
>
> #### `url.json`
> Getter to return updated URL Params as object.
>
> *RETURN:* [Object] URL Params
>
> #### `url.entries`
> Getter to return updated URL Params as nested Array pairs.
>
> *RETURN:* [Array[Array]] **[[key, value], ...]**
>
> #### `url.pathEntries`
> Getter to return updated URL and URL Params as Array.
>
> *RETURN:* [Array] **[URL, {Params}]**
### Properties
> `url.options` [Object] *Instance options*
>
> `url.params` [Object] *URL Params object*
>
> `url.url` [Object] *URL object instance*

