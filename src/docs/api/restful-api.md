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

The API key is defined in [the configuration file](/docs/config):

```toml
[server]

# Secret key for RESTful APIs (SSL required).
api_key = ""
```

:::


## API Endpoints

::: details `GET /api/collaborative-filtering/{user-id}` Get the collaborative filtering recommendation for a user

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | ID of the user to get recommendation |
| n | query | integer | Number of returned items |
| offset | query | integer | Offset of returned items |

:::

::: details `GET /api/collaborative-filtering/{user-id}/{category}` Get the collaborative filtering recommendation for a user

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | ID of the user to get recommendation |
| category | path | string | Category of returned items. |
| n | query | integer | Number of returned items |
| offset | query | integer | Offset of returned items |

:::

::: details `GET /api/feedback` Get feedbacks.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| cursor | query | string | Cursor for the next page |
| n | query | integer | Number of returned feedback |

:::

::: details `PUT /api/feedback` Insert feedbacks. Existed feedback will be overwritten.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| body | body | `[]Feedback` |  |

:::

::: details `POST /api/feedback` Insert feedbacks. Ignore insertion if feedback exists.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| body | body | `[]Feedback` |  |

:::

::: details `GET /api/feedback/{feedback-type}` Get feedbacks with feedback type.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| feedback-type | path | string | Type of returned feedbacks |
| cursor | query | string | Cursor for the next page |
| n | query | integer | Number of returned feedbacks |

:::

::: details `GET /api/feedback/{feedback-type}/{user-id}/{item-id}` Get feedbacks between a user and a item with feedback type.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| feedback-type | path | string | Type of returned feedbacks |
| user-id | path | string | User ID of returned feedbacks |
| item-id | path | string | Item ID of returned feedbacks |

:::

::: details `DELETE /api/feedback/{feedback-type}/{user-id}/{item-id}` Delete feedbacks between a user and a item with feedback type.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| feedback-type | path | string | Type of returned feedbacks |
| user-id | path | string | User ID of returned feedbacks |
| item-id | path | string | Item ID of returned feedbacks |

:::

::: details `GET /api/feedback/{user-id}/{item-id}` Get feedbacks between a user and a item.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | User ID of returned feedbacks |
| item-id | path | string | Item ID of returned feedbacks |

:::

::: details `DELETE /api/feedback/{user-id}/{item-id}` Delete feedbacks between a user and a item.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | User ID of returned feedbacks |
| item-id | path | string | Item ID of returned feedbacks |

:::

::: details `GET /api/health/live` Probe the liveness of this node. Return OK once the server starts.

**Parameters:** None

:::

::: details `GET /api/health/ready` Probe the readiness of this node. Return OK if the server is able to handle requests.

**Parameters:** None

:::

::: details `POST /api/item` Insert an item. Overwrite if the item exists.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| body | body | `Item` |  |

:::

::: details `GET /api/item-to-item/{name}/{item-id}` Get item-to-item recommendation.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| name | path | string | Name of the item-to-item recommendation |
| item-id | path | string | ID of the item to get neighbors |
| n | query | integer | Number of returned items |
| offset | query | integer | Offset of returned items |

:::

::: details `GET /api/item/{item-id}` Get a item.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| item-id | path | string | ID of the item to get. |

:::

::: details `DELETE /api/item/{item-id}` Delete an item and its feedback.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| item-id | path | string | ID of the item to delete |

:::

::: details `PATCH /api/item/{item-id}` Modify an item.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| item-id | path | string | ID of the item to modify |
| body | body | `ItemPatch` |  |

:::

::: details `PUT /api/item/{item-id}/category/{category}` Insert a category for a item.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| item-id | path | string | ID of the item to insert category |
| category | path | string | Category to insert |

:::

::: details `DELETE /api/item/{item-id}/category/{category}` Delete a category from a item.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| item-id | path | string | ID of the item to delete categoryßßß |
| category | path | string | Category to delete |

:::

::: details `GET /api/item/{item-id}/feedback` Get feedbacks by item id.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| item-id | path | string | Item ID of returned feedbacks |

:::

::: details `GET /api/item/{item-id}/feedback/{feedback-type}` Get feedbacks by item id with feedback type.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| item-id | path | string | Item ID of returned feedbacks |
| feedback-type | path | string | Type of returned feedbacks |

:::

