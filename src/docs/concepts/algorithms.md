---
icon: zhinengsuanfa
---
# Algorithms

Gorse has implemented various types of recommendation algorithms, both non-personalized and personalized. These recommendation algorithms are building blocks compose the recommendation workflow.

Math formulas are used to introduce complex algorithm, we define math symbols used in this section as follows:

| Symbol | Meaning |
|-|-|
| $n$ | `<cache_size>` |
| $I$ | The set of items. |
| $I_u$ | The set of favorite items by user $u$. |
| $I_l$ | The set of items with label $l$. |
| $U$ | The set of users. |
| $U_l$ | The set of users with label $l$. |
| $L_u$ | The labels of user $u$. |
| $L_i$ | The labels of item $i$. |
| $\mathcal{N}_u$ | The neighbors pf user $u$. |
| $\mathcal{N}_i$ | The neighbors of item $i$. |

::: tip

The `<cache_size>` comes from the configuration file:

```toml
[recommend]

# The cache size for recommended/popular/latest items. The default value is 100.
cache_size = 100
```

:::

## Non-personalized Algorithms

Non-personalized algorithms recommend the same content to all of users.

### Latest Items

Showing the latest items to users according to timestamps allows a new item to be exposed to users in time. To enable the latest recommender in Gorse, you need to set timestamp information for the items. Without timestamps, Gorse will not generate a list of the latest items.

The latest items recommendation is equivalent to the following SQL:

```sql
select item_id from items order by time_stamp desc limit <cache_size>;
```

### Popular Items

Many websites shows the recent popular items to users such as Twitter trending. The popular items recommendation is equivalent to the following SQL:

```sql
select item_id from (
    select item_id, count(*) as feedback_count from feedback 
    where feedback_type in <positive_feedback_types> 
        and time_stamp >= NOW() - INTERVAL <popular_window> 
    group by item_id) t
order by feedback_count desc limit <cache_size>;
```

::: tip

The `<popular_window> ` in the configuration file corresponds to the window of popular items.

```toml
[recommend.popular]

# The time window of popular items. The default values is 4320h.
popular_window = "720h"
```

:::

## Similarity Algorithms

In some scenarios, users like specific types of items, for example, gamers like to solve puzzles or users of a video platform like to watch dancing girls.

### Item Similarity

An item is similar to another item if their share more common users or labels than others. The cosine similarity is ideal to capture the similarity between two items. Since the importance of each users or labels are different, we use IDF to calculate the weight of each user or labels.

- **Label weight**: The label weight is defined as

$$
w_l = -\log\left(\frac{|I_l|}{|I|}\right)
$$

If a label is used by more items, this user is more generic and has lower weight.

- **User weight**: The user weight is defined as

$$
w_u = -\log\left(\frac{|I_u|}{|I|}\right)
$$

If a user have more favorite items, it means that this user have wider preference and he or she have lower weight. 

Based on label weights and user weights, Gorse implements three similarity algorithm:

- **Similar:** Calculates similarity based on label overlap between items

$$
s_{ij} = \frac{\sum_{l\in L_i \cap L_j}w_l}{\sqrt{\sum_{l\in L_i}w_l^2}\sqrt{\sum_{l\in L_j}w_l^2}}
$$

- **Related:** Calculates similarity based on user overlap between items.

$$
s_{ij} = \frac{\sum_{u\in U_i \cap U_j}w_u}{\sqrt{\sum_{u\in U_i}w_u^2}\sqrt{\sum_{u\in U_j}w_u^2}}
$$

- **Automatic:** Calculates similarity based on both label overlap and user overlap between items.

$$
s_{ij} = \frac{\sum_{l\in L_i \cap L_j}w_l + \sum_{u\in U_i \cap U_j}w_u}{\sqrt{\sum_{l\in L_i}w_l^2 + \sum_{u\in U_i}w_u^2}\sqrt{\sum_{l\in L_j}w_l^2 + \sum_{u\in U_j}w_u^2}}
$$

For each item, top $n$ items with top similarity will be cached as neighbprs of this item. The algorithm for item similarity can be set in the configuration file.

```toml
[recommend.item_neighbors]

# The type of neighbors for items. There are three types:
#   similar: Neighbors are found by number of common labels.
#   related: Neighbors are found by number of common users.
#   auto: Neighbors are found by number of common labels and users.
# The default value is "auto".
neighbor_type = "similar"
```

If items are attached with high quality labels, `similar` is the best choice. If items have no labels, use `related`. For other situation, consider `auto`.

### User Similarity

The computation of user similarity is similar to the computation of item similarity. First, we use IDF to calculate the weight of each item or labels.

- **Label weight**: The label weight is defined as

$$
w_l = -\log\left(\frac{|U_l|}{|U|}\right)
$$

