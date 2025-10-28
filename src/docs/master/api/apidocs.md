## Users API

::: details POST /api/user 

Insert a user.

#### Request Body

```json
{
  "Comment": "insect",
  "Labels": [
    "crocodilia",
    "cetacean",
    "horse"
  ],
  "Subscribe": [
    "fish",
    "dog",
    "lion"
  ],
  "UserId": "cat"
}
```

#### Response Body

```json
{
  "RowAffected": 1
}
```

:::

::: details GET /api/user/{user-id} 

Get a user.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `user-id` | path | string | ID of the user to get | ✅ |

#### Response Body

```json
{
  "Comment": "insect",
  "Labels": [
    "crocodilia",
    "cetacean",
    "horse"
  ],
  "Subscribe": [
    "fish",
    "dog",
    "lion"
  ],
  "UserId": "cat"
}
```

:::

::: details DELETE /api/user/{user-id} 

Delete a user and his or her feedback.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `user-id` | path | string | ID of the user to delete | ✅ |

#### Response Body

```json
{
  "RowAffected": 1
}
```

:::

::: details PATCH /api/user/{user-id} 

Modify a user.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `user-id` | path | string | ID of the user to modify | ✅ |

#### Request Body

```json
{
  "Comment": "cow",
  "Labels": [
    "dog",
    "lion",
    "fish"
  ],
  "Subscribe": [
    "horse",
    "fish",
    "cat"
  ]
}
```

#### Response Body

```json
{
  "RowAffected": 1
}
```

:::

::: details GET /api/users 

Get users.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `n` | query | integer | Number of returned users |  |
| `cursor` | query | string | Cursor for the next page |  |

#### Response Body

```json
{
  "Cursor": "cat",
  "Users": [
    {
      "Comment": "insect",
      "Labels": [
        "crocodilia",
        "cetacean",
        "horse"
      ],
      "Subscribe": [
        "fish",
        "dog",
        "lion"
      ],
      "UserId": "cat"
    },
    {
      "Comment": "insect",
      "Labels": [
        "crocodilia",
        "cetacean",
        "horse"
      ],
      "Subscribe": [
        "fish",
        "dog",
        "lion"
      ],
      "UserId": "cat"
    },
    {
      "Comment": "insect",
      "Labels": [
        "crocodilia",
        "cetacean",
        "horse"
      ],
      "Subscribe": [
        "fish",
        "dog",
        "lion"
      ],
      "UserId": "cat"
    }
  ]
}
```

:::

::: details POST /api/users 

Insert users.

#### Request Body

```json
[
  {
    "Comment": "insect",
    "Labels": [
      "crocodilia",
      "cetacean",
      "horse"
    ],
    "Subscribe": [
      "fish",
      "dog",
      "lion"
    ],
    "UserId": "cat"
  },
  {
    "Comment": "insect",
    "Labels": [
      "crocodilia",
      "cetacean",
      "horse"
    ],
    "Subscribe": [
      "fish",
      "dog",
      "lion"
    ],
    "UserId": "cat"
  },
  {
    "Comment": "insect",
    "Labels": [
      "crocodilia",
      "cetacean",
      "horse"
    ],
    "Subscribe": [
      "fish",
      "dog",
      "lion"
    ],
    "UserId": "cat"
  }
]
```

#### Response Body

```json
{
  "RowAffected": 1
}
```

:::

## Items API

::: details POST /api/item 

Insert an item. Overwrite if the item exists.

#### Request Body

```json
{
  "Categories": [
    "cetacean",
    "cow",
    "cow"
  ],
  "Comment": "lion",
  "IsHidden": false,
  "ItemId": "cetacean",
  "Labels": [
    "bear",
    "rabbit",
    "dog"
  ],
  "Timestamp": "2020-02-02T20:20:02.02Z"
}
```

#### Response Body

```json
{
  "RowAffected": 1
}
```

:::

::: details GET /api/item/{item-id} 

Get a item.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `item-id` | path | string | ID of the item to get. | ✅ |

#### Response Body

```json
{
  "Categories": [
    "cetacean",
    "cow",
    "cow"
  ],
  "Comment": "lion",
  "IsHidden": false,
  "ItemId": "cetacean",
  "Labels": [
    "bear",
    "rabbit",
    "dog"
  ],
  "Timestamp": "2020-02-02T20:20:02.02Z"
}
```

:::

::: details DELETE /api/item/{item-id} 

Delete an item and its feedback.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `item-id` | path | string | ID of the item to delete | ✅ |

#### Response Body

```json
{
  "RowAffected": 1
}
```

:::

::: details PATCH /api/item/{item-id} 

Modify an item.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `item-id` | path | string | ID of the item to modify | ✅ |

#### Request Body

