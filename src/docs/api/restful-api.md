---
icon: http
---
# RESTful APIs

RESTful APIs provided by the Gorse server are listed in this section. For more detailed information, please browse the interactive API document at:

`http://<server_node_IP>:<server_node_port>/apidocs`.

## Authorization

By default, there is no authorization required for RESTful APIs. Authorization can be enabled by set `api_key` in the config file. The API key is passed through `X-API-Key` header.

```bash
curl -H "X-API-Key: *****"  http://127.0.0.1:8087/api/recommend/bob?n=10
```

::: tip

The API key is defined in the [`[server]`](/docs/config#server) section in the configuration file:

```toml
[server]

# Secret key for RESTful APIs (SSL required).
api_key = ""
```

:::


## API Endpoints

::: details `GET /api/collaborative-filtering/{user-id}` Get collaborative filtering recommendation for a user.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | User ID |
| n | query | integer | Number of returned items |
| offset | query | integer | Offset of returned items |
| category | query | string | Category of returned items. |
| user-id | query | string | Remove read items of a user |

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

::: details `GET /api/feedback` List feedbacks.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| cursor | query | string | Cursor for the next page |
| n | query | integer | Number of returned feedback |

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

::: details `PUT /api/feedback` Insert feedbacks. Existed feedback will be overwritten.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |

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

::: details `POST /api/feedback` Insert feedbacks. Accumulate value if feedback already exists.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |

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

::: details `GET /api/feedback/{feedback-type}` List feedbacks with feedback type.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| feedback-type | path | string | Feedback type |
| cursor | query | string | Cursor for the next page |
| n | query | integer | Number of returned feedbacks |

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

::: details `GET /api/feedback/{feedback-type}/{user-id}/{item-id}` Get feedbacks between a user and a item with feedback type.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| feedback-type | path | string | Feedback type |
| user-id | path | string | User ID |
| item-id | path | string | Item ID |

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

::: details `DELETE /api/feedback/{feedback-type}/{user-id}/{item-id}` Delete feedbacks between a user and a item with feedback type.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| feedback-type | path | string | Feedback type |
| user-id | path | string | User ID |
| item-id | path | string | Item ID |

**Response:**

```json
{
  "RowAffected": 0
}
```

:::

::: details `GET /api/feedback/{user-id}/{item-id}` List feedbacks between a user and a item.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | User ID |
| item-id | path | string | Item ID |

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

::: details `DELETE /api/feedback/{user-id}/{item-id}` Delete feedbacks between a user and a item.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | User ID |
| item-id | path | string | Item ID |

**Response:**

```json
{
  "RowAffected": 0
}
```

:::

::: details `GET /api/health/live` Probe the liveness of this node. Return OK once the server starts.

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

::: details `GET /api/health/ready` Probe the readiness of this node. Return OK if the server is able to handle requests.

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

::: details `POST /api/item` Insert an item.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |

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

::: details `GET /api/item-to-item/{name}/{item-id}` Get item-to-item recommendation.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| name | path | string | Name of the item-to-item recommendation |
| item-id | path | string | Item ID |
| n | query | integer | Number of returned items |
| offset | query | integer | Offset of returned items |
| category | query | string | Category of returned items |
| user-id | query | string | Remove read items of a user |

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

::: details `GET /api/item/{item-id}` Get an item.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| item-id | path | string | Item ID. |

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

::: details `DELETE /api/item/{item-id}` Delete an item and its feedback.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| item-id | path | string | Item ID |

**Response:**

```json
{
  "RowAffected": 0
}
```

:::

::: details `PATCH /api/item/{item-id}` Modify an item.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| item-id | path | string | Item ID |

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

::: details `PUT /api/item/{item-id}/category/{category}` Insert a category for a item.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| item-id | path | string | Item ID |
| category | path | string | Category to insert |

**Response:**

```json
{
  "RowAffected": 0
}
```

:::

::: details `DELETE /api/item/{item-id}/category/{category}` Delete a category from a item.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| item-id | path | string | Item ID |
| category | path | string | Category to delete |

**Response:**

```json
{
  "RowAffected": 0
}
```

:::

::: details `GET /api/item/{item-id}/feedback` Get feedbacks by item id.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| item-id | path | string | Item ID |

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

::: details `GET /api/item/{item-id}/feedback/{feedback-type}` Get feedbacks by item id with feedback type.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| item-id | path | string | Item ID |
| feedback-type | path | string | Feedback type |

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

::: details `GET /api/item/{item-id}/neighbors` Get neighbors of a item

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| item-id | path | string | Item ID |
| n | query | integer | Number of returned items |
| offset | query | integer | Offset of returned items |
| category | query | string | Category of returned items |
| user-id | query | string | Remove read items of a user |

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

::: details `GET /api/items` List items.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| n | query | integer | Number of returned items |
| cursor | query | string | Cursor for the next page |

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

::: details `POST /api/items` Insert items.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |

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

::: details `GET /api/latest` Get latest items.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| category | query | string | Category of returned items |
| n | query | integer | Number of returned items |
| offset | query | integer | Offset of returned items |
| user-id | query | string | Remove read items of a user |

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

::: details `GET /api/non-personalized/{name}` Get non-personalized recommendations.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| category | query | string | Category of returned items. |
| n | query | integer | Number of returned users |
| offset | query | integer | Offset of returned users |
| user-id | query | string | Remove read items of a user |

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

::: details `GET /api/recommend/{user-id}` Get recommendation for user.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | User ID |
| category | query | string | Category of the returned items (support multi-categories filtering) |
| write-back-type | query | string | Type of write back feedback |
| write-back-delay | query | string | Timestamp delay of write back feedback (format 0h0m0s) |
| n | query | integer | Number of returned items |
| offset | query | integer | Offset of returned items |

**Response:**

```json
[
  "string"
]
```

:::

::: details `POST /api/session/recommend` Get recommendation for session.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| n | query | integer | Number of returned items |
| offset | query | integer | Offset of returned items |

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

::: details `POST /api/user` Insert a user.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |

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

::: details `GET /api/user-to-user/{name}/{user-id}` Get user-to-user recommendation.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| name | path | string | Name of the user-to-user recommendation |
| user-id | path | string | User ID |
| n | query | integer | Number of returned users |
| offset | query | integer | Offset of returned users |

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

::: details `GET /api/user/{user-id}` Get a user.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | User ID |

**Response:**

```json
{
  "Comment": "string",
  "Labels": {},
  "UserId": "string"
}
```

:::

::: details `DELETE /api/user/{user-id}` Delete a user. His or her feedback will also be deleted.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | User ID |

**Response:**

```json
{
  "RowAffected": 0
}
```

:::

::: details `PATCH /api/user/{user-id}` Modify a user.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | User ID |

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

::: details `GET /api/user/{user-id}/feedback` Get feedbacks by user id.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | User ID |

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

::: details `GET /api/user/{user-id}/feedback/{feedback-type}` Get feedbacks by user id with feedback type.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | User ID |
| feedback-type | path | string | Feedback type |

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

::: details `GET /api/user/{user-id}/neighbors` Get neighbors of a user.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | User ID |
| n | query | integer | Number of returned users |
| offset | query | integer | Offset of returned users |

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

::: details `GET /api/users` List users.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| n | query | integer | Number of returned users |
| cursor | query | string | Cursor for the next page |

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

::: details `POST /api/users` Insert users.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |

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

