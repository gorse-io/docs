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



### Users APIs

### Feedback APIs

#### Insert Feedbacks

```go
func (c *GorseClient) InsertFeedback(feedbacks []Feedback) (RowAffected, error)
```

```go
gorse.InsertFeedback([]client.Feedback{
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
func (c *GorseClient) GetRecommend(userId string, category string, n int) ([]string, error)
```

```go
gorse.GetRecommend("bob", "", 10)
```
