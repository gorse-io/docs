---
date: 2025-12-19
category:
  - Release
tag:
  - Release
---

# Gorse v0.5 Has been Released

After a year and a half of development, Gorse v0.5 is released. This release includes breaking changes, so it is worth writing an article to introduce the new features and upgrade guide.

## New Features

### New Data Schema

1. The `Subscribe` field of `User` has been removed. In the early design, the `Subscribe` field was used to store tags subscribed by users, but it was not actually used. It is recommended to use [External Recommenders](../docs/concepts/recommenders/external) to implement business logic driven recommendations like subscriptions.

2. The `Labels` field of `User` and `Item` supports arbitrary JSON objects. On this basis, some recommenders can specify nested fields to use. For example, in item-to-item recommenders, you can specify using the `Labels.embedding` embedding vector to calculate item similarity.

3. The `Value` field has been added to feedback. The `Value` field is used to represent the weight of feedback, such as the percentage of video watching, the rating of goods, etc. On the one hand, positive and negative feedback can be distinguished by setting thresholds based on the `Value` field; on the other hand, future updates will utlize the `Value` field to better train models. When inserting feedback, you can choose to accumulate (POST) the `Value`, or overwrite (PUT) the original `Value`.

### New Recommenders

1. Latest items are queried directly on the item table. Latest items can be obtained in real time without waiting for the recommender system to sort. With database indexes, the query speed of latest items is fast, and it will be provided as a built-in (no configuration required) recommender.

2. Added [Non-personalized Recommenders](../docs/concepts/recommenders/non-personalized), which can sort items according to custom rules. For example, items can be sorted according to item label fields to achieve functions such as "recommend by highest rating" or "recommend by lowest price".

3. Removed the popular item recommender. Since non-personalized recommenders can fully implement the function of popular item recommender and are more flexible than popular recommender, the popular item recommender and its RESTful API have been removed.

4. Added [Item-to-Item Recommenders](../docs/concepts/recommenders/item-to-item) to replace the similar item recommender in v0.4. Compared with the similar item recommender, the item-to-item recommender has the following advantages:
   - Multiple item-to-item recommender instances can be created.
   - The item label fields to be used can be specified.
   - Support for similarity calculation based on embedding vectors.

5. Added [User-to-User Recommenders](../docs/concepts/recommenders/user-to-user) to replace the similar user recommender in v0.4. The advantages of the new algorithm are similar to those of the item-to-item recommender.

6. Added [External Recommenders](../docs/concepts/recommenders/external), which can integrate external business logic into the recommendation pipeline. For example, user subscriptions can be added to the recommendation candidate set to participate in the final sorting. The current implementation of Fetch API is relatively simple, and more functions will be supported in the future.

### Other Updates

Other important updates unrelated to the recommendation pipeline will not be listed all here, welcome to find them in the documentation. These updates include but are not limited to:

- **Fixed the issue of excessive cache data volume caused by saving cache for each `Category`**
- Console supports OpenID Connect login
- gRPC communication from master node to worker node supports TLS encryption
- SQLite supports cluster deployment (test environment only)
- All recommendation APIs support filtering recommendation results using multiple `Category` parameters
- ...

## Upgrade Guide

### Configuration Update

Refer to the latest [configuration file example](https://github.com/gorse-io/gorse/blob/master/config/config.toml) to update your configuration file. Major configuration changes include:
1. The positive feedback type supports setting expressions for the `Value` field, for example, `read>=3` means feedback with read times greater than or equal to 3 is positive feedback, please modify as needed.
2. Configuration items for popular recommender, similar item recommender, and similar user recommender have been removed, please migrate to non-personalized recommenders, item-to-item recommenders, and user-to-user recommenders.
3. The naming and default values of other configuration items may have changed, please compare carefully.

### Database Changes

If you are using a MongoDB database, no data migration operations are required. However, relational database (MySQL, Postgres, SQLite) users need to make the following changes:

1. Remove the `Subscribe` field from the user table; failure to do so will result in user insertion failures.
2. The `Value` field and `Updated` field are added to the feedback table, but Gorse will add these fields automatically.
3. If the cache database uses Redis, please ensure that the RediSearch and RedisTimeseries modules are configured, otherwise the cache cannot be written.

::: warning
If you are not using a MongoDB database, the safest upgrade method is actually to redeploy Gorse v0.5 and re-import data. Although we try our best to ensure backward compatibility of the database, due to changes in data structure, there is still a risk of data corruption.
:::

## Conclusion

If you encounter any problems during the upgrade process, please feel free to submit an issue on GitHub, and we will assist you in solving the problem as soon as possible. We look forward to your continued use of the Gorse recommendation system and welcome valuable suggestions and feedback!
