---
icon: people
shortTitle: 用户到用户
---
# 用户到用户推荐算法

如果两个用户有相似的偏好，他们很可能会喜欢相同的物品。Gorse 实现了支持基于标签或喜爱物品的相似度的用户到用户推荐算法。

## 配置

用户到用户推荐算法需要显式配置。需要填写以下三个字段：
- `name` 是推荐算法的名称。
- `type` 是相似度类型，支持以下值：
  - `embedding` 是嵌入向量之间的欧几里得距离。
  - `tags` 是基于共同标签数量的相似度。
  - `items` 是基于共同喜爱物品数量的相似度。
- `column` 是推荐算法用于计算相似度的字段，用 [Expr](https://expr-lang.org/) 语言表示。

## 算法

### 嵌入相似度

两个物品分别有 $K$ 维嵌入向量 $p$ 和 $q$，它们之间的嵌入相似度为

$$
\sqrt{\sum^K_{k=1}(p_k-q_k)^2}
$$

### 标签相似度

首先，我们使用 IDF 计算每个标签的权重。标签权重定义为

$$
w_l = -\log\left(\frac{|U_l|}{|U|}\right)
$$

如果一个标签被更多用户使用，则该标签更通用，权重更低。然后，根据用户之间的标签重叠计算相似度

$$
\frac{\sum_{l\in L_u \cap L_v}w_l}{\sqrt{\sum_{l\in L_u}w_l^2}\sqrt{\sum_{l\in L_v}w_l^2}}
$$

### 物品相似度

首先，我们使用 IDF 计算每个物品的权重。

- **物品权重**：物品权重定义为

$$
w_i = -\log\left(\frac{|U_i|}{|U|}\right)
$$

如果一个物品有更多用户，这意味着该物品很受欢迎，但用于表征用户偏好的权重较低。然后，根据用户之间的物品重叠计算相似度。

$$
\frac{\sum_{i\in I_u \cap I_v}w_i}{\sqrt{\sum_{i\in I_u}w_i^2}\sqrt{\sum_{i\in I_v}w_i^2}}
$$

## 推荐

用户到用户推荐算法首先为目标用户找到相似用户，然后将相似用户的正反馈中的物品相加，最后按相似度分数对物品进行排序以获得最终推荐分数：

$$
\sum_{v \in S_u} s_{uv} \cdot \mathbf{1}_{i \in I_v}
$$

其中 $S_u$ 表示用户 $u$ 的相似用户集，$s_{uv}$ 表示用户 $u$ 和用户 $v$ 之间的相似度，$\mathbf{1}_{i \in I_v}$ 是一个指示函数，如果物品 $i$ 在用户 $v$ 的正反馈集中，则等于 1。

## API

您可以通过以下 API 访问相似用户：

```bash
curl http://localhost:8087/api/user-to-user/<name>/<user-id>
```

## 示例

例如，要根据从喜爱物品计算出的相似用户推荐物品，配置如下：

```toml
[recommend.user_neighbors]
name = "similar_users"
type = "items"
```
