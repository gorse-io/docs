---
icon: config_s
---
# Configuration

These configuration items without default values must be filled. It's highly recommended to create a new config file based on [the configuration template](https://github.com/gorse-io/gorse/blob/release-0.4/config/config.toml). *The "description" for each option links to the detailed usage of this option.*

## `database`

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `data_store` | string |     | Database for data storage, supports MySQL, PostgreSQL, ClickHouse and MongoDB. |
| `cache_store` | string |     | Database for cache storage, supports MySQL, PostgreSQL, MongoDB and Redis. |
| `table_prefix` | string | | Naming prefix for tables (collections, keys) in databases. |
| `cache_table_prefix` | string | | Naming prefix for tables (collections, keys) in cache storage databases. If empty, `table_prefix` is used. |
| `data_table_prefix` | string | | Naming prefix for tables (collections, keys) in data storage databases. If empty, `table_prefix` is used. |

The DSN (Database Source Name) format of the `data_store` and `cache_store` is as follows.

::: tabs

@tab Redis

```bash
# TCP Connection
redis://<user>:<password>@<host>:<port>/<db_number>

# TLS Connection
rediss://<user>:<password>@<host>:<port>/<db_number>

# TCP Connection to Redis Cluster
redis+cluster://<user>:<password>@<host>:<port>/<db_number>
```

Document: https://pkg.go.dev/github.com/go-redis/redis/v8#ParseURL

@tab MySQL

```
mysql://[username[:password]@][protocol[(hostname:port)]]/database[?config1=value1&...configN=valueN]
```

Document: https://github.com/go-sql-driver/mysql#dsn-data-source-name

@tab Postgres

```bash
# Option 1
postgres://bob:secret@1.2.3.4:5432/mydb?sslmode=verify-full

# Option 2
postgresql://bob:secret@1.2.3.4:5432/mydb?sslmode=verify-full
```
Document: https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING

@tab MongoDB

```bash
# Standard Connection
mongodb://[username:password@]hostname1[:port1][,... hostnameN[:portN]]][/[database][?options]]

# DNS Seed List Connection
mongodb+srv://server.example.com/
```

Document: https://www.mongodb.com/docs/manual/reference/connection-string/

@tab ClickHouse

```bash
# HTTP Connection (Option 1)
clickhouse://user:password@host[:port]/database?param1=value1&...&paramN=valueN

# HTTP Connection (Option 2)
chhttp://user:password@host[:port]/database?param1=value1&...&paramN=valueN

# HTTPS Connection
chhttps://user:password@host[:port]/database?param1=value1&...&paramN=valueN
```

Document: https://github.com/mailru/go-clickhouse#dsn

:::

