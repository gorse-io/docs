---
icon: config_s
---
# Configuration

These configuration items without default values must be filled. It's highly recommended to create a new config file based on [the configuration template](https://github.com/gorse-io/gorse/blob/master/config/config.toml). *The "description" for each option links to the detailed usage of this option.*

## `[database]`

| Key                  | Type   | Default        | Description                                          |
|----------------------|--------|----------------|------------------------------------------------------|
| `data_store`         | string |                | Database for data storage.                           |
| `cache_store`        | string |                | Database for cache storage.                          |
| `table_prefix`       | string |                | Naming prefix for tables in databases.               |
| `cache_table_prefix` | string | `table_prefix` | Naming prefix for tables in cache storage databases. |
| `data_table_prefix`  | string | `table_prefix` | Naming prefix for tables in data storage databases.  |

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

`[database.mysql]`

| Key               | Type   | Default              | Description                  |
|-------------------|--------|----------------------|------------------------------|
| `isolation_level` | string | `"READ-UNCOMMITTED"` | Transaction isolation level. |

## `[master]`

| Key                   | Type    | Default     | Description                                                         |
|-----------------------|---------|-------------|---------------------------------------------------------------------|
| `host`                | string  | `"0.0.0.0"` | Master node listening host for gRPC service (metadata exchange)     |
| `port`                | integer | `8086`      | Master node listening port for gRPC service (metadata exchange)     |
| `ssl_mode`            | boolean | `false`     | Enable SSL for the gRPC communication.                              |
| `ssl_ca`              | string  |             | SSL certification authority for the gRPC communication.             |
| `ssl_cert`            | string  |             | SSL certification for the gRPC communication.                       |
| `ssl_key`             | string  |             | SSL certification key for the gRPC communication.                   |
| `http_host`           | string  | `"0.0.0.0"` | Master node listening host for HTTP service (dashboard and metrics) |
| `http_port`           | integer | `8088`      | Master node listening port for HTTP service (dashboard and metrics) |
| `http_cors_domains`   | strings | `[]`        | AllowedDomains is a list of allowed values for Http Origin.         |
| `http_cors_methods`   | strings | `[]`        | AllowedMethods is either empty or has a list of http methods names. |
| `n_jobs`              | integer | `1`         | Number of working threads for the master node                       |
| `meta_timeout`        | integer | `10s`       | Metadata timeout                                                    |
| `dashboard_user_name` | string  |             | Dashboard login username                                            |
| `dashboard_password`  | string  |             | Dashboard login password                                            |
| `admin_api_key`       | string  |             | Secret key for admin APIs (SSL required).                           |

## `[server]`

| Key                | Type    | Default | Description                                                |
|--------------------|---------|---------|------------------------------------------------------------|
| `default_n`        | integer | `10`    | Default number of returned items                           |
| `api_key`          | string  |         | Secret key for RESTful APIs (SSL required)                 |
| `clock_error`      | integer | `5s`    | Clock error in the cluster                                 |
| `auto_insert_user` | boolean | `true`  | Automatically insert new users when inserting new feedback |
| `auto_insert_item` | boolean | `true`  | Automatically insert new items when inserting new feedback |
| `cache_expire`     | string  | `10s`   | Server-side cache expire time                              |

## `[recommend]`

Global recommendation configuration.

| Key               | Type    | Default | Description                                                |
|-------------------|---------|---------|------------------------------------------------------------|
| `cache_size`      | string  | `100`   | Number of cached elements in cache store                   |
| `cache_expire`    | string  | `72h`   | Recommended cache expire time                              |
| `context_size`    | integer | `100`   | The context size for online recommendations.               |
| `active_user_ttl` | integer | `0`     | The time-to-live (days) of active users, 0 means disabled. |

### `[recommend.data_source]`

Configuration for [data source](./concepts/data-source) of recommenders.

| Key                       | Type   | Default | Description                       |
|---------------------------|--------|---------|-----------------------------------|
| `positive_feedback_types` | string |         | Types of positive feedback        |
| `read_feedback_types`     | string |         | Type of read feedback             |
| `positive_feedback_ttl`   | string | `0`     | Time-to-live of positive feedback |
| `item_ttl`                | string | `0`     | Time-to-live of items             |

