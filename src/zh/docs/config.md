---
icon: config_s
---
# 配置项

这些没有默认值的配置项必须填写。强烈建议基于[配置模板](https://github.com/gorse-io/gorse/blob/master/config/config.toml)创建一个新的配置文件。*每个选项的“描述”链接到该选项的详细用法。*

## `[database]`

| 键                    | 类型     | 默认值            | 描述              |
|----------------------|--------|----------------|-----------------|
| `data_store`         | string |                | 用于数据存储的数据库。     |
| `cache_store`        | string |                | 用于缓存存储的数据库。     |
| `table_prefix`       | string |                | 数据库中表的命名约定。     |
| `cache_table_prefix` | string | `table_prefix` | 缓存存储数据库中表的命名约定。 |
| `data_table_prefix`  | string | `table_prefix` | 数据存储数据库中表的命名约定。 |

`data_store` 和 `cache_store` 的 DSN（数据源名称）格式如下。

::: tabs

@tab Redis

```bash
# TCP 连接
redis://<user>:<password>@<host>:<port>/<db_number>

# TLS 连接
rediss://<user>:<password>@<host>:<port>/<db_number>

# 到 Redis 集群的 TCP 连接
redis+cluster://<user>:<password>@<host>:<port>/<db_number>
```

文档: https://pkg.go.dev/github.com/go-redis/redis/v8#ParseURL

@tab MySQL

```
mysql://[username[:password]@][protocol[(hostname:port)]]/database[?config1=value1&...configN=valueN]
```

文档: https://github.com/go-sql-driver/mysql#dsn-data-source-name

@tab Postgres

```bash
# 选项 1
postgres://bob:secret@1.2.3.4:5432/mydb?sslmode=verify-full

# 选项 2
postgresql://bob:secret@1.2.3.4:5432/mydb?sslmode=verify-full
```
文档: https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING

@tab MongoDB

```bash
# 标准连接
mongodb://[username:password@]hostname1[:port1][,... hostnameN[:portN]]][/[database][?options]]

# DNS 种子列表连接
mongodb+srv://server.example.com/
```

文档: https://www.mongodb.com/docs/manual/reference/connection-string/

@tab ClickHouse

```bash
# HTTP 连接 (选项 1)
clickhouse://user:password@host[:port]/database?param1=value1&...&paramN=valueN

# HTTP 连接 (选项 2)
chhttp://user:password@host[:port]/database?param1=value1&...&paramN=valueN

# HTTPS 连接
chhttps://user:password@host[:port]/database?param1=value1&...&paramN=valueN
```

文档: https://github.com/mailru/go-clickhouse#dsn

:::

`[database.mysql]`

| 键                   | 类型      | 默认值                  | 描述           |
|---------------------|---------|----------------------|--------------|
| `isolation_level`   | string  | `"READ-UNCOMMITTED"` | 事务隔离级别。      |
| `max_open_conns`    | integer |                      | 数据库的最大打开连接数。 |
| `max_idle_conns`    | integer |                      | 数据库的最大空闲连接数。 |
| `conn_max_lifetime` | string  |                      | 连接可重用的最长时间。  |

`[database.postgres]`

| 键                   | 类型      | 默认值    | 描述           |
|---------------------|---------|--------|--------------|
| `max_open_conns`    | integer | `64`   | 数据库的最大打开连接数。 |
| `max_idle_conns`    | integer | `64`   | 数据库的最大空闲连接数。 |
| `conn_max_lifetime` | string  | `"1m"` | 连接可重用的最长时间。  |

## `[master]`

| 键                     | 类型      | 默认值         | 描述                                   |
|-----------------------|---------|-------------|--------------------------------------|
| `host`                | string  | `"0.0.0.0"` | 主节点监听 gRPC 服务的主机（元数据交换）              |
| `port`                | integer | `8086`      | 主节点监听 gRPC 服务的端口（元数据交换）              |
| `ssl_mode`            | boolean | `false`     | 为 gRPC 通信启用 SSL。                     |
| `ssl_ca`              | string  |             | gRPC 通信的 SSL 证书颁发机构。                 |
| `ssl_cert`            | string  |             | gRPC 通信的 SSL 证书。                     |
| `ssl_key`             | string  |             | gRPC 通信的 SSL 证书密钥。                   |
| `http_host`           | string  | `"0.0.0.0"` | 主节点监听 HTTP 服务的主机（仪表盘和指标）             |
| `http_port`           | integer | `8088`      | 主节点监听 HTTP 服务的端口（仪表盘和指标）             |
| `http_cors_domains`   | strings | `[]`        | AllowedDomains 是 Http Origin 的允许值列表。 |
| `http_cors_methods`   | strings | `[]`        | AllowedMethods 为空或是 http 方法名称列表。     |
| `n_jobs`              | integer | `1`         | 主节点的工作线程数                            |
| `meta_timeout`        | integer | `10s`       | 元数据超时                                |
| `dashboard_user_name` | string  |             | 仪表盘登录用户名                             |
| `dashboard_password`  | string  |             | 仪表盘登录密码                              |
| `admin_api_key`       | string  |             | 管理员 API 的密钥（需要 SSL）。                 |

## `[server]`

| 键                  | 类型      | 默认值    | 描述                      |
|--------------------|---------|--------|-------------------------|
| `default_n`        | integer | `10`   | 默认返回的物品数量               |
| `api_key`          | string  |        | RESTful API 的密钥（需要 SSL） |
| `clock_error`      | integer | `5s`   | 集群中的时钟误差                |
| `auto_insert_user` | boolean | `true` | 插入新反馈时自动插入新用户           |
| `auto_insert_item` | boolean | `true` | 插入新反馈时自动插入新物品           |
| `cache_expire`     | string  | `10s`  | 服务器端缓存过期时间              |

## `[recommend]`

全局推荐配置。

| 键                 | 类型      | 默认值   | 描述                   |
|-------------------|---------|-------|----------------------|
| `cache_size`      | string  | `100` | 缓存存储中的缓存元素数量         |
| `cache_expire`    | string  | `72h` | 推荐缓存过期时间             |
| `context_size`    | integer | `100` | 在线推荐的上下文大小。          |
| `active_user_ttl` | integer | `0`   | 活跃用户的生存时间（天），0 表示禁用。 |

### `[recommend.data_source]`

推荐器[数据源](./concepts/data-source.md)的配置。

| 键                         | 类型     | 默认值 | 描述        |
|---------------------------|--------|-----|-----------|
| `positive_feedback_types` | string |     | 积极反馈的类型   |
| `read_feedback_types`     | string |     | 已读反馈的类型   |
| `positive_feedback_ttl`   | string | `0` | 积极反馈的生存时间 |
| `item_ttl`                | string | `0` | 物品的生存时间   |

### `[[recommend.non-personalized]]`

[非个性化推荐器](concepts/recommenders/non-personalized.md)的配置。

| 键         | 类型     | 默认值 | 描述            |
|-----------|--------|-----|---------------|
| `name`    | string |     | 非个性化推荐器的名称    |
| `score`   | string |     | Expr 语言中的评分函数 |
| `filter ` | string |     | Expr 语言中的筛选函数 |

### `[[recommend.item-to-item]]`

[物品到物品推荐器](concepts/recommenders/item-to-item.md)的配置。

| 键        | 类型     | 默认值 | 描述          |
|----------|--------|-----|-------------|
| `name`   | string |     | 物品到物品推荐器的名称 |
| `type`   | string |     | 邻居的相似度类型。   |
| `column` | string |     | 用于计算相似度的字段。 |

### `[[recommend.user-to-user]]`

[用户到用户推荐器](concepts/recommenders/user-to-user.md)的配置。

| 键      | 类型     | 默认值 | 描述          |
|--------|--------|-----|-------------|
| `name` | string |     | 用户到用户推荐器的名称 |
| `type` | string |     | 邻居的相似度类型。   |

### `[[recommend.external]]`

[外部推荐器](concepts/recommenders/external.md)的配置。

| 键        | 类型     | 默认值 | 描述          |
|----------|--------|-----|-------------|
| `name`   | string |     | 外部推荐器的名称    |
| `script` | string |     | 获取外部推荐物品的脚本 |

### `[recommend.collaborative]`

[协同过滤推荐器](concepts/recommenders/collaborative.md)的配置。

| 键                 | 类型      | 默认值    | 描述             |
|-------------------|---------|--------|----------------|
| `type`            | string  | `"none"`| 协同过滤的类型（`none` 或 `mf`）。 |
| `fit_period`      | string  | `60m`  | 模型训练周期         |
| `fit_epoch`       | integer | `100`  | 模型搜索中每个模型的训练轮数 |
| `optimize_period` | string  | `360m` | 模型搜索周期         |
| `optimize_trials` | integer | `10`   | 模型搜索的试验次数      |

`[recommend.collaborative.early_stopping]`

| 键          | 类型      | 默认值  | 描述                 |
|------------|---------|------|--------------------|
| `patience` | integer | `10` | 如果没有改进，等待多少轮后停止训练。 |

### `[recommend.replacement]`

[替换](./concepts/replacement.md)已读物品回推荐的配置。

| 键                            | 类型      | 默认值     | 描述                |
|------------------------------|---------|---------|-------------------|
| `enable_replacement`         | boolean | `false` | 将已读物品替换回推荐        |
| `positive_replacement_decay` | float   | `0.8`   | 衰减来自积极反馈的被替换物品的权重 |
| `read_replacement_decay`     | float   | `0.6`   | 衰减来自已读反馈的被替换物品的权重 |

### `[recommend.ranker]`

[排序器](concepts/ranking.md)的配置。

| 键                 | 类型      | 默认值          | 描述               |
|-------------------|---------|--------------|------------------|
| `type`            | string  | `"fm"`       | 排序器的类型。          |
| `cache_expire`    | string  | `"120h"`     | 为不活跃用户刷新推荐的时间周期。 |
| `recommenders`    | strings | `["latest"]` | 排序前用于获取候选物品的推荐器。 |
| `fit_period`      | string  | `"60m"`      | 模型拟合的时间周期。       |
| `fit_epoch`       | integer | `100`        | 模型拟合的轮数。         |
| `optimize_period` | string  | `"360m"`     | 超参数优化的时间周期。      |
| `optimize_trials` | integer | `10`         | 超参数优化的试验次数。      |

`[recommend.ranker.early_stopping]`

| 键          | 类型      | 默认值  | 描述                 |
|------------|---------|------|--------------------|
| `patience` | integer | `10` | 如果没有改进，等待多少轮后停止训练。 |

### `[recommend.fallback]`

当排序器无法提供足够推荐时的回退推荐配置。

| 键              | 类型      | 默认值          | 描述            |
|----------------|---------|--------------|---------------|
| `recommenders` | strings | `["latest"]` | 个性化推荐用尽时的推荐来源 |

## `[blob]`

Blob 存储配置。

| 键     | 类型     | 默认值                     | 描述          |
|-------|--------|-------------------------|-------------|
| `uri` | string | `~/.gorse/var/lib/blob` | Blob 的 URI。 |

URI 的格式如下：

::: tabs

@tab S3

```bash
s3://bucket/path
```

@tab GCS

```bash
gs://my-bucket/my-database
```

@tab Azure Blob

```bash
az://container/path
```

@tab 本地

```bash
/path/without/prefix
```

:::

`[blob.s3]`

| 键                   | 类型     | 默认值 | 描述          |
|---------------------|--------|-----|-------------|
| `endpoint`          | string |     | AWS S3 的端点。 |
| `access_key_id`     | string |     | 访问密钥 ID。    |
| `secret_access_key` | string |     | 秘密访问密钥。     |

`[blob.gcs]`

| 键                  | 类型     | 默认值 | 描述      |
|--------------------|--------|-----|---------|
| `credentials_file` | string |     | 凭据文件路径。 |

`[blob.azure]`

| 键                   | 类型     | 默认值 | 描述     |
|---------------------|--------|-----|--------|
| `endpoint`          | string |     | 端点。    |
| `account_name`      | string |     | 账户名称。  |
| `account_key`       | string |     | 账户密钥。  |
| `connection_string` | string |     | 连接字符串。 |

## `[tracing]`

OpenTelemetry 追踪配置。

| 键                    | 类型      | 默认值                                   | 描述               |
|----------------------|---------|---------------------------------------|------------------|
| `enable_tracing`     | boolean | `false`                               | 为 REST API 启用追踪。 |
| `exporter`           | string  | `"jaeger"`                            | 追踪导出器的类型。        |
| `collector_endpoint` | string  | `"http://localhost:14268/api/traces"` | 追踪收集器的端点。        |
| `sampler`            | string  | `"always"`                            | 追踪采样器的类型。        |
| `ratio`              | float   | `1`                                   | 基于比率的采样器的比率。     |

## `[oidc]`

为[仪表盘](./dashboard/overview.md)配置 OpenID Connect (OIDC) 认证。

| 键               | 类型      | 默认值     | 描述                           |
|-----------------|---------|---------|------------------------------|
| `enable`        | boolean | `false` | 启用 OpenID Connect (OIDC) 认证。 |
| `issuer`        | string  |         | OAuth 提供商的颁发者。               |
| `client_id`     | string  |         | OAuth 应用程序的公共标识符。            |
| `client_secret` | string  |         | OAuth 应用程序的令牌访问权限。           |
| `redirect_url`  | string  |         | 认证后重定向的 URL。                 |

## 环境变量

部分配置可以被环境变量覆盖。

| 配置                             | 环境变量                              |
|--------------------------------|-----------------------------------|
| `database.cache_store`         | `GORSE_CACHE_STORE`               |
| `database.data_store`          | `GORSE_DATA_STORE`                |
| `database.table_prefix`        | `GORSE_TABLE_PREFIX`              |
| `database.cache_table_prefix`  | `GORSE_CACHE_TABLE_PREFIX`        |
| `database.data_table_prefix`   | `GORSE_DATA_TABLE_PREFIX`         |
| `master.port`                  | `GORSE_MASTER_PORT`               |
| `master.host`                  | `GORSE_MASTER_HOST`               |
| `master.ssl_mode`              | `GORSE_MASTER_SSL_MODE`           |
| `master.ssl_ca`                | `GORSE_MASTER_SSL_CA`             |
| `master.ssl_cert`              | `GORSE_MASTER_SSL_CERT`           |
| `master.ssl_key`               | `GORSE_MASTER_SSL_KEY`            |
| `master.http_port`             | `GORSE_MASTER_HTTP_PORT`          |
| `master.http_host`             | `GORSE_MASTER_HTTP_HOST`          |
| `master.n_jobs`                | `GORSE_MASTER_JOBS`               |
| `master.dashboard_user_name`   | `GORSE_DASHBOARD_USER_NAME`       |
| `master.dashboard_password`    | `GORSE_DASHBOARD_PASSWORD`        |
| `master.dashboard_auth_server` | `GORSE_DASHBOARD_AUTH_SERVER`     |
| `master.dashboard_redacted`    | `GORSE_DASHBOARD_REDACTED`        |
| `master.admin_api_key`         | `GORSE_ADMIN_API_KEY`             |
| `server.api_key`               | `GORSE_SERVER_API_KEY`            |
| `oidc.enable`                  | `GORSE_OIDC_ENABLE`               |
| `oidc.issuer`                  | `GORSE_OIDC_ISSUER`               |
| `oidc.client_id`               | `GORSE_OIDC_CLIENT_ID`            |
| `oidc.client_secret`           | `GORSE_OIDC_CLIENT_SECRET`        |
| `oidc.redirect_url`            | `GORSE_OIDC_REDIRECT_URL`         |
| `blob.uri`                     | `GORSE_BLOB_URI`                  |
| `blob.s3.endpoint`             | `S3_ENDPOINT`                     |
| `blob.s3.access_key_id`        | `S3_ACCESS_KEY_ID`                |
| `blob.s3.secret_access_key`    | `S3_SECRET_ACCESS_KEY`            |
| `blob.gcs.credentials_file`    | `GCS_CREDENTIALS_FILE`            |
| `blob.azure.endpoint`          | `AZURE_STORAGE_ENDPOINT`          |
| `blob.azure.account_name`      | `AZURE_STORAGE_ACCOUNT_NAME`      |
| `blob.azure.account_key`       | `AZURE_STORAGE_ACCOUNT_KEY`       |
| `blob.azure.connection_string` | `AZURE_STORAGE_CONNECTION_STRING` |

