---
icon: code
shortTitle: External API
---
# External API Recommenders

Although Gorse already offers several recommenders, the recommendation logic in production is something Gorse cannot fully encompass. For example, YouTube adds new videos from followed creators to recommendation, and Steam adds DLCs for games a user owns to recommendation. The external recommender executes a JavaScript script to access an external HTTP endpoint and retrieve recommendation.

## Configuration

An external recommender has two fields:

- `name` is used to uniquely identify an external recommender.
- `script` is used to access the external HTTP endpoint and convert the result into an array of item IDs. Item IDs that do not exist in the recommender system will be ignored.

Gorse integrates QuickJS to execute the JavaScript. The ability to access environment variables and send HTTP requests has been added. Contributions to add more capabilities are welcome.

### Accessing Environment Variables

In the JavaScript script, you can access environment variables using `env.VARIABLE_NAME`. For instance, to access an environment variable named `API_KEY`, you can use the following code:

```javascript
const apiKey = env.API_KEY;
```

::: note

- All environment variables are of the string type.
- If an environment variable does not exist, accessing it will return `undefined`.

:::

### Fetch API

To make a GET request, you can pass a URL string to the `fetch` function:

```javascript
const response = fetch('https://example.com/data');
const data = JSON.parse(response.body);
```

To make a POST request, you can pass an object containing the request options as the second argument to the `fetch` function:

```javascript
const response = fetch('https://example.com/api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    key1: 'value1',
    key2: 'value2'
  })
});
const result = JSON.parse(response.body);
```

The `fetch` function accepts the following request options:

- `method`: The HTTP method, e.g., `GET`, `POST`, `PUT`, `DELETE`. Defaults to `GET`.
- `headers`: An object containing HTTP headers.
- `body`: The request body, which should be a string.
- `url`: The request URL. If this option is specified, the first argument can be omitted.

The `fetch` function returns a response object with the following properties:

- `ok`: A boolean value indicating whether the request was successful (status code in 200-299).
- `status`: The HTTP status code.
- `statusText`: The HTTP status text.
- `body`: The response body, which is a string.
- `headers`: An object containing response headers.

Here is a complete example showing how to use the Fetch API to make a POST request and handle the response:

```javascript
const response = fetch('https://example.com/api', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        key1: 'value1',
        key2: 'value2'
    })
});
if (!response.ok) {
    throw new Error(`Request failed with status code: ${response.status}`);
}
JSON.parse(response.body)
```

::: warning

- The Fetch API executes synchronously within the JavaScript script. This means the script will be blocked until the request is completed.
- The Fetch API does not support all features of the Fetch API in web browsers, such as streaming responses.

:::

## Example

The following is an example from [GitRec](https://gitrec.gorse.io/) fetching repositories from GitHub Trending:

```toml
[[recommend.external]]

# The name of the external recommender.
name = "trending"

# The script to fetch external recommended items. The script should return a list of item IDs.
script = """
const body = fetch("https://cdn.jsdelivr.net/gh/isboyjc/github-trending-api/data/daily/all.json").body;
const data = JSON.parse(body);
data["items"].map((item) => {
  return item["title"].toLowerCase().replace("/", ":");
})
"""
```
