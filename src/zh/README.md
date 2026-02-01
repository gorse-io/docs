---
home: true
icon: home
title: 主页
heroImage: "/logo.png"
heroText: Gorse
tagline: 一个使用Go语言开发的开源智能推荐系统。
actions:
  - text: 文档
    link: /zh/docs/
    type: primary
  - text: 试用
    link: https://play.gorse.io
  - text: 在线示例
    link: "https://gitrec.gorse.io"
features:
  - title: 多源
    icon: cluster
    details: 从最新、基于用户、基于物品和协同过滤等方式推荐物品。
    link: docs/concepts/recommenders/

  - title: 多模态
    icon: si-glyph-multifunction-knife
    details: 通过嵌入支持多模态内容（文本、图像、视频等）。
    link: docs/concepts/data-source.md#describe-items-via-labels

  - title: AI 驱动
    icon: brightness-auto
    details: 支持传统推荐算法和基于大语言模型的推荐算法。
    link: docs/concepts/ranking.md

  - title: GUI 仪表盘
    icon: dashboard
    details: 提供用于推荐流程编辑和数据管理的 GUI 仪表盘。
    link: docs/dashboard/recflow.md

  - title: RESTful APIs
    icon: http
    details: 提供用于数据增删改查和推荐请求的 RESTful API。
    link: docs/api/restful-api.md

  - title: 跨数据库
    icon: database
    details: 支持 Redis、MySQL、Postgres、MongoDB 和 ClickHouse。
    link: docs/config.md#database

  - title: 在线评估
    icon: chart
    details: 根据最近的用户反馈分析在线推荐效果。
    link: docs/concepts/evaluation.md

  - title: 开源
    icon: open-source-fill
    details: 代码库基于 Apache 2 许可证发布，由社区驱动。
    link: https://github.com/gorse-io/gorse/blob/master/LICENSE
---

Gorse是一个用Go语言编写的开源推荐系统。Gorse的目标是成为一个通用的开源推荐系统，可以很容易地被引入到各种各样的在线服务中。通过将物品、用户和交互数据导入到Gorse中，系统将自动训练模型，为每个用户生成推荐。

# 快速开始

Playground模式是为初学者准备的。只需通过以下命令为GitHub仓库设置一个推荐系统。

::: code-tabs#setup

@tab:active Bash

```bash
curl -fsSL https://gorse.io/playground | bash
```

@tab Docker

```bash
docker run -p 8088:8088 zhenghaoz/gorse-in-one --playground
```

:::

Playground模式将从[GitRec]下载数据并导入到Gorse中。仪表板可以通过http://localhost:8088访问。

::: tabs

@tab 总览

![](/img/dashboard/overview.png)

@tab 任务监视

![](/img/dashboard/tasks.png)

@tab 流程编辑

![](/img/dashboard/recflow.png)

:::

在“任务”页面上完成“查找临近的物品”任务后，尝试向Gorse插入一些反馈。假设Bob是GitHub中几个人工智能仓库的开发人员。我们把他的star行为的反馈写入Gorse。

::: code-tabs#example

@tab:active HTTP

```bash
read -d '' JSON << EOF
[
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"ollama:ollama\", \"Value\": 1.0, \"Timestamp\": \"2022-02-24\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"huggingface:transformers\", \"Value\": 1.0, \"Timestamp\": \"2022-02-25\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"rasbt:llms-from-scratch\", \"Value\": 1.0, \"Timestamp\": \"2022-02-26\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"vllm-project:vllm\", \"Value\": 1.0, \"Timestamp\": \"2022-02-27\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"hiyouga:llama-factory\", \"Value\": 1.0, \"Timestamp\": \"2022-02-28\" }
]
EOF

curl -X POST http://127.0.0.1:8088/api/feedback \
   -H 'Content-Type: application/json' \
   -d "$JSON"
```

@tab Go