::: details `GET /api/item/{item-id}/neighbors` Get neighbors of a item

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| item-id | path | string | ID of the item to get neighbors |
| n | query | integer | Number of returned items |
| offset | query | integer | Offset of returned items |

:::

::: details `GET /api/item/{item-id}/neighbors/{category}` Get neighbors of a item in category.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| item-id | path | string | ID of the item to get neighbors |
| category | path | string | Category of returned items |
| n | query | integer | Number of returned items |
| offset | query | integer | Offset of returned items |

:::

::: details `GET /api/items` Get items.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| n | query | integer | Number of returned items |
| cursor | query | string | Cursor for the next page |

:::

::: details `POST /api/items` Insert items. Overwrite if items exist

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| body | body | `[]Item` |  |

:::

::: details `GET /api/latest` Get the latest items.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| category | query | string | Category of returned items |
| n | query | integer | Number of returned items |
| offset | query | integer | Offset of returned items |
| user-id | query | string | Remove read items of a user |

:::

::: details `GET /api/latest/{category}` Get the latest items in category.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| category | path | string | Category of returned items. |
| n | query | integer | Number of returned items |
| offset | query | integer | Offset of returned items |
| user-id | query | string | Remove read items of a user |

:::

::: details `GET /api/measurements/{name}` Get measurements.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| name | path | string | Name of returned measurements |
| n | query | integer | Number of returned measurements |

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

:::

::: details `GET /api/recommend/{user-id}` Get recommendation for user.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | ID of the user to get recommendation |
| category | query | string | Category of the returned items (support multi-categories filtering) |
| write-back-type | query | string | Type of write back feedback |
| write-back-delay | query | string | Timestamp delay of write back feedback (format 0h0m0s) |
| n | query | integer | Number of returned items |
| offset | query | integer | Offset of returned items |

:::

::: details `GET /api/recommend/{user-id}/{category}` Get recommendation for user.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | ID of the user to get recommendation |
| category | path | string | Category of the returned items |
| write-back-type | query | string | Type of write back feedback |
| write-back-delay | query | string | Timestamp delay of write back feedback (format 0h0m0s) |
| n | query | integer | Number of returned items |
| offset | query | integer | Offset of returned items |

:::

::: details `POST /api/session/recommend` Get recommendation for session.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| n | query | integer | Number of returned items |
| offset | query | integer | Offset of returned items |
| body | body | `[]Feedback` |  |

:::

::: details `POST /api/session/recommend/{category}` Get recommendation for session.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| category | path | string | Category of the returned items |
| n | query | integer | Number of returned items |
| offset | query | integer | Offset of returned items |
| body | body | `[]Feedback` |  |

:::

::: details `POST /api/user` Insert a user.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| body | body | `User` |  |

:::

::: details `GET /api/user-to-user/neighbors/{user-id}` Get user-to-user recommendation.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| name | path | string | Name of the user-to-user recommendation |
| user-id | path | string | ID of the user to get neighbors |
| n | query | integer | Number of returned users |
| offset | query | integer | Offset of returned users |

:::

::: details `GET /api/user/{user-id}` Get a user.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | ID of the user to get |

:::

::: details `DELETE /api/user/{user-id}` Delete a user and his or her feedback.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | ID of the user to delete |

:::

::: details `PATCH /api/user/{user-id}` Modify a user.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | ID of the user to modify |
| body | body | `UserPatch` |  |

:::

::: details `GET /api/user/{user-id}/feedback` Get feedbacks by user id.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | User ID of returned feedbacks |

:::

::: details `GET /api/user/{user-id}/feedback/{feedback-type}` Get feedbacks by user id with feedback type.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | User ID of returned feedbacks |
| feedback-type | path | string | Type of returned feedbacks |

:::

::: details `GET /api/user/{user-id}/neighbors` Get neighbors of a user.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| user-id | path | string | ID of the user to get neighbors |
| n | query | integer | Number of returned users |
| offset | query | integer | Offset of returned users |

:::

::: details `GET /api/users` Get users.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| n | query | integer | Number of returned users |
| cursor | query | string | Cursor for the next page |

:::

::: details `POST /api/users` Insert users.

**Parameters:**

| Name | In | Type | Description |
| ---- | -- | ---- | ----------- |
| X-API-Key | header | string | API key |
| body | body | `[]User` |  |

:::

