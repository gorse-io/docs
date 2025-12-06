---
icon: go
---

# Go SDK

::: warning

Go SDK 正在开发中， API 可能会在以后的版本中更改。欢迎贡献代码：https://github.com/gorse-io/gorse-go

:::

[![GoDoc](https://godoc.org/github.com/gorse-io/gorse-go?status.svg)](https://pkg.go.dev/github.com/gorse-io/gorse-go)[![GitHub go.mod Go version](https://img.shields.io/github/go-mod/go-version/gorse-io/gorse-go)](https://pkg.go.dev/github.com/gorse-io/gorse-go)

## 安装

```bash
go get github.com/zhenghaoz/gorse-io/gorse-go
```

## 用法

```go
import client "github.com/gorse-io/gorse-go"

func main() {
    // Create a client
    gorse := client.NewGorseClient("http://127.0.0.1:8087", "api_key")

    // Insert a user.
    gorse.InsertUser(client.User{
        UserId: "bob",
        Labels: map[string]interface{}{
            "company":  "gorse",
            "location": "hangzhou, china",
        },
        Comment: "Bob is a software engineer.",
    })

    // Insert an item.
    gorse.InsertItem(client.Item{
        ItemId:    "gorse-io:gorse",
        IsHidden:  false,
        Labels: map[string]interface{}{
            "topics": []string{"recommendation", "machine-learning"},
        },
        Categories: []string{"go"},
        Timestamp:  "2022-02-22",
        Comment:    "Gorse is an open-source recommender system.",
    })

    // Insert feedback
    gorse.InsertFeedback([]client.Feedback{
        {FeedbackType: "star", UserId: "bob", ItemId: "ollama:ollama", Value: 1.0, Timestamp: "2022-02-24"},
        {FeedbackType: "star", UserId: "bob", ItemId: "huggingface:transformers", Value: 1.0, Timestamp: "2022-02-25"},
        {FeedbackType: "star", UserId: "bob", ItemId: "rasbt:llms-from-scratch", Value: 1.0, Timestamp: "2022-02-26"},
        {FeedbackType: "star", UserId: "bob", ItemId: "vllm-project:vllm", Value: 1.0, Timestamp: "2022-02-27"},
        {FeedbackType: "star", UserId: "bob", ItemId: "hiyouga:llama-factory", Value: 1.0, Timestamp: "2022-02-28"},
    })

    // Get recommendation.
    gorse.GetRecommend("bob", "", 10)
}
```
