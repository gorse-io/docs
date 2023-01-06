---
icon: zhinengsuanfa
---

# 推荐算法

Gorse 已经实现了多种类型的推荐算法，包括非个性化推荐和个性化推荐。这些推荐算法是构成推荐工作流程的基础模块。

用数学公式介绍复杂的算法比较方便，本节中使用的数学符号定义如下。

符号 | 含义
--- | ---
$n$ | `<cache_size>`
$R$ | 正反馈集合
$\not R$ | 负反馈集合
$I$ | 物品集合
$I_u$ | 用户$u$喜欢的物品的集合
$I_l$ | 具有标签$l$的物品的集合
$U$ | 用户集合
$U_l$ | 具有标签$l$的用户的集合
$L_u$ | 用户$u$的标签
$L_i$ | 物品$i$的标签
$L_U$ | 所有用户使用的标签
$L_I$ | 所有物品使用的标签
$\mathcal{N}_u$ | 用户$u$的相似用户
$\mathcal{N}_i$ | 物品$i$的相似物品
$\mathbb{I}(p)$ | 如果条件$p$满足则等于1，否则等于0

::: tip

`<cache_size>`来自于配置文件。

```toml
[recommend]

# The cache size for recommended/popular/latest items. The default value is 100.
cache_size = 100
```

:::

## 非个性化推荐算法

非个性化算法向所有用户推荐相同的内容。

### 最新物品推荐

根据时间戳向用户展示最新的物品，可以让新内容及时暴露给用户。要在 Gorse 中启用最新推荐，您需要为物品设置时间戳信息。如果没有时间戳，Gorse 将不会生成最新物品列表。

最新物品推荐相当于以下SQL：

```sql
select item_id from items order by time_stamp desc limit <cache_size>;
```

### 人气物品推荐

许多网站向用户显示最近的热门，如Twitter的趋势。流行物品的推荐相当于以下SQL：

```sql
select item_id from (
    select item_id, count(*) as feedback_count from feedback
    where feedback_type in <positive_feedback_types>
        and time_stamp >= NOW() - INTERVAL <popular_window>
    group by item_id) t
order by feedback_count desc limit <cache_size>;
```

::: tip

配置文件中的`<popular_window> `对应的是热门物品的窗口。

```toml
[recommend.popular]

# The time window of popular items. The default values is 4320h.
popular_window = "720h"
```

:::

## 相似算法

在很多情况下，用户喜欢特定类型的物品，例如解密游戏玩家喜欢解谜游戏、B站的年轻小伙子喜欢看小姐姐跳舞。

### 物品相似度

如果一个物品与另一个物品比其他物品有更多的共同用户或标签，则该物品与另一个物品更相似。余弦相似度非常适合度量两个物品之间的相似度。由于每个用户或标签的重要性不同，我们使用 IDF 来计算每个用户或标签的权重。

- **标签权重**：标签权重定义如下

$$ w_l = -\log\left(\frac{|I_l|}{|I|}\right) $$

如果一个标签被更多的物品使用，则该标签更通用所以权重更低。

- **用户权重**：用户权重定义为

$$ w_u = -\log\left(\frac{|I_u|}{|I|}\right) $$

如果一个用户很多喜欢的物品，就意味着这个用户有更广泛的兴趣，他或她的权重更小。

基于标签权重和用户权重，Gorse实现了三种相似度算法：

- **相似：** 根据物品之间的标签重叠程度来计算相似度

$$ s_{ij} = \frac{\sum_{l\in L_i \cap L_j}w_l}{\sqrt{\sum_{l\in L_i}w_l^2}\sqrt{\sum_{l\in L_j}w_l^2}} $$

- **相关：** 根据物品之间用户的重叠程度计算相似度。

$$ s_{ij} = \frac{\sum_{u\in U_i \cap U_j}w_u}{\sqrt{\sum_{u\in U_i}w_u^2}\sqrt{\sum_{u\in U_j}w_u^2}} $$

- **自动：** 根据物品之间的标签重叠程度和用户重叠程度来计算相似度。