```go
import "github.com/zhenghaoz/gorse/client"

gorse := client.NewGorseClient("http://127.0.0.1:8088", "")

gorse.InsertFeedback([]client.Feedback{
    {FeedbackType: "star", UserId: "bob", ItemId: "ollama:ollama", Value: 1.0, Timestamp: "2022-02-24"},
    {FeedbackType: "star", UserId: "bob", ItemId: "huggingface:transformers", Value: 1.0, Timestamp: "2022-02-25"},
    {FeedbackType: "star", UserId: "bob", ItemId: "rasbt:llms-from-scratch", Value: 1.0, Timestamp: "2022-02-26"},
    {FeedbackType: "star", UserId: "bob", ItemId: "vllm-project:vllm", Value: 1.0, Timestamp: "2022-02-27"},
    {FeedbackType: "star", UserId: "bob", ItemId: "hiyouga:llama-factory", Value: 1.0, Timestamp: "2022-02-28"},
})
```

@tab Python

```python
from gorse import Gorse

client = Gorse('http://127.0.0.1:8088', '')

client.insert_feedbacks([
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'ollama:ollama', 'Value': 1.0, 'Timestamp': '2022-02-24' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'huggingface:transformers', 'Value': 1.0, 'Timestamp': '2022-02-25' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'rasbt:llms-from-scratch', 'Value': 1.0, 'Timestamp': '2022-02-26' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'vllm-project:vllm', 'Value': 1.0, 'Timestamp': '2022-02-27' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'hiyouga:llama-factory', 'Value': 1.0, 'Timestamp': '2022-02-28' }
])
```

@tab TypeScript

```javascript
import { Gorse } from "gorsejs";

const client = new Gorse({ endpoint: "http://127.0.0.1:8088", secret: "" });

await client.insertFeedbacks([
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'ollama:ollama', Value: 1.0, Timestamp: '2022-02-24' },
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'huggingface:transformers', Value: 1.0, Timestamp: '2022-02-25' },
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'rasbt:llms-from-scratch', Value: 1.0, Timestamp: '2022-02-26' },
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'vllm-project:vllm', Value: 1.0, Timestamp: '2022-02-27' },
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'hiyouga:llama-factory', Value: 1.0, Timestamp: '2022-02-28' }
]);
```

@tab Java

```java
import io.gorse.gorse4j.*;

Gorse client = new Gorse(GORSE_ENDPOINT, GORSE_API_KEY);

List<Feedback> feedbacks = List.of(
        new Feedback("star", "bob", "ollama:ollama", 1.0, "2022-02-24"),
        new Feedback("star", "bob", "huggingface:transformers", 1.0, "2022-02-25"),
        new Feedback("star", "bob", "rasbt:llms-from-scratch", 1.0, "2022-02-26"),
        new Feedback("star", "bob", "vllm-project:vllm", 1.0, "2022-02-27"),
        new Feedback("star", "bob", "hiyouga:llama-factory", 1.0, "2022-02-28")
);
client.insertFeedback(feedbacks);
```

@tab Rust

```rust
use gorse_rs::{Feedback, Gorse};

let client = Gorse::new("http://127.0.0.1:8088", "");

let feedback = vec![
    Feedback {
        feedback_type: "star".into(),
        user_id: "bob".into(),
        item_id: "ollama:ollama".into(),
        value: 1.0,
        timestamp: "2022-02-24".into(),
    },
    Feedback {
        feedback_type: "star".into(),
        user_id: "bob".into(),
        item_id: "huggingface:transformers".into(),
        value: 1.0,
        timestamp: "2022-02-25".into(),
    },
    Feedback {
        feedback_type: "star".into(),
        user_id: "bob".into(),
        item_id: "rasbt:llms-from-scratch".into(),
        value: 1.0,
        timestamp: "2022-02-26".into(),
    },
    Feedback {
        feedback_type: "star".into(),
        user_id: "bob".into(),
        item_id: "vllm-project:vllm".into(),
        value: 1.0,
        timestamp: "2022-02-27".into(),
    },
    Feedback {
        feedback_type: "star".into(),
        user_id: "bob".into(),
        item_id: "hiyouga:llama-factory".into(),
        value: 1.0,
        timestamp: "2022-02-28".into(),
    },
];
client.insert_feedback(&feedback).await;
```

