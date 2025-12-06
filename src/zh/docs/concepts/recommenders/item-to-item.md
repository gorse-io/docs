---
icon: boxes
shortTitle: 物品到物品
---
# 物品到物品推荐算法

基于用户喜欢的物品推荐相似物品是一种简单有效的推荐策略。Gorse 实现了支持嵌入相似度、标签相似度和用户相似度的物品到物品推荐算法。

## 配置

物品到物品推荐算法需要显式配置。需要填写以下三个字段：
- `name` 是推荐算法的名称。
- `type` 是相似度类型，支持以下值：
  - `embedding` 是嵌入向量之间的欧几里得距离。
  - `tags` 是基于共同标签数量的相似度。
  - `users` 是基于共同用户数量的相似度。
- `column` 是推荐算法用于计算相似度的字段，用 [Expr](https://expr-lang.org/) 语言表示。假设 GitHub 仓库 README 的嵌入向量存储在 `Labels` 的 `embedding` 字段中，标签存储在 `topics` 字段中：

```json
{
    "ItemId": "gorse-io:gorse",
    "IsHidden": false,
    "Categories": [],
    "Timestamp": "2022-10-23T03:50:24Z",
    "Labels": {
        "embedding": [0.0017246103, -0.009725488, 0.005806058, -0.0187753, -0.015343021, ...],
        "topics": ["machine-learning", "service", "recommender", "go", "recommender-system", "knn", "collaborative-filtering"]
    },
    "Comment": "An open source recommender system service written in Go"
}
```

如果使用 `embedding` 相似度，column 的值应为 `item.Labels.embedding`；如果使用 `tags` 相似度，column 的值应为 `item.Labels.topics`。当 type 为 `embedding` 或 `tags` 时，column 不能为空。但是，当 type 为 `users` 时，column 必须为空。

## 算法

### 嵌入相似度

两个物品分别有 $K$ 维嵌入向量 $p$ 和 $q$，它们之间的嵌入相似度为

$$
\sqrt{\sum^K_{k=1}(p_k-q_k)^2}
$$

嵌入向量的维度通常比较大。例如，OpenAI 的 `text-embedding-3-small` 模型生成 1536 维的嵌入向量。与标签相比，使用嵌入向量需要更多的磁盘空间和内存。与标签相似度相比，将文本和图像编码为嵌入向量可以消除手动维护标签或自动生成标签的成本，并且嵌入向量计算的相似度更准确。嵌入向量可以从 OpenAI 和 Anthropic 等 AI 提供商提供的 API 生成，也可以从 [Ollama](https://ollama.com/) 和 [CLIP-as-service](https://clip-as-service.jina.ai/index.html) 等自部署项目生成。

### 标签相似度

标签相似度认为物品之间的重叠标签越多，它们就越相似。首先，计算每个标签的 TF-IDF

$$
w_l=-\log\left(\frac{|I|}{|I_l|}\right)
$$

其中 $|I|$ 表示物品总数，$I_l$ 表示带有标签 $l$ 的物品数量。如果一个标签被更多物品使用，它就更通用，因此权重更低。然后，计算物品之间的标签相似度

$$
\frac{\sum_{l\in L_i \cap L_j}w_l}{\sqrt{\sum_{l\in L_i}w_l^2}\sqrt{\sum_{l\in L_j}w_l^2}}
$$

其中 $L_i$ 和 $L_j$ 分别表示物品 $i$ 和物品 $j$ 的标签集。虽然标签相似度不如嵌入相似度准确，但它可以帮助用户发现更多具有相似性但也存在差异的内容。

### 用户相似度

用户相似度认为物品之间的重叠用户越多，它们就越相似。同样，首先需要计算每个用户的 TF-IDF

$$
w_u = -\log\left(\frac{|I|}{|I_u|}\right)
$$

其中 $|I|$ 表示物品总数，$|I_u|$ 表示喜欢物品 $u$ 的物品数量。然后，计算物品之间的用户相似度

$$
\frac{\sum_{u\in U_i \cap U_j}w_u}{\sqrt{\sum_{u\in U_i}w_u^2}\sqrt{\sum_{u\in U_j}w_u^2}}
$$

其中 $U_i$ 和 $U_j$ 分别表示物品 $i$ 和物品 $j$ 的用户集。用户相似度的一个缺点是它倾向于推荐热门物品，因为热门物品总是与其他物品有很高的用户重叠。

### 推荐

物品到物品推荐算法首先检索用户的正反馈，然后为每个有正反馈的物品找到相似物品，最后将相同物品的相似度分数相加得到最终推荐分数：

$$
\sum_{j \in F_u} s_{ij}
$$

其中 $F_u$ 表示用户 $u$ 有正反馈的物品集，$s_{ij}$ 表示物品 $i$ 和物品 $j$ 之间的相似度。

## API

您可以通过以下 API 访问相似物品：

```bash
curl http://localhost:8087/api/item-to-item/<name>/<item-id>
```

## 示例

以演示项目 [GitRec](https://gitrec.gorse.io/) 的数据集为例。GitHub 项目的 README 文件的嵌入向量存储在 `embedding` 字段中，标签保存在 `topics` 字段中。

```json
{
    "ItemId": "gorse-io:gorse",
    "IsHidden": false,
    "Categories": [],
    "Timestamp": "2022-10-23T03:50:24Z",
    "Labels": {
        "embedding": [0.0017246103, -0.009725488, 0.005806058, -0.0187753, -0.015343021, ...],
        "topics": ["machine-learning", "service", "recommender", "go", "recommender-system", "knn", "collaborative-filtering"]
    },
    "Comment": "An open source recommender system service written in Go"
}
```

基于嵌入相似度的物品到物品推荐算法的配置项：

```toml
[[recommend.item-to-item]]
name = "similar_embedding"
type = "embedding"
column = "item.Labels.embedding"
```
基于标签相似度的物品到物品推荐算法的配置项：

```toml
[[recommend.item-to-item]]
name = "similar_topics"
type = "tags"
column = "item.Labels.topics"
```
