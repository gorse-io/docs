---
icon: go
---
# Go SDK

::: warning

The Go SDK is under development, and APIs might be changed in later versions. Pull requests are welcomed: https://github.com/gorse-io/gorse-go

:::

[![GoDoc](https://godoc.org/github.com/gorse-io/gorse-go?status.svg)](https://pkg.go.dev/github.com/gorse-io/gorse-go)
[![GitHub go.mod Go version](https://img.shields.io/github/go-mod/go-version/gorse-io/gorse-go)](https://pkg.go.dev/github.com/gorse-io/gorse-go)

## Install

```bash
go get github.com/zhenghaoz/gorse-io/gorse-go
```

## Usage

```go
import client "github.com/gorse-io/gorse-go"

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