$$ s_{ij} = \frac{\sum_{l\in L_i \cap L_j}w_l + \sum_{u\in U_i \cap U_j}w_u}{\sqrt{\sum_{l\in L_i}w_l^2 + \sum_{u\in U_i}w_u^2}\sqrt{\sum_{l\in L_j}w_l^2 + \sum_{u\in U_j}w_u^2}} $$

对于每个物品，相似度最高的$n$个物品将被缓存为这个物品的相似物品。物品相似度算法可以在配置文件中设置。

```toml
[recommend.item_neighbors]

# The type of neighbors for items. There are three types:
#   similar: Neighbors are found by number of common labels.
#   related: Neighbors are found by number of common users.
#   auto: Neighbors are found by number of common labels and users.
# The default value is "auto".
neighbor_type = "similar"
```

如果物品有高质量的标签，`similar`是最佳选择。如果物品没有标签，则使用`related`。对于其他情况，请考虑`auto`。

### 用户相似度

用户相似度的计算与物品相似度的计算类似。首先，我们使用IDF来计算每个物品或标签的权重。

- **标签权重**：标签权重定义如下

$$ w_l = -\log\left(\frac{|U_l|}{|U|}\right) $$

如果一个标签被更多的用户使用，这个标签就更通用，权重也更小。

- **物品权重**：物品权重定义如下

$$ w_i = -\log\left(\frac{|U_i|}{|U|}\right) $$

如果一个物品有更多的用户，这意味着这个物品很受欢迎，表示用户的偏好时权重也就更低。

基于标签权重和物品权重，Gorse 实现了三种相似度算法：

- **相似：** 根据用户之间的标签重叠程度来计算相似度

$$ s_{uv} = \frac{\sum_{l\in L_u \cap L_v}w_l}{\sqrt{\sum_{l\in L_u}w_l^2}\sqrt{\sum_{l\in L_v}w_l^2}} $$

- **相关：** 根据用户之间的物品重叠程度来计算相似度。

$$ s_{uv} = \frac{\sum_{i\in I_u \cap I_v}w_i}{\sqrt{\sum_{i\in I_u}w_i^2}\sqrt{\sum_{i\in I_v}w_i^2}} $$

- **自动：** 根据用户之间的标签重叠程度和物品重叠程度来计算相似度。

$$ s_{uv} = \frac{\sum_{l\in L_u \cap L_v}w_l + \sum_{i\in I_u \cap I_v}w_i}{\sqrt{\sum_{l\in L_u}w_l^2 + \sum_{i\in I_u}w_i^2}\sqrt{\sum_{l\in L_v}w_l^2 + \sum_{i\in I_v}w_i^2}} $$

对于每个用户，相似度最高的n$用户将被缓存为该用户的相似用户。用户相似度的算法可以在配置文件中设置。

```toml
[recommend.user_neighbors]

# The type of neighbors for users. There are three types:
#   similar: Neighbors are found by number of common labels.
#   related: Neighbors are found by number of common favorite items.
#   auto: Neighbors are found by number of common labels and favorite items.
# The default value is "auto".
neighbor_type = "similar"
```

如果用户附加了高质量的标签，`similar`是最佳选择。如果用户没有标签，则使用`related`。对于其他情况，可以考虑`auto`。

### 聚类索引

Gorse 需要为每个用户和物品生成相似推荐，但这是一个昂贵的过程。通过暴力为所有物品生成相似推荐的复杂度是$O(|I|^2)$（为简单起见，假设相似度计算的复杂度是恒定的）。聚类索引[^9]在可接受的精度衰减的情况下，为每个物品搜索相似物品的效率更高。聚类索引的使用过程包括两个步骤

1. **聚类：** 使用*spherical k-means*算法将物品聚类到$k$类，类的中心点为$c_i$（$i/in{1./dots,K}$）。每个物品$j$都属于第$a_j$类。

