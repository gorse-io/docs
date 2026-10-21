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

这两种方法都可以根据用户历史兴趣的文本描述对候选物品进行排序，而不需要先在业务数据上训练一个排序模型。那么，面向相关性排序的重排序模型和面向判断任务的决策模型，谁更适合推荐系统？本文使用 Gorse 的 `gorse-bench` 工具，在 MovieLens 100K 数据集上比较它们的排序效果。

## 两种排序方式有什么区别

Reranker 接收一个查询和多个文档，输出文档相对于查询的相关性分数。在推荐场景中，查询可以由用户喜欢过的电影组成，文档则是每部候选电影的描述。

[Jev](https://docs.typesafe.ai/introduction/quickstart) 的接口接收一个共享的 `state` 和一组 `questions`，为每个问题返回结构化结果。它支持选择、评分和名为 `noul` 的真假判断；其中 `noul` 返回 0 到 1 之间的数值，表示命题为真的概率。Gorse 使用这一类判断为候选物品打分。

下面以物品 ID 为 `1` 和 `2` 的两部候选电影为例，以终端记录的形式对比两种接口，每段 curl 命令后紧接对应的 JSON 返回结果。命令适用于 Bash，请将 API 地址、密钥和模型名替换为实际服务配置。返回内容仅展示排序相关字段，分数为示意值。

::: code-tabs

@tab:active 重排序模型API

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

@tab 决策模型API

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

:::

Gorse 的两种实现共用模板渲染逻辑。Reranker 通过响应中的文档索引匹配物品；决策接口则以物品 ID 作为问题 ID，取回相应概率，再排序。两者都可以一次提交一个用户的多个候选物品，接口调用方式本身并不能说明哪一种推理更快。

两种任务的区别在于：与历史兴趣相关的内容，未必就是用户下一步最想消费的内容。例如，用户看过许多战争电影，并不意味着所有战争电影都同样值得推荐。决策模型能否更好地处理这种偏好判断，需要通过实际数据检验。

## 数据集与评估方法

### 从评分中构造正负反馈

本次使用 MovieLens 100K 电影评分数据。本地数据包含 943 个用户、1,682 部电影和 100,000 条评分，评分范围为 1 到 5。实验配置将 4 分及以上的评分作为正反馈，将其他已评分记录作为负样本：

```toml
[recommend.data_source]
positive_feedback_types = ["rating>=4"]
read_feedback_types = ["rating"]
```

模型看到的电影信息是 `item.Comment` 中的电影名称和年份，以及 `item.Categories` 中的类型。例如：

```text
Toy Story (1995). A animation, children's, comedy movie.
```

因此，本次比较依赖电影名称和类型提供的语义信息，没有使用剧情简介，也没有为这些模型进行 MovieLens 数据上的微调。结果不能直接外推到只包含物品 ID、缺少文本信息的推荐场景。

### 按用户的时间顺序划分样本

`gorse-bench` 的 `reranker` 和 `decision` 子命令使用相同的评估流程：

1. 将每个用户的评分按时间排序，较早的约 80% 作为历史，较晚的约 20% 作为测试集。
2. 只把历史中的正反馈放入提示词，不把测试集评分提供给模型。
3. 将测试集中的正负样本一起作为候选电影，请模型打分。
4. 对每个用户计算 AUC，再按该用户的测试样本数量加权得到 GAUC。

这里的“历史”用于构造模型输入，没有用于训练模型。候选集来自用户实际评分过的电影，**没有额外随机抽取未交互物品作为负样本**，因此也不是对完整召回链路的评估。

实验配置中的 `recommend.context_size` 为 100。当前评测实现会排除没有历史正反馈、历史正反馈超过 100 条，以及测试集中缺少正样本或负样本的用户。超过上限的历史不会被截断到 100 条，而是整个用户不参与评估。

### GAUC 如何计算

GAUC 的计算方式为：

$$
\mathrm{GAUC} = \frac{\sum_{u \in U} n_u \cdot \mathrm{AUC}_u}{\sum_{u \in U} n_u}
$$

其中，$U$ 为实际参与评估的用户集合，$n_u$ 为用户 $u$ 的测试样本数量，$\mathrm{AUC}_u$ 衡量模型把正样本排在负样本之前的能力。GAUC 越高，表示在这一评估方式下，模型对用户喜欢和不喜欢的电影区分得越好。

需要注意，当前 Gorse 的 AUC 实现只在正样本得分**严格大于**负样本时计为正确，同分不会计入半次正确。如果模型输出大量相同分数，这一细节会影响结果。另外，GAUC 衡量排序区分能力，并不能证明 `noul` 数值已经是经过校准的用户喜欢概率。

## 实验结果

### 整体排序效果

本次保存了 9 个模型的逐用户 CSV，字段分别为历史正反馈数量 `Feedback`、测试候选数量 `Candidates` 和用户 AUC。下面按 `Candidates` 加权重新汇总 GAUC，保留四位小数；其中 8 个模型与 `result.txt` 中的汇总一致，OpenJev 的结果由 CSV 补充计算。

| 模型 | 参数量 | GAUC |
| --- | ---: | ---: |
| [OpenJev-GGUF](https://huggingface.co/ggml-org/OpenJev-GGUF) | 27B | **0.6463** |
| [Clef-Flash-GGUF](https://huggingface.co/Cloudflare/clef-flash) | 9B | **0.6163** |
| [Qwen3-Reranker-8B-GGUF](https://huggingface.co/Qwen/Qwen3-Reranker-8B) | 8B | 0.5911 |
| [Qwen3-Reranker-4B-GGUF](https://huggingface.co/Qwen/Qwen3-Reranker-4B) | 4B | 0.5877 |
| [Kev-4B-GGUF](https://huggingface.co/ggml-org/Kev-4B-GGUF) | 4B | 0.5852 |
| [Clef-GGUF](https://huggingface.co/Cloudflare/clef) | 27B | 0.5782 |
| [Bespoke-Nimble-9B-v3-GGUF](https://huggingface.co/ggml-org/Bespoke-Nimble-9B-v3-GGUF) | 9B | 0.5771 |
| [lev-GGUF](https://huggingface.co/ggml-org/lev-GGUF) | 4B | 0.5714 |
| [Qwen3-Reranker-0.6B-GGUF](https://huggingface.co/Qwen/Qwen3-Reranker-0.6B) | 0.6B | 0.5135 |

参数量采用模型标称规模，B 表示十亿参数，点击模型名称可查看对应模型页面。

在各自导出的评估样本上，OpenJev 的 GAUC 比 Qwen3-Reranker-8B 高约 0.0552，Clef-Flash 高约 0.0252。这说明 Jev 风格的决策模型值得加入推荐排序模型的候选名单。

但决策模型并没有整体胜出：Kev、Clef、Nimble 和 lev 的结果均低于 Qwen3-Reranker-8B。即使同属决策模型，不同模型之间的效果差异也相当明显。接口类型并不能代替模型选型。

Qwen3-Reranker 系列中，8B 和 4B 的结果比较接近，差值约为 0.0033，而 0.6B 明显更低。这个结果支持在本任务中优先比较 4B 和 8B，但没有推理耗时和显存记录，暂时不能判断哪一个性价比更高。

### 用户历史长度会影响结果吗

为了观察不同历史长度下的表现，我们按照 CSV 中的 `Feedback` 将用户划分为五组，并在每一组内继续按 `Candidates` 加权计算 GAUC。下面展示整体结果领先的 OpenJev、Clef-Flash，以及 Qwen3-Reranker-8B：

::: echarts 不同历史正反馈数量下的排序效果

```json
{
  "legend": {
    "data": ["OpenJev-GGUF", "Clef-Flash-GGUF", "Qwen3-Reranker-8B-GGUF"],
    "type": "scroll"
  },
  "grid": {
    "left": 55,
    "right": 25,
    "bottom": 65,
    "top": 65
  },
  "tooltip": {
    "trigger": "axis"
  },
  "xAxis": {
    "type": "category",
    "name": "历史正反馈数量",
    "nameLocation": "middle",
    "nameGap": 35,
    "data": ["1–20", "21–40", "41–60", "61–80", "81–100"]
  },
  "yAxis": {
    "type": "value",
    "name": "GAUC",
    "min": 0.5,
    "max": 0.7
  },
  "series": [
    {
      "name": "OpenJev-GGUF",
      "type": "line",
      "data": [0.5985, 0.6490, 0.6667, 0.6466, 0.6566]
    },
    {
      "name": "Clef-Flash-GGUF",
      "type": "line",
      "data": [0.5716, 0.6372, 0.6278, 0.6208, 0.6054]
    },
    {
      "name": "Qwen3-Reranker-8B-GGUF",
      "type": "line",
      "data": [0.5549, 0.6141, 0.6083, 0.5925, 0.5693]
    }
  ]
}
```

:::

OpenJev 在这五组中都取得了更高的 GAUC，Clef-Flash 则都高于 Qwen3-Reranker-8B。不过，历史更多并没有带来单调的效果提升：三个模型在 41–60 条之后都出现了不同程度的波动。不同分组包含不同用户，因此这张图不能解释为“给同一个用户增加历史就会得到相应提升”。

1–20 条历史组也已经有正反馈可用，这不是完全没有行为记录的新用户冷启动测试。

### 如何理解这些差异

一种可能的解释是，决策模型对“根据已有偏好判断一个候选项是否合适”这一任务更适应，而 Reranker 更容易把电影类型相近当作相关性依据。但本次没有做提示词消融，也没有逐条分析模型的判断，因此这只是一个待验证的假设。

另一个值得关注的现象是 Clef-Flash 优于 Clef。模型名称中的 Flash 并不意味着效果一定更低；[官方模型卡](https://huggingface.co/Cloudflare/clef-flash)说明 Clef-Flash 基于 Qwen3.5-9B，并使用面向结构化问题的输出方式。具体到推荐任务，仍然需要独立评测，不能根据名称或通用决策榜单推断结果。

## 如何使用 Gorse 复现评估

本次使用的 `gorse-bench` 已提供 `reranker` 和 `decision` 两个子命令。请使用包含这些子命令的源码版本；本次工作区的 `go.mod` 要求 Go 1.27。

```bash
go build -o gorse-bench ./cmd/gorse-bench
```

准备 MovieLens 100K 数据并导入 Gorse，已有的 `client/setup-test.sh` 提供了数据下载和恢复示例。将配置文件中的数据库地址指向导入的数据，然后设置反馈类型和上下文上限：

```toml
[recommend]
context_size = 100

[recommend.data_source]
positive_feedback_types = ["rating>=4"]
read_feedback_types = ["rating"]
```

以下片段沿用本次实验的电影提示词。API 地址使用本地服务示例，`model` 应填写服务端实际注册的模型名，密钥也需要替换。

### 配置 Reranker

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

运行评测并保存逐用户结果：

```bash
./gorse-bench reranker --config config.toml --jobs 1 --user-auc
```

### 配置决策模型

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

这里的 `instructions_template` 与 Reranker 的文档模板保持一致，只提供候选电影的描述，没有额外加入“用户会喜欢这部电影吗”的句子。为决策模型单独设计问题是可以继续探索的方向，但那会是另一组实验。

```bash
./gorse-bench decision --config config.toml --jobs 1 --user-auc
```

评测子命令直接选择对应模型，不依赖 `recommend.ranker.type`。如果要让 Gorse 的推荐流程使用决策排序，还需要在现有配置的 `[recommend.ranker]` 中设置 `type = "decision"`；使用 Reranker 则设置为 `"reranker"`。

`--user-auc` 会在当前目录生成以模型名命名的 CSV。同名模型的下一次运行会覆盖文件，比较不同提示词或量化版本时应分别保存结果。本文的分组统计使用如下加权方式，而不是直接对 AUC 列取平均：

```python
import csv

with open("OpenJev-GGUF.csv", encoding="utf-8-sig", newline="") as f:
    rows = list(csv.DictReader(f))

weight = sum(int(row["Candidates"]) for row in rows)
gauc = sum(
    int(row["Candidates"]) * float(row["AUC"])
    for row in rows
) / weight
print(f"GAUC: {gauc:.4f}")
```

CSV 中的 AUC 已四舍五入到四位小数，因此重新汇总与程序内部的未舍入结果可能存在很小的差异。

## 选型前还需要验证什么

本次实验最明确的信号是：**OpenJev 和 Clef-Flash 值得作为推荐排序候选模型，与 Qwen3-Reranker 一起评估。** 但要据此选择生产模型，还缺少几项关键证据。

首先，需要固定相同的用户和候选集。当前导出结果覆盖 673–683 个用户，数量并不完全一致。代码会跳过最终请求失败的用户；同时，按时间划分的实现没有为相同时间戳增加固定的次级排序键，而 MovieLens 中存在同时间戳评分。现有记录不足以确定各次差异的具体来源。CSV 又没有保存用户 ID，无法在事后准确取用户交集，进行配对比较或计算可靠的差异置信区间。

其次，需要补全部署和运行信息。现有记录中的 `GGUF` 名称没有说明具体量化精度，也没有记录统一的硬件、推理后端版本、上下文截断策略、延迟和吞吐。因此，本文比较的是这些已保存运行的排序效果，不能据此判断速度、显存或调用成本。换量化版本和部署方式后应重新评估。

最后，需要用业务指标复核。GAUC 高不等于前十条推荐一定更好，也不代表点击率或留存一定提升。实际选型还应比较 NDCG@K 等头部排序指标，保留传统排序模型作为基线，并通过线上实验验证收益。

如果你的物品有较丰富的文本信息，可以从 OpenJev、Clef-Flash 和 Qwen3-Reranker-4B/8B 开始，在相同数据和资源预算下测试。如果已有成熟的 Reranker 服务，可以先接入决策模型做离线对照，再决定是否替换。对于缺少语义信息、依赖大量交互特征的场景，本次实验没有提供替代传统排序模型的依据。
