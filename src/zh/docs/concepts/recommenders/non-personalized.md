---
icon: rankfill
shortTitle: 非个性化
---
# 非个性化推荐算法

Gorse 推荐系统提供了一个默认的非个性化推荐算法，即最新推荐。为了提高非个性化推荐的灵活性，Gorse 提供了非个性化推荐算法。

## 配置

非个性化推荐算法将遍历每个物品及其反馈，使用用户提供的表达式进行过滤和评分。非个性化推荐算法的配置由三个字段组成：
- `name` 是推荐算法的名称。
- `score` 是评分函数，用 [Expr](https://expr-lang.org/) 表示，要求输出类型为浮点数或整数。物品按降序排列。
- `filter` 是过滤函数，用 [Expr](https://expr-lang.org/) 表示，要求输出类型为布尔值。

::: tip
如果要按升序对物品进行排序，需要自己添加负号。
:::

在表达式中，`item` 变量表示当前物品，而 `feedback` 变量表示当前物品的正反馈。

`item` 的类型是 `Item` 结构体，访问字段的语法与 Go 语言一致。例如，`item.Timestamp` 将返回物品的时间戳。

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

`feedback` 的类型是 `[]Feedback`，即 `Feedback` 的切片。访问数组的语法与 Go 语言一致。例如，`feedback[0].FeedbackKey.FeedbackType` 将返回第一个正反馈的反馈类型。

```go
type Feedback struct {
    FeedbackType string
    UserId       string
    ItemId       string
    Timestamp   time.Time
    Comment     string
}
```

[Expr](https://expr-lang.org/) 提供了许多内置函数，足以编写更复杂的计算逻辑。除了处理单个变量的内置函数（如数学运算符、比较运算符、逻辑运算符等）外，它还提供了许多与数组相关的内置函数。要了解有关语法的更多信息，请访问 [Expr 的官方文档](https://expr-lang.org/docs/language-definition)。

## API

您可以通过以下 API 访问非个性化推荐：

```bash
curl http://localhost:8087/api/non-personalized/<name>
```

## 示例

### 最新物品

您可以直接使用时间戳对最新物品进行排序。

```toml
[[recommend.non-personalized]]
name = "latest"
score = "item.Timestamp.Unix()"
```

由于 `item.Timestamp` 是 `time.Time` 结构体，不能直接用于排序，因此需要调用 `Unix()` 方法将其转换为 `int64` 类型。

### 过去一周内最受欢迎的物品

使用过滤器排除一周前的物品，并计算点赞数作为排序分数。

```toml
[[recommend.non-personalized]]
name = "most_liked_weekly"
score = "count(feedback, .FeedbackType == 'like')"
filter = "(now() - item.Timestamp).Hours() < 24 * 7"
```

`count` 函数将计算反馈切片的长度，第二个参数表示仅在反馈类型为 'like' 时计数。`now()` 函数获取当前时间，减去物品时间，并要求小时数在一周内（24*7 小时）。

### Hacker News

据说 Hacker News 使用以下公式计算内容排名的分数：

$$
\frac{p-1}{(T+2)^G}
$$

其中 $p$ 是内容的赞成票数，$T$ 是从发布到分数计算的时间，$G$ 是用于控制内容流行度随时间衰减速率的重力值。如果将 $G$ 设置为 0.5，则可以添加以下配置项：

```toml
[[recommend.non-personalized]]
name = "trending"
score = "(count(feedback, .FeedbackType == 'upvote')-1)/((now() - item.Timestamp).Seconds()+2)^0.5"
```