```json
{
  "Categories": [
    "horse",
    "bear",
    "lion"
  ],
  "Comment": "insect",
  "IsHidden": false,
  "Labels": [
    "fish",
    "fish",
    "insect"
  ],
  "Timestamp": "2020-02-02T20:20:02.02Z"
}
```

#### Response Body

```json
{
  "RowAffected": 1
}
```

:::

::: details PUT /api/item/{item-id}/category/{category} 

Insert a category for a item.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `item-id` | path | string | ID of the item to insert category | ✅ |
| `category` | path | string | Category to insert | ✅ |

#### Response Body

```json
{
  "RowAffected": 1
}
```

:::

::: details DELETE /api/item/{item-id}/category/{category} 

Delete a category from a item.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `item-id` | path | string | ID of the item to delete categoryßßß | ✅ |
| `category` | path | string | Category to delete | ✅ |

#### Response Body

```json
{
  "RowAffected": 1
}
```

:::

::: details GET /api/items 

Get items.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `n` | query | integer | Number of returned items |  |
| `cursor` | query | string | Cursor for the next page |  |

#### Response Body

```json
{
  "Cursor": "fish",
  "Items": [
    {
      "Categories": [
        "cetacean",
        "cow",
        "cow"
      ],
      "Comment": "lion",
      "IsHidden": false,
      "ItemId": "cetacean",
      "Labels": [
        "bear",
        "rabbit",
        "dog"
      ],
      "Timestamp": "2020-02-02T20:20:02.02Z"
    },
    {
      "Categories": [
        "cetacean",
        "cow",
        "cow"
      ],
      "Comment": "lion",
      "IsHidden": false,
      "ItemId": "cetacean",
      "Labels": [
        "bear",
        "rabbit",
        "dog"
      ],
      "Timestamp": "2020-02-02T20:20:02.02Z"
    },
    {
      "Categories": [
        "cetacean",
        "cow",
        "cow"
      ],
      "Comment": "lion",
      "IsHidden": false,
      "ItemId": "cetacean",
      "Labels": [
        "bear",
        "rabbit",
        "dog"
      ],
      "Timestamp": "2020-02-02T20:20:02.02Z"
    }
  ]
}
```

:::

::: details POST /api/items 

Insert items. Overwrite if items exist

#### Request Body

```json
[
  {
    "Categories": [
      "cetacean",
      "cow",
      "cow"
    ],
    "Comment": "lion",
    "IsHidden": false,
    "ItemId": "cetacean",
    "Labels": [
      "bear",
      "rabbit",
      "dog"
    ],
    "Timestamp": "2020-02-02T20:20:02.02Z"
  },
  {
    "Categories": [
      "cetacean",
      "cow",
      "cow"
    ],
    "Comment": "lion",
    "IsHidden": false,
    "ItemId": "cetacean",
    "Labels": [
      "bear",
      "rabbit",
      "dog"
    ],
    "Timestamp": "2020-02-02T20:20:02.02Z"
  },
  {
    "Categories": [
      "cetacean",
      "cow",
      "cow"
    ],
    "Comment": "lion",
    "IsHidden": false,
    "ItemId": "cetacean",
    "Labels": [
      "bear",
      "rabbit",
      "dog"
    ],
    "Timestamp": "2020-02-02T20:20:02.02Z"
  }
]
```

#### Response Body

```json
{
  "RowAffected": 1
}
```

:::

## Feedback API

::: details GET /api/feedback 

Get feedbacks.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `cursor` | query | string | Cursor for the next page |  |
| `n` | query | integer | Number of returned feedback |  |

#### Response Body

```json
{
  "Cursor": "fish",
  "Feedback": [
    {
      "Comment": "crocodilia",
      "FeedbackType": "bird",
      "ItemId": "fish",
      "Timestamp": "2020-02-02T20:20:02.02Z",
      "UserId": "crocodilia"
    },
    {
      "Comment": "crocodilia",
      "FeedbackType": "bird",
      "ItemId": "fish",
      "Timestamp": "2020-02-02T20:20:02.02Z",
      "UserId": "crocodilia"
    },
    {
      "Comment": "crocodilia",
      "FeedbackType": "bird",
      "ItemId": "fish",
      "Timestamp": "2020-02-02T20:20:02.02Z",
      "UserId": "crocodilia"
    }
  ]
}
```

:::

::: details PUT /api/feedback 

Insert feedbacks. Existed feedback will be overwritten.

#### Request Body

```json
[
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  },
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  },
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  }
]
```

#### Response Body

```json
{
  "RowAffected": 1
}
```

:::

::: details POST /api/feedback 

Insert feedbacks. Ignore insertion if feedback exists.

#### Request Body

```json
[
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  },
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  },
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  }
]
```

#### Response Body

```json
{
  "RowAffected": 1
}
```

:::

::: details GET /api/feedback/{feedback-type} 

