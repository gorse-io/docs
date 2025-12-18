---
icon: collaborate_sider
shortTitle: 协同过滤
---
# 协同过滤

Gorse 使用矩阵分解[^3]作为协同过滤算法来提供个性化推荐。矩阵分解是推荐系统中广泛使用的一种技术，它通过在共享的潜在空间中表示用户和物品来对用户-物品交互进行建模。

## 矩阵分解

在矩阵分解中，物品和用户由向量表示。用户 $u$ 喜欢物品 $i$ 的概率由两个向量的点积预测。

$$
\hat y_{ui}=\mathbf{p}_u^T \mathbf{q}_i
$$

其中 $\mathbf{p}_u$ 是用户 $u$ 的嵌入向量，$\mathbf{q}_i$ 是物品 $i$ 的嵌入向量。矩阵分解的模型很简单，但有不止一种训练算法。

#### BPR

BPR[^1] (Bayesian Personalized Ranking) 是一种成对训练算法。BPR 的训练数据由一组三元组组成：

$$
D_s=\{(u,i,j)|i\in I_u\wedge j\in I \setminus I_u\}
$$

$(u, i, j) \in D_S$ 的语义是假设用户 $u$ 相比 $j$ 更喜欢 $i$。负例被隐式地考虑。

为所有物品找到正确的个性化排名的贝叶斯公式是最大化以下后验概率，其中 $\Theta$ 表示矩阵分解模型的参数向量

$$
p(\Theta|>_u) \propto p(>_u|\Theta)p(\Theta)
$$

其中 $>_u$ 是用户 $u$ 期望但潜在的偏好。所有用户被假定为彼此独立行动。BPR 还假设特定用户对每对物品 $(i, j)$ 的排序独立于其他每一对的排序。因此，上述特定于用户的似然函数 $p(>_u|\Theta)$ 可以首先重写为单个密度的乘积，其次可以针对所有用户 $u \in U$ 进行组合。

$$
\prod_{u\in U}p(>_u|\Theta)=\prod_{(u,i,j)\in D_s}p(i>_u j|\Theta)
$$

其中 $p(i>_u j|\Theta)=\sigma(\hat y_{uij})$ 且 $\hat y_{uij}=\hat y_{ui} - \hat y_{uj}$。

对于参数向量，BPR 引入了一个通用的先验密度 $p(\Theta)$，它是一个均值为零且方差-协方差矩阵为 $\Sigma_\Theta$ 的正态分布。

$$
p(\Theta) \sim N(0,\Sigma_\Theta)
$$

其中 $Σ_Θ = λ_ΘI$。那么个性化排名的优化标准是