> - $a_j \leftarrow \text{rand}(k)$
> - **while** $c_i$ 或 $a_j$ 在上一步迭代中发生改变 **do**
>     - $c_i \leftarrow$ 第 $i$ 类的中心点
>     - $a_j \leftarrow \argmax_{i\in{1,\dots,K}}s_{c_i j}$
> - **end while**

1. **搜索：** 搜索物品$i'$的相似物品

> - 第1步，找到与物品$i'$最近的$L$个中心点。
> - 第2步，在$L$个类包含的物品上找到与$i'$最近的$n$个物品。

时间复杂度为$O(|I|TK+|I|L/K)$，其中$T$是停止聚类算法的最大迭代数。在 Gorse 实现中，$K= \sqrt{|I|}$，时间复杂度变为$O(\sqrt{|I|}(|I|T+L))$。因此，如果$T\ll \sqrt{|T|}$，聚类索引是高效的。

聚类索引可以通过`enable_index`打开和关闭，默认情况下是打开的。聚类索引需要设置参数$L$，也就是要查询的聚类数量。太小的$L$会导致索引无法达到要求的召回率，而太大的$L$则会降低性能。构建过程中会尝试增加$L$。如果查询召回率达到`index_recall`，或者增长次数达到`index_fit_epoch`，构建过程将停止增加$L$。

```toml
[recommend.item_neighbors]

# Enable approximate item neighbor searching using vector index. The default value is true.
enable_index = true

# Minimal recall for approximate item neighbor searching. The default value is 0.8.
index_recall = 0.8

# Maximal number of fit epochs for approximate item neighbor searching vector index. The default value is 3.
index_fit_epoch = 3

[recommend.user_neighbors]

# Enable approximate user neighbor searching using vector index. The default value is true.
enable_index = true

# Minimal recall for approximate user neighbor searching. The default value is 0.8.
index_recall = 0.8

# Maximal number of fit epochs for approximate user neighbor searching vector index. The default value is 3.
index_fit_epoch = 3
```

## 个性化推荐算法

现在有很多花哨的推荐算法，其中大部分是基于深度学习的[^4]。然而，我们认为没有深度学习的传统方法足以实现至少可以用的推荐性能。

### 基于物品相似度的推荐

对于一个喜爱物品$I_u$的用户，如果我们知道任何一对物品之间的相似性，那么用户$u$喜欢一个物品$i$的概率通过该物品$i$与喜爱物品之间的相似性之和预测的。

$$ \hat{y}*{ui}=\sum*{j\in I_u}s_{ij} $$

其中$s_{ij}$是物品$i$和物品目$j$之间的相似度。对于一个用户来说，在整个项目集中搜索推荐物品的时间复杂度为$O(|I_u||I|)$。在实践中，对于大多数成对的两个物品，它们的相似度为零。因此，我们可以在最喜欢的物品的相似推荐中搜索推荐物品。

1. 从喜欢的物品的相似推荐中收据候选物品。

$$ C = \bigcup_{j\in I_u}\mathcal{N}_j $$

1. 对于$C$中的每个物品$i$，通过以下方式计算预测分数

$$ \hat{y}*{ui}=\sum*{j\in I_u}s_{ij}\mathbb{I}(i\in\mathcal{N}_j) $$

其中$mathbb{I}(i\in\mathcal{N}_j)$表示只有当$i$在$j$的相似物品中时，相似度才会被加到预测分数上。由于Gorse只缓存每个物品前n$个相似物品及其相似度，所以很多相似度在缓存是缺失的。优化算法的时间复杂度为$O(|I_u|n)$。

### 基于用户相似度的推荐

基于用户相似性的推荐与基于物品相似性的推荐非常类似。

1. 从用户的相似用户的最爱物品中收集候选物品。

$$ C = \bigcup_{v\in\mathcal{N}_u}I_v $$

1. 对于$C$中的每个物品$i$，通过以下公式计算预测分数

$$ \hat{y}*{ui} = \sum*{v\in\mathcal{N}*u}s*{uv}\mathbb{I}(i\in I_v) $$

