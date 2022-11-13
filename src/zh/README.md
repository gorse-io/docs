---
home: true
icon: home
title: 主页
heroImage: /logo.png
heroText: Gorse
tagline: 一个使用Go语言开发的开源推荐系统。
actions:
  - text: 文档
    link: /zh/docs/
    type: primary

  - text: 在线示例
    link: https://gitrec.gorse.io

features:
  - title: 多源
    icon: si-glyph-multifunction-knife
    details: 从热门、最新、基于用户、基于项目和协作过滤中推荐物品。

  - title: 自动机器学习
    icon: brightness-auto
    details: 在后台自动搜索最佳的推荐模型。

  - title: 分布式预测
    icon: cluster
    details: 在单节点训练后的推荐阶段支持水平伸缩。

  - title: RESTful APIs
    icon: http
    details: 为数据CRUD和推荐请求暴露RESTful API。

  - title: 多数据源支持
    icon: database
    details: 支持使用Redis、MySQL、Postgres、MongoDB和ClickHouse作为后端存储。

  - title: 在线评估
    icon: chart
    details: 根据最近插入的反馈分析在线推荐的效果。

  - title: 仪表盘
    icon: dashboard
    details: 提供数据管理、系统监控、集群状态检查的GUI界面。

  - title: 开源
    icon: open-source-fill
    details: 代码库是在Apache 2许可下发布的、由社区驱动的。
---

Gorse是一个用Go语言编写的开源推荐系统。Gorse的目标是成为一个通用的开源推荐系统，可以很容易地被引入到各种各样的在线服务中。通过将物品、用户和交互数据导入到Gorse中，系统将自动训练模型，为每个用户生成推荐。

# 快速开始

playground模式是为初学者准备的。只需通过以下命令为GitHub仓库设置一个推荐系统。

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

playground模式将从[GitRec][gitrec]下载数据并导入到Gorse中。仪表板可以通过http://localhost:8088访问。

![](../img/dashboard-overview.png =580x)
![](../img/dashboard-tasks.png =580x)

在“任务”页面上完成“查找临近的物品”任务后，尝试向Gorse插入一些反馈。假设Bob是GitHub中几个前端仓库的前端开发人员。我们把他的star行为的反馈写入Gorse。

::: code-tabs#example

@tab:active HTTP

```bash
read -d '' JSON << EOF
[
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"vuejs:vue\", \"Timestamp\": \"2022-02-24\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"d3:d3\", \"Timestamp\": \"2022-02-25\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"dogfalo:materialize\", \"Timestamp\": \"2022-02-26\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"mozilla:pdf.js\", \"Timestamp\": \"2022-02-27\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"moment:moment\", \"Timestamp\": \"2022-02-28\" }
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
    {FeedbackType: "star", UserId: "bob", ItemId: "vuejs:vue", Timestamp: "2022-02-24"},
    {FeedbackType: "star", UserId: "bob", ItemId: "d3:d3", Timestamp: "2022-02-25"},
    {FeedbackType: "star", UserId: "bob", ItemId: "dogfalo:materialize", Timestamp: "2022-02-26"},
    {FeedbackType: "star", UserId: "bob", ItemId: "mozilla:pdf.js", Timestamp: "2022-02-27"},
    {FeedbackType: "star", UserId: "bob", ItemId: "moment:moment", Timestamp: "2022-02-28"},
})
```

@tab Python

```python
from gorse import Gorse

client = Gorse('http://127.0.0.1:8088', '')

client.insert_feedbacks([
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'vuejs:vue', 'Timestamp': '2022-02-24' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'd3:d3', 'Timestamp': '2022-02-25' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'dogfalo:materialize', 'Timestamp': '2022-02-26' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'mozilla:pdf.js', 'Timestamp': '2022-02-27' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'moment:moment', 'Timestamp': '2022-02-28' }
])
```

@tab TypeScript

```javascript
import { Gorse } from "gorsejs";

const client = new Gorse({ endpoint: "http://127.0.0.1:8088", secret: "" });

await client.insertFeedbacks([
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'vuejs:vue', Timestamp: '2022-02-24' },
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'd3:d3', Timestamp: '2022-02-25' },
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'dogfalo:materialize', Timestamp: '2022-02-26' },
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'mozilla:pdf.js', Timestamp: '2022-02-27' },
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'moment:moment', Timestamp: '2022-02-28' }
]);
```

:::

然后从Gorse中获取10个推荐的物品。我们可以发现，前端相关的仓库被推荐给了Bob。

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

:::

```json
[
  "mbostock:d3",
  "nt1m:material-framework",
  "mdbootstrap:vue-bootstrap-with-material-design",
  "justice47:f2-vue",
  "10clouds:cyclejs-cookie",
  "academicpages:academicpages.github.io",
  "accenture:alexia",
  "addyosmani:tmi",
  "1wheel:d3-starterkit",
  "acdlite:redux-promise"
]
```

> 最终的输出可能与示例不同，因为playground数据集会随时间而变化。

[gitrec]: https://girec.gorse.io