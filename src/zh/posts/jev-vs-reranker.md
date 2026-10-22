---
icon: robot
date: 2026-10-22
category:
  - 技术分享
tag:
  - 人工智能
---
# 决策模型和重排序模型谁更适合推荐排序？

在[使用大语言模型排序推荐结果](./llm-ranker.md)一文中，我们尝试将用户的历史兴趣转换为查询，再使用重排序模型对候选物品进行排序。随着 Jev 及其相关决策模型的出现，推荐系统又多了一种选择：把“用户是否会喜欢这个物品”作为一个判断任务，直接使用模型返回的概率排序。

这两种方法都可以根据用户历史兴趣和个人画像的文本描述对候选物品进行排序，而不需要先在业务数据上训练一个排序模型。那么，面向相关性排序的重排序模型和面向判断任务的决策模型，谁更适合推荐系统？本文使用 Gorse 的 `gorse-bench` 工具，在 MovieLens 100K 数据集上比较它们的排序效果。

## 两种模型的区别

重排序模型接收一个`query`和多个`documents`，输出文档相对于查询的相关性分数。而 Jev 之类的决策模型接收一个`state`和一组 `questions`，为每个问题返回结构化结果。它支持`choice`（选择）、`score`（评分）和 `noul` （真假判断），其中 `noul` 返回 0 到 1 之间的数值，表示命题为真的概率。推荐系统使用这一类判断为候选物品打分。

以 llama.cpp 提供的 API 为例，下面分别是重排序模型和决策模型的请求和返回示例：

::: code-tabs

@tab:active 决策模型API

```bash
$ curl --request POST 'http://localhost:8080/v1/systemone' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-binary @- <<'JSON'
{
  "model": "OpenJev-GGUF",
  "state": "A user likes the following movies:\n- The Lion King (1994). A animation, children's, musical movie.\nPlease recommend more movies.",
  "questions": {
    "1": {
      "type": "noul",
      "instructions": "Toy Story (1995). A animation, children's, comedy movie."
    },
    "2": {
      "type": "noul",
      "instructions": "GoldenEye (1995). A action, adventure, thriller movie."
    }
  }
}
JSON
{
  "model": "OpenJev-GGUF",
  "answers": {
    "1": {
      "type": "noul",
      "noul": 0.91
    },
    "2": {
      "type": "noul",
      "noul": 0.35
    }
  }
}
```

@tab 重排序模型API

```bash
$ curl --request POST 'http://localhost:8080/v1/rerank' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-binary @- <<'JSON'
{
  "model": "Qwen3-Reranker-8B-GGUF",
  "query": "A user likes the following movies:\n- The Lion King (1994). A animation, children's, musical movie.\nPlease recommend more movies.",
  "documents": [
    "Toy Story (1995). A animation, children's, comedy movie.",
    "GoldenEye (1995). A action, adventure, thriller movie."
  ]
}
JSON
{
  "model": "Qwen3-Reranker-8B-GGUF",
  "results": [
    {
      "index": 0,
      "relevance_score": 0.87
    },
    {
      "index": 1,
      "relevance_score": 0.24
    }
  ]
}
```

:::



## 数据集与评估方法

本次使用 MovieLens 100K 电影评分数据。本地数据包含 943 个用户、1,682 部电影和 100,000 条评分，评分范围为 1 到 5。实验配置将 4 分及以上的评分作为正反馈，将其他已评分记录作为负样本：

```toml
[recommend.data_source]
positive_feedback_types = ["rating>=4"]
read_feedback_types = ["rating"]
```

::: info