$mathbb{I}(i/in I_v)$表示只有当$i$受到用户$v$的青睐时，相似度才会被加到预测分数上。时间复杂度也是$O(|I_u|n)$。

### 矩阵分解

在矩阵分解模型中，物品和用户由向量表示。一个用户$u$喜欢一个物品$i$的概率是由两个向量的点乘来预测的。

$$ \hat y_{ui}=\mathbf{p}_u^T \mathbf{q}_i $$

其中$mathbf{p}_u$是用户$u$的嵌入向量，$mathbf{q}_i$是物品$i$的嵌入向量。矩阵分解的模型很简单，但有不止一种训练算法。

#### BPR

BPR[^1]（Bayesian Personalized Ranking）是一种基于对优化的训练算法。BPR的训练数据由三元组集合构成。

$$ D_s={(u,i,j)|i\in I_u\wedge I \setminus I_u} $$

D_S$中$(u, i, j)的表示用户$u$喜欢$i$而不是$j$。

为所有物品寻找最优的个性化排名的贝叶斯公式是使以下后验概率的最大化，其中$Theta$代表矩阵分解模型的参数

$$ p(\Theta|&gt;_u) \propto p(&gt;_u|\Theta)p(\Theta) $$

其中$&gt;_u$是用户$u$的期望但不为人知的偏好。所有的用户都被认为是独立的。BPR还假设特定用户的每对物品$(i, j)$的排序与其他每对物品的排序无关。因此，上述针对用户的似然函数$p(&gt;_u|Theta)$首先可以改写为单个密度的乘积，其次可以对所有用户$u/in U$进行组合。

$$ \prod_{u\in U}p(&gt;*u|\Theta)=\prod*{(u,i,j)\in D_s}p(i&gt;_u j|\Theta) $$

其中$p(i&gt;*u j||Theta)=\sigma(\hat y*{uij})$，$hat y_{uij}=\hat y_{ui}- \hat y_{uj}$。

对于参数，BPR引入了一般的先验密度$p(\Theta)$，这是一个正态分布，均值为零，方差矩阵为$Sigma_\Theta$。

$$ p(\Theta) \sim N(0,\Sigma_\Theta) $$

其中$Σ_Θ = λ_ΘI$。那么，个性化排序的优化目标是

$$ \begin{split} \text{BPR-OPT}&amp;=\ln p(\Theta|&gt;*u)\ &amp;=\ln p(&gt;*u|\Theta)p(\Theta)\ &amp;=\ln\prod*{(u,i,j)\in D_s}\sigma(\hat y*{uij})p(\Theta)\ &amp;=\sum_{(u,i,j)\in D_s}\ln \sigma(\hat y_{uij})+\ln p(\Theta)\ &amp;=\sum_{(u,i,j)\in D_s}\ln \sigma(\hat y_{uij})-\lambda_\Theta|\Theta|^2 \end{split} $$

BPR-Opt 中模型参数的梯度为：

$$ \begin{split} \frac{\partial\text{BPR-OPT}}{\partial\Theta}&amp;=\sum_{(u,i,j)\in D_s}\frac{\partial}{\partial\Theta}\ln\sigma(\hat x_{uij})-\lambda_\Theta\frac{\partial}{\partial\Theta}|\Theta|^2\ &amp;\propto\sum_{(u,i,j)\in D_s}\frac{-e^{-\hat y_{uij}}}{1+e^{-\hat y_{uij}}}\cdot \frac{\partial}{\partial\Theta}\hat y_{uij}-\lambda_\Theta\Theta\ \end{split} $$

基于自举抽样三元组的随机梯度训练算法如下：

> - 初始化 $\Theta$
>     - **repeat**
>         - 从 $D_s$ 采样得到 $(u,i,j)$
>         - $\Theta\leftarrow\Theta+\alpha\left(\frac{e^{-\hat y_{uij}}}{1+e^{-\hat y_{uij}}}\cdot \frac{\partial}{\partial\Theta}\hat y_{uij}+\lambda_\Theta\Theta\right)$
>     - **util** 收敛
> - **return** $\Theta$

