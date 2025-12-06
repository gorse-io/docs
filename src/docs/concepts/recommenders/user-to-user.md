---
icon: people
shortTitle: User-to-User
---
# User-to-User Recommenders

If two users have similar preferences, they are likely to like the same items. Gorse has implemented user-to-user recommenders that support similarity based on labels or favorite items.

## Configuration

The user-to-user recommenders need to be explicitly configured. The following three fields need to be filled in:
- `name` is the name of the recommender.
- `type` is the similarity type, and the following values are supported:
  - `embedding` is the Euclidean distance between embedding vectors.
  - `tags` is the similarity based on the number of common labels.
  - `items` is the similarity based on the number of common favorite items.
- `column` is the field used by the recommender to calculate the similarity, expressed in the [Expr](https://expr-lang.org/) language.

## Algorithms

### Embedding Similarity

There are $K$-dimensional embedding vectors $p$ and $q$ for two items respectively, the embedding similarity between them is

$$
\sqrt{\sum^K_{k=1}(p_k-q_k)^2}
$$

### Tags Similarity

First, we use IDF to calculate the weight of each tag. The tag weight is defined as

$$
w_l = -\log\left(\frac{|U_l|}{|U|}\right)
$$

If a tag is used by more users, this tag is more generic and has a lower weight. Then, calculates similarity based on label overlap between users

$$
\frac{\sum_{l\in L_u \cap L_v}w_l}{\sqrt{\sum_{l\in L_u}w_l^2}\sqrt{\sum_{l\in L_v}w_l^2}}
$$

### Items Similarity

First, we use IDF to calculate the weight of each item.

- **Item weight**: The item weight is defined as

$$
w_i = -\log\left(\frac{|U_i|}{|U|}\right)
$$

If an item has more users, it means that this item is popular but has a lower weight to characterize users' preferences. Then, calculates similarity based on item overlap between users.

$$
\frac{\sum_{i\in I_u \cap I_v}w_i}{\sqrt{\sum_{i\in I_u}w_i^2}\sqrt{\sum_{i\in I_v}w_i^2}}
$$

## Recommendation

The user-to-user recommender first finds similar users for the target user, then sums up items from positive feedback of similar users, and finally ranks items by similarity scores to get the final recommendation score:

$$
\sum_{v \in S_u} s_{uv} \cdot \mathbf{1}_{i \in I_v}
$$

where $S_u$ represents the set of similar users of user $u$, $s_{uv}$ represents the similarity between user $u$ and user $v$, and $\mathbf{1}_{i \in I_v}$ is an indicator function that equals 1 if item $i$ is in the positive feedback set of user $v$.

## API

You can access similar users through the following API:

```bash
curl http://localhost:8087/api/user-to-user/<name>/<user-id>
```

## Examples

For example, to recommend items based on similar users calculated from favorite items, the configuration is as follows:

```toml
[recommend.user_neighbors]
name = "similar_users"
type = "items"
```
