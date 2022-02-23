# Configuration

Previous section *[Recommend using Gorse](ch01-02-recommend.md)* is helpful to understand configurations introduced in this section. These configuration items without default values must be filled. It's highly recommended to create a new config file based on [`config.toml.template`](https://github.com/zhenghaoz/gorse/blob/master/config/config.toml.template).

## `[database]`

Configurations under `[database]` are used to define behaviors on the database and data.

| Key | Type | Default | Description |
|-|-|-|-|
| `data_store` | string |  | Database for data store (supports MySQL/MongoDB) |
| `cache_store` | string |  | Database for cache store (supports Redis) |
| `auto_insert_user` | boolean | `true` | Automatically insert new users when inserting new feedback [(2.2)](ch02-02-feedback.md#users-items-and-feedback) |
| `auto_insert_item` | boolean | `true` | Automatically insert new items when inserting new feedback [(2.2)](ch02-02-feedback.md#users-items-and-feedback) |
| `cache_size` | string | `100` | Number of cached elements in cache store |
| `positive_feedback_types` | string | | Types of positive feedback [(2.2)](ch02-02-feedback.md#define-positive-feedback-and-read-feedback) |
| `read_feedback_type` | string |  | Type of feedback for read events [(2.2)](ch02-02-feedback.md#define-positive-feedback-and-read-feedback) |
| `positive_feedback_ttl` | string | `0` | Time-to-live of positive feedback |
| `item_ttl` | string | `0` | Time-to-live of items |

The DSN (Database Source Name) format of the `data_store` and `cache_store` is as follows.

- Redis: `redis://hostname:port`
- MySQL: `mysql://[username[:password]@][protocol[(hostname:port)]]/database[?config1=value1&...configN=valueN]`
- PostgresSQL: `postgres://bob:secret@1.2.3.4:5432/mydb?sslmode=verify-full`
- ClickHouse: `clickhouse://user:password@host[:port]/database?param1=value1&...&paramN=valueN`
- MongoDB: `mongodb://[username:password@]hostname1[:port1][,... hostnameN[:portN]]][/[database][?options]]`

## `[master]`

Configurations under `[master]` are used to define behaviors of the master node.

| Key | Type | Default | Description |
|-|-|-|-|
| `host` | string | `"127.0.0.1"` | Master node listening host for gRPC service (metadata exchange) |
| `port` | integer | `8086` | Master node listening port for gRPC service (metadata exchange) |
| `http_host` | string | `"127.0.0.1"` | Master node listening host for HTTP service (dashboard) |
| `http_port` | integer | `8088` | Master node listening port for HTTP service (dashboard) |
| `n_jobs` | integer | `1` | Number of working threads for the master node |
| `meta_timeout` | integer | `60` | Metadata timeout in seconds |
| `dashboard_user_name` | string | | Username login dashboard [(2.5)](ch02-05-dashboard.md#login) |
| `dashboard_password` | string | | Password login dashboard [(2.5)](ch02-05-dashboard.md#login) |

## `[server]`

Configurations under `[server]` are used to define behaviors of the server node.

| Key | Type | Default | Description |
|-|-|-|-|
| `default_n` | integer | `10` | Default number of returned items |
| `api_key` | string |  | Secret key for RESTful APIs (SSL required) |

## `[recommend]`

Configurations under `[recommend]` are used to define behaviors of recommendation.

| Key | Type | Default | Description |
|-|-|-|-|
| `popular_window` | integer | `180` | Time window of popular items in days [(2.3)](ch02-03-strategy.md#latest-recommender) |
| `fit_period` | integer | `60` | Period of model training in minutes |
| `search_period` | integer | `180` | Period of model search in minutes |
| `search_epoch` | integer | `100` | Number of training epochs for each model in model search |
| `search_trials` | integer | `10` | Number of trials for each model in model search |
| `refresh_recommend_period` | integer | `5` | Period to refresh offline recommendation cache in days |
| `fallback_recommend` | strings | `["latest"]` | Source of recommendation when personalized recommendation exhausted [(2.3)](ch02-03-strategy.md#online-strategy) |
| `num_feedback_fallback_item_based` | integer | `10` | The number of feedback used in fallback item-based similar recommendation [(2.3)](ch02-03-strategy.md#online-strategy) |
| `item_neighbor_type` | string | `"auto"` | The type of neighbors for items [(2.3)](ch02-03-strategy.md#item-based-similarity-recommender) |
| `enable_item_neighbor_index` | boolean | `false` | Enable approximate item neighbor searching using vector index |
| `item_neighbor_index_recall` | float | `0.8` | Minimal recall for approximate user neighbor searching |
| `item_neighbor_index_fit_epoch` | integer | `3` | Maximal number of fit epochs for approximate user neighbor searching vector index |
| `user_neighbor_type` | string | `"auto"` | The type of neighbors for users [(2.3)](ch02-03-strategy.md#user-based-similarity-recommender) |
| `enable_user_neighbor_index` | boolean | `false` | Enable approximate item neighbor searching using vector index |
| `user_neighbor_index_recall` | float | `0.8` | Minimal recall for approximate item neighbor searching |
| `user_neighbor_index_fit_epoch` | integer | `3` | Maximal number of fit epochs for approximate item neighbor searching vector index |
| `enable_latest_recommend` | boolean | `false` | Enable latest recommendation during offline recommendation [(2.3)](ch02-03-strategy.md#offline-strategy) |
| `enable_popular_recommend` | boolean | `false` | Enable popular recommendation during offline recommendation [(2.3)](ch02-03-strategy.md#offline-strategy) |
| `enable_user_based_recommend` | boolean | `false` | Enable user-based similarity recommendation during offline recommendation [(2.3)](ch02-03-strategy.md#offline-strategy) |
| `enable_item_based_recommend` | boolean | `false` | Enable item-based similarity recommendation during offline recommendation [(2.3)](ch02-03-strategy.md#offline-strategy) |
| `enable_collaborative_recommend` | boolean | `true` | Enable collaborative filtering recommendation during offline recommendation [(2.3)](ch02-03-strategy.md#offline-strategy) |
| `enable_collaborative_index` | boolean | `false` | Enable approximate collaborative filtering recommend using vector index |
| `collaborative_index_recall` | float | `0.9` | Minimal recall for approximate collaborative filtering recommend |
| `collaborative_index_fit_epoch` | integer | `3` | Maximal number of fit epochs for approximate collaborative filtering recommend vector index |
| `enable_click_through_prediction` | boolean | `false` | Enable click-though rate prediction during offline recommendation. Otherwise, results from multi-way recommendation would be merged randomly [(2.3)](ch02-03-strategy.md#offline-strategy) |
| `explore_recommend` | map | `{ popular = 0.0, latest = 0.0 }` | The explore recommendation method is used to inject popular items or latest items into recommended result [(2.3)](ch02-03-strategy.md#offline-strategy) |
