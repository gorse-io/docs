---
icon: dot-net
---

# .NET SDK

::: warning

.NET SDK 正在开发中， API 可能会在以后的版本中更改。欢迎参与贡献：https://github.com/gorse-io/Gorse.NET

:::

[![Nuget (with prereleases)](https://img.shields.io/nuget/vpre/Gorse.NET)](https://www.nuget.org/packages/Gorse.NET/)[![Nuget](https://img.shields.io/nuget/dt/Gorse.NET)](https://www.nuget.org/packages/Gorse.NET/)

## 安装

- 通过 .NET CLI 安装：

```bash
dotnet add package Gorse.NET
```

- 通过 NuGet 包管理器安装：

```bash
NuGet\Install-Package Gorse.NET
```

## 用法

```cs
using Gorse.NET;

var client = new Gorse("http://127.0.0.1:8087", "api_key");

// Insert a user
client.InsertUser(new User
{
    UserId = "bob",
    Labels = new { company = "gorse", location = "hangzhou, china" },
    Comment = "Bob is a software engineer."
});

// Insert an item
client.InsertItem(new Item
{
    ItemId = "gorse-io:gorse",
    IsHidden = false,
    Labels = new { topics = new[] { "recommendation", "machine-learning" } },
    Categories = new[] { "go" },
    Timestamp = "2022-02-22",
    Comment = "Gorse is an open-source recommender system."
}

// Insert feedback
client.InsertFeedback(new Feedback[]
{
    new Feedback{FeedbackType="star", UserId="bob", ItemId="ollama:ollama", Value=1.0, Timestamp="2022-02-24"},
    new Feedback{FeedbackType="star", UserId="bob", ItemId="huggingface:transformers", Value=1.0, Timestamp="2022-02-25"},
    new Feedback{FeedbackType="star", UserId="bob", ItemId="rasbt:llms-from-scratch", Value=1.0, Timestamp="2022-02-26"},
    new Feedback{FeedbackType="star", UserId="bob", ItemId="vllm-project:vllm", Value=1.0, Timestamp="2022-02-27"},
    new Feedback{FeedbackType="star", UserId="bob", ItemId="hiyouga:llama-factory", Value=1.0, Timestamp="2022-02-28"}
});

// Get recommendations
client.GetRecommend("bob");
```
