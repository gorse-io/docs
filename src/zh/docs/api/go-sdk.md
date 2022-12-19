---
icon: go
---

# Go SDK

::: warning

Go SDK 正在开发中， API 可能会在以后的版本中更改。欢迎贡献代码：https://github.com/gorse-io/gorse/tree/master/client

:::

[](https://pkg.go.dev/github.com/zhenghaoz/gorse/client)![GoDoc](https://godoc.org/github.com/zhenghaoz/gorse?status.svg)

## 安装

```bash
go get github.com/zhenghaoz/gorse/client@master
```

## 用法

```go
import "github.com/zhenghaoz/gorse/client"

func main() {
    // Create a client
    gorse := client.NewGorseClient("http://127.0.0.1:8087", "api_key")

    // Insert feedback
    gorse.InsertFeedback([]client.Feedback{
        {FeedbackType: "star", UserId: "bob", ItemId: "vuejs:vue", Timestamp: "2022-02-24"},
        {FeedbackType: "star", UserId: "bob", ItemId: "d3:d3", Timestamp: "2022-02-25"},
        {FeedbackType: "star", UserId: "bob", ItemId: "dogfalo:materialize", Timestamp: "2022-02-26"},
        {FeedbackType: "star", UserId: "bob", ItemId: "mozilla:pdf.js", Timestamp: "2022-02-27"},
        {FeedbackType: "star", UserId: "bob", ItemId: "moment:moment", Timestamp: "2022-02-28"},
    })

    // Get recommendation.
    gorse.GetRecommend("bob", "", 10)
}
```