### `[[recommend.non-personalized]]`

Configuration for [non-personalized recommenders](concepts/non-personalized).

| Key       | Type   | Default | Description                              |
|-----------|--------|---------|------------------------------------------|
| `name`    | string |         | The name of non-personalized recommender |
| `score`   | string |         | The score function in the Expr language  |
| `filter ` | string |         | The filter function in the Expr language |

### `[[recommend.item-to-item]]`

Configuration for [item-to-item recommenders](concepts/item-to-item).

| Key      | Type   | Default | Description                                 |
|----------|--------|---------|---------------------------------------------|
| `name`   | string |         | The name of item-to-item recommender        |
| `type`   | string |         | The similarity type of neighbors.           |
| `column` | string |         | The field used to calculate the similarity. |

### `[[recommend.user-to-user]]`

Configuration for [user-to-user recommenders](concepts/user-to-user).

| Key    | Type   | Default | Description                          |
|--------|--------|---------|--------------------------------------|
| `name` | string |         | The name of user-to-user recommender |
| `type` | string |         | The similarity type of neighbors.    |

### `[[recommend.external]]`

Configuration for [external recommenders](concepts/recommenders/external).

| Key      | Type   | Default | Description                                    |
|----------|--------|---------|------------------------------------------------|
| `name`   | string |         | The name of external recommender               |
| `script` | string |         | The script to fetch external recommended items |

### `[recommend.collaborative]`

Configuration for the [collaborative filtering recommender](concepts/collaborative).

| Key               | Type    | Default | Description                                              |
|-------------------|---------|---------|----------------------------------------------------------|
| `fit_period`      | string  | `60m`   | Period of model training                                 |
| `fit_epoch`       | integer | `100`   | Number of training epochs for each model in model search |
| `optimize_period` | string  | `360m`  | Period of model search                                   |
| `optimize_trials` | integer | `10`    | Number of trials for each model in model search          |

`[recommend.collaborative.early_stopping]`

| Key        | Type    | Default | Description                                                            |
|------------|---------|---------|------------------------------------------------------------------------|
| `patience` | integer | `10`    | Number of epochs to wait if no improvement and then stop the training. |

### `[recommend.replacement]`

[Replacement](./concepts/replacement) configuration for replacing read items back to recommendations.

| Key                          | Type    | Default | Description                                                |
|------------------------------|---------|---------|------------------------------------------------------------|
| `enable_replacement`         | boolean | `false` | Replace read items back to recommendations                 |
| `positive_replacement_decay` | float   | `0.8`   | Decay the weights of replaced items from positive feedback |
| `read_replacement_decay`     | float   | `0.6`   | Decay the weights of replaced items from read feedback     |

### `[recommend.ranker]`

Configuration for [rankers](concepts/rankers).

| Key               | Type    | Default      | Description                                                    |
|-------------------|---------|--------------|----------------------------------------------------------------|
| `type`            | string  | `"fm"`       | The type of the ranker.                                        |
| `cache_expire`    | string  | `"120h"`     | The time period to refresh recommendation for inactive users.  |
| `recommenders`    | strings | `["latest"]` | The recommenders used to fetch candidate items before ranking. |
| `fit_period`      | string  | `"60m"`      | The time period for model fitting.                             |
| `fit_epoch`       | integer | `100`        | The number of epochs for model fitting.                        |
| `optimize_period` | string  | `"360m"`     | The time period for hyperparameter optimization.               |
| `optimize_trials` | integer | `10`         | The number of trials for hyperparameter optimization.          |

`[recommend.ranker.early_stopping]`

| Key        | Type    | Default | Description                                                            |
|------------|---------|---------|------------------------------------------------------------------------|
| `patience` | integer | `10`    | Number of epochs to wait if no improvement and then stop the training. |

### `[recommend.fallback]`

Fallback recommendation configuration when ranker cannot provide enough recommendations.

| Key            | Type    | Default      | Description                                                         |
|----------------|---------|--------------|---------------------------------------------------------------------|
| `recommenders` | strings | `["latest"]` | Source of recommendation when personalized recommendation exhausted |