If a label is used by more users, this label is more generic and has lower weight.

- **Item weight**: The item weight is defined as

$$
w_i = -\log\left(\frac{|U_i|}{|U|}\right)
$$

If an item have more users, it means that this item is popular but have lower weight to characterize users' preferences. 


Based on label weights and item weights, Gorse implements three similarity algorithm:

- **Similar:** Calculates similarity based on label overlap between users

$$
s_{uv} = \frac{\sum_{l\in L_u \cap L_v}w_l}{\sqrt{\sum_{l\in L_u}w_l^2}\sqrt{\sum_{l\in L_v}w_l^2}}
$$

- **Related:** Calculates similarity based on item overlap between users.

$$
s_{uv} = \frac{\sum_{i\in I_u \cap I_v}w_i}{\sqrt{\sum_{i\in I_u}w_i^2}\sqrt{\sum_{i\in I_v}w_i^2}}
$$

- **Automatic:** Calculates similarity based on both label overlap and item overlap between users.

$$
s_{uv} = \frac{\sum_{l\in L_u \cap L_v}w_l + \sum_{i\in I_u \cap I_v}w_i}{\sqrt{\sum_{l\in L_u}w_l^2 + \sum_{i\in I_u}w_i^2}\sqrt{\sum_{l\in L_v}w_l^2 + \sum_{i\in I_v}w_i^2}}
$$

For each user, top $n$ users with top similarity will be cached as neighbors of this user. The algorithm for user similarity can be set in the configuration file.

```toml
[recommend.user_neighbors]

# The type of neighbors for users. There are three types:
#   similar: Neighbors are found by number of common labels.
#   related: Neighbors are found by number of common favorite items.
#   auto: Neighbors are found by number of common labels and favorite items.
# The default value is "auto".
neighbor_type = "similar"
```

If users are attached with high quality labels, `similar` is the best choice. If users have no labels, use `related`. For other situation, consider `auto`.

## Personalized Algorithms

There are lots of fancy recommendation algorithms these days and most of them are based on deep learning[^4]. However, we believe traditional methods without deep learning is sufficient to achieve compromising recommendation performance.

### Item Similarity based Recommendation

For a user $u$ with favorite items $I_u$, if we know the similarity between any pair of items, The probability that a user $u$ likes an item $i$ is predicted by the sum of similarity between the item $i$ and favorite items.

$$
\hat{y}_{ui}=\sum_{j\in I_u}s_{ij}
$$

where $s_{ij}$ is the similarity between the item $i$ and the item $j$. For a user, the time complexity to search top recommended items in the full item set is $O(|I_u||I|)$. In practice, for most pairs of two items, their similarity is zero. Hence, we could search recommended items in neighbors of favorite items.

1. Collect candidates from neighors of favorite items.

$$
C = \bigcup_{j\in I_u}\mathcal{N}_j
$$

2. For each item $i$ in $C$, calculate the prediction score by

$$
\hat{y}_{ui}=\sum_{j\in I_u}s_{ij}\mathbb{I}(i\in\mathcal{N}_j)
$$

the indicator $\mathbb{I}(i\in\mathcal{N}_j)$ means the similarity is sumed to the prediction score only if $i$ is in the neighbors of item $j$. Since Gorse only cache top $n$ neighbors and their similarity of each item, lots of similarity is missing in the cache. The time complexoty of the optimized algorithm is $O(|I_u|n)$.

### User Similarity based Recommendation

The user similarity based recommendation is the same to the item similarity based recommendation:

1. Collect candidates from favorite items of neighbors of user.

$$
C = \bigcup_{v\in\mathcal{N}_u}I_v
$$

2. For each item $i$ in $C$, calculate the prediction score by

$$
\hat{y}_{ui} = \sum_{v\in\mathcal{N}_u}s_{uv}\mathbb{I}(i\in I_v)
$$

the indicator $\mathbb{I}(i\in I_v)$ means the similarity is sumed to the prediction score only if $i$ is favored by user $v$. The time complexity is $O(|I_u|n)$ as well.

### Matrix Factorization

In matrix factorization models, items and users are represented by vectors. The probability that a user $u$ likes an item $i$ is predicted by the dot product of two vectors.

$$
\hat y_{ui}=\mathbf{p}_u^T \mathbf{q}_i
$$

where $\mathbf{p}_u$ is the embedding vector of the user $u$, and $\mathbf{q}_i$ is the embedding vector of the item $i$. The model of matrix factorization is simple, but there is more than one training algorithms.

#### BPR

BPR[^1] (Bayesian Personalized Ranking) is a pairwise training algorithm. The training data for BPR consist a set of triples: 

$$
D_s=\{(u,i,j)|i\in I_u\wedge I \setminus I_u\}
$$

