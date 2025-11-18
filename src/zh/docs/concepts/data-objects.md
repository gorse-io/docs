---
icon: model
---

# 数据对象

Gorse 中只有三种数据对象：用户、物品和反馈。

## 用户

- 一条用户信息由用户ID和用户标签组成。用户标签可以为空，但这些标签有助于增强推荐准确率。

```go
type User struct {
    UserId    string	// user ID
    Labels    []string	// labels describing the user
}
```

## 物品

一条物品信息由 6 个字段组成：

```go
type Item struct {
	ItemId     string
	IsHidden   bool
	Categories []string
	Timestamp  time.Time
	Labels     []string
	Comment    string
}
```

字段 | 描述
--- | ---
`ItemId` | 物品的唯一标识符，不能包含斜线“/”，因为与 RESTful API 的 URL 定义冲突。
`IsHidden` | 隐藏选项，设置为true后，该物品将不再出现在推荐结果中。
`Categories` | 物品所属的品类，用于多品类推荐。
`Timestamp` | 物品的时间戳，用于判断物品的新鲜度。
`Labels` | 物品的标签信息，用于向推荐系统描述物品的特征。
`Comment` | 物品的注释信息，有助于在仪表盘中浏览物品和推荐结果。

### 隐藏物品

在某些情况下希望不推荐某物品给其他用户，例如：

- 如果商品已售罄，则不应该推荐给其他用户。
- 如果物品存在法律风险，也不能继续推荐给其他用户。

在 Gorse 中，可以通过 RESTful API 将物品的`IsHidden`设置为`true`来下架物品。推荐算法可以在训练期间使用该物品，但该物品将不再推荐给其他用户。将`IsHidden`设置为`true`会立即生效，但将其设置为`false`会在`refresh_recommend_period`过期后恢复物品推荐。

### 有效时间

用户倾向于喜欢新内容而不是旧内容。配置中有一个选项`item_ttl`可以从推荐系统中隐藏太旧的物品。陈旧的物品永远不会被推荐给用户，也不会在推荐模型的训练中使用。

```toml
[recommend.data_source]

# The time-to-live (days) of items, 0 means disabled. The default value is 0.
item_ttl = 0
```

### 多品类推荐

多品类推荐很常见，以YouTube为例，首页提供多个主题推荐。

![](../../../../img/youtube-topics.png)

物品品类可以根据主题区分，例如美食、旅游等，也可以根据形式区分，例如直播、短视频和长视频。物品除了出现在全局推荐流中外，`Categories`字段决定了物品应出现在哪些品类推荐流中。对于每个推荐 API，都有一个全局推荐版本和一个品类推荐版本：

方法 | URL | 描述
--- | --- | ---
`GET` | `/api/latest` | 获取最新的物品。
`GET` | `/api/latest/{category}` | 获取指定品类中的最新物品。
`GET` | `/api/popular` | 获取热门物品。
`GET` | `/api/popular/{category}` | 获取指定品类中的热门物品。
`GET` | `/api/recommend/{user-id}` | 获取用户推荐。
`GET` | `/api/recommend/{user-id}/{category}` | 获取指定品类下的用户推荐。
`GET` | `/api/item/{item-id}/neighbors` | 获取物品的相似物品。
`GET` | `/api/item/{item-id}/neighbors/{category}` | 获取指定品类中物品的相似物品。

例如，对于羽毛球比赛直播，您可以将其`Categories`设置为“直播”和“体育”。这样，除了默认的推荐流之外，用户还可以在“直播”和“体育”推荐类别中找到直播流。

![](../../../../img/youtube-live.png)

::: warning

多品类推荐会消耗更多的缓存存储空间。

:::

### 使用标签描述物品

如果只有物品ID，推荐系统并不知道物品的内容，这就需要标签来帮助推荐系统理解物品。

- **用户生成标签**：人工提供的标签通常是最准确的，可以由编辑或用户添加。例如，对于一款游戏，编辑可以添加发行商和类型作为标签，用户可以添加关于游戏的主题作为标签。
- **自动标签提取**：不幸的是，在很多情况下，物品并没有现成的标签，因此需要使用机器学习来自动为物品生成标签。
    - **图像分类** : 图像的类别作为标签，例如分类图像是女孩、男孩、猫还是狗。
    - **对象检测**：将图像中包含的对象检测为标签，例如将图像检测为撸猫的女孩。
    - **关键词提取** : 提取文本的关键词，比如一篇文章讲的是基于深度学习的推荐系统，关键词是深度学习和推荐系统。
    - **文本分类** : 对文章的内容进行分类，例如判断推文是倾诉、约会还是求职。

为物品生成高质量的标签是一项艰巨的任务，低质量的标签可能会损害推荐系统的准确性。

## 反馈

- 一条反馈由用户ID、物品ID、反馈类型、反馈时间戳组成，其中用户ID、物品ID、反馈类型三元组在数据库中要求唯一。

```go
type Feedback struct {
    FeedbackType string		// feedback type
    UserId       string		// user id
    ItemId       string		// item id
    Timestamp    time.Time	// feedback timestamp
}
```

