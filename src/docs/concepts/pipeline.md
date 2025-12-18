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

The pipeline is executed in a distributed manner. There are three types of nodes in Gorse: master, worker, and server.

### Master: Dataset, Neighbors, and Models

A cluster has only one master node. Workers and servers connect to the master node via GRPC. The master node is responsible the following tasks:

1. **Load dataset:** Load users, items, and feedback from the database. Non-personalized recommendations are updated during this process.
2. **Generate user-to-user recommendation:** Calculate user similarities and store user neighbors in the cache database for each user-to-user recommender.
3. **Generate item-to-item recommendation:** Calculate item similarities and store item neighbors in the cache database for each item-to-item recommender.
4. **Train Collaborative Filtering Model:** Train matrix factorization models and store the models in the blob storage (local disk on the master node by default).
5. **Train Click-Through Rate Prediction Model:** Train the factorization machine ranking model and store the model in the blob storage.

If the master node is down, workers and servers will still work but configuration changes and model updates will not be applied.

### Worker: Recommendation

The retrieval and ranking process is executed by worker nodes. Workers connect to the master node to get configurations and models. Workers periodically generate offline recommendations for all users and store the results in the cache database by the following steps:

1. For each user, get candidate items from all recommenders.
2. Score and sort candidate items by the ranker.
3. Replace read items back to recommendations if configured.
4. Store the final recommendations in the cache database.

More workers can be added to speed up the offline recommendation process. If a worker node is down, other workers will take over its tasks.

### Server: Filter and Fallback

The server node exposes RESTful APIs for data and recommendations. When a user requests recommendations, the server node performs the following steps:

1. Get offline recommendations from the cache database.
2. Filter out items that have been read by the user.
3. If not enough recommendations, get fallback recommendations from the recommenders.
4. Return recommendations to the user.

Servers are stateless, thus more servers can be added to handle more requests.

### Clock Synchronization

Gorse supports feedback with future timestamps, thus Gorse relies on a correct clock. However, clocks in different hosts might be different, `clock_error` should be the maximal difference between clocks.
