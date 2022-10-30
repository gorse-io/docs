# Configuration

These configuration items without default values must be filled. It's highly recommended to create a new config file based on [`config.toml.template`](https://github.com/zhenghaoz/gorse/blob/master/config/config.toml.template).

## `[database]`

| Key | Type | Default | Description |
|-|-|-|-|
| `data_store` | string |  | Database for data store (supports MySQL/PostgreSQL/ClickHouse/MongoDB) [(Build Recommender)](/build-recommender/) |
| `cache_store` | string |  | Database for cache store (supports MySQL/PostgreSQL/MongoDB/Redis) [(Build Recommender)](/build-recommender/) |

The DSN (Database Source Name) format of the `data_store` and `cache_store` is as follows.

- Redis: `redis://<user>:<password>@<host>:<port>/<db_number>`
    - Use the prefix `rediss://` for TLS connections.
- MySQL: `mysql://[username[:password]@][protocol[(hostname:port)]]/database[?config1=value1&...configN=valueN]`
- PostgresSQL: `postgres://bob:secret@1.2.3.4:5432/mydb?sslmode=verify-full`
    - The prefix `postgresql://` is an alias of `postgres://`.
- ClickHouse: `clickhouse://user:password@host[:port]/database?param1=value1&...&paramN=valueN`
    - Gorse connects ClickHouse via HTTP (TCP interface is not supported).
    - The prefix `chhttp://` is an alias of `clickhouse://`.
    - Use the prefix `chhttps://` for TLS connections.
- MongoDB: `mongodb://[username:password@]hostname1[:port1][,... hostnameN[:portN]]][/[database][?options]]`
    - Use the prefix `mongodb+srv://` for a DNS-constructed seed list by the DNS SRV record. 

## `[master]`