## `master`

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `host` | string | `"0.0.0.0"` | [Master node listening host for gRPC service (metadata exchange)](./concepts/how-it-works#architecture) |
| `port` | integer | `8086` | [Master node listening port for gRPC service (metadata exchange)](./concepts/how-it-works#architecture) |
| `http_host` | string | `"0.0.0.0"` | [Master node listening host for HTTP service (dashboard and metrics)](./gorse-dashboard#login) |
| `http_port` | integer | `8088` | [Master node listening port for HTTP service (dashboard and metrics)](./gorse-dashboard#login) |
| `n_jobs` | integer | `1` | [Number of working threads for the master node](./concepts/how-it-works#architecture) |
| `meta_timeout` | integer | `10s` | [Metadata timeout](./concepts/how-it-works#architecture) |
| `dashboard_user_name` | string |     | [Dashboard login username](./gorse-dashboard#login) |
| `dashboard_password` | string |     | [Dashboard login password](./gorse-dashboard#login) |

## `server`

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `default_n` | integer | `10` | Default number of returned items [(RESTful APIs)](restful-apis#authorization) |
| `api_key` | string |     | [Secret key for RESTful APIs (SSL required)](./api/restful-api.html#authorization) |
| `clock_error` | integer | `5s` | clock error in the cluster [(RESTful APIs)](restful-apis#clock-error) |
| `auto_insert_user` | boolean | `true` | Automatically insert new users when inserting new feedback [(Feedback Collection)](/build-recommender/feedback-collection#users-items-and-feedback) |
| `auto_insert_item` | boolean | `true` | Automatically insert new items when inserting new feedback [(Feedback Collection)](/build-recommender/feedback-collection#users-items-and-feedback) |
| `cache_expire` | string | `10s` | Server-side cache expire time [(RESTful APIs)](restful-apis#server-side-cache) |

## `recommend`

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `cache_size` | string | `100` | [Number of cached elements in cache store](./concepts/how-it-works#recommendation-flow) |
| `cache_expire` | string | `72h` | [Recommended cache expire time](./concepts/how-it-works#recommendation-flow) |

### `recommend.data_source`

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `positive_feedback_types` | string |     | [Types of positive feedback](./concepts/data-objects#positive-feedback-and-read-feedback) |
| `read_feedback_types` | string |     | [Type of read feedback](./concepts/data-objects#positive-feedback-and-read-feedback) |
| `positive_feedback_ttl` | string | `0` | [Time-to-live of positive feedback](./concepts/data-objects#time-to-live-1) |
| `item_ttl` | string | `0` | [Time-to-live of items](./concepts/data-objects#time-to-live) |

### `recommend.popular`

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `popular_window` | integer | `4320h` | [Time window of popular items in days](./concepts/algorithms#popular-items) |

### `recommend.user_neighbors`

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `neighbor_type` | string | `"auto"` | [The type of neighbors for users](./concepts/algorithms#item-similarity) |
| `enable_index` | boolean | `false` | [Enable approximate item neighbor searching using clustering index](./concepts/algorithms#clustering-index) |
| `index_recall` | float | `0.8` | [Minimal recall for approximate item neighbor searching](./concepts/algorithms#clustering-index) |
| `index_fit_epoch` | integer | `3` | [Maximal number of fit epochs for approximate item neighbor searching clustering index](./concepts/algorithms#clustering-index) |

### `recommend.item_neighbors`

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `neighbor_type` | string | `"auto"` | [The type of neighbors for items](./concepts/algorithms#user-similarity) |
| `enable_index` | boolean | `false` | [Enable approximate item neighbor searching using clustering index](./concepts/algorithms#clustering-index) |
| `index_recall` | float | `0.8` | [Minimal recall for approximate user neighbor searching](./concepts/algorithms#clustering-index) |
| `index_fit_epoch` | integer | `3` | [Maximal number of fit epochs for approximate user neighbor searching clustering index](./concepts/algorithms#clustering-index) |

### `recommend.collaborative`

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `model_fit_period` | integer | `60m` | Period of model training [(Performance vs Precision)](/build-recommender/performance-vs-precision#set-training-and-recommendation-period) |
| `model_search_period` | integer | `360m` | Period of model search [(Performance vs Precision)](/build-recommender/performance-vs-precision#set-training-and-recommendation-period) |
| `model_search_epoch` | integer | `100` | Number of training epochs for each model in model search [(Performance vs Precision)](/build-recommender/performance-vs-precision#set-training-and-recommendation-period) |
| `model_search_trials` | integer | `10` | Number of trials for each model in model search [(Performance vs Precision)](/build-recommender/performance-vs-precision#set-training-and-recommendation-period) |
| `enable_model_size_search` | boolean | `false` | Enable searching models of different sizes, which consume more memory. |
| `enable_index` | boolean | `false` | [Enable approximate collaborative filtering recommend using HNSW index](./concepts/algorithms#matrix-factorization) |
| `index_recall` | float | `0.9` | [Minimal recall for approximate collaborative filtering recommend](./concepts/algorithms#matrix-factorization) |
| `index_fit_epoch` | integer | `3` | [Maximal number of fit epochs for approximate collaborative filtering recommend HNSW index](./concepts/algorithms#matrix-factorization) |

### `recommend.replacement`

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `enable_replacement` | boolean | `false` | Replace historical items back to recommendations [(Performance vs Precision)](/build-recommender/recommendation-strategies#offline-strategy) |
| `positive_replacement_decay` | float | `0.8` | Decay the weights of replaced items from positive feedbacks [(Performance vs Precision)](/build-recommender/recommendation-strategies#offline-strategy) |
| `read_replacement_decay` | float | `0.6` | Decay the weights of replaced items from read feedbacks [(Performance vs Precision)](/build-recommender/recommendation-strategies#offline-strategy) |

### `recommend.offline`

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `check_recommend_period` | integer | `1m` | Period to check recommendation for users [(Performance vs Precision)](/build-recommender/performance-vs-precision#set-training-and-recommendation-period) |
| `refresh_recommend_period` | integer | `24h` | Period to refresh offline recommendation cache [(Performance vs Precision)](/build-recommender/performance-vs-precision#set-training-and-recommendation-period) |
| `enable_latest_recommend` | boolean | `false` | Enable latest recommendation during offline recommendation [(Recommendation Strategies)](/build-recommender/recommendation-strategies#offline-strategy) |
| `enable_popular_recommend` | boolean | `false` | Enable popular recommendation during offline recommendation [(Recommendation Strategies)](/build-recommender/recommendation-strategies#offline-strategy) |
| `enable_user_based_recommend` | boolean | `false` | Enable user-based similarity recommendation during offline recommendation [(Recommendation Strategies)](/build-recommender/recommendation-strategies#offline-strategy) |
| `enable_item_based_recommend` | boolean | `false` | Enable item-based similarity recommendation during offline recommendation [(Recommendation Strategies)](/build-recommender/recommendation-strategies#offline-strategy) |
| `enable_collaborative_recommend` | boolean | `true` | Enable collaborative filtering recommendation during offline recommendation [(Recommendation Strategies)](/build-recommender/recommendation-strategies#offline-strategy) |
| `enable_click_through_prediction` | boolean | `false` | Enable click-though rate prediction during offline recommendation. Otherwise, results from multi-way recommendation would be merged randomly [(Recommendation Strategies)](/build-recommender/recommendation-strategies#offline-strategy) |
| `explore_recommend` | map | `{ popular = 0.0, latest = 0.0 }` | The explore recommendation method is used to inject popular items or latest items into recommended result [(Recommendation Strategies)](/build-recommender/recommendation-strategies#offline-strategy) |

### `recommend.online`

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `fallback_recommend` | strings | `["latest"]` | Source of recommendation when personalized recommendation exhausted [(Recommendation Strategies)](/build-recommender/recommendation-strategies#online-strategy) |
| `num_feedback_fallback_item_based` | integer | `10` | The number of feedback used in fallback item-based similar recommendation [(Recommendation Strategies)](/build-recommender/recommendation-strategies#online-strategy) |

## Environment Variables

Part of configurations can be overwritten by environment variables.

| Configuration | Environment Variable |
| --- | --- |
| `database.cache_store` | `GORSE_CACHE_STORE` |
| `database.data_store` | `GORSE_DATA_STORE` |
| `database.table_prefix` | `GORSE_TABLE_PREFIX` |
| `database.cache_table_prefix` | `GORSE_CACHE_TABLE_PREFIX` |
| `database.data_table_prefix` | `GORSE_DATA_TABLE_PREFIX` |
| `master.port` | `GORSE_MASTER_PORT` |
| `master.host` | `GORSE_MASTER_HOST` |
| `master.http_port` | `GORSE_MASTER_HTTP_PORT` |
| `master.http_host` | `GORSE_MASTER_HTTP_HOST` |
| `master.n_jobs` | `GORSE_MASTER_JOBS` |
| `master.dashboard_user_name` | `GORSE_DASHBOARD_USER_NAME` |
| `master.dashboard_password` | `GORSE_DASHBOARD_PASSWORD` |
| `server.api_key` | `GORSE_SERVER_API_KEY` |
