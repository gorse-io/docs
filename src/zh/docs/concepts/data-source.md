---
icon: data
---
# 数据源

Gorse 中有三种数据集合：用户、物品和反馈。

## 用户

一个用户由用户 ID、标签和评论组成：

```go
type User struct {
    UserId    string
    Labels    any
    Comment   string
}
```
- `UserId` 是用户的唯一标识符，不能包含斜杠“/”，因为与 RESTful API 的 URL 定义冲突。
- `Labels` 是用户的 JSON 格式标签信息，用于向推荐系统描述用户的特征。用户标签可以为空，但这些标签有助于提高推荐质量。
- `Comment` 是用户的评论信息，有助于在仪表盘中浏览用户。

## 物品

一个物品由 6 个字段组成：

```go
type Item struct {
	ItemId     string
	IsHidden   bool
	Categories []string
	Timestamp  time.Time
	Labels     any
	Comment    string
}
```

- `ItemId` 是物品的唯一标识符，不能包含斜线“/”，因为与 RESTful API 的 URL 定义冲突。
- `IsHidden` 指示物品是否在推荐中隐藏。
- `Categories` 是物品所属的类别列表，用于在推荐中筛选物品。
- `Timestamp` 是物品添加到推荐系统的时间，用于确定物品的新鲜度。
- `Labels` 是物品的 JSON 格式标签信息，用于向推荐系统描述物品的内容。物品标签可以为空，但这些标签有助于提高推荐质量。
- `Comment` 是物品的评论信息，有助于在仪表盘中浏览物品。

### 隐藏物品

在许多情况下，历史记录中的物品不适用于向其他用户推荐，例如：
- 如果物品已售罄，则无法推荐给其他用户。
- 如果物品存在法律风险，也无法继续推荐给其他用户。

在 Gorse 中，可以通过 RESTful API 将物品的 `IsHidden` 设置为 `true` 来下架物品。推荐算法可以在训练期间使用该物品，但该物品将不再推荐给其他用户。将 `IsHidden` 设置为 `true` 会立即生效，但在 `refresh_recommend_period` 过期后，将其设置为 `false` 会恢复物品推荐。

### 通过标签描述物品

如果只有物品 ID，推荐系统不知道物品的内容，这需要标签来帮助推荐系统理解物品。

