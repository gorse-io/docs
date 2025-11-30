---
icon: zhinengsuanfa
---
# Algorithms

Gorse has implemented various types of recommendation algorithms, both non-personalized and personalized. These recommendation algorithms are building blocks that compose the recommendation workflow.

Math formulas are used to introduce complex algorithms, we define math symbols used in this section as follows:

| Symbol | Meaning |
|-|-|
| $n$ | `<cache_size>` |
| $R$ | The set of positive feedbacks. |
| $\not R$ | The set of negative feedbacks. |
| $I$ | The set of items. |
| $I_u$ | The set of favorite items by user $u$. |
| $I_l$ | The set of items with label $l$. |
| $U$ | The set of users. |
| $U_l$ | The set of users with label $l$. |
| $L_u$ | The labels of user $u$. |
| $L_i$ | The labels of item $i$. |
| $L_U$ | The labels used by all users. |
| $L_I$ | The labels used by all items. |
| $\mathcal{N}_u$ | The neighbors pf user $u$. |
| $\mathcal{N}_i$ | The neighbors of item $i$. |
| $\mathbb{I}(p)$ | Equals 1 if condition $p$ satisfies, otherwise equals 0. |

::: tip

The `<cache_size>` comes from the configuration file:

```toml
[recommend]

# The cache size for recommended/popular/latest items. The default value is 100.
cache_size = 100
```

:::

## Non-personalized Algorithms

Non-personalized algorithms recommend the same content to all users.

### Latest Items

Showing the latest items to users according to timestamps allows a new item to be exposed to users in time. To enable the latest recommender in Gorse, you need to set timestamp information for the items. Without timestamps, Gorse will not generate a list of the latest items.

The latest items recommendation is equivalent to the following SQL:

```sql
select item_id from items order by time_stamp desc limit <cache_size>;
```

## Similarity Algorithms

In some scenarios, users like specific types of items, for example, gamers like to solve puzzles and young children like to watch cartoons.

### Item Similarity

An item is similar to another item if they share more common users or labels than others. The cosine similarity is ideal to capture the similarity between two items. Since the importance of each user or label is different, we use IDF to calculate the weight of each user or label.

- **Label weight**: The label weight is defined as

$$
w_l = -\log\left(\frac{|I_l|}{|I|}\right)
$$

If a label is used by more items, this label is more generic and has a lower weight.

- **User weight**: The user weight is defined as

$$
w_u = -\log\left(\frac{|I_u|}{|I|}\right)
$$

If a user has more favorite items, it means that this user has a wider preference and he or she has a lower weight. 

Based on label weights and user weights, Gorse implements three similarity algorithms:

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

For each item, top $n$ items with top similarity will be cached as neighbors of this item. The algorithm for item similarity can be set in the configuration file.

```toml
[recommend.item_neighbors]

# The type of neighbors for items. There are three types:
#   similar: Neighbors are found by number of common labels.
#   related: Neighbors are found by number of common users.
#   auto: Neighbors are found by number of common labels and users.
# The default value is "auto".
neighbor_type = "similar"
```

If items are attached with high-quality labels, `similar` is the best choice. If items have no labels, use `related`. For other situations, consider `auto`.

## Personalized Algorithms

There are lots of fancy recommendation algorithms these days and most of them are based on deep learning[^4]. However, we believe traditional methods without deep learning are sufficient to achieve compromising recommendation performance.

### Item Similarity-based Recommendation

For a user $u$ with favorite items $I_u$, if we know the similarity between any pair of items, The probability that a user $u$ likes an item $i$ is predicted by the sum of similarity between the item $i$ and favorite items.

$$
\hat{y}_{ui}=\sum_{j\in I_u}s_{ij}
$$

where $s_{ij}$ is the similarity between the item $i$ and the item $j$. For a user, the time complexity to search top recommended items in the full item set is $O(|I_u||I|)$. In practice, for most pairs of two items, their similarity is zero. Hence, we could search for recommended items in neighbors of favorite items.

1. Collect candidates from neighbors of favorite items.

$$
C = \bigcup_{j\in I_u}\mathcal{N}_j
$$

2. For each item $i$ in $C$, calculate the prediction score by

$$
\hat{y}_{ui}=\sum_{j\in I_u}s_{ij}\mathbb{I}(i\in\mathcal{N}_j)
$$

the indicator $\mathbb{I}(i\in\mathcal{N}_j)$ means the similarity is summed to the prediction score only if $i$ is in the neighbors of item $j$. Since Gorse only caches top $n$ neighbors and the similarity of each item, lots of similarities are missing in the cache. The time complexity of the optimized algorithm is $O(|I_u|n)$.

### User Similarity-based Recommendation

The user similarity-based recommendation is the same as the item similarity-based recommendation:

1. Collect candidates from favorite items of neighbors of the user.

