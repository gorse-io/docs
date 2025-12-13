---
icon: config_s
---

# 配置项

这些没有默认值的配置项必须填写。强烈建议根据[配置模板](https://github.com/gorse-io/gorse/blob/release-0.4/config/config.toml)创建一个新的配置文件。*点击每个配置项的“描述”查看该配置项的详细用法。*

## `[database]`

| 配置项               | 类型   | 默认值         | 描述                                   |
|----------------------|--------|----------------|----------------------------------------|
| `data_store`         | string |                | 用于数据存储的数据库。                  |
| `cache_store`        | string |                | 用于缓存存储的数据库。                  |
| `table_prefix`       | string |                | 数据库中表（集合、键）的命名前缀。         |
| `cache_table_prefix` | string | `table_prefix` | 缓存存储数据库中表（集合、键）的命名前缀。 |
| `data_table_prefix`  | string | `table_prefix` | 数据存储数据库中表（集合、键）的命名前缀。 |

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

### `[database.mysql]`

| 配置项            | 类型   | 默认值               | 描述          |
|-------------------|--------|----------------------|---------------|
| `isolation_level` | string | `"READ-UNCOMMITTED"` | 事务隔离级别。 |

## `[master]`

| 配置项                | 类型    | 默认值      | 描述                                           |
|-----------------------|---------|-------------|------------------------------------------------|
| `host`                | string  | `"0.0.0.0"` | 主节点 gRPC 服务监听IP（用于元数据交换）         |
| `port`                | integer | `8086`      | 主节点 gRPC 监听端口（用于元数据交换）           |
| `ssl_mode`            | boolean | `false`     | 启用 gRPC 通信的 SSL。                          |
| `ssl_ca`              | string  |             | gRPC 通信的 SSL 证书颁发机构。                  |
| `ssl_cert`            | string  |             | gRPC 通信的 SSL 证书。                          |
| `ssl_key`             | string  |             | gRPC 通信的 SSL 密钥。                          |
| `http_host`           | string  | `"0.0.0.0"` | 主节点 HTTP 服务监听IP（用于控制台和指标监控）   |
| `http_port`           | integer | `8088`      | 主节点 HTTP 服务监听端口（用于控制台和指标监控） |
| `http_cors_domains`   | strings | `[]`        | 允许的 Http Origin 列表。                       |
| `http_cors_methods`   | strings | `[]`        | 允许的 Http 方法列表。                          |
| `n_jobs`              | integer | `1`         | 主节点的工作线程数                             |
| `meta_timeout`        | integer | `10s`       | 元数据超时时间                                 |
| `dashboard_user_name` | string  |             | 控制台登录用户名                               |
| `dashboard_password`  | string  |             | 控制台登录密码                                 |
| `admin_api_key`       | string  |             | 管理 API 的密钥（需要 SSL）。                     |

## `[server]`

| 配置项             | 类型    | 默认值 | 描述                         |
|--------------------|---------|--------|------------------------------|
| `default_n`        | integer | `10`   | 默认返回条目数量。            |
| `api_key`          | string  |        | RESTful API 的密钥（需要 SSL） |
| `clock_error`      | integer | `5s`   | 集群中的时钟误差             |
| `auto_insert_user` | boolean | `true` | 插入新反馈时自动插入新用户   |
| `auto_insert_item` | boolean | `true` | 插入新反馈时自动插入新物品   |
| `cache_expire`     | string  | `10s`  | 服务节点本地缓存过期时间     |

## `[recommend]`

| 配置项            | 类型    | 默认值 | 描述                               |
|-------------------|---------|--------|------------------------------------|
| `cache_size`      | string  | `100`  | 推荐缓存大小                       |
| `cache_expire`    | string  | `72h`  | 推荐缓存过期时间                   |
| `context_size`    | integer | `100`  | 在线推荐的上下文大小。              |
| `active_user_ttl` | integer | `0`    | 活跃用户的生存时间（天），0 表示禁用。 |

### `recommend.data_source`

| 配置项                    | 类型   | 默认值 | 描述             |
|---------------------------|--------|--------|------------------|
| `positive_feedback_types` | string |        | 正向反馈的类型   |
| `read_feedback_types`     | string |        | 已读反馈的类型   |
| `positive_feedback_ttl`   | string | `0`    | 正反馈的有效时间 |
| `item_ttl`                | string | `0`    | 物品的有效时间   |

### `[[recommend.non-personalized]]`

[非个性化推荐器](concepts/non-personalized)的配置。

| 配置项    | 类型   | 默认值 | 描述                   |
|-----------|--------|--------|------------------------|
| `name`    | string |        | 非个性化推荐器的名称。  |
| `score`   | string |        | Expr 语言中的评分函数。 |
| `filter ` | string |        | Expr 语言中的过滤函数。 |

### `[[recommend.item-to-item]]`

[物品到物品推荐器](concepts/item-to-item)的配置。

| 配置项   | 类型   | 默认值 | 描述                    |
|----------|--------|--------|-------------------------|
| `name`   | string |        | 物品到物品推荐器的名称。 |
| `type`   | string |        | 邻居的相似度类型。       |
| `column` | string |        | 用于计算相似度的字段。   |

### `[[recommend.user-to-user]]`

[用户到用户推荐器](concepts/user-to-user)的配置。

| 配置项 | 类型   | 默认值 | 描述                    |
|--------|--------|--------|-------------------------|
| `name` | string |        | 用户到用户推荐器的名称。 |
| `type` | string |        | 邻居的相似度类型。       |

### `[[recommend.external]]`

[外部推荐器](concepts/recommenders/external)的配置。

| 配置项   | 类型   | 默认值 | 描述                    |
|----------|--------|--------|-------------------------|
| `name`   | string |        | 外部推荐器的名称。       |
| `script` | string |        | 获取外部推荐物品的脚本。 |

### `[recommend.collaborative]`

| 配置项            | 类型    | 默认值 | 描述                           |
|-------------------|---------|--------|--------------------------------|
| `fit_period`      | string  | `60m`  | 模型训练周期                   |
| `fit_epoch`       | integer | `100`  | 模型搜索中每个模型的训练迭代数 |
| `optimize_period` | string  | `360m` | 模型搜索周期                   |
| `optimize_trials` | integer | `10`   | 模型搜索中试验模型数           |

### `[recommend.collaborative.early_stopping]`

| 配置项     | 类型    | 默认值 | 描述                             |
|------------|---------|--------|----------------------------------|
| `patience` | integer | `10`   | 如果没有改进，等待停止训练的轮数。 |

### `[recommend.replacement]`

将已读物品放回推荐结果的配置。

| 配置项                       | 类型    | 默认值  | 描述                      |
|------------------------------|---------|---------|---------------------------|
| `enable_replacement`         | boolean | `false` | 将已读物品放回推荐结果。   |
| `positive_replacement_decay` | float   | `0.8`   | 正向反馈物品放回衰减权重。 |
| `read_replacement_decay`     | float   | `0.6`   | 已读反馈物品放回衰减权重。 |

### `[recommend.ranker]`

| 配置项            | 类型    | 默认值                                                                                                                    | 描述                            |
|-------------------|---------|---------------------------------------------------------------------------------------------------------------------------|---------------------------------|
| `type`            | string  | `"fm"`                                                                                                                    | 排序器的类型。                   |
| `cache_expire`    | string  | `"120h"`                                                                                                                  | 刷新非活跃用户推荐的时间周期。   |
| `recommenders`    | strings | `["latest", "collaborative", "non-personalized/most_starred_weekly", "item-to-item/neighbors", "user-to-user/neighbors"]` | 排序前用于获取候选物品的推荐器。 |
| `fit_period`      | string  | `"60m"`                                                                                                                   | 模型训练周期。                   |
| `fit_epoch`       | integer | `100`                                                                                                                     | 模型训练的迭代数。               |
| `optimize_period` | string  | `"360m"`                                                                                                                  | 超参数优化的时间周期。           |
| `optimize_trials` | integer | `10`                                                                                                                      | 超参数优化的试验次数。           |

### `[recommend.ranker.early_stopping]`

| 配置项     | 类型    | 默认值 | 描述                             |
|------------|---------|--------|----------------------------------|
| `patience` | integer | `10`   | 如果没有改进，等待停止训练的轮数。 |

### `[recommend.fallback]`

| 配置项         | 类型    | 默认值       | 描述                           |
|----------------|---------|--------------|--------------------------------|
| `recommenders` | strings | `["latest"]` | 离线推荐耗尽时的兜底的推荐算法 |

## `[tracing]`

| 配置项               | 类型    | 默认值                                | 描述                    |
|----------------------|---------|---------------------------------------|-------------------------|
| `enable_tracing`     | boolean | `false`                               | 启用 REST API 的追踪。   |
| `exporter`           | string  | `"jaeger"`                            | 追踪导出器的类型。       |
| `collector_endpoint` | string  | `"http://localhost:14268/api/traces"` | 追踪收集器的端点。       |
| `sampler`            | string  | `"always"`                            | 追踪采样器的类型。       |
| `ratio`              | float   | `1`                                   | 基于比率的采样器的比率。 |

## `[oidc]`

| 配置项          | 类型    | 默认值  | 描述                             |
|-----------------|---------|---------|----------------------------------|
| `enable`        | boolean | `false` | 启用 OpenID Connect (OIDC) 认证。 |
| `issuer`        | string  |         | OAuth 提供商的发行者。            |
| `client_id`     | string  |         | OAuth 应用程序的公共标识符。      |
| `client_secret` | string  |         | OAuth 应用程序的令牌访问。        |
| `redirect_url`  | string  |         | 认证后重定向的 URL。              |

## 环境变量

部分配置可以被环境变量覆盖。

| 配置项                         | 环境变量                      |
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
