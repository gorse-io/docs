---
icon: chart
---

# 效果评估

要观测推荐系统的推荐能力，需要进行效果评估。 Gorse 提供在线评估和离线评估。

## 在线评估

推荐系统的目标是最大化每个用户喜欢推荐物品的概率。因此，在线评估的指标是正反馈率

$$ \text{positive rate}=\frac{1}{|U|}\sum_{i\in |U|}\frac{|R^p_u|}{|R^r_u|} $$

其中 $R^r_u$ 是来自用户 $u$ 的已读反馈集合，$R^p_U$ 是某类型正反馈集合。 Gorse 每天计算正反馈率并将其绘制为折线图。

例如，在[GitRec](https://gitrec.gorse.io/#/)中有两种正反馈类型（“喜欢”和“点赞”）。因此，喜欢率和点赞率显示在控制台的概览页面上。

![](../../../img/dashboard-overview.png)

## 离线评估

离线评估用于评估单个算法的推荐能力。它允许用户检查单个算法的状态。因此，本节按照不同的算法组织。

### 因子分解机

因子分解机模型预测用户对物品给出正反馈的概率。向用户推荐具有最高概率的物品。评估算法估计给定用户和物品情况下的预测质量。数据集将分为训练数据集和测试数据集，在测试数据集上计算以下指标。

$$ \text{precision}=\frac{tp}{tp+fp} $$

其中 $tp=|{i|y_i=1\wedge\hat y_i=1}|$ 和 $fp=|{i|y_i=0\wedge\hat y_i=1}|$。

$$ \text{recall}=\frac{tp}{tp+fn} $$

其中 $fn={i|y_i=1\wedge\hat y_i=0}$。

$$ \text{AUC}=\sum_{i\in P}\sum_{j \in N}\frac{\mathbb{I}(\hat y_i&gt;\hat y_j)}{|P||N|} $$

其中 $P={i|y_i=1}$ 和 $N={i|y_i=0}$。

### 矩阵分解

矩阵分解从负反馈和未观察到的反馈中挑选出正反馈。对于每个用户，Gorse 从其他正反馈中随机留下一个反馈作为测试物品。矩阵分解模型被希望将测试物品排在其他未观察到的物品之前。由于在评估期间为每个用户对所有物品进行排名太耗时，Gorse随机抽取 100 个未与用户交互的物品 [^1] ，在 100 个物品中对测试物品进行排名。

矩阵分解在前 10 个推荐物品中进行评估。假设矩阵分解向用户$u$推荐了10个物品$\hat I^{(10)}_u$，测试物品为$i_u$

$$ \text{HR@10}=\sum_{u\in U}\frac{\mathbb{I}(i_u \in \hat I^{(10)}_u)}{|U|} $$

$$ \text{NDCG@10}=\sum_{u \in U}\sum_{i=1}^{10}\frac{\mathbb{I}(i=\hat I^{(10)}_{u,i})}{\log_2(i+1)} $$

其中 $\mathbb{I}(i=\hat I^{(10)}_{u,i})$ 是前 10 个推荐物品中的第 $i$ 个物品。

### 聚类索引和 HNSW 索引

聚类索引用于加速搜索相似用户（物品），而 HNSW 索引用于加速矩阵分解的推荐。索引的质量通过召回率来评估：

$$ \text{recall@n}=\frac{|\text{索引搜索得到的top n}|}{|\text{暴力搜索得到的top n}|} $$

::: tip

索引的召回率在仪表板主页的“系统状态”部分可以查看。

![](../../../img/evaluation-neighbor-index-recall.jpeg =400x) ![](../../../img/evaluation-mf-index-recall.jpeg =400x)

如果某个索引的召回率极低，请考虑关闭该索引。

:::

[^1]: He, Xiangnan, et al. "Neural collaborative filtering." Proceedings of the 26th international conference on world wide web. 2017.


