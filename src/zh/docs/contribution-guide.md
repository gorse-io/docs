---
icon: pullrequest
---

# 贡献指南

此页面将展示如何在 Gorse 源代码上进行开发。

## 配置开发环境

需要安装以下这些依赖：

- **Go** (&gt;= 1.18)：由于 Gorse 使用了 1.18 的 Go 特性，因此编译器的版本必须大于 1.18。强烈建议使用 GoLand 或 Visual Studio Code 作为开发 Gorse 的 IDE。
- **Docker Compose** ：单元测试需要多个数据库，需要使用 Docker Compose 管理数据库。

```bash
cd storage
docker-compose up -d
```

## 运行单元测试

Gorse 中的大多数逻辑都已经被单元测试覆盖。通过以下命令运行单元测试：

```bash
go test -v ./...
```

默认数据库 URL 指向`storage/docker-compose.yml`中的这些数据库。可以通过设置以下环境变量来设置测试数据库：

环境变量 | 默认值
--- | ---
`MYSQL_URI` | `mysql://root:password@tcp(127.0.0.1:3306)/`
`POSTGRES_URI` | `postgres://gorse:gorse_pass@127.0.0.1/`
`MONGO_URI` | `mongodb://root:password@127.0.0.1:27017/`
`CLICKHOUSE_URI` | `clickhouse://127.0.0.1:8123/`
`REDIS_URI` | `redis://127.0.0.1:6379/`

例如，通过以下方式使用 TiDB 作为测试数据库：

```bash
MYSQL_URI=mysql://root:password@tcp(127.0.0.1:4000)/ go test -v ./...
```