其中$alpha$ 为学习率。嵌入向量的梯度为

$$ \frac{\partial}{\partial\theta}\hat y_{uij}=\begin{cases} (q_{if}-q_{jf})&amp;\text{if }\theta=p_{uf}\ p_uf&amp;\text{if }\theta=q_if\ -p_uf&amp;\text{if }\theta=q_{jf}\ 0&amp;\text{else} \end{cases} $$

#### eALS

eALS[^2]是一种基于点优化的训练算法。对于一对用户$u$和物品$i$，用于训练的基础事实是

$$ y_{ui}=\begin{cases} 1&amp;i\in I_u\ 0&amp;i\notin I_u \end{cases} $$

嵌入向量通过最小化以下代价函数进行优化[^8]：

$$ \mathcal{C} = \sum_{u\in U}\sum_{i \in I}w_{ui}(y_{ui}-\hat{y}*{ui}^f)^2 + \lambda\left(\sum*{u \in U}|\mathcal{p}|^2+\sum_{i \in I}|\mathbf{q}_i|^2\right) $$

其中，$hat{y}*{ui}^f=$hat{y}*{ui}-p_{uf}q_{if}$，$w_{ui}$为反馈的权重。

$$ w_{ui}=\begin{cases} 1&amp;i\in I_u\ \alpha&amp;i\notin I_u \end{cases} $$

$\alpha$ ($\alpha &lt; 1$) is the weight for negative feedbacks. The derivative of the objective function with respect to $p_{uf}$ is

$$ \frac{\partial J}{\partial p_{uf}}=-2\sum_{i\in I}(y_{ui}-\hat y_{ui}^f)w_{ui}q_{uf} + 2p_{uf}\sum_{i\in I}w_{ui}q_{if}^2 + 2\lambda p_{uf} $$

通过将此导数设为0，得到$p_{uf}$的解（公式1）。

$$ \begin{split} p_{uf} &amp;= \frac{\sum_{i \in I}(y_{ui}-\hat y_{ui}^f)w_{ui}q_{if}}{\sum_{i \in I}w_{ui}q^2_{if}+\lambda}\ &amp;=\frac{\sum_{i\in I_u}(y_{ui}-\hat{y}*{ui}^f)q*{if}-\sum_{i\in I_u}\hat{y}*{ui}^f\alpha q*{if}}{\sum_{i\in I_u}q^2_{if}+\sum_{i \in I_u}\alpha q_{if}^2+\lambda}\ &amp;=\frac{\sum_{i\in I_u}[y_{ui}-(1-\alpha)\hat{y}*{ui}^f]q*{if}-\sum_{k\neq f}p_{uk}s^q_{kf}}{\sum_{i\in I_u}(1-\alpha)q^2_{if}+\alpha s^q_{ff}+\lambda} \end{split} $$

其中$s^q_{kf}$表示$(k, f)^\text{th}$的$mathbf{S}^q$缓存的元素，定义为$mathbf{S}^q = \mathbf{Q}^T\mathbf{Q}$。同理，得到一个物品嵌入向量的最优解（公式2）。

$$ q_{if} = \frac{\sum_{u \in U_i}(y_{ui}-(1-\alpha)\hat y_{ui})p_{uf}-\alpha\sum_{k\neq f}q_{ik}s^p_{kf}}{\sum_{u \in U_i}(1-\alpha)p^2_{uf} + \alpha s^p_{ff} + \lambda} $$

其中$s^p_{kf}$表示$mathbf{S}^p$缓存的第$(k, f)^\text{th}$个元素，定义为$mathbf{S}^p = \mathbf{P}^T\mathbf{P}$。该训练算法总结为