Get feedbacks with feedback type.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `feedback-type` | path | string | Type of returned feedbacks | ✅ |
| `cursor` | query | string | Cursor for the next page |  |
| `n` | query | integer | Number of returned feedbacks |  |

#### Response Body

```json
{
  "Cursor": "fish",
  "Feedback": [
    {
      "Comment": "crocodilia",
      "FeedbackType": "bird",
      "ItemId": "fish",
      "Timestamp": "2020-02-02T20:20:02.02Z",
      "UserId": "crocodilia"
    },
    {
      "Comment": "crocodilia",
      "FeedbackType": "bird",
      "ItemId": "fish",
      "Timestamp": "2020-02-02T20:20:02.02Z",
      "UserId": "crocodilia"
    },
    {
      "Comment": "crocodilia",
      "FeedbackType": "bird",
      "ItemId": "fish",
      "Timestamp": "2020-02-02T20:20:02.02Z",
      "UserId": "crocodilia"
    }
  ]
}
```

:::

::: details GET /api/feedback/{feedback-type}/{user-id}/{item-id} 

Get feedbacks between a user and a item with feedback type.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `feedback-type` | path | string | Type of returned feedbacks | ✅ |
| `user-id` | path | string | User ID of returned feedbacks | ✅ |
| `item-id` | path | string | Item ID of returned feedbacks | ✅ |

#### Response Body

```json
{
  "Comment": "crocodilia",
  "FeedbackType": "bird",
  "ItemId": "fish",
  "Timestamp": "2020-02-02T20:20:02.02Z",
  "UserId": "crocodilia"
}
```

:::

::: details DELETE /api/feedback/{feedback-type}/{user-id}/{item-id} 

Delete feedbacks between a user and a item with feedback type.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `feedback-type` | path | string | Type of returned feedbacks | ✅ |
| `user-id` | path | string | User ID of returned feedbacks | ✅ |
| `item-id` | path | string | Item ID of returned feedbacks | ✅ |

#### Response Body

```json
{
  "Comment": "crocodilia",
  "FeedbackType": "bird",
  "ItemId": "fish",
  "Timestamp": "2020-02-02T20:20:02.02Z",
  "UserId": "crocodilia"
}
```

:::

::: details GET /api/feedback/{user-id}/{item-id} 

Get feedbacks between a user and a item.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `user-id` | path | string | User ID of returned feedbacks | ✅ |
| `item-id` | path | string | Item ID of returned feedbacks | ✅ |

#### Response Body

```json
[
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  },
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  },
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  }
]
```

:::

::: details DELETE /api/feedback/{user-id}/{item-id} 

Delete feedbacks between a user and a item.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `user-id` | path | string | User ID of returned feedbacks | ✅ |
| `item-id` | path | string | Item ID of returned feedbacks | ✅ |

#### Response Body

```json
[
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  },
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  },
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  }
]
```

:::

::: details GET /api/item/{item-id}/feedback 

Get feedbacks by item id.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `item-id` | path | string | Item ID of returned feedbacks | ✅ |

#### Response Body

```json
[
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  },
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  },
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  }
]
```

:::

::: details GET /api/item/{item-id}/feedback/{feedback-type} 

Get feedbacks by item id with feedback type.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `item-id` | path | string | Item ID of returned feedbacks | ✅ |
| `feedback-type` | path | string | Type of returned feedbacks | ✅ |

#### Response Body

```json
[
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  },
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  },
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  }
]
```

:::

::: details GET /api/user/{user-id}/feedback 

Get feedbacks by user id.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `user-id` | path | string | User ID of returned feedbacks | ✅ |

#### Response Body

```json
[
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  },
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  },
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  }
]
```

:::

::: details GET /api/user/{user-id}/feedback/{feedback-type} 

Get feedbacks by user id with feedback type.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `user-id` | path | string | User ID of returned feedbacks | ✅ |
| `feedback-type` | path | string | Type of returned feedbacks | ✅ |

#### Response Body

```json
[
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  },
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  },
  {
    "Comment": "crocodilia",
    "FeedbackType": "bird",
    "ItemId": "fish",
    "Timestamp": "2020-02-02T20:20:02.02Z",
    "UserId": "crocodilia"
  }
]
```

:::

## Recommendation API

::: details GET /api/item/{item-id}/neighbors 

get neighbors of a item

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `item-id` | path | string | ID of the item to get neighbors | ✅ |
| `n` | query | integer | Number of returned items |  |
| `offset` | query | integer | Offset of returned items |  |

#### Response Body

```json
[
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  },
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  },
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  }
]
```

:::

::: details GET /api/item/{item-id}/neighbors/{category} 

Get neighbors of a item in category.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `item-id` | path | string | ID of the item to get neighbors | ✅ |
| `category` | path | string | Category of returned items | ✅ |
| `n` | query | integer | Number of returned items |  |
| `offset` | query | integer | Offset of returned items |  |

