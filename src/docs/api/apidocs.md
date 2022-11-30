## Users API

::: details POST /api/user 

Insert a user.

#### Request Body

```json
{
  "Comment": "per",
  "Labels": [
    "invoice",
    "plastic",
    "monte"
  ],
  "Subscribe": [
    "arsenic",
    "west",
    "magnetic"
  ],
  "UserId": "chicken"
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
  "Comment": "per",
  "Labels": [
    "invoice",
    "plastic",
    "monte"
  ],
  "Subscribe": [
    "arsenic",
    "west",
    "magnetic"
  ],
  "UserId": "chicken"
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
  "Comment": "copying",
  "Labels": [
    "indexing",
    "foolishly",
    "gender"
  ],
  "Subscribe": [
    "smart",
    "frozen",
    "vero"
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
  "Cursor": "woot",
  "Users": [
    {
      "Comment": "per",
      "Labels": [
        "invoice",
        "plastic",
        "monte"
      ],
      "Subscribe": [
        "arsenic",
        "west",
        "magnetic"
      ],
      "UserId": "chicken"
    },
    {
      "Comment": "per",
      "Labels": [
        "invoice",
        "plastic",
        "monte"
      ],
      "Subscribe": [
        "arsenic",
        "west",
        "magnetic"
      ],
      "UserId": "chicken"
    },
    {
      "Comment": "per",
      "Labels": [
        "invoice",
        "plastic",
        "monte"
      ],
      "Subscribe": [
        "arsenic",
        "west",
        "magnetic"
      ],
      "UserId": "chicken"
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
    "Comment": "per",
    "Labels": [
      "invoice",
      "plastic",
      "monte"
    ],
    "Subscribe": [
      "arsenic",
      "west",
      "magnetic"
    ],
    "UserId": "chicken"
  },
  {
    "Comment": "per",
    "Labels": [
      "invoice",
      "plastic",
      "monte"
    ],
    "Subscribe": [
      "arsenic",
      "west",
      "magnetic"
    ],
    "UserId": "chicken"
  },
  {
    "Comment": "per",
    "Labels": [
      "invoice",
      "plastic",
      "monte"
    ],
    "Subscribe": [
      "arsenic",
      "west",
      "magnetic"
    ],
    "UserId": "chicken"
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
    "veum",
    "turkmenistan",
    "confess"
  ],
  "Comment": "website",
  "IsHidden": false,
  "ItemId": "north",
  "Labels": [
    "hampshire",
    "jazz",
    "gosh"
  ],
  "Timestamp": "2022-11-01T12:34:31.378Z"
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
    "veum",
    "turkmenistan",
    "confess"
  ],
  "Comment": "website",
  "IsHidden": false,
  "ItemId": "north",
  "Labels": [
    "hampshire",
    "jazz",
    "gosh"
  ],
  "Timestamp": "2022-11-01T12:34:31.378Z"
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
    "dodge",
    "content",
    "account"
  ],
  "Comment": "handcrafted",
  "IsHidden": false,
  "Labels": [
    "directional",
    "payment",
    "account"
  ],
  "Timestamp": "2022-10-16T00:07:11.105Z"
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
  "Cursor": "nut",
  "Items": [
    {
      "Categories": [
        "veum",
        "turkmenistan",
        "confess"
      ],
      "Comment": "website",
      "IsHidden": false,
      "ItemId": "north",
      "Labels": [
        "hampshire",
        "jazz",
        "gosh"
      ],
      "Timestamp": "2022-11-01T12:34:31.378Z"
    },
    {
      "Categories": [
        "veum",
        "turkmenistan",
        "confess"
      ],
      "Comment": "website",
      "IsHidden": false,
      "ItemId": "north",
      "Labels": [
        "hampshire",
        "jazz",
        "gosh"
      ],
      "Timestamp": "2022-11-01T12:34:31.378Z"
    },
    {
      "Categories": [
        "veum",
        "turkmenistan",
        "confess"
      ],
      "Comment": "website",
      "IsHidden": false,
      "ItemId": "north",
      "Labels": [
        "hampshire",
        "jazz",
        "gosh"
      ],
      "Timestamp": "2022-11-01T12:34:31.378Z"
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
      "veum",
      "turkmenistan",
      "confess"
    ],
    "Comment": "website",
    "IsHidden": false,
    "ItemId": "north",
    "Labels": [
      "hampshire",
      "jazz",
      "gosh"
    ],
    "Timestamp": "2022-11-01T12:34:31.378Z"
  },
  {
    "Categories": [
      "veum",
      "turkmenistan",
      "confess"
    ],
    "Comment": "website",
    "IsHidden": false,
    "ItemId": "north",
    "Labels": [
      "hampshire",
      "jazz",
      "gosh"
    ],
    "Timestamp": "2022-11-01T12:34:31.378Z"
  },
  {
    "Categories": [
      "veum",
      "turkmenistan",
      "confess"
    ],
    "Comment": "website",
    "IsHidden": false,
    "ItemId": "north",
    "Labels": [
      "hampshire",
      "jazz",
      "gosh"
    ],
    "Timestamp": "2022-11-01T12:34:31.378Z"
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
  "Cursor": "rhodium",
  "Feedback": [
    {
      "Comment": "boynton",
      "FeedbackType": "synthesizing",
      "ItemId": "copying",
      "Timestamp": "2022-01-12T13:38:15.748Z",
      "UserId": "keyboard"
    },
    {
      "Comment": "boynton",
      "FeedbackType": "synthesizing",
      "ItemId": "copying",
      "Timestamp": "2022-01-12T13:38:15.748Z",
      "UserId": "keyboard"
    },
    {
      "Comment": "boynton",
      "FeedbackType": "synthesizing",
      "ItemId": "copying",
      "Timestamp": "2022-01-12T13:38:15.748Z",
      "UserId": "keyboard"
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
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
  },
  {
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
  },
  {
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
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
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
  },
  {
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
  },
  {
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
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
  "Cursor": "rhodium",
  "Feedback": [
    {
      "Comment": "boynton",
      "FeedbackType": "synthesizing",
      "ItemId": "copying",
      "Timestamp": "2022-01-12T13:38:15.748Z",
      "UserId": "keyboard"
    },
    {
      "Comment": "boynton",
      "FeedbackType": "synthesizing",
      "ItemId": "copying",
      "Timestamp": "2022-01-12T13:38:15.748Z",
      "UserId": "keyboard"
    },
    {
      "Comment": "boynton",
      "FeedbackType": "synthesizing",
      "ItemId": "copying",
      "Timestamp": "2022-01-12T13:38:15.748Z",
      "UserId": "keyboard"
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
  "Comment": "boynton",
  "FeedbackType": "synthesizing",
  "ItemId": "copying",
  "Timestamp": "2022-01-12T13:38:15.748Z",
  "UserId": "keyboard"
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
  "Comment": "boynton",
  "FeedbackType": "synthesizing",
  "ItemId": "copying",
  "Timestamp": "2022-01-12T13:38:15.748Z",
  "UserId": "keyboard"
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
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
  },
  {
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
  },
  {
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
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
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
  },
  {
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
  },
  {
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
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
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
  },
  {
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
  },
  {
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
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
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
  },
  {
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
  },
  {
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
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
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
  },
  {
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
  },
  {
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
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
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
  },
  {
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
  },
  {
    "Comment": "boynton",
    "FeedbackType": "synthesizing",
    "ItemId": "copying",
    "Timestamp": "2022-01-12T13:38:15.748Z",
    "UserId": "keyboard"
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
    "Id": "gasoline",
    "Score": 0.7340646507275475
  },
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
  },
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
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
    "Id": "gasoline",
    "Score": 0.7340646507275475
  },
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
  },
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
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
    "Id": "gasoline",
    "Score": 0.7340646507275475
  },
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
  },
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
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
    "Id": "gasoline",
    "Score": 0.7340646507275475
  },
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
  },
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
  }
]
```

