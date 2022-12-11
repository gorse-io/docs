---
icon: charts
---
# Evaluation

In the most ideal situation, a recommender system should recommend to users the items they are most likely to like. However, since computation and storage resources are always limited, recommender systems often have to make tradeoffs between performance and accuracy. In this section, we describe how to configure the tradeoff between Gorse's computational resource usage, storage resource usage, and recommendation accuracy.

## Set TTL for Items and Feedback

By default, Gorse loads all the data in the database as training data. In the configuration file, the number of items and feedbacks read can be limited by `item_ttl` and `positive_feedback_ttl`. If the timestamp of an item is more than `item_ttl` days ago, Gorse does not read this item anymore. If the timestamp of a feedback is more than `positive_feedback_ttl` days ago, then Gorse will also not read this feedback. The advantages and disadvantages of using TTL are as follows.
- **Advantages:** Remove obsolete items and feedbacks to reduce the amount of data Gorse needs to process. Items that are too outdated, such as old news, are not recommended, and user histories that are too old do not reflect current user interests, so removing outdated items and feedback is beneficial to the recommender system.
- **Disadvantage:** If the TTL is set decisively, the amount of information obtained during the training will be insufficient.

The TTL is used to remove obsolete items and feedback, but should be set long enough to prevent loss of information.

```toml
[recommend.data_source]

# The time-to-live (days) of positive feedback, 0 means disabled. The default value is 0.
positive_feedback_ttl = 0

# The time-to-live (days) of items, 0 means disabled. The default value is 0.
item_ttl = 0
```

## Set Training and Recommendation Period

There are three loops in the Gorse recommender system, which are

- **Model training loop:** The master node loads data, uses the latest data to train the recommendation model, and updates the latest items, popular items, similar items, similar users, etc. The interval of the model training loop corresponds to `model_fit_period` in the configuration file.
- **Model tuning loop:** the master node loads data and uses random search[^1] to find the best hyper-parameters for the recommendation model. The loop interval is set by `model_search_period`, and the interval of the model tuning loop can be set longer. The optimal model hyper-parameters are relatively stable unless the dataset changes dramatically.

  The model tuning loop 

```
for every `search_period` minutes:
    pull data from database.
    for every recommendation models:
        for `search_trials` trials:
            sample a hyperparameter combination.
            train model with sampled hyper-parameters by `search_epoch` epoches and `search_jobs` jobs.
            update best model.
```

- **Recommendation loop:** The worker node checks whether update each user's recommendation results, the check interval is `check_recommend_period` minutes. The conditions to update a user's recommendation are: the last active time of the user exceeds the last recommendation generated time, or the last recommendation generated time is more than `refresh_recommend_period` days from now. The interval `check_recommend_period` for checking recommendation results should be set relatively short, recommended to be around a few minutes, so as to be able to cope with the user's recommendation result consumption.

Too long a interval will result in outdated models and recommendation results, and too short a interval will result in high database and cache load. In summary, `check_recommend_period` should be small, `model_search_period` should be large, and `model_fit_period` needs to be set reasonably according to the database load.

```toml
[recommend.collaborative]

# The time period for model fitting. The default value is "60m".
model_fit_period = "60m"

# The time period for model searching. The default value is "360m".
model_search_period = "360m"

# The number of epochs for model searching. The default value is 100.
model_search_epoch = 100

# The number of trials for model searching. The default value is 10.
model_search_trials = 10

[recommend.offline]

# The time period to check recommendation for users. The default values is 1m.
check_recommend_period = "1m"

# The time period to refresh recommendation for inactive users. The default values is 120h.
refresh_recommend_period = "24h"
```

## Enable Clustering Index for Similar Item/User Searching

