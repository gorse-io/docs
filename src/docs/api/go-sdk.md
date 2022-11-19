---
icon: go
---
# Go SDK

::: warning
The Go SDK is under development, APIs might be changed in later versions. Pull requests are welcomed: https://github.com/gorse-io/gorse/tree/master/client
:::

## Install

```bash
go get github.com/zhenghaoz/gorse/client@master
```

## Usage

#### Create Client

```go
func NewGorseClient(entryPoint, apiKey string) *GorseClient
```

Create a Gorse client.

**Parameters**

| Name | Description |
|-|-|
| entryPoint | URL of the server node |
| apiKey | Authorization API key |

**Return**

The Gorse Client.

**Example**

```go
gorse := client.NewGorseClient("http://127.0.0.1:8087", "api_key")
```

### Items APIs

#### Insert Item

```go
func (c *GorseClient) InsertItem(ctx context.Context, item Item) (RowAffected, error)
```

Insert an item. Overwrite if the item exists.

**Parameters**
| Name | Description |
|-|-|
| ctx | context for http request |
| item | the item need to be inserted |

**Return**
```go
type RowAffected struct {
	RowAffected int `json:"RowAffected"`
}
```

**Example**

```go
item := Item{
    ItemId:     "100",
    IsHidden:   true,
    Labels:     []string{"a", "b", "c"},
    Categories: []string{"d", "e"},
    Timestamp:  timestamp,
    Comment:    "comment",
}
rowAffected, err := gorse.InsertItem(context.Background(), item)
```

#### Get Item

```go
func (c *GorseClient) GetItem(ctx context.Context, itemId string) (Item, error)
```

Get a item.

**Parameters**

| Name | Description |
|-|-|
| ctx | context for http request |
| itemId | id of item |

**Return**

```go
type Item struct {
	ItemId     string   `json:"ItemId"`
	IsHidden   bool     `json:"IsHidden"`
	Labels     []string `json:"Labels"`
	Categories []string `json:"Categories"`
	Timestamp  string   `json:"Timestamp"`
	Comment    string   `json:"Comment"`
}
```

**Example**

```go
gorse.GetItem(context.Background(), "100")
```

#### Delete Item

```go
func (c *GorseClient) DeleteItem(ctx context.Context, itemId string) (RowAffected, error)
```

Delete an item and its feedback.

**Parameters**

| Name | Description |
|-|-|
| ctx | context for http request |
| itemId | id of item |

**Return**

```go
type RowAffected struct {
	RowAffected int `json:"RowAffected"`
}
```

**Example**

```go
gorse.DeleteItem(context.Background(), "100")
```



### Users APIs
#### Insert User

```go
func (c *GorseClient) InsertUser(ctx context.Context, user User) (RowAffected, error)
```
Insert a user.

**Parameters**
| Name | Description |
|-|-|
| ctx | context for http request |
| user | the user need to be inserted |

**Return**
```go
type RowAffected struct {
	RowAffected int `json:"RowAffected"`
}
```

**Example**

```go
user := User{
    UserId:    "100",
    Labels:    []string{"a", "b", "c"},
    Subscribe: []string{"d", "e"},
    Comment:   "comment",
}
rowAffected, err := gorse.InsertUser(context.Background(), user)
```

#### Get User

```go
func (c *GorseClient) GetUser(ctx context.Context, userId string) (User, error)
```
Get a user.

**Parameters**
| Name | Description |
|-|-|
| ctx | context for http request |
| userId | id of user |

**Return**
```go
type User struct {
	UserId    string   `json:"UserId"`
	Labels    []string `json:"Labels"`
	Subscribe []string `json:"Subscribe"`
	Comment   string   `json:"Comment"`
}
```

**Example**

```go
gorse.GetUser(context.Background(), "100")
```

#### Delete User

```go
func (c *GorseClient) DeleteUser(ctx context.Context, userId string) (RowAffected, error)
```

Delete a user and his or her feedback.

**Parameters**
| Name | Description |
|-|-|
| ctx | context for http request |
| userId | id of user |

**Return**
```go
type RowAffected struct {
	RowAffected int `json:"RowAffected"`
}
```

**Example**

```go
gorse.DeleteUser(context.Background(), "100")
```


### Feedback APIs

#### Insert Feedbacks

```go
func (c *GorseClient) InsertFeedback(ctx context.Context, feedbacks []Feedback) (RowAffected, error)
```

Insert feedbacks. Ignore insertion if feedback exists.

