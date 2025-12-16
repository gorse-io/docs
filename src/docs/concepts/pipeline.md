---
icon: pipeline
---
# Pipeline

Gorse is a multi-way recommender system. Different recommenders are combined to provide high-quality recommendations.

## Retrieval and Ranking

This architecture follows a "Retrieval and Ranking" pattern:

![](../../img/pipeline.drawio.svg)

1. The input layer is the [datasource](./data-source). This is where all the raw data is stored.
    * **Users:** Demographic data or profiles of users using the app.
    * **Items:** The catalog of content, products, videos and etc. that can be recommended.
    * **Feedback:** User feedback on items (clicks, likes, purchases, view time). This is crucial for training the algorithms to understand user preferences.
2. The retrieval layer consists of multiple [recommenders](./recommenders/) that generate a large pool of candidate items for each user.
    * **Latest Items:** Newest content, the predefined recommender in Gorse.
    * **Non-personalized:** Items are ranked by defined rules, such as most popular items.
    * **User to User:** "People similar to you liked this."
    * **Item to Item:** "Because you liked X, here is Y."
    * **Collaborative:** Matrix factorization finds complex patterns in user-item interactions.
    * **External API:** Fetches recommendations from third-party services (e.g., an ad network or a partner service).
3. The ranking layer merge all the outputs from different recommenders, removes items that the user has already seen (read items) and scores the remaining items based on the probability that the user will engage with them.
    * **Ranker:** Scores and sorts the items based on the probability that the user will engage with them.
    * **Replacement:** Read items are replaced back to recommendations if configured.
    * **Fallback:** If the ranker cannot provide enough recommendations (e.g., for new users), the fallback module provides alternative recommendations using simpler methods (like latest items).

When a user sees the recommendations and interacts with them (or ignores them), that action is recorded and fed back into the database. This allows the system to learn and improve its accuracy for the next time.

### Default Pipeline

There is a predefined recommender, latest items. If no pipeline is configured (empty `[recommend]` section in the configuration file), Gorse will use the default pipeline:

![](../../img/default.drawio.svg)

Latest items are recommended to all users. Latest items are easy to implement and can recommend fresh items to users. However, latest items ignore user preferences and cannot provide personalized recommendations. Therefore, it is recommended to configure a complete pipeline to improve recommendation quality.

### Caches in Pipeline

The following intermediate results are cached and updated periodically:
- Users neighbors for user-to-user recommenders.
- Item neighbors for item-to-item recommenders.
- Results of non-personalized recommenders.
- Output of ranker (with replacement applied) for each user.

Cache will be updated if data changed, configurations changed or expiration time reached. The size and expiration time of caches can be configured in the configuration file.

```toml
[recommend]
cache_size = 100
cache_expire = "72h"
```

Increasing cache size might improve recommendations since the recommender system has more information on data but also consumes more cache storage. The expiration time of the cache should be traded off between freshness and CPU costs.

## How Gorse Works

The master node loads data from the database. In the process of loading data, popular items and the latest items are written to the cache. Then, the master node searches for neighbors and training recommendation models. In the background, the random search is used to find the optimal recommendation model for current data. The worker nodes pull recommendation models from the master node and generate recommendations for each user. The server nodes provide RESTful APIs. Workers and servers connect to the master node via GRPC, which is configured in the configuration file.

![](../../img/recommend.drawio.svg)

```toml
[master]

# GRPC port of the master node. The default value is 8086.
port = 8086

# gRPC host of the master node. The default values is "0.0.0.0".
host = "0.0.0.0"

# Number of working jobs in the master node. The default value is 1.
n_jobs = 1

# Meta information timeout. The default value is 10s.
meta_timeout = "10s"
```

The number of working jobs for the master node is set by `master.n_jobs`. For workers, the number of working jobs is set by the command line flag.

## Recommendation Flow

Gorse works like a waterfall. Users, items and feedbacks are the sources of water. Intermediate results will be cached in cache storage (eg. Redis) such as water falling from the first waterfall will be cached in the intermediate pool. After several stages, selected items are recommended to users.

The intermediate cache is configurable. Increasing cache size might improve recommendations since the recommender system has more information on data but also consumes more cache storage. The expiration time of the cache should be traded off between freshness and CPU costs.

The recommendation flow will be introduced in the top-down method.

### Master: Neighbors and Models

The master node is driven by data loading. Data loading happens in every `model_fit_period`. The latest items and popular items can be collected during loading data. Once data is loaded, the following tasks start.

- **Find Neighbors:** User neighbors and item neighbors are found and cached.
- **Fit MF and FM** The matrix factorization model and factorization machine model are trained and delivered to workers.
- **Optimize MF and FM:** In every `model_search_period`, random search is used to optimize MF and FM. The model searcher will generate `model_search_trials` combinations of hyper-parameters and the model with the best score during `model_search_epoch` epoch is used in the next model training period. In most cases, there is no need to change these two options. By default, the model size is fixed, set `enable_model_size_search` to search larger models, which consumes more memory.

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

# Enable searching models of different sizes, which consume more memory. The default value is false.
enable_model_size_search = false
```

Once data is loaded, neighbor searching and model training starts in parallel. After neighbor searching and model training is finished, model optimization starts if the last optimize time is `model_search_period` ago.

### Worker: Offline Recommendation

Workers nodes generate and write offline recommendations to the cache database. The worker node checks each user in every `check_recommend_period`. If a user's active time is greater than his or her latest offline recommendation cache or the cache is generated before `refresh_recommend_period`, the worker starts to refresh offline recommendations for this user.

First, the worker collects candidates from the latest items, popular items, user similarity-based recommendations, item similarity-based recommendations and matrix factorization recommendations. Sources of candidates can be enabled or disabled in the configuration. Then, candidates are ranked by the factorization machine and read items are removed. If `enable_click_through_prediction` is `false`, candidates are ranked randomly. Finally, popular items and the latest items will be injected into recommendations with probabilities defined in `explore_recommend`. Offline recommendation results will be written to the cache.

### Server: Online Recommendation

The server node exposes RESTful APIs for data and recommendations.

Recommendation APIs return recommendation results. For non-personalized recommendations (latest items, popular items or neighbors), the server node fetches cached recommendations from the cache database and sends responses. But the server node needs to do more work for personalized recommendations.

- **Recommendation:** Offline recommendations by workers are written to responses and read items will be removed. But if the offline recommendation cache is consumed, fallback recommenders will be used. Recommenders in `fallback_recommend` will be tried in order.

- **Session recommendation:** Session recommender generates recommendations for unregistered users based on user session-wise feedbacks. Session recommendations are generated by an item similarity-based algorithm based on the latest $n$ feedback and read items from feedback will be removed from recommendations. The number of user feedback is set by `num_feedback_fallback_item_based`.

```toml
[recommend.online]

# The fallback recommendation method is used when cached recommendation drained out:
#   item_based: Recommend similar items.
#   popular: Recommend popular items.
#   latest: Recommend latest items.
# Recommenders are used in order. The default values is ["latest"].
fallback_recommend = ["item_based", "latest"]

# The number of feedback used in fallback item-based similar recommendation. The default values is 10.
num_feedback_fallback_item_based = 10
```

### Clock Synchronization

Gorse supports feedback with future timestamps, thus Gorse relies on a correct clock. However, clocks in different hosts might be different, `clock_error` should be the maximal difference between clocks.