The semantics of $(u, i, j) \in D_S$ is that user $u$ is assumed to prefer $i$ over $j$. The negative cases are regarded implicitly.

The Bayesian formulation of finding the correct personalized ranking for all items is to maximize the following posterior probability where $\Theta$ represents the parameter vectors of the matrix factorization model

$$
p(\Theta|>_u) \propto p(>_u|\Theta)p(\Theta)
$$

where $>_u$ is the desired but latent preference 
for user $u$. All users are presumed to act independently of each other. BPR also assume the ordering of each pair of items $(i, j)$ for a specific user is independent of the ordering of every other pair. Hence, the above user-specific likelihood function $p(>_u|\Theta)$ can first be rewritten as a product of single densities and second be combined for all users $u \in U$.

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
based on bootstrap sampling of training triples is as follows:

> - initialize $\Theta$
>   - **repeat**
>     - draw $(u,i,j)$ from $D_s$
>     - $\Theta\leftarrow\Theta+\alpha\left(\frac{e^{-\hat y_{uij}}}{1+e^{-\hat y_{uij}}}\cdot \frac{\partial}{\partial\Theta}\hat y_{uij}+\lambda_\Theta\Theta\right)$
>   - **util** convergence
> - **return** $\Theta$

The derivatives from embedding vectors is

$$
\frac{\partial}{\partial\theta}\hat y_{uij}=\begin{cases}
(q_{if}-q_{jf})&\text{if }\theta=p_{uf}\\
p_uf&\text{if }\theta=q_if\\
-p_uf&\text{if }\theta=q_{jf}\\
0&\text{else}
\end{cases}
$$

#### eALS

eALS[^2] is a point-wise training algorithm. For a pair of a user $u$ and a item $i$, the ground truth for training is

$$
y_{ui}\begin{cases}
1&i\in I_u\\
0&i\notin I_u
\end{cases}
$$

Embedding vectors are optimized by minimizing the following cost function[^8]:

$$
\mathcal{C} = \sum_{u\in U}\sum_{i \in I}(y_{ui}-\mathbf{p}^T_u\mathbf{q}_i)^2 + \lambda\left(\sum_{u \in U}\|\mathcal{p}\|^2+\sum_{i \in I}\|\mathbf{q}_i\|^2\right)
$$

The derivative of objective function with respect to $p_{uf}$ is

$$
\frac{\partial J}{\partial p_{uf}}=-2\sum_{i\in I}(y_{ui}-\hat y_{ui})q_{uf} + 2p_{uf}\sum_{i\in I}q_{if}^2 + 2\lambda p_{uf}
$$

By setting this derivative to 0, obtain the solution of $p_{uf}$:

$$
p_{uf} = \frac{\sum_{i \in I}(y_{ui}-\hat y_{ui})q_{if}}{\sum_{i \in I}q^2_{if}+\lambda}
$$

Similarly, get the solver for an item embedding vector:

$$
q_{if} = \frac{\sum_{u \in U}(y_{ui}-\hat y_{ui})p_{uf}}{\sum_{u \in I}p^2_{uf} + \lambda}
$$

> - Randomly initialize P and Q
> - **for** $(u, i)$ 
> - **while** Stopping criteria is not met **do**
> - **return** P and Q

### Factorization Machines

[^1]: Rendle, Steffen, et al. "BPR: Bayesian personalized ranking from implicit feedback." Proceedings of the Twenty-Fifth Conference on Uncertainty in Artificial Intelligence. 2009.

[^2]: He, Xiangnan, et al. "Fast matrix factorization for online recommendation with implicit feedback." Proceedings of the 39th International ACM SIGIR conference on Research and Development in Information Retrieval. 2016.

[^3]: Rendle, Steffen. "Factorization machines." 2010 IEEE International conference on data mining. IEEE, 2010.

[^4]: Zhang, Shuai, et al. "Deep learning based recommender system: A survey and new perspectives." ACM Computing Surveys (CSUR) 52.1 (2019): 1-38.

[^5]: Bergstra, James, and Yoshua Bengio. "Random search for hyper-parameter optimization." Journal of machine learning research 13.2 (2012).

[^6]: Auvolat, Alex, et al. "Clustering is efficient for approximate maximum inner product search." arXiv preprint arXiv:1507.05910 (2015).

[^7]: Malkov, Yu A., and Dmitry A. Yashunin. "Efficient and robust approximate nearest neighbor search using hierarchical navigable small world graphs." IEEE transactions on pattern analysis and machine intelligence 42.4 (2018): 824-836.

[^8]: Hu, Yifan, Yehuda Koren, and Chris Volinsky. "Collaborative filtering for implicit feedback datasets." 2008 Eighth IEEE international conference on data mining. Ieee, 2008.