$$
C = \bigcup_{v\in\mathcal{N}_u}I_v
$$

2. For each item $i$ in $C$, calculate the prediction score by

$$
\hat{y}_{ui} = \sum_{v\in\mathcal{N}_u}s_{uv}\mathbb{I}(i\in I_v)
$$

the indicator $\mathbb{I}(i\in I_v)$ means the similarity is summed to the prediction score only if $i$ is favored by user $v$. The time complexity is $O(|I_u|n)$ as well.

#### Random Search for Hyper-parameters

There are hyper-parameters for model training such as learning rate, regularization strength, etc. Gorse uses random search[^5] to find the best hyper-parameters. The hyper-parameters optimization behavior is set by `model_search_epoch` and `model_search_trials`. Large value might lead to better recommendations but cost more CPU time. The optimal model hyper-parameters are relatively stable unless the dataset changes dramatically.

```toml
[recommend.collaborative]

# The number of epochs for model searching. The default value is 100.
model_search_epoch = 100

# The number of trials for model searching. The default value is 10.
model_search_trials = 10
```

#### HNSW Index

The matrix factorization model in Gorse represents users and items as embedding vectors. For each user, items with large dot products of embedding vectors with the user are filtered as recommended items. Therefore, the most intuitive way to search for recommended items is to scan all items, calculate the dot product of embedding vectors during the scanning process, and select the top several items with the largest dot products as the recommended result. Assuming that there are N users and M items, the computational complexity to generate recommendation results for all users is $O(|I||U|)$. However, if the number of items and users is large, the overall computation is unacceptable.

A more efficient approach is to use the vector index HNSW[^10]. The HNSW index creates a navigation graph for all item vectors. The results from HNSW are not accurate, but the small loss in the recall is worth the large performance gain. The HNSW requires a parameter, ef_construction, to be set. ef_construction that is too small will prevent the vector index from reaching the required recall, and $\text{ef\_construction}$ that is too large will reduce search performance. The build process tries to keep increasing $\text{ef\_construction}$, and stops growing $\text{ef\_construction}$ if the recall reaches `index_recall`, or if the number of epochs reaches `index_fit_epoch`.

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

HNSW index is complex and it is impossible to introduce it on this page. For more information, read the original paper: https://arxiv.org/abs/1603.09320

:::

### Factorization Machines

User labels and item labels are important information for personalized recommendations, but matrix factorization only handles user embedding and item embedding. Factorization machines^3 generate recommendations with rich features such as user features and item features.

Different from the learning algorithms for matrix factorization, negative feedbacks are used in factorization machine training. The training dataset is constructed by

$$
D=\{((x_1,\dots,x_f,\dots,x_F),1)|(u,i)\in R\}\cup\{((x_1,\dots,x_f,\dots,x_F),0)|(u,i)\in\not R\}
$$

The dimension of input vectors $\mathbf{x}$ is the sum of the numbers of items, users, item labels and user labels: $F = |I| + |U| + |L_I| + |L_U|$. Each element in $\mathbf{x}$ for a pair $(u,i)$ is defined by

$$
x_f=\begin{cases}
\mathbb{I}(f=u)&0<f\le |I|\\
\mathbb{I}(f-|I|=u)&|I|<f\le |I|+|U|\\
\mathbb{I}(f-|I|-|U|\in L_i)&|I|+|U|<f<\le |I|+|U|+|L_I|\\
\mathbb{I}(f-|I|-|U|-|L_U| \in L_u)&|I|+|U|+|L_I|<f<\le F
\end{cases}
$$

The prediction output for a input vector $\mathbf{x}$ is

$$
\hat y = w_0 + \sum^n_{i=1}w_i x_i + \sum^n_{i=1}\sum^n_{j=i+1}\left<\mathbf{v}_i,\mathbf{v}_j\right>x_i x_j
$$

where the model parameters that have to be estimated are: $w_0\in\mathbb{R}$, $\mathbf{w}\in\mathbb{R}^n$, $\mathbf{V}\in\mathbb{R}^{n\times k}$. And $\left<\cdot,\cdot\right>$ is the dot product of two vectors. Parameters are optimized by logit loss with SGD. The loss function is

$$
\mathcal C=\sum_{(\mathbf{x},y)\in D}−y\log(\hat y)−(1−y)\log(1-\hat y)
$$

The gradient for each parameter is

$$
\frac{\partial}{\partial\theta}\hat y=\begin{cases}
1,&\text{if }\theta\text{ is }w_0\\
x_i,&\text{if }\theta\text{ is }w_i\\
x_i\sum^n_{j=1}v_{j,f}x_j-v_{i,f}x^2_i,&\text{if }\theta\text{ is }v_{i,f}
\end{cases}
$$

Hyper-parameters are optimized by random search and the configuration `recommend.collaborative` is reused.

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