- **用户生成标签**：人工提供的标签通常是最准确的，可以由编辑或用户添加。例如，对于一款游戏，编辑可以添加发行商和类型作为标签，用户可以添加关于游戏的主题作为标签。
- **嵌入向量**：嵌入向量是文本、图像和其他非结构化数据的密集向量表示。嵌入向量可以使用预训练模型（如用于文本的 [EmbeddingGemma](https://ai.google.dev/gemma/docs/embeddinggemma)）生成。

::: warning
关键词提取或其他自动标签提取方法已被弃用，因为它们的表现不如嵌入向量。
:::

## 反馈

一个反馈由用户 ID、物品 ID、反馈类型、反馈值和反馈时间戳组成，其中用户 ID、物品 ID 和反馈类型的三元组在数据库中必须是唯一的。

```go
type Feedback struct {
    FeedbackType string
    UserId       string
    ItemId       string
    Value        float64
    Timestamp    time.Time
}
```

反馈表示用户和物品之间发生的事件，可以是积极的或消极的。例如，分享和点赞是用户对物品的积极反馈。如果用户在阅读后没有进一步的积极反馈，则认为用户对该物品的反馈是消极的。如果用户查看该物品，将记录已读反馈。然后，如果用户对该物品给予积极反馈，则已读反馈将被积极反馈覆盖。相反，如果用户没有给出积极反馈，则已读反馈被认为是消极反馈。

反馈值用于表示反馈的强度。例如，5 星评级系统可以用 1 到 5 的反馈值表示。如果反馈值不可用，可以将其设置为 0。

### 积极和已读反馈

在将反馈插入 Gorse 推荐系统之前，有必要定义用户的哪些行为是积极反馈，哪些是已读反馈。已读反馈相对容易定义，因为当用户看到推荐的物品时，可以将其记录为已读反馈。然而，积极反馈的定义更多地取决于具体场景。对于 TikTok，如果用户“点赞”或“分享”当前视频，可以认为是积极反馈。对于 YouTube，如果用户观看视频达到一定的完成比例、“点赞”视频或“分享”视频，可以认为是积极反馈。总而言之，积极和已读反馈由以下规则定义。

- **已读反馈：** 用户看到物品。
- **积极反馈：** 服务提供商期望用户执行的操作。

### 插入反馈

有两种方法可以将反馈插入 Gorse 推荐系统：插入新反馈和更新现有反馈。插入新反馈通过 `PUT /api/feedback` API 完成，而更新现有反馈通过 `POST /api/feedback` API 完成。两个 API 都接受 JSON 格式的反馈列表。

::: code-tabs

@tab:active POST

```bash
curl -X POST "http://localhost:8088/api/feedback" \
    -H "accept: application/json" \
    -H "Content-Type: application/json" \
    -d '[ { "FeedbackType": "read", "ItemId": "10086", "Value": 1, "Timestamp": "2021-10-24T06:42:20.207Z", "UserId": "jack" }]'
```

@tab PUT

```bash
curl -X PUT "http://localhost:8088/api/feedback" \
    -H "accept: application/json" \
    -H "Content-Type: application/json" \
    -d '[ { "FeedbackType": "read", "ItemId": "10086", "Value": 1, "Timestamp": "2021-10-24T06:42:20.207Z", "UserId": "jack" }]'
```

:::

`PUT /api/feedback` 将覆盖具有相同用户 ID、物品 ID 和反馈类型的现有反馈，而 `POST /api/feedback` 只会将反馈值累加到现有反馈值上。例如，如果数据库中已存在 `{ "FeedbackType": "read", "ItemId": "10086", "Value": 1, "Timestamp": "2021-10-24T06:42:20.207Z", "UserId": "jack" }` 的反馈记录，则通过 `PUT /api/feedback` 插入相同的反馈将导致反馈值为 `1`，而通过 `POST /api/feedback` 插入相同的反馈将导致反馈值为 `2`。

### 已读检测

当用户执行操作（例如单击“点赞”按钮）时，可以轻松检测到积极反馈。但是，已读反馈要求应用程序检测用户何时“阅读”了物品。有两种检测已读反馈的方法：主动已读和自动已读。

#### 主动已读

当用户执行操作时，可以将积极反馈插入推荐系统，而读取反馈需要应用程序检测用户的“阅读”行为。显示推荐的方法因应用程序而异，但通常可以分为两类。

- **全屏模式：** 最典型的应用是 TikTok，当向用户显示全屏内容时，用户被视为“已读”。也就是说，当向用户显示推荐内容时，应用程序可以向推荐系统写入“已读”反馈，并且已读内容将不再向用户显示。

::: center

![](../../../img/tiktok.svg)

:::

- **列表模式：** 最典型的应用是 YouTube，用户在查看列表中的多个视频后不被视为“已读”。当有多个视频时，用户的注意力无法浏览整个列表。此外，如果在列表模式下快速丢弃已读内容，推荐内容的消耗速度太快。因此，最好的解决方案是在将物品呈现给流中的用户时，向推荐系统写入带有未来时间戳的“已读”反馈，“已读”反馈将在时间达到时间戳时生效，并且已读内容将不再呈现给用户。

![](../../../img/youtube.svg)

#### 自动已读

主动将已读反馈插入推荐系统需要应用程序能够准确捕获用户浏览行为。此任务对于移动应用程序更容易，但对于 Web 应用程序更难。为了解决这个问题，Gorse 用于获取推荐结果的 API 提供了两个参数：`write−back−type` 和 `write−back−delay`。

- **在全屏模式下：** 获取推荐并写入“已读”反馈，之后该推荐不会再次出现。

```bash
curl -X GET "http://172.18.0.3:8087/api/recommend/zhenghaoz?write-back-type=read&n=1" \
    -H "accept: application/json" \
    -H "X-API-Key: 19260817"
```

- **在列表模式下：** 获取 10 条推荐，并用 10 分钟后的时间戳写入“已读”反馈。这 10 条推荐将在 10 分钟后才会被丢弃。

```bash
curl -X GET "http://172.18.0.3:8087/api/recommend/zhenghaoz?write-back-type=read&write-back-delay=10m&n=10" \
    -H "accept: application/json" \
    -H "X-API-Key: 19260817"
```

推荐 API 的 `write−back−type` 和 `write−back−delay` 参数提供了一种插入已读反馈的便捷方式，但当然，如果您希望已读反馈更准确，则应由应用程序将其写入推荐系统。

## 配置

Gorse 中有几个与数据源相关的配置选项：

- `positive_feedback_types`: 被视为积极反馈的反馈类型列表。
- `read_feedback_types`: 被视为已读反馈的反馈类型列表。
- `positive_feedback_ttl`: 积极反馈的生存时间（天）。在此期限后，积极反馈将在推荐中被忽略。默认值：`0`（无过期）。
- `item_ttl`: 物品的生存时间（天）。在此期限后，物品将自动从推荐中隐藏。默认值：`0`（无过期）。

`positive_feedback_types` 和 `read_feedback_types` 可以是反馈类型或带有值条件的反馈类型。条件运算符可以是 `>`、`>=`、`<`、`<=` 和 `==`。例如，如果反馈类型为“read”且反馈值为 5，则“read>=3”被视为积极反馈，而“read<3”被视为已读反馈。

TTL 用于自动从推荐系统中删除旧的反馈和物品，以确保推荐保持新鲜和相关。

## 示例

在演示项目 [GitRec](https://gitrec.gorse.io/) 中，使用以下配置将积极反馈定义为“star”、“like”和值大于或等于 3 的“read”。已读反馈定义为“read”。积极反馈和物品都不会过期。

```toml
[recommend.data_source]
positive_feedback_types = ["star","like","read>=3"]
read_feedback_types = ["read"]
positive_feedback_ttl = 0
item_ttl = 0
```

