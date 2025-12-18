---
icon: sort
---
# 排序

Gorse 合并来自多个推荐器的推荐，并对它们进行排序以产生最终的推荐列表。

## 配置

- `type` 是排序器类型。支持的排序器是：
  - `none` 表示不执行排序。
  - `fm` 使用因子分解机[^1]对推荐物品进行排序。
- `recommenders` 是其推荐被合并和排序的推荐器的名称。值应为以下之一：
  - `latest` 使用最新的物品推荐器。
  - `collaborative` 使用协同过滤推荐器。
  - `non-personalized/NAME` 使用名称为 `NAME` 的非个性化推荐器。
  - `item-to-item/NAME` 使用名称为 `NAME` 的物品到物品推荐器。
  - `user-to-user/NAME` 使用名称为 `NAME` 的用户到用户推荐器。
- `early_stopping.patience` 是在没有改进的情况下，因子分解机训练将停止的 epoch 数。默认为 `10`。

## 示例

在演示项目 [GitRec](https://gitrec.gorse.io/) 中，因子分解机用于对来自多个推荐器的推荐物品进行排序：
- 来自最新物品推荐器的最新仓库。
- 协同过滤推荐。
- 来自非个性化推荐器的过去一周最受关注的仓库。
- 来自物品到物品推荐器的相似仓库。
- 来自用户到用户推荐器的相似用户的积极反馈中的仓库。

```toml
[recommend.ranker]
type = "fm"
recommenders = ["latest", "collaborative", "non-personalized/most_starred_weekly", "item-to-item/neighbors", "user-to-user/neighbors"]
```

## 算法

### 因子分解机

与矩阵分解的学习算法不同，负反馈用于因子分解机训练。训练数据集由下式构成

$$ 
D=\{((x_1,\dots,x_f,\dots,x_F),1)|(u,i)\in R\}\cup\{((x_1,\dots,x_f,\dots,x_F),0)|(u,i)\notin R\} 
$$ 

输入向量 $\mathbf{x}$ 的维度是物品、用户、物品标签和用户标签数量的总和：$F = |I| + |U| + |L_I| + |L_U|$。对于一对 $(u,i)$，$\mathbf{x}$ 中的每个元素定义为

$$ x_f=\begin{cases} 
\mathbb{I}(f=u)&0<f\le |I|\
\mathbb{I}(f-|I|=u)&|I|<f\le |I|+|U|\
\mathbb{I}(f-|I|-|U|\in L_i)&|I|+|U|<f<\le |I|+|U|+|L_I|\
\mathbb{I}(f-|I|-|U|-|L_U| \in L_u)&|I|+|U|+|L_I|<f<\le F
\end{cases} 
$$ 

输入向量 $\mathbf{x}$ 的预测输出是

$$ 
\hat y = w_0 + \sum^n_{i=1}w_i x_i + \sum^n_{i=1}\sum^n_{j=i+1}\left<\mathbf{v}_i,\mathbf{v}_j\right>x_i x_j 
$$ 

其中必须估计的模型参数是：$w_0\in\mathbb{R}$，$\mathbf{w}\in\mathbb{R}^n$，$\mathbf{V}\in\mathbb{R}^{n\times k}$。而 $\left<\cdot,\cdot\right>$ 是两个向量的点积。参数通过带有 SGD 的 logit 损失进行优化。损失函数是

$$ 
\mathcal C=\sum_{(\mathbf{x},y)\in D}−y\log(\hat y)−(1−y)\log(1-\hat y) 
$$ 

每个参数的梯度是

$$ 
\frac{\partial}{\partial\theta}\hat y=\begin{cases}
1,&\quad ext{if }\theta\quad ext{ is }w_0\
x_i,&\quad ext{if }\theta\quad ext{ is }w_i\
x_i\sum^n_{j=1}v_{j,f}x_j-v_{i,f}x^2_i,&\quad ext{if }\theta\quad ext{ is }v_{i,f}
\end{cases} 
$$ 

[^1]: Rendle, Steffen. "Factorization machines." 2010 IEEE International conference on data mining. IEEE, 2010.
