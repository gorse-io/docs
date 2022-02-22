# Performance vs Precision

```toml
# The time-to-live (days) of positive feedback, 0 means disabled. The default value is 0.
positive_feedback_ttl = 0

# The time-to-live (days) of items, 0 means disabled. The default value is 0.
item_ttl = 0
```

```toml
# The time period for model fitting (minutes). The default values is 60.
fit_period = 360

# The time period for model searching (minutes). The default values is 100.
search_period = 60

# The number of epochs for model searching. The default values is 100.
search_epoch = 100

# The number of trials for model searching. The default values is 10.
search_trials = 10

# The time period to refresh recommendation for inactive users (days). The default values is 5.
refresh_recommend_period = 1
```
## Enable Clustering Index for Similar Item/User Searching

Gorse searches similar items for each item and similar users for each user. Assuming there are N items, the computation complexity to search similar items for an item is $O(N)$, and the computation complexity to generate similar items for all items is $O(N^2)$. Gorse provides a cluster-based index to speed up the searching of similar items and similar users. The index of similar items (users) first clusters items (users) according to their similarity, that is, the most similar items (users) are grouped into multiple clusters. When searching similar items (users), first find the K clusters whose centroids are most similar to the current item (user), and then search similar items (users) within the K clusters, the idea of clustering index is derived from [1].

Similar item (user) index can be switched on and off by `enable_item_neighbor_index` (`enable_user_neighbor_index`), which is turned off by default in the current version and considered to be turned on by default in subsequent versions. Similar item (user) index needs to set the parameter K, which is the number of clusters to query. Too small K will cause the index to fail to reach the required recall, while too large K will reduce the performance. The construction process tries to increase K. If the query recall reaches `item_neighbor_index_recall` (`user_neighbor_index_recall`), or the growth epochs reaches `item_neighbor_index_fit_epoch` (`user_neighbor_ index_fit_epoch`), the build process stops increasing K. 

```toml
# Enable approximate item neighbor searching using vector index.
enable_item_neighbor_index = true

# Minimal recall for approximate item neighbor searching.
item_neighbor_index_recall = 0.8

# Maximal number of fit epochs for approximate item neighbor searching vector index.
item_neighbor_index_fit_epoch = 3

# Enable approximate user neighbor searching using vector index.
enable_user_neighbor_index = true

# Minimal recall for approximate user neighbor searching.
user_neighbor_index_recall = 0.8

# Maximal number of fit epochs for approximate user neighbor searching vector index.
user_neighbor_index_fit_epoch = 3
```

The advantages and disadvantages of using similar item/user indexing are as follows. 
- **Advantages:** Saves similar item/user search time.
- **Disadvantages:** Indexing requires extra memory, and if the data is difficult to cluster (e.g. randomly generated data), the indexing recall will be low.

The recall of similar users index and similar items index can be seen in "User Neighbor Index Recall" and "Item Neighbor Index Recall" in the system status section in the overview page of Gorse dashboard.

## Enable HNSW Index for Collaborative Filtering

Collaborative filtering models in Gorse represent users and items as embedding vectors. For each user, items with large dot products of embedding vectors with the user are filtered as recommended items. Therefore, the most intuitive way to search for recommended items is to scan all items, calculate the dot product of embedding vectors during the scanning process, and select the top several items with the largest dot products as the recommended result. Assuming that there are N users and M items, the computational complexity to generate recommendation results for all users is $O(MN)$. However, if the number of items and users is large, the overall computation is unacceptable.

```toml
# Enable approximate collaborative filtering recommend using vector index.
enable_collaborative_index = false

# Minimal recall for approximate collaborative filtering recommend.
collaborative_index_recall = 0.9

# Maximal number of fit epochs for approximate collaborative filtering recommend vector index.
collaborative_index_fit_epoch = 3
```

## References

1. Auvolat, Alex, et al. "Clustering is efficient for approximate maximum inner product search." arXiv preprint arXiv:1507.05910 (2015).
2. Malkov, Yu A., and Dmitry A. Yashunin. "Efficient and robust approximate nearest neighbor search using hierarchical navigable small world graphs." IEEE transactions on pattern analysis and machine intelligence 42.4 (2018): 824-836.