**Parameters**
| Name | Description |
|-|-|
| ctx | context for http request |
| feedbacks | feedbacks need to be inserted |

**Return**

```go
type RowAffected struct {
	RowAffected int `json:"RowAffected"`
}
```

**Example**

```go
gorse.InsertFeedback(context.Background(), []client.Feedback{
    {FeedbackType: "star", UserId: "bob", ItemId: "vuejs:vue", Timestamp: "2022-02-24"},
    {FeedbackType: "star", UserId: "bob", ItemId: "d3:d3", Timestamp: "2022-02-25"},
    {FeedbackType: "star", UserId: "bob", ItemId: "dogfalo:materialize", Timestamp: "2022-02-26"},
    {FeedbackType: "star", UserId: "bob", ItemId: "mozilla:pdf.js", Timestamp: "2022-02-27"},
    {FeedbackType: "star", UserId: "bob", ItemId: "moment:moment", Timestamp: "2022-02-28"},
})
```

#### List Feedbacks

```go
func (c *GorseClient) ListFeedbacks(ctx context.Context, feedbackType, userId string) ([]Feedback, error)
```
Get feedback by user id with feedback type.
**Parameters**

| Name | Description |
|-|-|
| ctx | context for http request |
| feedbackType | feedback type |
| userId | id of user |

**Return**
```go
[]Feedback
```

**Example**
```go
gorse.ListFeedbacks(context.Background(), "read","800")
```

#### Insert Feedbacks
```go
func (c *GorseClient) InsertFeedback(ctx context.Context, feedbacks []Feedback) (RowAffected, error)
```

Insert feedbacks. Ignore insertion if feedback exists.
**Parameters**

| Name | Description |
|-|-|
| ctx | context for http request |
| feedbacks | feedbacks need to be inserted |

**Return**
```go
type RowAffected struct {
	RowAffected int `json:"RowAffected"`
}
```

**Example**
```go
gorse.InsertFeedback(context.Background(), []client.Feedback{
    {FeedbackType: "star", UserId: "bob", ItemId: "vuejs:vue", Timestamp: "2022-02-24"},
    {FeedbackType: "star", UserId: "bob", ItemId: "d3:d3", Timestamp: "2022-02-25"},
    {FeedbackType: "star", UserId: "bob", ItemId: "dogfalo:materialize", Timestamp: "2022-02-26"},
    {FeedbackType: "star", UserId: "bob", ItemId: "mozilla:pdf.js", Timestamp: "2022-02-27"},
    {FeedbackType: "star", UserId: "bob", ItemId: "moment:moment", Timestamp: "2022-02-28"},
})
```

### Recommend APIs

#### Get Recommend

```go
func (c *GorseClient) GetRecommend(ctx context.Context, userId string, category string, n int) ([]string, error)
```

Get recommendation for user.

**Parameters**

| Name | Description |
|-|-|
| ctx | context for http request |
| userId | id of user |
| category | the category of recommended items |
| n | the number of return n recommend records |

**Return**
```go
[]string
```

**Example**

```go
gorse.GetRecommend(context.Background(), "bob", "", 10)
```

#### Session Recommend
```go
func (c *GorseClient) SessionRecommend(ctx context.Context, feedbacks []Feedback, n int) ([]Score, error) 
```

Get recommendation for session.

**Parameters**
| Name | Description |
|-|-|
| ctx | context for http request |
| feedbacks | feekbacks in session |

**Return**
```go
[]Score
```

**Example**
```go
gorse.SessionRecommend(ctx, []Feedback{
    {
        FeedbackType: feedbackType,
        UserId:       userId,
        ItemId:       "1",
        Timestamp:    timestamp,
    },
    {
        FeedbackType: feedbackType,
        UserId:       userId,
        ItemId:       "2",
        Timestamp:    timestamp,
    },
    {
        FeedbackType: feedbackType,
        UserId:       userId,
        ItemId:       "3",
        Timestamp:    timestamp,
    },
    {
        FeedbackType: feedbackType,
        UserId:       userId,
        ItemId:       "4",
        Timestamp:    timestamp,
    },
}, 3)
```

#### Get Neighbors

```go
func (c *GorseClient) GetNeighbors(ctx context.Context, itemId string, n int) ([]Score, error)
```
get neighbors of a item

**Parameters**
| Name | Description |
|-|-|
| ctx | context for http request |
| itemId | id of item |
| n | number of scores |

**Return**
```go
[]Score{{
    Id:    "id",
    Score: 0,
}}
```


**Example**
```go
gorse.GetNeighbors(ctx, "100", 3)
```