Gorse searches similar items for each item and similar users for each user. Assuming there are N items, the computation complexity to search similar items for an item is \\(O(N)\\), and the computation complexity to generate similar items for all items is \\(O(N^2)\\). Gorse provides a cluster-based index to speed up the searching of similar items and similar users. The index of similar items (users) first clusters items (users) according to their similarity, that is, the most similar items (users) are grouped into multiple clusters. When searching similar items (users), first find the K clusters whose centroids are most similar to the current item (user), and then search similar items (users) within the K clusters, the idea of clustering index is derived from[^2].

Similar item (user) index can be switched on and off by `enable_index`, which is turned off by default in the current version and considered to be turned on by default in subsequent versions. Similar item (user) index needs to set the parameter K, which is the number of clusters to query. Too small K will cause the index to fail to reach the required recall, while too large K will reduce the performance. The construction process tries to increase K. If the query recall reaches `index_recall`, or the growth epochs reaches `index_fit_epoch`, the build process stops increasing K. 

```toml
[recommend.item_neighbors]

# Enable approximate item neighbor searching using vector index. The default value is true.
enable_index = true

# Minimal recall for approximate item neighbor searching. The default value is 0.8.
index_recall = 0.8

# Maximal number of fit epochs for approximate item neighbor searching vector index. The default value is 3.
index_fit_epoch = 3

[recommend.user_neighbors]

# Enable approximate user neighbor searching using vector index. The default value is true.
enable_index = true

# Minimal recall for approximate user neighbor searching. The default value is 0.8.
index_recall = 0.8

# Maximal number of fit epochs for approximate user neighbor searching vector index. The default value is 3.
index_fit_epoch = 3
```

The advantages and disadvantages of using similar item/user indexing are as follows. 
- **Advantages:** Saves similar item/user search time.
- **Disadvantages:** Indexing requires extra memory, and if the data is difficult to cluster (e.g. randomly generated data), the indexing recall will be low.

The recall of similar users index and similar items index can be seen in "User Neighbor Index Recall" and "Item Neighbor Index Recall" in the system status section in the overview page of Gorse dashboard.

<center><img width="420px" src="../img/ch3/neighbor_index_recall.jpeg"></center>

## Enable HNSW Index for Collaborative Filtering

Collaborative filtering models in Gorse represent users and items as embedding vectors. For each user, items with large dot products of embedding vectors with the user are filtered as recommended items. Therefore, the most intuitive way to search for recommended items is to scan all items, calculate the dot product of embedding vectors during the scanning process, and select the top several items with the largest dot products as the recommended result. Assuming that there are N users and M items, the computational complexity to generate recommendation results for all users is \\(O(MN)\\). However, if the number of items and users is large, the overall computation is unacceptable.

A more efficient approach is to use the vector index HNSW[^3]. The HNSW index creates a navigation graph for all item vectors. The results from HNSW are not accurate, but the small loss in recall is worth the large performance gain. The HNSW requires a parameter, `ef_construction`, to be set. `ef_construction` that is too small will prevent the vector index from reaching the required recall, and `ef_construction` that is too large will reduce search performance. The build process tries to keep increasing `ef_construction`, and stops growing `ef_construction` if the recall reaches `index_recall`, or if the number of epochs reaches `index_fit_epoch`.

```toml
[recommend.collaborative]

# Enable approximate collaborative filtering recommend using vector index. The default value is true.
enable_index = true

# Minimal recall for approximate collaborative filtering recommend. The default value is 0.9.
index_recall = 0.9

# Maximal number of fit epochs for approximate collaborative filtering recommend vector index. The default value is 3.
index_fit_epoch = 3
```

The advantages and disadvantages of using vector indexing for collaborative filtering are as follows.

- **Advantages:** Vector indexing can significantly improve the speed of collaborative filtering recommendations and the recall is sufficient in most cases.
- **Disadvantages:** Creating HNSW indexes requires additional memory space and can produce relatively low recall in rare cases.

The HNSW index recall of collaborative filtering corresponds to the "Matching Index Recall" in the system status of the dashboard overview page, if the value is low then consider turning off the index query.

<center><img width="420px" src="../img/ch3/cf_index_recall.jpeg"></center>