@tab Ruby

```ruby
require 'gorse'

client = Gorse.new('http://127.0.0.1:8088', 'api_key')

client.insert_feedback([
    { 'FeedbackType' => 'star', 'UserId' => 'bob', 'ItemId' => 'ollama:ollama' , 'Value' => 1.0, 'Timestamp' => '2022-02-24' },
    { 'FeedbackType' => 'star', 'UserId' => 'bob', 'ItemId' => 'huggingface:transformers' , 'Value' => 1.0, 'Timestamp' => '2022-02-25' },
    { 'FeedbackType' => 'star', 'UserId' => 'bob', 'ItemId' => 'rasbt:llms-from-scratch', 'Value' => 1.0, 'Timestamp' => '2022-02-26' },
    { 'FeedbackType' => 'star', 'UserId' => 'bob', 'ItemId' => 'vllm-project:vllm', 'Value' => 1.0, 'Timestamp' => '2022-02-27' },
    { 'FeedbackType' => 'star', 'UserId' => 'bob', 'ItemId' => 'hiyouga:llama-factory', 'Value' => 1.0, 'Timestamp' => '2022-02-28' }
])
```

@tab PHP

```php
$client = new Gorse("http://127.0.0.1:8088/", "api_key");

$rowsAffected = $client->insertFeedback([
    new Feedback("star", "bob", "ollama:ollama", 1.0, "2022-02-24"),
    new Feedback("star", "bob", "huggingface:transformers", 1.0, "2022-02-25"),
    new Feedback("star", "bob", "rasbt:llms-from-scratch", 1.0, "2022-02-26"),
    new Feedback("star", "bob", "vllm-project:vllm", 1.0, "2022-02-27"),
    new Feedback("star", "bob", "hiyouga:llama-factory", 1.0, "2022-02-28")
]);
```

@tab .NET

```cs
using Gorse.NET;

var client = new Gorse("http://127.0.0.1:8087", "api_key");

client.InsertFeedback(new Feedback[]
{
    new Feedback{FeedbackType="star", UserId="bob", ItemId="ollama:ollama", Value=1.0, Timestamp="2022-02-24"},
    new Feedback{FeedbackType="star", UserId="bob", ItemId="huggingface:transformers", Value=1.0, Timestamp="2022-02-25"},
    new Feedback{FeedbackType="star", UserId="bob", ItemId="rasbt:llms-from-scratch", Value=1.0, Timestamp="2022-02-26"},
    new Feedback{FeedbackType="star", UserId="bob", ItemId="vllm-project:vllm", Value=1.0, Timestamp="2022-02-27"},
    new Feedback{FeedbackType="star", UserId="bob", ItemId="hiyouga:llama-factory", Value=1.0, Timestamp="2022-02-28"},
});
```

:::

然后从Gorse中获取10个推荐的物品。我们可以发现，人工智能相关的仓库被推荐给了Bob。

::: code-tabs#example

@tab:active HTTP

```bash
curl http://127.0.0.1:8088/api/recommend/bob?n=10
```

@tab Go

```go
gorse.GetRecommend("bob", "", 10)
```

@tab Python

```python
client.get_recommend('bob', n=10)
```

@tab TypeScript

```javascript
await client.getRecommend({ userId: 'bob', cursorOptions: { n: 10 } });
```

@tab Java

```java
client.getRecommend("bob");
```

@tab Rust

```rust
use gorse_rs::{RecommendOptions, Gorse};

let client = Gorse::new("http://127.0.0.1:8088", "");
client.get_recommend("bob", RecommendOptions::default()).await;
```

@tab Ruby

```ruby
client.get_recommend('bob')
```

@tab PHP

```php
$client->getRecommend('bob');
```

@tab .NET

```cs
client.GetRecommend("bob");
```

:::

> 最终的输出可能与示例不同，因为playground数据集会随时间而变化。


[GitRec]: https://gitrec.gorse.io
