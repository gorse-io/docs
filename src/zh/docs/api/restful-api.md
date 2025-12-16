---
icon: http
---

# RESTful APIs

本节列出了 Gorse 服务器提供的 RESTful API。如需更多详细信息，请浏览交互式 API 文档：

`http://<server_node_IP>:<server_node_port>/apidocs`.

## 认证

默认配置下，RESTful API 不需要认证。可以通过在配置文件中设置`api_key`来启用认证。 API 密钥通过`X-API-Key`请求头传递。

```bash
curl -H "X-API-Key: *****"  http://127.0.0.1:8087/api/recommend/bob?n=10
```

::: tip

API 密钥在配置文件的 [`[server]`](/docs/config#server) 部分设置：

```toml
[server]

# Secret key for RESTful APIs (SSL required).
api_key = ""
```

:::

## API 接口

::: details `GET /api/collaborative-filtering/{user-id}` 获取用户的协同过滤推荐。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| user-id | path | string | 用户 ID |
| n | query | integer | 返回物品的数量 |
| offset | query | integer | 返回物品的偏移量 |
| category | query | string | 返回物品的类别。 |
| user-id | query | string | 移除用户已读物品 |

**Response:**

```json
[
  {
    "Id": "string",
    "Score": 0
  }
]
```

:::

::: details `GET /api/feedback` 列出反馈。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| cursor | query | string | 下一页的游标 |
| n | query | integer | 返回反馈的数量 |

**Response:**

```json
{
  "Cursor": "string",
  "Feedback": [
    {
      "Comment": "string",
      "FeedbackType": "string",
      "ItemId": "string",
      "Timestamp": "2000-01-01T00:00:00Z",
      "Updated": "2000-01-01T00:00:00Z",
      "UserId": "string",
      "Value": 0
    }
  ]
}
```

:::

::: details `PUT /api/feedback` 插入反馈。现有的反馈将被覆盖。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |

**Body:**

```json
[
  {
    "Comment": "string",
    "FeedbackType": "string",
    "ItemId": "string",
    "Timestamp": "2000-01-01T00:00:00Z",
    "Updated": "2000-01-01T00:00:00Z",
    "UserId": "string",
    "Value": 0
  }
]
```

**Response:**

```json
{
  "RowAffected": 0
}
```

:::

::: details `POST /api/feedback` 插入反馈。如果反馈已存在，则累加值。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |

**Body:**

```json
[
  {
    "Comment": "string",
    "FeedbackType": "string",
    "ItemId": "string",
    "Timestamp": "2000-01-01T00:00:00Z",
    "Updated": "2000-01-01T00:00:00Z",
    "UserId": "string",
    "Value": 0
  }
]
```

**Response:**

```json
{
  "RowAffected": 0
}
```

:::

::: details `GET /api/feedback/{feedback-type}` 列出指定类型的反馈。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| feedback-type | path | string | 反馈类型 |
| cursor | query | string | 下一页的游标 |
| n | query | integer | 返回反馈的数量 |

**Response:**

```json
{
  "Cursor": "string",
  "Feedback": [
    {
      "Comment": "string",
      "FeedbackType": "string",
      "ItemId": "string",
      "Timestamp": "2000-01-01T00:00:00Z",
      "Updated": "2000-01-01T00:00:00Z",
      "UserId": "string",
      "Value": 0
    }
  ]
}
```

:::

::: details `GET /api/feedback/{feedback-type}/{user-id}/{item-id}` 获取用户和物品之间指定类型的反馈。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| feedback-type | path | string | 反馈类型 |
| user-id | path | string | 用户 ID |
| item-id | path | string | 物品 ID |

**Response:**

```json
{
  "Comment": "string",
  "FeedbackType": "string",
  "ItemId": "string",
  "Timestamp": "2000-01-01T00:00:00Z",
  "Updated": "2000-01-01T00:00:00Z",
  "UserId": "string",
  "Value": 0
}
```

:::

::: details `DELETE /api/feedback/{feedback-type}/{user-id}/{item-id}` 删除用户和物品之间指定类型的反馈。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| feedback-type | path | string | 反馈类型 |
| user-id | path | string | 用户 ID |
| item-id | path | string | 物品 ID |

**Response:**

```json
{
  "RowAffected": 0
}
```

:::

::: details `GET /api/feedback/{user-id}/{item-id}` 列出用户和物品之间的反馈。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| user-id | path | string | 用户 ID |
| item-id | path | string | 物品 ID |

**Response:**

```json
[
  {
    "Comment": "string",
    "FeedbackType": "string",
    "ItemId": "string",
    "Timestamp": "2000-01-01T00:00:00Z",
    "Updated": "2000-01-01T00:00:00Z",
    "UserId": "string",
    "Value": 0
  }
]
```

:::

::: details `DELETE /api/feedback/{user-id}/{item-id}` 删除用户和物品之间的反馈。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| user-id | path | string | 用户 ID |
| item-id | path | string | 物品 ID |

**Response:**

```json
{
  "RowAffected": 0
}
```

:::

::: details `GET /api/health/live` 探测此节点的存活状态。服务器启动后返回 OK。

**Parameters:** None

**Response:**

```json
{
  "CacheStoreConnected": false,
  "CacheStoreError": {},
  "DataStoreConnected": false,
  "DataStoreError": {},
  "Ready": false
}
```

:::

::: details `GET /api/health/ready` 探测此节点的就绪状态。如果服务器能够处理请求，则返回 OK。

**Parameters:** None

**Response:**

```json
{
  "CacheStoreConnected": false,
  "CacheStoreError": {},
  "DataStoreConnected": false,
  "DataStoreError": {},
  "Ready": false
}
```

:::

::: details `POST /api/item` 插入一个物品。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |

**Body:**

```json
{
  "Categories": [
    "string"
  ],
  "Comment": "string",
  "IsHidden": false,
  "ItemId": "string",
  "Labels": {},
  "Timestamp": "2000-01-01T00:00:00Z"
}
```

**Response:**

```json
{
  "RowAffected": 0
}
```

:::

::: details `GET /api/item-to-item/{name}/{item-id}` 获取物品到物品的推荐。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| name | path | string | 物品到物品推荐的名称 |
| item-id | path | string | 物品 ID |
| n | query | integer | 返回物品的数量 |
| offset | query | integer | 返回物品的偏移量 |
| category | query | string | 返回物品的类别 |
| user-id | query | string | 移除用户已读物品 |

**Response:**

```json
[
  {
    "Id": "string",
    "Score": 0
  }
]
```

:::

::: details `GET /api/item/{item-id}` 获取一个物品。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| item-id | path | string | 物品 ID. |

**Response:**

```json
{
  "Categories": [
    "string"
  ],
  "Comment": "string",
  "IsHidden": false,
  "ItemId": "string",
  "Labels": {},
  "Timestamp": "2000-01-01T00:00:00Z"
}
```

:::

::: details `DELETE /api/item/{item-id}` 删除一个物品及其反馈。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| item-id | path | string | 物品 ID |

**Response:**

```json
{
  "RowAffected": 0
}
```

:::

::: details `PATCH /api/item/{item-id}` 修改一个物品。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| item-id | path | string | 物品 ID |

**Body:**

```json
{
  "Categories": [
    "string"
  ],
  "Comment": "string",
  "IsHidden": false,
  "Labels": {},
  "Timestamp": "2000-01-01T00:00:00Z"
}
```

**Response:**

```json
{
  "RowAffected": 0
}
```

:::

::: details `PUT /api/item/{item-id}/category/{category}` 为物品插入一个类别。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| item-id | path | string | 物品 ID |
| category | path | string | 要插入的类别 |

**Response:**

```json
{
  "RowAffected": 0
}
```

:::

::: details `DELETE /api/item/{item-id}/category/{category}` 从物品中删除一个类别。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| item-id | path | string | 物品 ID |
| category | path | string | 要删除的类别 |

**Response:**

```json
{
  "RowAffected": 0
}
```

:::

::: details `GET /api/item/{item-id}/feedback` 根据物品 ID 获取反馈。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| item-id | path | string | 物品 ID |

**Response:**

```json
[
  {
    "Comment": "string",
    "FeedbackType": "string",
    "ItemId": "string",
    "Timestamp": "2000-01-01T00:00:00Z",
    "Updated": "2000-01-01T00:00:00Z",
    "UserId": "string",
    "Value": 0
  }
]
```

:::

::: details `GET /api/item/{item-id}/feedback/{feedback-type}` 根据物品 ID 和反馈类型获取反馈。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| item-id | path | string | 物品 ID |
| feedback-type | path | string | 反馈类型 |

**Response:**

```json
[
  {
    "Comment": "string",
    "FeedbackType": "string",
    "ItemId": "string",
    "Timestamp": "2000-01-01T00:00:00Z",
    "Updated": "2000-01-01T00:00:00Z",
    "UserId": "string",
    "Value": 0
  }
]
```

:::

::: details `GET /api/item/{item-id}/neighbors` 获取物品的邻居。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| item-id | path | string | 物品 ID |
| n | query | integer | 返回物品的数量 |
| offset | query | integer | 返回物品的偏移量 |
| category | query | string | 返回物品的类别 |
| user-id | query | string | 移除用户已读物品 |

**Response:**

```json
[
  {
    "Id": "string",
    "Score": 0
  }
]
```

:::

::: details `GET /api/items` 列出物品。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| n | query | integer | 返回物品的数量 |
| cursor | query | string | 下一页的游标 |

**Response:**

```json
{
  "Cursor": "string",
  "Items": [
    {
      "Categories": [
        "string"
      ],
      "Comment": "string",
      "IsHidden": false,
      "ItemId": "string",
      "Labels": {},
      "Timestamp": "2000-01-01T00:00:00Z"
    }
  ]
}
```

:::

::: details `POST /api/items` 插入物品。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |

**Body:**

```json
[
  {
    "Categories": [
      "string"
    ],
    "Comment": "string",
    "IsHidden": false,
    "ItemId": "string",
    "Labels": {},
    "Timestamp": "2000-01-01T00:00:00Z"
  }
]
```

**Response:**

```json
{
  "RowAffected": 0
}
```

:::

::: details `GET /api/latest` 获取最新物品。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| category | query | string | 返回物品的类别 |
| n | query | integer | 返回物品的数量 |
| offset | query | integer | 返回物品的偏移量 |
| user-id | query | string | 移除用户已读物品 |

**Response:**

```json
[
  {
    "Id": "string",
    "Score": 0
  }
]
```

:::

::: details `GET /api/non-personalized/{name}` 获取非个性化推荐。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| category | query | string | 返回物品的类别。 |
| n | query | integer | 返回用户的数量 |
| offset | query | integer | 返回用户的偏移量 |
| user-id | query | string | 移除用户已读物品 |

**Response:**

```json
[
  {
    "Id": "string",
    "Score": 0
  }
]
```

:::

::: details `GET /api/recommend/{user-id}` 获取用户的推荐。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| user-id | path | string | 用户 ID |
| category | query | string | 返回物品的类别（支持多类别过滤） |
| write-back-type | query | string | 回写反馈的类型 |
| write-back-delay | query | string | 回写反馈的时间戳延迟（格式 0h0m0s） |
| n | query | integer | 返回物品的数量 |
| offset | query | integer | 返回物品的偏移量 |

**Response:**

```json
[
  "string"
]
```

:::

::: details `POST /api/session/recommend` 获取会话的推荐。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| n | query | integer | 返回物品的数量 |
| offset | query | integer | 返回物品的偏移量 |
 
**Body:**

```json
[
  {
    "Comment": "string",
    "FeedbackType": "string",
    "ItemId": "string",
    "Timestamp": "string",
    "UserId": "string",
    "Value": 0
  }
]
```

**Response:**

```json
[
  {
    "Id": "string",
    "Score": 0
  }
]
```

:::

::: details `POST /api/user` 插入一个用户。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |

**Body:**

```json
{
  "Comment": "string",
  "Labels": {},
  "UserId": "string"
}
```

**Response:**

```json
{
  "RowAffected": 0
}
```

:::

::: details `GET /api/user-to-user/{name}/{user-id}` 获取用户到用户的推荐。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| name | path | string | 用户到用户推荐的名称 |
| user-id | path | string | 用户 ID |
| n | query | integer | 返回用户的数量 |
| offset | query | integer | 返回用户的偏移量 |

**Response:**

```json
[
  {
    "Id": "string",
    "Score": 0
  }
]
```

:::

::: details `GET /api/user/{user-id}` 获取一个用户。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| user-id | path | string | 用户 ID |

**Response:**

```json
{
  "Comment": "string",
  "Labels": {},
  "UserId": "string"
}
```

:::

::: details `DELETE /api/user/{user-id}` 删除一个用户。他/她的反馈也将被删除。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| user-id | path | string | 用户 ID |

**Response:**

```json
{
  "RowAffected": 0
}
```

:::

::: details `PATCH /api/user/{user-id}` 修改一个用户。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| user-id | path | string | 用户 ID |

**Body:**

```json
{
  "Comment": "string",
  "Labels": {}
}
```

**Response:**

```json
{
  "RowAffected": 0
}
```

:::

::: details `GET /api/user/{user-id}/feedback` 根据用户 ID 获取反馈。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| user-id | path | string | 用户 ID |

**Response:**

```json
[
  {
    "Comment": "string",
    "FeedbackType": "string",
    "ItemId": "string",
    "Timestamp": "2000-01-01T00:00:00Z",
    "Updated": "2000-01-01T00:00:00Z",
    "UserId": "string",
    "Value": 0
  }
]
```

:::

::: details `GET /api/user/{user-id}/feedback/{feedback-type}` 根据用户 ID 和反馈类型获取反馈。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| user-id | path | string | 用户 ID |
| feedback-type | path | string | 反馈类型 |

**Response:**

```json
[
  {
    "Comment": "string",
    "FeedbackType": "string",
    "ItemId": "string",
    "Timestamp": "2000-01-01T00:00:00Z",
    "Updated": "2000-01-01T00:00:00Z",
    "UserId": "string",
    "Value": 0
  }
]
```

:::

::: details `GET /api/user/{user-id}/neighbors` 获取用户的邻居。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| user-id | path | string | 用户 ID |
| n | query | integer | 返回用户的数量 |
| offset | query | integer | 返回用户的偏移量 |

**Response:**

```json
[
  {
    "Id": "string",
    "Score": 0
  }
]
```

:::

::: details `GET /api/users` 列出用户。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |
| n | query | integer | 返回用户的数量 |
| cursor | query | string | 下一页的游标 |

**Response:**

```json
{
  "Cursor": "string",
  "Users": [
    {
      "Comment": "string",
      "Labels": {},
      "UserId": "string"
    }
  ]
}
```

:::

::: details `POST /api/users` 插入用户。

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API 密钥 |

**Body:**

```json
[
  {
    "Comment": "string",
    "Labels": {},
    "UserId": "string"
  }
]
```

**Response:**

```json
{
  "RowAffected": 0
}
```

:::