> - 随机初始化 $\mathbf{P}$ 和 $\mathbf{Q}$
> - **for** $(u, i)\in R$ **do** $\hat{y}_{ui}=\mathbf{p}_u^T\mathbf{q}_i$
> - **while** 结束条件满足则停止 **do**
>     - $\mathbf{S}^q = \mathbf{Q}^T\mathbf{Q}$
>     - **for** $u \leftarrow 1$ **to** $M$ **do**
>         - **for** $f \leftarrow 1$ **to** $K$ **do**
>             - **for** $i \in I_u$ **do** $\hat{y}*{ui}\leftarrow\hat{y}*{ui}^f-p_{uf}q_{if}$
>             - $p_{uf}\leftarrow$ Eq 1
>             - **for** $i \in I_u$ **do** $\hat{y}*{ui}\leftarrow\hat{y}*{ui}^f+p_{uf}q_{if}$
>         - **end**
>     - **end**
>     - $\mathbf{S}^p=\mathbf{P}^T\mathbf{P}$
>     - **for** $i \leftarrow 1$ **to** $N$ **do**
>         - **for** $f \leftarrow 1$ **to** $K$ **do**
>             - **for** $u \in U_i$ **do** $\hat{y}*{ui}\leftarrow\hat{y}*{ui}^f-p_{uf}q_{if}$
>             - $q_{if}\leftarrow$ Eq 2
>             - **for** $u \in U_i$ **do** $\hat{y}*{ui}\leftarrow\hat{y}*{ui}^f+p_{uf}q_{if}$
>         - **end**
>     - **end**
> - **return** $\mathbf{P}$ 和 $\mathbf{Q}$

#### 超参的随机搜索

有一些用于模型训练的超参，如学习率、正则化系数等。Gorse 使用随机搜索[^5]来寻找最佳超参。超参的优化行为由`model_search_epoch`和`model_search_trials`设置。大的值可能会产生更好的推荐结果，但要花费更多的CPU时间。最佳的模型超参组合是相对稳定的，除非数据集发生巨大的变化。

```toml
[recommend.collaborative]

# The number of epochs for model searching. The default value is 100.
model_search_epoch = 100

# The number of trials for model searching. The default value is 10.
model_search_trials = 10
```

#### HNSW 索引

Gorse 中的矩阵分解模型将用户和物品表示为嵌入向量。对于每个用户来说，嵌入向量与用户的点积大的物品被选为推荐物品。因此，搜索推荐物品最直观的方法是扫描所有物品，在扫描过程中计算嵌入向量的点积，并选择点积最大的前几个物品作为推荐结果。假设有N个用户和M个物品，为所有用户生成推荐结果的计算复杂度为$O(|I||U|)$。然而，如果物品和用户的数量很大，整体的计算量是不可接受的。

一个更有效的方法是使用向量索引HNSW[^10]。HNSW索引为所有物品向量创建了一个导航图。HNSW的结果并不准确，但召回率的小损失换回了性能提升。HNSW需要设置一个参数ef_construction，ef_construction太小会阻止向量索引达到所需的召回率，$text{ef_construction}$太大会降低搜索性能。构建过程试图会不断增加$text{ef_construction}$，如果召回率达到`index_recall`，或者如果迭代数达到`index_fit_epoch`，则停止增加$text{ef_construction}$。

```toml
[recommend.collaborative]

# Enable approximate collaborative filtering recommend using vector index. The default value is true.
enable_index = true

# Minimal recall for approximate collaborative filtering recommend. The default value is 0.9.
index_recall = 0.9

# Maximal number of fit epochs for approximate collaborative filtering recommend vector index. The default value is 3.
index_fit_epoch = 3
```

::: note

HNSW索引很复杂，欲了解更多信息，请阅读原始论文：https://arxiv.org/abs/1603.09320

:::

### 因子分解机

用户标签和物品标签是个性化推荐的重要信息，但矩阵分解只处理用户嵌入向量和物品嵌入向量。因式分解机[^3]能够利用丰富特征，如用户特征和物品特征。

与矩阵分解的训练算法不同，因子分解机的训练需要用到负反馈。训练数据集的构建方法是

$$ D={((x_1,\dots,x_f,\dots,x_F),1)|(u,i)\in R}\cup{((x_1,\dots,x_f,\dots,x_F),0)|(u,i)\in\not R} $$