$$
\begin{split}
\text{BPR-OPT}&=\ln p(\Theta|>_u)\\
&=\ln p(>_u|\Theta)p(\Theta)\\
&=\ln\prod_{(u,i,j)\in D_s}\sigma(\hat y_{uij})p(\Theta)\\
&=\sum_{(u,i,j)\in D_s}\ln \sigma(\hat y_{uij})+\ln p(\Theta)\\
&=\sum_{(u,i,j)\in D_s}\ln \sigma(\hat y_{uij})-\lambda_\Theta\|\Theta\|^2
\end{split
$$

BPR-Opt 关于模型参数的梯度是：

$$
\begin{split}
\frac{\partial\text{BPR-OPT}}{\partial\Theta}&=\sum_{(u,i,j)\in D_s}\frac{\partial}{\partial\Theta}\ln\sigma(\hat x_{uij})-\lambda_\Theta\frac{\partial}{\partial\Theta}\|\Theta\|^2\\
&\propto\sum_{(u,i,j)\in D_s}\frac{-e^{-\hat y_{uij}}}{1+e^{-\hat y_{uij}}}\cdot \frac{\partial}{\partial\Theta}\hat y_{uij}-\lambda_\Theta\Theta\\
\end{split}
$$

基于训练三元组的 bootstrap 采样的随机梯度下降算法如下：

> - initialize $\Theta$
>   - **repeat**
>     - draw $(u,i,j)$ from $D_s$
>     - $\Theta\leftarrow\Theta+\alpha\left(\frac{e^{-\hat y_{uij}}}{1+e^{-\hat y_{uij}}}\cdot \frac{\partial}{\partial\Theta}\hat y_{uij}+\lambda_\Theta\Theta\right)$
>   - **util** convergence
> - **return** $\Theta$

其中 $\alpha$ 是学习率。嵌入向量的导数是

$$
\frac{\partial}{\partial\theta}\hat y_{uij}=\begin{cases}
(q_{if}-q_{jf})&\text{if }\theta=p_{uf}\\
p_uf&\text{if }\theta=q_if\\
-p_uf&\text{if }\theta=q_{jf}\\
0&\text{else}
\end{cases}
$$

#### eALS

eALS[^2] 是一种逐点训练算法。对于用户 $u$ 和物品 $i$ 的一对，训练的真实值是

$$
y_{ui}=\begin{cases}
1&i\in I_u\\
0&i\notin I_u
\end{cases}
$$

嵌入向量通过最小化以下成本函数[^8]来优化：

$$
\mathcal{C} = \sum_{u\in U}\sum_{i \in I}w_{ui}(y_{ui}-\hat{y}_{ui}^f)^2 + \lambda\left(\sum_{u \in U}\|\mathcal{p}\|^2+\sum_{i \in I}\|\mathbf{q}_i\|^2\right)
$$

其中 $\hat{y}_{ui}^f=\hat{y}_{ui}-p_{uf}q_{if}$ 且 $w_{ui}$ 是反馈的权重

$$
w_{ui}=\begin{cases}
1&i\in I_u\\
\alpha&i\notin I_u
\end{cases}
$$

$\alpha$ ($\alpha < 1$) 是负反馈的权重。目标函数关于 $p_{uf}$ 的导数是

$$
\frac{\partial J}{\partial p_{uf}}=-2\sum_{i\in I}(y_{ui}-\hat y_{ui}^f)w_{ui}q_{uf} + 2p_{uf}\sum_{i\in I}w_{ui}q_{if}^2 + 2\lambda p_{uf}
$$

通过将此导数设为 0，获得 $p_{uf}$ 的解 (Eq 1)：

$$
\begin{split}
p_{uf} &= \frac{\sum_{i \in I}(y_{ui}-\hat y_{ui}^f)w_{ui}q_{if}}{\sum_{i \in I}w_{ui}q^2_{if}+\lambda}\\
&=\frac{\sum_{i\in I_u}(y_{ui}-\hat{y}_{ui}^f)q_{if}-\sum_{i\in I_u}\hat{y}_{ui}^f\alpha q_{if}}{\sum_{i\in I_u}q^2_{if}+\sum_{i \in I_u}\alpha q_{if}^2+\lambda}\\
&=\frac{\sum_{i\in I_u}[y_{ui}-(1-\alpha)\hat{y}_{ui}^f]q_{if}-\sum_{k\neq f}p_{uk}s^q_{kf}}{\sum_{i\in I_u}(1-\alpha)q^2_{if}+\alpha s^q_{ff}+\lambda}
\end{split
$$

其中 $s^q_{kf}$ 表示 $\mathbf{S}^q$ 缓存的第 $(k, f)$ 个元素，定义为 $\mathbf{S}^q = \mathbf{Q}^T\mathbf{Q}$。类似地，获得物品嵌入向量的求解器 (Eq 2)：

$$
q_{if} = \frac{\sum_{u \in U_i}(y_{ui}-(1-\alpha)\hat y_{ui})p_{uf}-\alpha\sum_{k\neq f}q_{ik}s^p_{kf}}{\sum_{u \in U_i}(1-\alpha)p^2_{uf} + \alpha s^p_{ff} + \lambda}
$$

其中 $s^p_{kf}$ 表示 $\mathbf{S}^p$ 缓存的第 $(k, f)$ 个元素，定义为 $\mathbf{S}^p = \mathbf{P}^T\mathbf{P}$。学习算法总结如下

> - Randomly initialize $\mathbf{P}$ and $\mathbf{Q}$
> - **for** $(u, i)\in R$ **do** $\hat{y}_{ui}=\mathbf{p}_u^T\mathbf{q}_i$
> - **while** Stopping criteria is not met **do**
>   - $\mathbf{S}^q = \mathbf{Q}^T\mathbf{Q}$
>   - **for** $u \leftarrow 1$ **to** $M$ **do**
>     - **for** $f \leftarrow 1$ **to** $K$ **do**
>       - **for** $i \in I_u$ **do** $\hat{y}_{ui}\leftarrow\hat{y}_{ui}^f-p_{uf}q_{if}$
>       - $p_{uf}\leftarrow$ Eq 1
>       - **for** $i \in I_u$ **do** $\hat{y}_{ui}\leftarrow\hat{y}_{ui}^f+p_{uf}q_{if}$
>     - **end**
>   - **end**
>   - $\mathbf{S}^p=\mathbf{P}^T\mathbf{P}$
>   - **for** $i \leftarrow 1$ **to** $N$ **do**
>     - **for** $f \leftarrow 1$ **to** $K$ **do**
>       - **for** $u \in U_i$ **do** $\hat{y}_{ui}\leftarrow\hat{y}_{ui}^f-p_{uf}q_{if}$
>       - $q_{if}\leftarrow$ Eq 2
>       - **for** $u \in U_i$ **do** $\hat{y}_{ui}\leftarrow\hat{y}_{ui}^f+p_{uf}q_{if}$
>     - **end**
>   - **end**
> - **return** $\mathbf{P}$ and $\mathbf{Q}$

## 配置

协同过滤的配置都是关于模型拟合和超参数优化的。
- `fit_period` 是模型拟合的周期。默认为 `60m`。
- `fit_epoch` 是模型拟合的 epoch 数。默认为 `100`。
- `optimize_period` 是超参数优化的周期。默认为 `180m`。
- `optimize_trials` 是超参数优化的试验次数。默认为 `10`。
- `early_stopping.patience` 是在没有改进多少个 epoch 后停止训练。默认为 `10`。

## 示例

在演示项目 [GitRec](https://gitrec.gorse.io/) 中，协同过滤配置如下：

```toml
[recommend.collaborative]
fit_period = "60m"
fit_epoch = 100
optimize_period = "360m"
optimize_trials = 10
[recommend.collaborative.early_stopping]
patience = 10
```

[^1]: Rendle, Steffen, et al. "BPR: Bayesian personalized ranking from implicit feedback." Proceedings of the Twenty-Fifth Conference on Uncertainty in Artificial Intelligence. 2009.

[^2]: He, Xiangnan, et al. "Fast matrix factorization for online recommendation with implicit feedback." Proceedings of the 39th International ACM SIGIR conference on Research and Development in Information Retrieval. 2016.

[^3]: Funk, Simon. "Netflix Update: Try This at Home." The Sifter. December 11, 2006. https://sifter.org/~simon/journal/20061211.html.