| Key | Type | Default | Description |
|-|-|-|-|
| `host` | string | `"0.0.0.0"` | Master node listening host for gRPC service (metadata exchange) [(Build Recommender)](/build-recommender/) |
| `port` | integer | `8086` | Master node listening port for gRPC service (metadata exchange) [(Build Recommender)](/build-recommender/) |
| `http_host` | string | `"0.0.0.0"` | Master node listening host for HTTP service (dashboard [(Gorse Dashboard)](/build-recommender/gorse-dashboard)) |
| `http_port` | integer | `8088` | Master node listening port for HTTP service (dashboard [(Gorse Dashboard)](/build-recommender/gorse-dashboard)) |
| `n_jobs` | integer | `1` | Number of working threads for the master node |
| `meta_timeout` | integer | `10s` | Metadata timeout [(Build Recommender)](/build-recommender/) |
| `dashboard_user_name` | string | | Username login dashboard [(Gorse Dashboard)](/build-recommender/gorse-dashboard#login) |
| `dashboard_password` | string | | Password login dashboard [(Gorse Dashboard)](/build-recommender/gorse-dashboard#login) |

## `[server]`

| Key | Type | Default | Description |
|-|-|-|-|
| `default_n` | integer | `10` | Default number of returned items [(RESTful APIs)](restful-apis#authorization) |
| `api_key` | string |  | Secret key for RESTful APIs (SSL required) [(RESTful APIs)](restful-apis#default-length-of-returned-list) |
| `clock_error` | integer | `5s` | clock error in the cluster [(RESTful APIs)](restful-apis#clock-error) |
| `auto_insert_user` | boolean | `true` | Automatically insert new users when inserting new feedback [(Feedback Collection)](/build-recommender/feedback-collection#users-items-and-feedback) |
| `auto_insert_item` | boolean | `true` | Automatically insert new items when inserting new feedback [(Feedback Collection)](/build-recommender/feedback-collection#users-items-and-feedback) |
| `cache_expire` | string | `10s` | Server-side cache expire time [(RESTful APIs)](restful-apis#server-side-cache) |

## `[recommend]`

| Key | Type | Default | Description |
|-|-|-|-|
| `cache_size` | string | `100` | Number of cached elements in cache store |
| `cache_expire` | string | `72h` | Recommended cache expire time |

### `[recommend.data_source]`

| Key | Type | Default | Description |
|-|-|-|-|
| `positive_feedback_types` | string | | Types of positive feedback [(Feedback Collection)](/build-recommender/feedback-collection#define-positive-feedback-and-read-feedback) |
| `read_feedback_types` | string |  | Type of feedback for read events [(Feedback Collection)](/build-recommender/feedback-collection#define-positive-feedback-and-read-feedback) |
| `positive_feedback_ttl` | string | `0` | Time-to-live of positive feedback [(Performance vs Precision)](/build-recommender/performance-vs-precision#set-ttl-for-items-and-feedback) |
| `item_ttl` | string | `0` | Time-to-live of items [(Performance vs Precision)](/build-recommender/performance-vs-precision#set-ttl-for-items-and-feedback) |

### `[recommend.popular]`

| Key | Type | Default | Description |
|-|-|-|-|
| `popular_window` | integer | `4320h` | Time window of popular items in days [(Recommendation Strategies)](/build-recommender/recommendation-strategies#latest-recommender) |

### `[recommend.user_neighbors]`

| Key | Type | Default | Description |
|-|-|-|-|
| `neighbor_type` | string | `"auto"` | The type of neighbors for users [(Recommendation Strategies)](/build-recommender/recommendation-strategies#user-based-similarity-recommender) |
| `enable_index` | boolean | `false` | Enable approximate item neighbor searching using vector index [(Performance vs Precision)](/build-recommender/performance-vs-precision#enable-clustering-index-for-similar-itemuser-searching) |
| `index_recall` | float | `0.8` | Minimal recall for approximate item neighbor searching [(Performance vs Precision)](/build-recommender/performance-vs-precision#enable-clustering-index-for-similar-itemuser-searching) |
| `index_fit_epoch` | integer | `3` | Maximal number of fit epochs for approximate item neighbor searching vector index [(Performance vs Precision)](/build-recommender/performance-vs-precision#enable-clustering-index-for-similar-itemuser-searching) |

### `[recommend.item_neighbors]`

| Key | Type | Default | Description |
|-|-|-|-|
| `neighbor_type` | string | `"auto"` | The type of neighbors for items [(Recommendation Strategies)](/build-recommender/recommendation-strategies#item-based-similarity-recommender) |
| `enable_index` | boolean | `false` | Enable approximate item neighbor searching using vector index [(Performance vs Precision)](/build-recommender/performance-vs-precision#enable-clustering-index-for-similar-itemuser-searching) |
| `index_recall` | float | `0.8` | Minimal recall for approximate user neighbor searching [(Performance vs Precision)](/build-recommender/performance-vs-precision#enable-clustering-index-for-similar-itemuser-searching) |
| `index_fit_epoch` | integer | `3` | Maximal number of fit epochs for approximate user neighbor searching vector index [(Performance vs Precision)](/build-recommender/performance-vs-precision#enable-clustering-index-for-similar-itemuser-searching) |

### `[recommend.collaborative]`

| Key | Type | Default | Description |
|-|-|-|-|
| `model_fit_period` | integer | `60m` | Period of model training [(Performance vs Precision)](/build-recommender/performance-vs-precision#set-training-and-recommendation-period) |
| `model_search_period` | integer | `360m` | Period of model search [(Performance vs Precision)](/build-recommender/performance-vs-precision#set-training-and-recommendation-period) |
| `model_search_epoch` | integer | `100` | Number of training epochs for each model in model search [(Performance vs Precision)](/build-recommender/performance-vs-precision#set-training-and-recommendation-period) |
| `model_search_trials` | integer | `10` | Number of trials for each model in model search [(Performance vs Precision)](/build-recommender/performance-vs-precision#set-training-and-recommendation-period) |
| `enable_model_size_search` | boolean | `false` | Enable searching models of different sizes, which consume more memory. |
| `enable_index` | boolean | `false` | Enable approximate collaborative filtering recommend using vector index [(Performance vs Precision)](/build-recommender/performance-vs-precision#enable-hnsw-index-for-collaborative-filtering) |
| `index_recall` | float | `0.9` | Minimal recall for approximate collaborative filtering recommend [(Performance vs Precision)](/build-recommender/performance-vs-precision#enable-hnsw-index-for-collaborative-filtering) |
| `index_fit_epoch` | integer | `3` | Maximal number of fit epochs for approximate collaborative filtering recommend vector index [(Performance vs Precision)](/build-recommender/performance-vs-precision#enable-hnsw-index-for-collaborative-filtering) |

### `[recommend.replacement]`

| Key | Type | Default | Description |
|-|-|-|-|
| `enable_replacement` | boolean | `false` | Replace historical items back to recommendations [(Performance vs Precision)](/build-recommender/recommendation-strategies#offline-strategy) |
| `positive_replacement_decay` | float | `0.8` | Decay the weights of replaced items from positive feedbacks [(Performance vs Precision)](/build-recommender/recommendation-strategies#offline-strategy) |
| `read_replacement_decay` | float | `0.6` | Decay the weights of replaced items from read feedbacks [(Performance vs Precision)](/build-recommender/recommendation-strategies#offline-strategy) |

### `[recommend.offline]`

| Key | Type | Default | Description |
|-|-|-|-|
| `check_recommend_period` | integer | `1m` | Period to check recommendation for users [(Performance vs Precision)](/build-recommender/performance-vs-precision#set-training-and-recommendation-period) |
| `refresh_recommend_period` | integer | `24h` | Period to refresh offline recommendation cache [(Performance vs Precision)](/build-recommender/performance-vs-precision#set-training-and-recommendation-period) |
| `enable_latest_recommend` | boolean | `false` | Enable latest recommendation during offline recommendation [(Recommendation Strategies)](/build-recommender/recommendation-strategies#offline-strategy) |
| `enable_popular_recommend` | boolean | `false` | Enable popular recommendation during offline recommendation [(Recommendation Strategies)](/build-recommender/recommendation-strategies#offline-strategy) |
| `enable_user_based_recommend` | boolean | `false` | Enable user-based similarity recommendation during offline recommendation [(Recommendation Strategies)](/build-recommender/recommendation-strategies#offline-strategy) |
| `enable_item_based_recommend` | boolean | `false` | Enable item-based similarity recommendation during offline recommendation [(Recommendation Strategies)](/build-recommender/recommendation-strategies#offline-strategy) |
| `enable_collaborative_recommend` | boolean | `true` | Enable collaborative filtering recommendation during offline recommendation [(Recommendation Strategies)](/build-recommender/recommendation-strategies#offline-strategy) |
| `enable_click_through_prediction` | boolean | `false` | Enable click-though rate prediction during offline recommendation. Otherwise, results from multi-way recommendation would be merged randomly [(Recommendation Strategies)](/build-recommender/recommendation-strategies#offline-strategy) |
| `explore_recommend` | map | `{ popular = 0.0, latest = 0.0 }` | The explore recommendation method is used to inject popular items or latest items into recommended result [(Recommendation Strategies)](/build-recommender/recommendation-strategies#offline-strategy) |

### `[recommend.online]`

| Key | Type | Default | Description |
|-|-|-|-|
| `fallback_recommend` | strings | `["latest"]` | Source of recommendation when personalized recommendation exhausted [(Recommendation Strategies)](/build-recommender/recommendation-strategies#online-strategy) |
| `num_feedback_fallback_item_based` | integer | `10` | The number of feedback used in fallback item-based similar recommendation [(Recommendation Strategies)](/build-recommender/recommendation-strategies#online-strategy) |

## Environment Variables

Part of configurations can be overwritten by environment variables.

| Configuration | Environment Variable |
|-|-|
| `database.cache_store` | `GORSE_CACHE_STORE` |
| `database.data_store` | `GORSE_DATA_STORE` |
| `master.port` | `GORSE_MASTER_PORT` |
| `master.host` | `GORSE_MASTER_HOST` |
| `master.http_port` | `GORSE_MASTER_HTTP_PORT` |
| `master.http_host` | `GORSE_MASTER_HTTP_HOST` |
| `master.n_jobs` | `GORSE_MASTER_JOBS` |
| `master.dashboard_user_name` | `GORSE_DASHBOARD_USER_NAME` |
| `master.dashboard_password` | `GORSE_DASHBOARD_PASSWORD` |
| `server.api_key` | `GORSE_SERVER_API_KEY` |