输入向量的维度$mathbf{x}$是物品数量、用户数量、物品标签数量和用户标签数量之和$f = |i| + |u| + |l_i| + |l_u|$。对于一对$(u,i)$来说，$mathbf{x}$中的每个元素的定义为

$$ x_f=\begin{cases} \mathbb{I}(f=u)&amp;0&lt;f\le |I|\ \mathbb{I}(f-|I|=u)&amp;|I|&lt;f\le |I|+|U|\ \mathbb{I}(f-|I|-|U|\in L_i)&amp;|I|+|U|&lt;f&lt;\le |I|+|U|+|L_I|\ \mathbb{I}(f-|I|-|U|-|L_U| \in L_u)&amp;|I|+|U|+|L_I|&lt;f&lt;\le F \end{cases} $$

对一个输入向量$mathbf{x}$的预测输出是

$$ \hat y = w_0 + \sum^n_{i=1}w_i x_i + \sum^n_{i=1}\sum^n_{j=i+1}\left&lt;\mathbf{v}_i,\mathbf{v}_j\right&gt;x_i x_j $$

其中需要训练的模型参数为$w_0\in\mathbb{R}$, $mathbf{w}\in\mathbb{R}^n$, $\mathbf{V}\in\mathbb{R}^{n\times k}$。$left&lt;\cdot,\cdot\right&gt;$是两个向量的点积。参数通过SGD针对logit代价函数进行优化。代价函数为

$$ \mathcal C=\sum_{(\mathbf{x},y)\in D}−y\log(\hat y)−(1−y)\log(1-\hat y) $$

每个参数的梯度为

$$ \frac{\partial}{\partial\theta}\hat y=\begin{cases} 1,&amp;\text{if }\theta\text{ is }w_0\ x_i,&amp;\text{if }\theta\text{ is }w_i\ x_i\sum^n_{j=1}v_{j,f}x_j-v_{i,f}x^2_i,&amp;\text{if }\theta\text{ is }v_{i,f} \end{cases} $$

超参同样通过随机搜索进行优化，继续使用`recommend.collaborative`这个配置项。

[^1]: Rendle, Steffen, et al. "BPR: Bayesian personalized ranking from implicit feedback." Proceedings of the Twenty-Fifth Conference on Uncertainty in Artificial Intelligence. 2009.

[^2]: He, Xiangnan, et al. "Fast matrix factorization for online recommendation with implicit feedback." Proceedings of the 39th International ACM SIGIR conference on Research and Development in Information Retrieval. 2016.

[^3]: Rendle, Steffen. "Factorization machines." 2010 IEEE International conference on data mining. IEEE, 2010.

[^4]: Zhang, Shuai, et al. "Deep learning based recommender system: A survey and new perspectives." ACM Computing Surveys (CSUR) 52.1 (2019): 1-38.

[^5]: Bergstra, James, and Yoshua Bengio. "Random search for hyper-parameter optimization." Journal of machine learning research 13.2 (2012).

[^6]: Auvolat, Alex, et al. "Clustering is efficient for approximate maximum inner product search." arXiv preprint arXiv:1507.05910 (2015).

[^7]: Malkov, Yu A., and Dmitry A. Yashunin. "Efficient and robust approximate nearest neighbor search using hierarchical navigable small world graphs." IEEE transactions on pattern analysis and machine intelligence 42.4 (2018): 824-836.

[^8]: Hu, Yifan, Yehuda Koren, and Chris Volinsky. "Collaborative filtering for implicit feedback datasets." 2008 Eighth IEEE international conference on data mining. Ieee, 2008.

[^9]: Auvolat, Alex, et al. "Clustering is efficient for approximate maximum inner product search." arXiv preprint arXiv:1507.05910 (2015).

[^10]: Malkov, Yu A., and Dmitry A. Yashunin. "Efficient and robust approximate nearest neighbor search using hierarchical navigable small world graphs." IEEE transactions on pattern analysis and machine intelligence 42.4 (2018): 824-836.