#### Response Body

```json
[
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  },
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  },
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  }
]
```

:::

::: details GET /api/latest 

Get the latest items.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `n` | query | integer | Number of returned items |  |
| `offset` | query | integer | Offset of returned items |  |
| `user-id` | query | string | Remove read items of a user |  |

#### Response Body

```json
[
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  },
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  },
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  }
]
```

:::

::: details GET /api/latest/{category} 

Get the latest items in category.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `category` | path | string | Category of returned items. | ✅ |
| `n` | query | integer | Number of returned items |  |
| `offset` | query | integer | Offset of returned items |  |
| `user-id` | query | string | Remove read items of a user |  |

#### Response Body

```json
[
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  },
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  },
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  }
]
```

:::

::: details GET /api/recommend/{user-id} 

Get recommendation for user.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `user-id` | path | string | ID of the user to get recommendation | ✅ |
| `write-back-type` | query | string | Type of write back feedback |  |
| `write-back-delay` | query | string | Timestamp delay of write back feedback (format 0h0m0s) |  |
| `n` | query | integer | Number of returned items |  |
| `offset` | query | integer | Offset of returned items |  |

#### Response Body

```json
[
  "bird",
  "cow",
  "crocodilia"
]
```

:::

::: details GET /api/recommend/{user-id}/{category} 

Get recommendation for user.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `user-id` | path | string | ID of the user to get recommendation | ✅ |
| `category` | path | string | Category of the returned items | ✅ |
| `write-back-type` | query | string | Type of write back feedback |  |
| `write-back-delay` | query | string | Timestamp delay of write back feedback (format 0h0m0s) |  |
| `n` | query | integer | Number of returned items |  |
| `offset` | query | integer | Offset of returned items |  |

#### Response Body

```json
[
  "cat",
  "insect",
  "horse"
]
```

:::

::: details POST /api/session/recommend 

Get recommendation for session.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `n` | query | integer | Number of returned items |  |
| `offset` | query | integer | Offset of returned items |  |

#### Request Body

```json
[
  {
    "Comment": "rabbit",
    "FeedbackType": "rabbit",
    "ItemId": "horse",
    "Timestamp": "insect",
    "UserId": "fish"
  },
  {
    "Comment": "rabbit",
    "FeedbackType": "rabbit",
    "ItemId": "horse",
    "Timestamp": "insect",
    "UserId": "fish"
  },
  {
    "Comment": "rabbit",
    "FeedbackType": "rabbit",
    "ItemId": "horse",
    "Timestamp": "insect",
    "UserId": "fish"
  }
]
```

#### Response Body

```json
[
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  },
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  },
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  }
]
```

:::

::: details POST /api/session/recommend/{category} 

Get recommendation for session.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `category` | path | string | Category of the returned items | ✅ |
| `n` | query | integer | Number of returned items |  |
| `offset` | query | integer | Offset of returned items |  |

#### Request Body

```json
[
  {
    "Comment": "rabbit",
    "FeedbackType": "rabbit",
    "ItemId": "horse",
    "Timestamp": "insect",
    "UserId": "fish"
  },
  {
    "Comment": "rabbit",
    "FeedbackType": "rabbit",
    "ItemId": "horse",
    "Timestamp": "insect",
    "UserId": "fish"
  },
  {
    "Comment": "rabbit",
    "FeedbackType": "rabbit",
    "ItemId": "horse",
    "Timestamp": "insect",
    "UserId": "fish"
  }
]
```

#### Response Body

```json
[
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  },
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  },
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  }
]
```

:::

::: details GET /api/user/{user-id}/neighbors 

Get neighbors of a user.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `user-id` | path | string | ID of the user to get neighbors | ✅ |
| `n` | query | integer | Number of returned users |  |
| `offset` | query | integer | Offset of returned users |  |

#### Response Body

```json
[
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  },
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  },
  {
    "Id": "crocodilia",
    "Score": 3.1415926
  }
]
```

:::

## Health API

::: details GET /api/health/live 

Probe the liveness of this node. Return OK once the server starts.

#### Response Body

```json
{
  "CacheStoreConnected": false,
  "CacheStoreError": "Nothing's Gonna Stop Us Now",
  "DataStoreConnected": false,
  "DataStoreError": "I Fall to Pieces",
  "Ready": false
}
```

:::

::: details GET /api/health/ready 

Probe the readiness of this node. Return OK if the server is able to handle requests.

#### Response Body

```json
{
  "CacheStoreConnected": false,
  "CacheStoreError": "Nothing's Gonna Stop Us Now",
  "DataStoreConnected": false,
  "DataStoreError": "I Fall to Pieces",
  "Ready": false
}
```

:::

