---
icon: collaborate_sider
shortTitle: Collaborative
---
# Collaborative Filtering

Gorse uses matrix factorization[^3] as the collaborative filtering algorithm to provide personalized recommendations. Matrix factorization is a widely used technique in recommender systems that models user-item interactions by representing both users and items in a shared latent space.

## Matrix Factorization

In matrix factorization, items and users are represented by vectors. The probability that a user $u$ likes an item $i$ is predicted by the dot product of two vectors.

$$
\hat y_{ui}=\mathbf{p}_u^T \mathbf{q}_i
$$

where $\mathbf{p}_u$ is the embedding vector of the user $u$, and $\mathbf{q}_i$ is the embedding vector of the item $i$. The model of matrix factorization is simple, but there is more than one training algorithm.

#### BPR

BPR[^1] (Bayesian Personalized Ranking) is a pairwise training algorithm. The training data for BPR consist of a set of triples: 

$$
D_s=\{(u,i,j)|i\in I_u\wedge j\in I \setminus I_u\}
$$

The semantics of $(u, i, j) \in D_S$ is that user $u$ is assumed to prefer $i$ over $j$. The negative cases are regarded implicitly.

The Bayesian formulation of finding the correct personalized ranking for all items is to maximize the following posterior probability where $\Theta$ represents the parameter vectors of the matrix factorization model

$$
p(\Theta|>_u) \propto p(>_u|\Theta)p(\Theta)
$$

where $>_u$ is the desired but latent preference 
for user $u$. All users are presumed to act independently of each other. BPR also assumes the ordering of each pair of items $(i, j)$ for a specific user is independent of the ordering of every other pair. Hence, the above user-specific likelihood function $p(>_u|\Theta)$ can first be rewritten as a product of single densities and second be combined for all users $u \in U$.

$$
\prod_{u\in U}p(>_u|\Theta)=\prod_{(u,i,j)\in D_s}p(i>_u j|\Theta)
$$

where $p(i>_u j|\Theta)=\sigma(\hat y_{uij})$ and $\hat y_{uij}=\hat y_{ui} - \hat y_{uj}$.

For the parameter vectors, BPR introduces a general prior density $p(\Theta)$ which is a normal distribution with zero mean and variance-covariance matrix $\Sigma_\Theta$.

$$
p(\Theta) \sim N(0,\Sigma_\Theta)
$$

where $Σ_Θ = λ_ΘI$. Then the optimization criterion for personalized ranking is

$$
\begin{split}
\text{BPR-OPT}&=\ln p(\Theta|>_u)\\
&=\ln p(>_u|\Theta)p(\Theta)\\
&=\ln\prod_{(u,i,j)\in D_s}\sigma(\hat y_{uij})p(\Theta)\\
&=\sum_{(u,i,j)\in D_s}\ln \sigma(\hat y_{uij})+\ln p(\Theta)\\
&=\sum_{(u,i,j)\in D_s}\ln \sigma(\hat y_{uij})-\lambda_\Theta\|\Theta\|^2
\end{split}
$$

The gradient of BPR-Opt with respect to
the model parameters is:

$$
\begin{split}
\frac{\partial\text{BPR-OPT}}{\partial\Theta}&=\sum_{(u,i,j)\in D_s}\frac{\partial}{\partial\Theta}\ln\sigma(\hat x_{uij})-\lambda_\Theta\frac{\partial}{\partial\Theta}\|\Theta\|^2\\
&\propto\sum_{(u,i,j)\in D_s}\frac{-e^{-\hat y_{uij}}}{1+e^{-\hat y_{uij}}}\cdot \frac{\partial}{\partial\Theta}\hat y_{uij}-\lambda_\Theta\Theta\\
\end{split}
$$

A stochastic gradient-descent algorithm
based on a bootstrap sampling of training triples is as follows:

> - initialize $\Theta$
>   - **repeat**
>     - draw $(u,i,j)$ from $D_s$
>     - $\Theta\leftarrow\Theta+\alpha\left(\frac{e^{-\hat y_{uij}}}{1+e^{-\hat y_{uij}}}\cdot \frac{\partial}{\partial\Theta}\hat y_{uij}+\lambda_\Theta\Theta\right)$
>   - **util** convergence
> - **return** $\Theta$

where $\alpha$ . The derivatives from embedding vectors are

$$
\frac{\partial}{\partial\theta}\hat y_{uij}=\begin{cases}
(q_{if}-q_{jf})&\text{if }\theta=p_{uf}\\
p_uf&\text{if }\theta=q_if\\
-p_uf&\text{if }\theta=q_{jf}\\
0&\text{else}
\end{cases}
$$