:::

::: details GET /api/popular 

Get popular items.

#### Parameters

| Name | Locate | Type | Description | Required | 
|-|-|-|-|-|
| `n` | query | integer | Number of returned recommendations |  |
| `offset` | query | integer | Offset of returned recommendations |  |
| `user-id` | query | string | Remove read items of a user |  |

#### Response Body

```json
[
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
  },
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
  },
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
  }
]
```

:::

::: details GET /api/popular/{category} 

Get popular items in category.

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
    "Id": "gasoline",
    "Score": 0.7340646507275475
  },
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
  },
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
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
  "hacking",
  "east",
  "north"
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
  "division",
  "manager",
  "reggae"
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
    "Comment": "magenta",
    "FeedbackType": "west",
    "ItemId": "chlorine",
    "Timestamp": "nissan",
    "UserId": "chevrolet"
  },
  {
    "Comment": "magenta",
    "FeedbackType": "west",
    "ItemId": "chlorine",
    "Timestamp": "nissan",
    "UserId": "chevrolet"
  },
  {
    "Comment": "magenta",
    "FeedbackType": "west",
    "ItemId": "chlorine",
    "Timestamp": "nissan",
    "UserId": "chevrolet"
  }
]
```

#### Response Body

```json
[
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
  },
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
  },
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
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
    "Comment": "magenta",
    "FeedbackType": "west",
    "ItemId": "chlorine",
    "Timestamp": "nissan",
    "UserId": "chevrolet"
  },
  {
    "Comment": "magenta",
    "FeedbackType": "west",
    "ItemId": "chlorine",
    "Timestamp": "nissan",
    "UserId": "chevrolet"
  },
  {
    "Comment": "magenta",
    "FeedbackType": "west",
    "ItemId": "chlorine",
    "Timestamp": "nissan",
    "UserId": "chevrolet"
  }
]
```

#### Response Body

```json
[
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
  },
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
  },
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
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
    "Id": "gasoline",
    "Score": 0.7340646507275475
  },
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
  },
  {
    "Id": "gasoline",
    "Score": 0.7340646507275475
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
  "CacheStoreError": "I Can't Get Next to You",
  "DataStoreConnected": false,
  "DataStoreError": "My Girl",
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
  "CacheStoreError": "I Can't Get Next to You",
  "DataStoreConnected": false,
  "DataStoreError": "My Girl",
  "Ready": false
}
```

:::

