---
icon: launch
---

# 快速上手

本指南将引导您基于[GitRec](https://gitrec.gorse.io/)的数据集以最快的速度为 GitHub 仓库搭建一个推荐系统。在开始前，请确保你已经安装了以下软件：

- [Docker](https://docs.docker.com/get-docker/) ，Gorse 的节点将运行在容器中。
- [Docker Compose](https://docs.docker.com/compose/install/) ，Gorse 的节点由 Docker Compose 编排。

## 搭建 Gorse

Gorse 支持单节点和多节点部署。本节演示如何通过 playground 搭建最小可用的 Gorse 单节点，以及如何通过 Docker Compose 搭建多节点集群。

### 选项 1：通过 Playground 搭建 Gorse-in-one 节点

使用以下命令搭建 Gorse-in-one 节点。

::: code-tabs#setup

@tab:active Bash

```bash
curl -fsSL https://gorse.io/playground | bash
```

@tab docker

```bash
docker run -p 8088:8088 zhenghaoz/gorse-in-one --playground
```

:::

::: tips

Gorse 的 RESTful API 入口是 http://127.0.0.1:8088。

:::

### 选项 2：通过 Docker Compose 搭建 Gorse 集群

示例[docker-compose.yml](https://github.com/gorse-io/gorse/blob/release-0.4/docker-compose.yml)由一个主节点、一个服务节点和一个工作节点、一个 Redis 实例和一个 MySQL 实例组成。

1. 下载 [docker-compose.yml](https://github.com/zhenghaoz/gorse/blob/release-0.4/docker-compose.yml)和配置文件[config.toml](https://github.com/gorse-io/gorse/blob/release-0.4/config/config.toml).

```bash
# Create a new directory
mkdir gorse
cd gorse

# Download docker-compose.yml and config.tom
wget https://raw.githubusercontent.com/zhenghaoz/gorse/release-0.4/docker-compose.yml
wget https://raw.githubusercontent.com/zhenghaoz/gorse/release-0.4/config.toml
```

1. 使用 Docker Compose 搭建 Gorse 集群。

```bash
docker-compose up -d
```

::: details 预期输出

```
Creating network "gorse_default" with the default driver
Creating gorse_worker_1 ... done
Creating gorse_master_1 ... done
Creating gorse_mysql_1  ... done
Creating gorse_server_1 ... done
Creating gorse_redis_1  ... done
```

::::

1. 下载SQL文件[github.sql](https://cdn.gorse.io/example/github.sql)并导入到MySQL实例中。该数据集由 GitHub 用户、GitHub 仓库以及用户与仓库之间的交互组成。

```bash
# Download sample data.
wget https://cdn.gorse.io/example/github.sql

# Import sample data.
mysql -h 127.0.0.1 -u gorse -pgorse_pass gorse < github.sql
```

在这个数据集中，用户和仓库之间存在三种交互（在 Gorse 中称为“反馈”）。

反馈类型 | 描述
--- | ---
star | 用户在 GitHub 中为仓库点赞
read | 用户阅读了[GitRec](https://gitrec.gorse.io/)推荐的仓库
like | 用户给了[GitRec](https://gitrec.gorse.io/)推荐的仓库点了小心心

在配置文件中，“read”属于`read_feedback_types` （已读反馈），而“star”和“like”属于`positive_feedback_types`（正向反馈） 。

```toml
# The feedback types for positive events.
positive_feedback_types = ["star","like"]

# The feedback types for read events.
read_feedback_types = ["read"]
```

1. 重新启动主节点从而立即加载导入的数据。

```bash
docker-compose restart
```

::: details 预期输出

```
Restarting gorse_redis_1  ... done
Restarting gorse_mysql_1  ... done
Restarting gorse_master_1 ... done
Restarting gorse_server_1 ... done
Restarting gorse_worker_1 ... done
```

::::

## 获取推荐

在插入用户反馈后，Gorse 自动为用户生成推荐。

在浏览器中打开[http://127.0.0.1:8088](http://127.0.0.1:8088) ，仪表盘汇总了 Gorse 中的所有状态和数据。

![](../../img/dashboard-overview.png)

等待*除了“Searching collaborative filtering model”和“Searching click-through prediction model”外*的所有任务完成。

![](../../img/dashboard-tasks.png)

假设 Bob 是一名前端开发人员，他在 GitHub 中点赞过为多个前端仓库。我们通过 RESTful API 将他的点赞插入 Gorse。

```bash
read -d '' JSON << EOF
[
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"vuejs:vue\", \"Timestamp\": \"2022-02-24\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"d3:d3\", \"Timestamp\": \"2022-02-25\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"dogfalo:materialize\", \"Timestamp\": \"2022-02-26\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"mozilla:pdf.js\", \"Timestamp\": \"2022-02-27\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"moment:moment\", \"Timestamp\": \"2022-02-28\" }
]
EOF

curl -X POST http://127.0.0.1:8087/api/feedback \
   -H 'Content-Type: application/json' \
   -d "$JSON"
```

::: details 预期输出

```json
{
 "RowAffected": 5
}
```

::::

然后，从 Gorse 获取 10 个推荐项。我们可以发现 Gorse 为 Bob 推荐了前端相关的仓库。

```bash
curl http://127.0.0.1:8087/api/recommend/bob?n=10
```

预期输出：

```json
[
    "mbostock:d3",
    "nt1m:material-framework",
    "mdbootstrap:vue-bootstrap-with-material-design",
    "justice47:f2-vue",
    "10clouds:cyclejs-cookie",
    "academicpages:academicpages.github.io",
    "accenture:alexia",
    "addyosmani:tmi",
    "1wheel:d3-starterkit",
    "acdlite:redux-promise"
]
```
