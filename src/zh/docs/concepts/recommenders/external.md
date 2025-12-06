---
icon: code
shortTitle: 外部 API
---
# 外部 API 推荐算法

虽然 Gorse 已经提供了几种推荐算法，但生产中的推荐逻辑是 Gorse 无法完全涵盖的。例如，YouTube 将关注的创作者的新视频添加到推荐中，Steam 将用户拥有的游戏的 DLC 添加到推荐中。外部推荐算法执行 JavaScript 脚本以访问外部 HTTP 端点并检索推荐。

## 配置

外部推荐算法有两个字段：

- `name` 用于唯一标识外部推荐算法。
- `script` 用于访问外部 HTTP 端点并将结果转换为物品 ID 数组。推荐系统中不存在的物品 ID 将被忽略。

Gorse 集成了 QuickJS 来执行 JavaScript。已添加访问环境变量和发送 HTTP 请求的功能。欢迎贡献以添加更多功能。

### 访问环境变量

在 JavaScript 脚本中，您可以使用 `env.VARIABLE_NAME` 访问环境变量。例如，要访问名为 `API_KEY` 的环境变量，可以使用以下代码：

```javascript
const apiKey = env.API_KEY;
```

::: note

- 所有环境变量都是字符串类型。
- 如果环境变量不存在，访问它将返回 `undefined`。

:::

### Fetch API

要发出 GET 请求，您可以将 URL 字符串传递给 `fetch` 函数：

```javascript
const response = fetch('https://example.com/data');
const data = JSON.parse(response.body);
```

要发出 POST 请求，您可以将包含请求选项的对象作为第二个参数传递给 `fetch` 函数：

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

`fetch` 函数接受以下请求选项：

- `method`: HTTP 方法，例如 `GET`, `POST`, `PUT`, `DELETE`。默认为 `GET`。
- `headers`: 包含 HTTP 头的对象。
- `body`: 请求体，应该是一个字符串。
- `url`: 请求 URL。如果指定了此选项，则可以省略第一个参数。

`fetch` 函数返回具有以下属性的响应对象：

- `ok`: 一个布尔值，指示请求是否成功（状态码在 200-299 范围内）。
- `status`: HTTP 状态码。
- `statusText`: HTTP 状态文本。
- `body`: 响应体，是一个字符串。
- `headers`: 包含响应头的对象。

这是一个完整的示例，展示了如何使用 Fetch API 发出 POST 请求并处理响应：

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

- Fetch API 在 JavaScript 脚本中同步执行。这意味着脚本将被阻塞，直到请求完成。
- Fetch API 不支持 Web 浏览器中 Fetch API 的所有功能，例如流式响应。

:::

## 示例

以下是 [GitRec](https://gitrec.gorse.io/) 从 GitHub Trending 获取仓库的示例：

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