## `[tracing]`

OpenTelemetry tracing configuration.

| Key                  | Type    | Default                               | Description                        |
|----------------------|---------|---------------------------------------|------------------------------------|
| `enable_tracing`     | boolean | `false`                               | Enable tracing for REST APIs.      |
| `exporter`           | string  | `"jaeger"`                            | The type of tracing exporters.     |
| `collector_endpoint` | string  | `"http://localhost:14268/api/traces"` | The endpoint of tracing collector. |
| `sampler`            | string  | `"always"`                            | The type of tracing sampler.       |
| `ratio`              | float   | `1`                                   | The ratio of ratio based sampler.  |

## `[oidc]`

Configure OpenID Connect (OIDC) authentication for [dashboard](./gorse-dashboard).

| Key             | Type    | Default | Description                                  |
|-----------------|---------|---------|----------------------------------------------|
| `enable`        | boolean | `false` | Enable OpenID Connect (OIDC) authentication. |
| `issuer`        | string  |         | The issuer of the OAuth provider.            |
| `client_id`     | string  |         | Public identifier of the OAuth application.  |
| `client_secret` | string  |         | Token access to the OAuth application.       |
| `redirect_url`  | string  |         | URL used to redirect after authenticated.    |

## `[openai]`

Configuration for OpenAI API, used by LLM ranker.

| Key                     | Type    | Default | Description                                      |
|-------------------------|---------|---------|--------------------------------------------------|
| `base_url`              | string  |         | Base URL of OpenAI API.                          |
| `auth_token`            | string  |         | API key of OpenAI API.                           |
| `chat_completion_model` | string  |         | Name of chat completion model.                   |
| `chat_completion_rpm`   | integer |         | Maximum requests per minute for chat completion. |
| `chat_completion_tpm`   | integer |         | Maximum tokens per minute for chat completion.   |

## Environment Variables

Part of configurations can be overwritten by environment variables.

| Configuration                  | Environment Variable          |
|--------------------------------|-------------------------------|
| `database.cache_store`         | `GORSE_CACHE_STORE`           |
| `database.data_store`          | `GORSE_DATA_STORE`            |
| `database.table_prefix`        | `GORSE_TABLE_PREFIX`          |
| `database.cache_table_prefix`  | `GORSE_CACHE_TABLE_PREFIX`    |
| `database.data_table_prefix`   | `GORSE_DATA_TABLE_PREFIX`     |
| `master.port`                  | `GORSE_MASTER_PORT`           |
| `master.host`                  | `GORSE_MASTER_HOST`           |
| `master.ssl_mode`              | `GORSE_MASTER_SSL_MODE`       |
| `master.ssl_ca`                | `GORSE_MASTER_SSL_CA`         |
| `master.ssl_cert`              | `GORSE_MASTER_SSL_CERT`       |
| `master.ssl_key`               | `GORSE_MASTER_SSL_KEY`        |
| `master.http_port`             | `GORSE_MASTER_HTTP_PORT`      |
| `master.http_host`             | `GORSE_MASTER_HTTP_HOST`      |
| `master.n_jobs`                | `GORSE_MASTER_JOBS`           |
| `master.dashboard_user_name`   | `GORSE_DASHBOARD_USER_NAME`   |
| `master.dashboard_password`    | `GORSE_DASHBOARD_PASSWORD`    |
| `master.dashboard_auth_server` | `GORSE_DASHBOARD_AUTH_SERVER` |
| `master.dashboard_redacted`    | `GORSE_DASHBOARD_REDACTED`    |
| `master.admin_api_key`         | `GORSE_ADMIN_API_KEY`         |
| `server.api_key`               | `GORSE_SERVER_API_KEY`        |
| `oidc.enable`                  | `GORSE_OIDC_ENABLE`           |
| `oidc.issuer`                  | `GORSE_OIDC_ISSUER`           |
| `oidc.client_id`               | `GORSE_OIDC_CLIENT_ID`        |
| `oidc.client_secret`           | `GORSE_OIDC_CLIENT_SECRET`    |
| `oidc.redirect_url`            | `GORSE_OIDC_REDIRECT_URL`     |
