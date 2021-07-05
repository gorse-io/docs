# Configuration

Previous section *[Recommend using Gorse](ch01-02-recommend.md)* is helpful to understand configurations introduced in this section.

## `[database]`

Configuratios under `[database]` are used to define behaviors on database and data.

| Key | Type | Default | Description |
|-|-|-|-|
| `data_store` | string |  | Database for data store (supports MySQL/MongoDB) |
| `cache_store` | string |  | Database for cache store (supports Redis) |
| `auto_insert_user` | boolean | `true` | Automatically insert new users when inserting new feedback |
| `auto_insert_item` | boolean | `true` | Automatically insert new items when inserting new feedback |
| `ache_size` | string |  | |
| `positive_feedback_types` | string | `[]` | |
| `click_feedback_types` | string | `[]` | |
| `read_feedback_type` | string |  | |
| `positive_feedback_ttl` | string |  | |
| `item_ttl` | string |  | |

The DSN (Database Source Name) format of the `data_store` and `cache_store` is as follows.

- Redis: `redis://hostname:port`
- MySQL: `mysql://[username[:password]@][protocol[(hostname:port)]]/database[?config1=value1&...configN=valueN]`
- MongoDB: `mongodb://[username:password@]hostname1[:port1][,... hostnameN[:portN]]][/[database][?options]]`

## `[master]`

Configuratios under `[master]` are used to define behaviors of the master node.

| Key | Type | Default | Description |
|-|-|-|-|
| `host` | string | `127.0.0.1` | Master node listening host for gRPC service (metadata exchange) |
| `port` | integer | `8086` | Master node listening port for gRPC service (metadata exchange) |
| `http_host` | string | `127.0.0.1` | Master node listening host for HTTP service (dashboard) |
| `http_port` | integer | `8088` | Master node listening port for HTTP service (dashboard) |
| `fit_jobs` | integer | `1` | Number of working threads for model training |
| `search_jobs` | integer | `1` | Number of working threads for model search |
| `meta_timeout` | integer | `60` | Metadata timeout in seconds |

## `[server]`

Configuratios under `[server]` are used to define behaviors of the server node.

| Key | Type | Default | Description |
|-|-|-|-|
| `default_n` | integer | `10` | Default number of returned items |
| `api_key` | string |  | Secret key for RESTful APIs (SSL required) |

## `[recommend]`

| Key | Type | Default | Description |
|-|-|-|-|
| `popular_window` | integer | `180` | Time window of popular items in days |
| `fit_period` | integer | `60` | Period of model trainig in minutes |
| `search_period` | integer | `180` | Period of model search in minutes |
| `search_epoch` | integer | `100` | Number of training epoches for each model in model search |
| `search_trials` | integer | `10` | Number of trials for each model in model search |
| `refresh_recommend_period` | integer | `10` | |
| `fallback_recommend` | integer | `latest` | Source of recommendation when personalized recommendation exhausted |
| `explore_latest_num` | integer | `10` | |
