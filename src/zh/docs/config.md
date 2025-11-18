---
icon: config_s
---

# 配置项

这些没有默认值的配置项必须填写。强烈建议根据[配置模板](https://github.com/gorse-io/gorse/blob/release-0.4/config/config.toml)创建一个新的配置文件。*点击每个配置项的“描述”查看该配置项的详细用法。*

## `database`

配置项 | 类型 | 默认值 | 描述
--- | --- | --- | ---
`data_store` | 字符串 |  | 用于数据存储的数据库，支持MySQL、PostgreSQL、ClickHouse和MongoDB。
`cache_store` | 字符串 |  | 用于缓存存储的数据库，支持MySQL、PostgreSQL、MongoDB和Redis。
`table_prefix` | 字符串 |  | 数据库中表（集合、键）的命名前缀。
`cache_table_prefix` | 字符串 |  | 缓存存储数据库中表（集合、键）的命名前缀。如果为空，则使用`table_prefix` 。
`data_table_prefix` | 字符串 |  | 数据存储数据库中表（集合、键）的命名前缀。如果为空，则使用`table_prefix` 。

`data_store`和`cache_store`的DSN（Database Source Name）格式如下。

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

文档：https://pkg.go.dev/github.com/go-redis/redis/v8#ParseURL

@tab MySQL

```
mysql://[username[:password]@][protocol[(hostname:port)]]/database[?config1=value1&...configN=valueN]
```

文档：https://github.com/go-sql-driver/mysql#dsn-data-source-name

@tab Postgres

```bash
# Option 1
postgres://bob:secret@1.2.3.4:5432/mydb?sslmode=verify-full

# Option 2
postgresql://bob:secret@1.2.3.4:5432/mydb?sslmode=verify-full
```

文档：https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING

@tab MongoDB

```bash
# Standard Connection
mongodb://[username:password@]hostname1[:port1][,... hostnameN[:portN]]][/[database][?options]]

# DNS Seed List Connection
mongodb+srv://server.example.com/
```

文档：https://www.mongodb.com/docs/manual/reference/connection-string/

@tab ClickHouse

```bash
# HTTP Connection (Option 1)
clickhouse://user:password@host[:port]/database?param1=value1&...&paramN=valueN

# HTTP Connection (Option 2)
chhttp://user:password@host[:port]/database?param1=value1&...&paramN=valueN

# HTTPS Connection
chhttps://user:password@host[:port]/database?param1=value1&...&paramN=valueN
```

文档：https://github.com/mailru/go-clickhouse#dsn

:::

## `master`

配置项 | 类型 | 默认值 | 描述
--- | --- | --- | ---
`host` | 字符串 | `"0.0.0.0"` | [主节点 gRPC 服务监听IP（用于元数据交换）](./concepts/how-it-works#architecture)
`port` | 整型 | `8086` | [主节点 gRPC 监听端口（用于元数据交换）](./concepts/how-it-works#architecture)
`http_host` | 字符串 | `"0.0.0.0"` | [主节点 HTTP 服务监听IP（用于控制台和指标监控）](./gorse-dashboard#login)
`http_port` | 整型 | `8088` | [主节点 HTTP 服务监听端口（用于控制台和指标监控）](./gorse-dashboard#login)
`n_jobs` | 整型 | `1` | [主节点的工作线程数](./concepts/how-it-works#architecture)
`meta_timeout` | 整型 | `10s` | [元数据超时时间](./concepts/how-it-works#architecture)
`dashboard_user_name` | 字符串 |  | [控制台登录用户名](./gorse-dashboard#login)
`dashboard_password` | 字符串 |  | [控制台登录密码](./gorse-dashboard#login)

## `server`

配置项 | 类型 | 默认值 | 描述
--- | --- | --- | ---
`default_n` | 整型 | `10` | 默认返回条目数量
`api_key` | 字符串 |  | [RESTful API 的密钥（需要 SSL）](./api/restful-api.html#authorization)
`clock_error` | 整型 | `5s` | [集群中的时钟误差](./concepts/how-it-works#server-online-recommendation)
`auto_insert_user` | 布尔值 | `true` | [插入新反馈时自动插入新用户](./concepts/how-it-works#server-online-recommendation)
`auto_insert_item` | 布尔值 | `true` | [插入新反馈时自动插入新物品](./concepts/how-it-works#server-online-recommendation)
`cache_expire` | 字符串 | `10s` | [服务节点本地缓存过期时间](./concepts/how-it-works#server-online-recommendation)

## `recommend`

配置项 | 类型 | 默认值 | 描述
--- | --- | --- | ---
`cache_size` | 字符串 | `100` | [推荐缓存大小](./concepts/how-it-works#recommendation-flow)
`cache_expire` | 字符串 | `72h` | [推荐缓存过期时间](./concepts/how-it-works#recommendation-flow)

### `recommend.data_source`

配置项 | 类型 | 默认值 | 描述
--- | --- | --- | ---
`positive_feedback_types` | 字符串 |  | [正向反馈的类型](./concepts/data-objects#positive-feedback-and-read-feedback)
`read_feedback_types` | 字符串 |  | [已读反馈的类型](./concepts/data-objects#positive-feedback-and-read-feedback)
`positive_feedback_ttl` | 字符串 | `0` | [正反馈的有效时间](./concepts/data-objects#time-to-live-1)
`item_ttl` | 字符串 | `0` | [物品的有效时间](./concepts/data-objects#time-to-live)

### `recommend.popular`

配置项 | 类型 | 默认值 | 描述
--- | --- | --- | ---
`popular_window` | 整型 | `4320h` | [以天为单位的热门物品的时间窗口](./concepts/algorithms#popular-items)

### `recommend.user_neighbors`

配置项 | 类型 | 默认值 | 描述
--- | --- | --- | ---
`neighbor_type` | 字符串 | `"auto"` | [相似用户算法](./concepts/algorithms#item-similarity)
`enable_index` | 布尔值 | `false` | [使用聚类索引搜索相似用户](./concepts/algorithms#clustering-index)
`index_recall` | 浮点 | `0.8` | [聚类索引的最小召回率](./concepts/algorithms#clustering-index)
`index_fit_epoch` | 整型 | `3` | [聚类索引的最大拟合次数](./concepts/algorithms#clustering-index)

### `recommend.item_neighbors`

配置项 | 类型 | 默认值 | 描述
--- | --- | --- | ---
`neighbor_type` | 字符串 | `"auto"` | [相似物品算法](./concepts/algorithms#user-similarity)
`enable_index` | 布尔值 | `false` | [使用聚类索引搜索相似物品](./concepts/algorithms#clustering-index)
`index_recall` | 浮点 | `0.8` | [聚类索引的最小召回率](./concepts/algorithms#clustering-index)
`index_fit_epoch` | 整型 | `3` | [聚类索引的最大拟合次数](./concepts/algorithms#clustering-index)

### `recommend.collaborative`

配置项 | 类型 | 默认值 | 描述
--- | --- | --- | ---
`model_fit_period` | 整型 | `60m` | [模型训练周期](./concepts/how-it-works#master-neighbors-and-models)
`model_search_period` | 整型 | `360m` | [模型搜索周期](./concepts/how-it-works#master-neighbors-and-models)
`model_search_epoch` | 整型 | `100` | [模型搜索中每个模型的训练迭代数](./concepts/how-it-works#master-neighbors-and-models)
`model_search_trials` | 整型 | `10` | [模型搜索中试验模型数](./concepts/how-it-works#master-neighbors-and-models)
`enable_model_size_search` | 布尔值 | `false` | [启用搜索不同大小的模型，这会占用更多内存](./concepts/how-it-works#master-neighbors-and-models)
`enable_index` | 布尔值 | `false` | [使用 HNSW 索引加速协同过滤推荐](./concepts/algorithms#matrix-factorization)
`index_recall` | 浮点 | `0.9` | [HNSW最小召回率](./concepts/algorithms#matrix-factorization)
`index_fit_epoch` | 整型 | `3` | [HNSW最大拟合次数](./concepts/algorithms#matrix-factorization)

### `recommend.replacement`

配置项 | 类型 | 默认值 | 描述
--- | --- | --- | ---
`enable_replacement` | 布尔值 | `false` | [将历史物品放回推荐池](./concepts/how-it-works#replacement)
`positive_replacement_decay` | 浮点 | `0.8` | [正向反馈物品放回衰减权重](./concepts/how-it-works#replacement)
`read_replacement_decay` | 浮点 | `0.6` | [已读反馈物品放回衰减权重](./concepts/how-it-works#replacement)

### `recommend.offline`

配置项 | 类型 | 默认值 | 描述
--- | --- | --- | ---
`check_recommend_period` | 整型 | `1m` | [触发离线推荐的周期](./concepts/how-it-works#worker-offline-recommendation)
`refresh_recommend_period` | 整型 | `24h` | [强制刷新离线推荐的周期](./concepts/how-it-works#worker-offline-recommendation)
`enable_latest_recommend` | 布尔值 | `false` | [离线推荐时启用最新推荐](./concepts/how-it-works.html#worker-offline-recommendation)
`enable_popular_recommend` | 布尔值 | `false` | [离线推荐时开启热门推荐](./concepts/how-it-works.html#worker-offline-recommendation)
`enable_user_based_recommend` | 布尔值 | `false` | [在离线推荐期间启用基于相似用户的推荐](./concepts/how-it-works.html#worker-offline-recommendation)
`enable_item_based_recommend` | 布尔值 | `false` | [在离线推荐期间启用基于相似物品的推荐](./concepts/how-it-works.html#worker-offline-recommendation)
`enable_collaborative_recommend` | 布尔值 | `true` | [离线推荐时启用协同过滤推荐](./concepts/how-it-works.html#worker-offline-recommendation)
`enable_click_through_prediction` | 布尔值 | `false` | [在离线推荐期间启用点击率预测。否则，多路推荐的结果将被随机合并](./concepts/how-it-works.html#worker-offline-recommendation)
`explore_recommend` | 字段 | `{ popular = 0.0, latest = 0.0 }` | [在探索推荐阶段，将热门物品或最新物品注入推荐结果的比例](./concepts/how-it-works.html#worker-offline-recommendation)

### `recommend.online`

配置项 | 类型 | 默认值 | 描述
--- | --- | --- | ---
`fallback_recommend` | 字符串 | `["latest"]` | [离线推荐耗尽时的兜底的推荐算法](./concepts/how-it-works.html#server-online-recommendation)
`num_feedback_fallback_item_based` | 整型 | `10` | [在线相似物品推荐使用的用户正反馈数量](./concepts/how-it-works.html#server-online-recommendation)

## 环境变量

部分配置可以被环境变量覆盖。

配置项 | 环境变量
--- | ---
`database.cache_store` | `GORSE_CACHE_STORE`
`database.data_store` | `GORSE_DATA_STORE`
`database.table_prefix` | `GORSE_TABLE_PREFIX`
`database.cache_table_prefix` | `GORSE_CACHE_TABLE_PREFIX`
`database.data_table_prefix` | `GORSE_DATA_TABLE_PREFIX`
`master.port` | `GORSE_MASTER_PORT`
`master.host` | `GORSE_MASTER_HOST`
`master.http_port` | `GORSE_MASTER_HTTP_PORT`
`master.http_host` | `GORSE_MASTER_HTTP_HOST`
`master.n_jobs` | `GORSE_MASTER_JOBS`
`master.dashboard_user_name` | `GORSE_DASHBOARD_USER_NAME`
`master.dashboard_password` | `GORSE_DASHBOARD_PASSWORD`
`server.api_key` | `GORSE_SERVER_API_KEY`