反馈表示用户和物品之间发生的事件，可以是正面的也可以是负面的。例如，分享和喜欢是用户对某个物品的正面反馈。如果用户在阅读后没有进一步的正面反馈，则认为用户对该物品的反馈是负面的。如果用户查看该物品，将记录已读反馈。然后，如果用户对该物品给予正面反馈，则已读反馈将被正面反馈覆盖。相反，如果用户没有给出正面反馈，则已读反馈被认为是负面反馈。

### 正反馈和已读反馈

在将反馈插入 Gorse 推荐系统之前，需要定义用户的哪些行为是正反馈，哪些是已读反馈。已读反馈相对容易定义，因为当用户看到推荐物品时可以将其记录为已读反馈。但是，正反馈的定义更多地取决于具体场景。对于TikTok，如果用户“喜欢”或“分享”当前视频，则可以视为正向反馈；对于 YouTube，如果用户观看视频达到一定比例的完成度、“喜欢”视频或“分享”视频，都可以被视为正向反馈。总而言之，正反馈和已读反馈由以下规则定义：

- **已读反馈：** 用户看到过物品。
- **正反馈：** 用户执行了服务方期望的操作，例如点赞、收藏、购买等行为。

例如，G胖想基于 Gorse 为 Steam 构建一个推荐系统，点击进入游戏介绍页面可以被视为已读反馈（游戏列表页面信息太少，无法确定用户已读），以及那么诸如添加愿望清单和添加购物车之类的操作将被视为正反馈。需要在配置文件中进行如下设置：

```toml
[recommend.data_source]

# Add to wishlist or cart
positive_feedback_types = ["wish_list", "cart"]

# Read the game introduction page
read_feedback_types = ["read"]
```

### 有效时间

用户的偏好随时间变化。 `positive_feedback_ttl`选项可防止推荐系统根据陈旧的反馈生成推荐。

```toml
[recommend.data_source]

# The time-to-live (days) of positive feedback, 0 means disabled. The default value is 0.
positive_feedback_ttl = 0
```

### 插入正面反馈

对于正反馈，可以在用户执行操作时插入，其中时间戳为当前时间戳。

```bash
curl -X POST "http://127.0.0.1:8088/api/feedback" \
    -H "accept: application/json" \
    -H "Content-Type: application/json" \
    -d '[ { "FeedbackType": "read", "ItemId": "10086", "Timestamp": "2021-10-24T06:42:20.207Z", "UserId": "jack" }]'
```

### 插入已读反馈

对于已读反馈，时间戳除了记录阅读时间外，还可以用来设置推荐结果的超时时间。

#### 主动插入

当用户行动发生时，可以将正反馈插入推荐系统，而已读反馈则需要应用程序检测用户的“阅读”行为。显示推荐的方法因应用程序而异，但通常可分为两类。

- **全屏模式：** 最典型的应用程序是 TikTok，当向用户显示全屏内容时，用户被视为“已读”。也就是说，应用程序可以在向用户展示推荐内容时向推荐系统写入“已读”反馈，并且将不再向用户展示已读内容。

::: center

![](../../../../img/tiktok.jpg =300x) ![](../../../../img/youtube-mobile.jpg =300x)

:::

- **列表模式：** 最典型的应用是 YouTube，用户在浏览视频列表后不会被立刻视为“已读”。当有多个推荐项目同时展示给用户时，用户的注意力无法浏览整个列表。而且，如果在列表模式下快速丢弃已读内容，则推荐内容消耗过快。因此，最好的解决方案是当推荐以列表形式呈现给用户时，向推荐系统写入带有未来时间戳的“已读”反馈，“已读”反馈将在时间达到时间戳时生效，那个时候才不再呈现给用户。

#### 自动插入

主动将已读反馈插入推荐系统需要应用程序能够准确捕获用户浏览行为。此任务对于移动应用程序来说更容易，但对于 Web 应用程序来说更难。为了解决这个问题，Gorse 获取推荐结果的 API 提供了两个参数： `write−back−type`和`write−back−delay` 。

- **在全屏模式下：** 获得推荐并写“已读”反馈，之后不会再次出现推荐。

```bash
curl -X GET "http://172.18.0.3:8087/api/recommend/zhenghaoz?write-back-type=read&n=1" \
    -H "accept: application/json" \
    -H "X-API-Key: 19260817"
```

- **在列表模式下：** 获得 10 条推荐并在 10 分钟后写入“已读”的反馈。直到 10 分钟后，这 10 条推荐才会被丢弃。

```bash
curl -X GET "http://172.18.0.3:8087/api/recommend/zhenghaoz?write-back-type=read&write-back-delay=10m&n=10" \
    -H "accept: application/json" \
    -H "X-API-Key: 19260817"
```

推荐API的`write−back−type`和`write−back−delay`参数提供了插入已读反馈的便捷方式，当然，如果你想让已读反馈更准确，应该通过前端或者客户端主动写入推荐系统。
