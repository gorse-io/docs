---
icon: evaluate_fill
---
# 评估

为了评估推荐系统的性能，需要进行评估。Gorse 提供在线评估和离线评估。

## 在线评估

推荐系统的目标是最大化每个用户喜欢推荐物品的概率。因此，在线评估的指标是积极反馈率

$$
\frac{1}{|U|}\sum_{i\in |U|}\frac{|R^p_u|}{|R^r_u|}
$$

其中 $R^r_u$ 是来自用户 $u$ 的已读反馈集合，$R^p_U$ 是特定积极反馈的集合。Gorse 每天计算积极率并将其绘制为仪表盘中的折线图。

## 离线评估

离线评估用于评估单个算法的性能。它允许用户检查单个算法的状态。因此，本节按不同算法组织。

### 评估因子分解机

因子分解机模型预测用户对物品给出积极反馈的概率。具有最高概率的物品被推荐给用户。评估算法估计给定用户和物品对的预测质量。数据集将被分为训练数据集和测试数据集。将在测试数据集上计算以下指标。

$$
\text{precision}=\frac{tp}{tp+fp}
$$

其中 $tp=|\{i|y_i=1\wedge\hat y_i=1\}|$ 和 $fp=|\{i|y_i=0\wedge \hat y_i=1\}|$。

$$
\text{recall}=\frac{tp}{tp+fn}
$$

其中 $fn=\{i|y_i=1\wedge \hat y_i=0\}$。

$$
\text{AUC}=\sum_{i\in P}\sum_{j \in N}\frac{\mathbb{I}(\hat y_i>\hat y_j)}{|P||N|}
$$

其中 $P=\{i|y_i=1\}$ 和 $N=\{i|y_i=0\}$。AUC 在 Gorse 中用作选择最佳模型的主要指标。

### 评估协同过滤（矩阵分解）

矩阵分解从消极反馈和未观察到的反馈中过滤出积极反馈。对于每个用户，Gorse 从其他积极反馈中随机留下一个反馈作为测试物品。期望矩阵分解模型将测试物品排在其他未观察到的物品之前。由于在评估期间为每个用户对所有物品进行排名太耗时，Gorse 遵循了通用策略[^1]，即随机抽取 100 个未与用户交互的物品，在 100 个物品中对测试物品进行排名。

矩阵分解在前 10 个推荐中进行评估。假设矩阵分解向用户 $u$ 推荐 10 个物品 $\hat I^{(10)}_u$，测试物品为 $i_u$

$$
\text{NDCG@10}=\sum_{u \in U}\sum_{i=1}^{10}\frac{\mathbb{I}(i=\hat I^{(10)}_{u,i})}{\log_2(i+1)}
$$

$$
\text{Precision@10}=\sum_{u \in U}\sum_{i=1}^{10}\frac{\mathbb{I}(i=\hat I^{(10)}_{u,i})}{10|U|}
$$

$$
\text{Recall@10}=\sum_{u \in U}\sum_{i=1}^{10}\frac{\mathbb{I}(i=\hat I^{(10)}_{u,i})}{|I_u|}
$$

其中 $\mathbb{I}(i=\hat I^{(10)}_{u,i})$ 是前 10 个推荐中的第 $i$-th 个物品。NDCG@10 在 Gorse 中用作选择最佳模型的主要指标。

[^1]: He, Xiangnan, et al. "Neural collaborative filtering." Proceedings of the 26th international conference on world wide web. 2017.


