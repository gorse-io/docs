---
icon: search
shortTitle: User-to-User
---
# User-to-User Recommenders

## Configuration

### User Similarity

The computation of user similarity is similar to the computation of item similarity. First, we use IDF to calculate the weight of each item or label.

- **Label weight**: The label weight is defined as

$$
w_l = -\log\left(\frac{|U_l|}{|U|}\right)
$$

If a label is used by more users, this label is more generic and has a lower weight.

- **Item weight**: The item weight is defined as

$$
w_i = -\log\left(\frac{|U_i|}{|U|}\right)
$$

If an item has more users, it means that this item is popular but has a lower weight to characterize users' preferences. 


Based on label weights and item weights, Gorse implements three similarity algorithms:

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

For each user, the top $n$ users with top similarity will be cached as neighbors of this user. The algorithm for user similarity can be set in the configuration file.

```toml
[recommend.user_neighbors]

# The type of neighbors for users. There are three types:
#   similar: Neighbors are found by number of common labels.
#   related: Neighbors are found by number of common favorite items.
#   auto: Neighbors are found by number of common labels and favorite items.
# The default value is "auto".
neighbor_type = "similar"
```

If users are attached to high-quality labels, `similar` is the best choice. If users have no labels, use `related`. For other situations, consider `auto`.