#### eALS

eALS[^2] is a point-wise training algorithm. For a pair of a user $u$ and an item $i$, the ground truth for training is

$$
y_{ui}=\begin{cases}
1&i\in I_u\\
0&i\notin I_u
\end{cases}
$$

Embedding vectors are optimized by minimizing the following cost function[^8]:

$$
\mathcal{C} = \sum_{u\in U}\sum_{i \in I}w_{ui}(y_{ui}-\hat{y}_{ui}^f)^2 + \lambda\left(\sum_{u \in U}\|\mathcal{p}\|^2+\sum_{i \in I}\|\mathbf{q}_i\|^2\right)
$$

where $\hat{y}_{ui}^f=\hat{y}_{ui}-p_{uf}q_{if}$ and $w_{ui}$ the weight of feedback

$$
w_{ui}=\begin{cases}
1&i\in I_u\\
\alpha&i\notin I_u
\end{cases}
$$

$\alpha$ ($\alpha < 1$) is the weight for negative feedbacks. The derivative of the objective function with respect to $p_{uf}$ is

$$
\frac{\partial J}{\partial p_{uf}}=-2\sum_{i\in I}(y_{ui}-\hat y_{ui}^f)w_{ui}q_{uf} + 2p_{uf}\sum_{i\in I}w_{ui}q_{if}^2 + 2\lambda p_{uf}
$$

By setting this derivative to 0, obtain the solution of $p_{uf}$ (Eq 1):

$$
\begin{split}
p_{uf} &= \frac{\sum_{i \in I}(y_{ui}-\hat y_{ui}^f)w_{ui}q_{if}}{\sum_{i \in I}w_{ui}q^2_{if}+\lambda}\\
&=\frac{\sum_{i\in I_u}(y_{ui}-\hat{y}_{ui}^f)q_{if}-\sum_{i\in I_u}\hat{y}_{ui}^f\alpha q_{if}}{\sum_{i\in I_u}q^2_{if}+\sum_{i \in I_u}\alpha q_{if}^2+\lambda}\\
&=\frac{\sum_{i\in I_u}[y_{ui}-(1-\alpha)\hat{y}_{ui}^f]q_{if}-\sum_{k\neq f}p_{uk}s^q_{kf}}{\sum_{i\in I_u}(1-\alpha)q^2_{if}+\alpha s^q_{ff}+\lambda}
\end{split}
$$

where $s^q_{kf}$ denotes the $(k, f)^\text{th}$ element of the $\mathbf{S}^q$ cache, defined as $\mathbf{S}^q = \mathbf{Q}^T\mathbf{Q}$. Similarly, get the solver for an item embedding vector (Eq 2):

$$
q_{if} = \frac{\sum_{u \in U_i}(y_{ui}-(1-\alpha)\hat y_{ui})p_{uf}-\alpha\sum_{k\neq f}q_{ik}s^p_{kf}}{\sum_{u \in U_i}(1-\alpha)p^2_{uf} + \alpha s^p_{ff} + \lambda}
$$

where $s^p_{kf}$ denotes the $(k, f)^\text{th}$ element of the $\mathbf{S}^p$ cache, defined as $\mathbf{S}^p = \mathbf{P}^T\mathbf{P}$. The learning algorithm is summarized as

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

## Configuration

The configurations for collaborative filtering are all about model fitting and hyperparameter optimization.
- `fit_period` is the period for model fitting. Defaults to `60m`.
- `fit_epoch` is the number of epochs for model fitting. Defaults to `100`.
- `optimize_period` is the period for hyperparameter optimization. Defaults to `180m`.
- `optimize_trials` is the number of trials for hyperparameter optimization. Defaults to `10`.
- `early_stopping.patience` is the number of epochs with no improvement after which training will be stopped. Defaults to `10`.

[^1]: Rendle, Steffen, et al. "BPR: Bayesian personalized ranking from implicit feedback." Proceedings of the Twenty-Fifth Conference on Uncertainty in Artificial Intelligence. 2009.

[^2]: He, Xiangnan, et al. "Fast matrix factorization for online recommendation with implicit feedback." Proceedings of the 39th International ACM SIGIR conference on Research and Development in Information Retrieval. 2016.

[^3]: Funk, Simon. "Netflix Update: Try This at Home." The Sifter. December 11, 2006. https://sifter.org/~simon/journal/20061211.html.