如果对复现实验感兴趣，欢迎访问[基础配置文件](https://github.com/gorse-io/gorse/blob/master/client/config.toml)（不含重排序模型和决策模型配置）并下载[可以直接导入的数据](https://cdn.gorse.io/example/github.bin.gz)，按照[快速上手](../docs/quick-start.md)导入该数据集。

:::

模型的推理引擎为 llama.cpp，所有的模型采用 Q4_K_M 量化格式。重排序模型和决策模型使用的提示词模板完全相同，下面是具体配置示例。

::: code-tabs

@tab:active 决策模型的配置

```toml
[recommend.ranker.decision_api]
url = "http://127.0.0.1:8080/v1/systemone"
auth_token = "YOUR_API_KEY"
model = "OpenJev-GGUF"
state_template = """
A user likes the following movies:
{% for item in feedback -%}
- {{ item.Comment }}. A{% for category in item.Categories %}{% if not loop.first %},{% endif %} {{ category | lower }}{% endfor %} movie.
{% endfor -%}
Please recommend more movies.
"""
instructions_template = '{{ item.Comment }}. A{% for category in item.Categories %}{% if not loop.first %},{% endif %} {{ category | lower }}{% endfor %} movie.'
```

@tab 重排序模型的配置

```toml
[recommend.ranker.reranker_api]
url = "http://127.0.0.1:8080/v1/rerank"
auth_token = "YOUR_API_KEY"
model = "Qwen3-Reranker-8B-GGUF"
query_template = """
A user likes the following movies:
{% for item in feedback -%}
- {{ item.Comment }}. A{% for category in item.Categories %}{% if not loop.first %},{% endif %} {{ category | lower }}{% endfor %} movie.
{% endfor -%}
Please recommend more movies.
"""
document_template = '{{ item.Comment }}. A{% for category in item.Categories %}{% if not loop.first %},{% endif %} {{ category | lower }}{% endfor %} movie.'
```

:::

使用 `gorse-bench` 工具指定配置文件进行模型评测。

::: code-tabs

@tab:active 测试决策模型

```bash
./gorse-bench decision --config config.toml
```

@tab 测试重排序模型

```bash
./gorse-bench reranker --config config.toml
```

:::

`gorse-bench` 的 `reranker` 和 `decision` 子命令使用相同的评估流程：

1. 将每个用户的评分按时间排序，较早的约 80% 作为历史，较晚的约 20% 作为测试集。
2. 只把历史中的正反馈放入提示词，不把测试集评分提供给模型。
3. 将测试集中的正负样本一起作为候选电影，请模型打分。
4. 对每个用户计算 AUC，再按该用户的测试样本数量加权得到 GAUC。

GAUC 的计算方式为：

$$
\mathrm{GAUC} = \frac{\sum_{u \in U} n_u \cdot \mathrm{AUC}_u}{\sum_{u \in U} n_u}
$$

其中，$U$ 为实际参与评估的用户集合，$n_u$ 为用户 $u$ 的测试样本数量，$\mathrm{AUC}_u$ 表述用户 $u$ 测试集上的 AUC。GAUC 越高，表示在这一评估方式下，模型对用户喜欢和不喜欢的电影区分得越好。

## 实验结果

本次测试了 9 个模型，其中 6 个为决策模型，3 个为重排序模型：

::: echarts 决策模型和重排序模型 GAUC 对比

```json
{
  "color": ["#5470c6", "#eea23e"],
  "legend": {
    "data": ["决策模型", "重排序模型"],
    "top": 0
  },
  "grid": {
    "left": 10,
    "right": 65,
    "top": 40,
    "bottom": 30,
    "containLabel": true
  },
  "tooltip": {
    "trigger": "axis",
    "axisPointer": {
      "type": "shadow"
    }
  },
  "xAxis": {
    "type": "value",
    "name": "GAUC",
    "min": 0.5,
    "max": 0.66
  },
  "yAxis": {
    "type": "category",
    "inverse": true,
    "axisLabel": {
      "fontSize": 11
    },
    "data": [
      "OpenJev-27B",
      "Clef-Flash-9B",
      "Qwen3-Reranker-8B",
      "Qwen3-Reranker-4B",
      "Kev-4B",
      "Clef-27B",
      "Bespoke-Nimble-9B-v3",
      "lev-4B",
      "Qwen3-Reranker-0.6B"
    ]
  },
  "series": [
    {
      "name": "决策模型",
      "type": "bar",
      "stack": "GAUC",
      "barMaxWidth": 20,
      "label": {
        "show": true,
        "position": "right",
        "formatter": "{c}"
      },
      "data": [0.6463, 0.6163, null, null, 0.5852, 0.5782, 0.5771, 0.5714, null]
    },
    {
      "name": "重排序模型",
      "type": "bar",
      "stack": "GAUC",
      "barMaxWidth": 20,
      "label": {
        "show": true,
        "position": "right",
        "formatter": "{c}"
      },
      "data": [null, null, 0.5911, 0.5877, null, null, null, null, 0.5135]
    }
  ],
  "media": [
    {
      "query": {
        "maxWidth": 500
      },
      "option": {
        "yAxis": {
          "axisLabel": {
            "width": 120,
            "overflow": "break",
            "lineHeight": 14
          }
        }
      }
    }
  ]
}
```

:::

OpenJev 的 GAUC 比 Qwen3-Reranker-8B 高约 0.0552，Clef-Flash 高约 0.0252。这说明决策模型值得加入推荐排序模型的候选名单。但决策模型并没有整体胜出：Kev、Clef、Nimble 和 lev 的结果均低于 Qwen3-Reranker-8B。即使同属决策模型，不同模型之间的效果差异也相当明显。

## 哪种模型更好？

**首先，重排序模型是最稳妥的选择。**Qwen3-Reranker-4B 在本次实验中优于大部分决策模型，甚至表现好于参数量高达 27B 并且在[决策模型排行榜](https://clef-evals.workers-ai-mle.workers.dev/)名列前茅的 Clef。这可能是因为重排序模型为排序任务专门训练，而决策模型的训练数据覆盖更加通用的场景，导致其未必在排序任务中表现最佳。

**其次，决策模型的表现取决于具体模型。**OpenJev 和 Clef-Flash 在本次实验中表现较好。其中 Clef-Flash 的效果明显由于参数量接近的 Qwen3-Reranker-8B 重排序模型，也明显优于来自同一公司的 Clef。Clef-Flash 和 Nimble 都是基于 Qwen 3.5 9B 微调而来，不同的微调数据造就了它们在推荐任务上完全不同的表现。

::: warning
基于决策模型的排序器还处于实验阶段，只能通过配置文件设置，尚未在图形界面提供相应的编辑功能。
:::