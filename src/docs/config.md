---
icon: config_s
---
# Configuration

These configuration items without default values must be filled. It's highly recommended to create a new config file based on [the configuration template](https://github.com/gorse-io/gorse/blob/master/config/config.toml). *The "description" for each option links to the detailed usage of this option.*

## `[database]`

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `data_store` | string |     | Database for data storage. |
| `cache_store` | string |     | Database for cache storage. |
| `table_prefix` | string | | Naming prefix for tables in databases. |
| `cache_table_prefix` | string | `table_prefix` | Naming prefix for tables in cache storage databases. |
| `data_table_prefix` | string | `table_prefix` | Naming prefix for tables in data storage databases. |

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

## `[master]`

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

## `[server]`

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `default_n` | integer | `10` | Default number of returned items |
| `api_key` | string |     | [Secret key for RESTful APIs (SSL required)](./api/restful-api.html#authorization) |
| `clock_error` | integer | `5s` | [Clock error in the cluster](./concepts/how-it-works#server-online-recommendation)  |
| `auto_insert_user` | boolean | `true` | [Automatically insert new users when inserting new feedback](./concepts/how-it-works#server-online-recommendation) |
| `auto_insert_item` | boolean | `true` | [Automatically insert new items when inserting new feedback](./concepts/how-it-works#server-online-recommendation) |
| `cache_expire` | string | `10s` | [Server-side cache expire time](./concepts/how-it-works#server-online-recommendation)  |

## `[recommend]`

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

### `[[recommend.non-personalized]]`

Configuration for [non-personalized recommenders](concepts/non-personalized).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | string | | The name of non-personalized recommender |
| `score` | string | | The score function in the [Expr](https://expr-lang.org/) language |
| `filter ` | string | | The filter function in the [Expr](https://expr-lang.org/) language |

### `[[recommend.user-to-user]]`

Configuration for [user-to-user recommenders](concepts/user-to-user).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | string | | The name of user-to-user recommender |
| `neighbor_type` | string | `"auto"` | [The type of neighbors for users](./concepts/algorithms#item-similarity) |
| `enable_index` | boolean | `false` | [Enable approximate item neighbor searching using clustering index](./concepts/algorithms#clustering-index) |
| `index_recall` | float | `0.8` | [Minimal recall for approximate item neighbor searching](./concepts/algorithms#clustering-index) |
| `index_fit_epoch` | integer | `3` | [Maximal number of fit epochs for approximate item neighbor searching clustering index](./concepts/algorithms#clustering-index) |

### `[[recommend.item-to-item]]`

Configuration for [item-to-item recommenders](concepts/item-to-item).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | string | | The name of [item-to-item recommender](concepts/item-to-item.md) |
| `type` | string | | The similarity type of neighbors. |
| `column` | string | | The field used to calculate the similarity. |

### `[[recommend.external]]`

Configuration for [external recommenders](concepts/recommenders/external).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | string | | The name of [external recommender](concepts/external.md) |
| `script` | string | | The script to fetch external recommended items |

### `[recommend.collaborative]`

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `model_fit_period` | integer | `60m` | [Period of model training](./concepts/how-it-works#master-neighbors-and-models) |
| `model_search_period` | integer | `360m` | [Period of model search](./concepts/how-it-works#master-neighbors-and-models) |
| `model_search_epoch` | integer | `100` | [Number of training epochs for each model in model search](./concepts/how-it-works#master-neighbors-and-models) |
| `model_search_trials` | integer | `10` | [Number of trials for each model in model search](./concepts/how-it-works#master-neighbors-and-models) |
| `enable_model_size_search` | boolean | `false` | [Enable searching models of different sizes, which consume more memory](./concepts/how-it-works#master-neighbors-and-models) |
| `enable_index` | boolean | `false` | [Enable approximate collaborative filtering recommend using HNSW index](./concepts/algorithms#matrix-factorization) |
| `index_recall` | float | `0.9` | [Minimal recall for approximate collaborative filtering recommend](./concepts/algorithms#matrix-factorization) |
| `index_fit_epoch` | integer | `3` | [Maximal number of fit epochs for approximate collaborative filtering recommend HNSW index](./concepts/algorithms#matrix-factorization) |

### `[recommend.replacement]`

Replacement configuration for replacing read items back to recommendations.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `enable_replacement` | boolean | `false` | Replace read items back to recommendations |
| `positive_replacement_decay` | float | `0.8` | Decay the weights of replaced items from positive feedback |
| `read_replacement_decay` | float | `0.6` | Decay the weights of replaced items from read feedback |

### `[recommend.ranker]`

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `check_recommend_period` | integer | `1m` | [Period to check recommendation for users](./concepts/how-it-works#worker-offline-recommendation) |
| `refresh_recommend_period` | integer | `24h` | [Period to refresh offline recommendation cache](./concepts/how-it-works#worker-offline-recommendation) |
| `enable_latest_recommend` | boolean | `false` | [Enable latest recommendation during offline recommendation](./concepts/how-it-works.html#worker-offline-recommendation) |
| `enable_popular_recommend` | boolean | `false` | [Enable popular recommendation during offline recommendation](./concepts/how-it-works.html#worker-offline-recommendation) |
| `enable_user_based_recommend` | boolean | `false` | [Enable user-based similarity recommendation during offline recommendation](./concepts/how-it-works.html#worker-offline-recommendation) |
| `enable_item_based_recommend` | boolean | `false` | [Enable item-based similarity recommendation during offline recommendation](./concepts/how-it-works.html#worker-offline-recommendation) |
| `enable_collaborative_recommend` | boolean | `true` | [Enable collaborative filtering recommendation during offline recommendation](./concepts/how-it-works.html#worker-offline-recommendation) |
| `enable_click_through_prediction` | boolean | `false` | [Enable click-though rate prediction during offline recommendation. Otherwise, results from multi-way recommendation would be merged randomly](./concepts/how-it-works.html#worker-offline-recommendation) |
| `explore_recommend` | map | `{ popular = 0.0, latest = 0.0 }` | [The explore recommendation method is used to inject popular items or latest items into recommended result](./concepts/how-it-works.html#worker-offline-recommendation) |

### `[recommend.fallback]`

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `recommenders` | strings | `["latest"]` | [Source of recommendation when personalized recommendation exhausted](./concepts/how-it-works.html#server-online-recommendation) |

## `[oidc]`

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `enable` | boolean | `false` | Enable OpenID Connect (OIDC) authentication. |
| `issuer` | string | | The issuer of the OAuth provider. |
| `client_id` | string | | Public identifier of the OAuth application. |
| `client_secret` | string | | Token access to the OAuth application. |
| `redirect_url` | string | | URL used to redirect after authenticated. |

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
