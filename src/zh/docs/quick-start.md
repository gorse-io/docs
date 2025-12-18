---
icon: launch
---
# 快速上手

本指南将引导您基于 [GitRec](https://gitrec.gorse.io/) 的数据集，以最快的方式为 GitHub 仓库搭建一个推荐系统。在开始之前，请确保您已安装以下软件：

- [Docker](https://docs.docker.com/get-docker/)，节点将在容器中运行。
- [Docker Compose](https://docs.docker.com/compose/install/)，节点将由 Docker Compose 编排。

## 搭建 Gorse

Gorse 支持单节点或多节点。本节演示如何通过 playground 搭建一个最小可用的 Gorse 单节点，或通过 Docker Compose 搭建一个多节点集群。

### 选项 1：通过 Playground 搭建 Gorse-in-one 节点

使用以下命令搭建一个 Gorse 多合一节点。

```bash
docker run -p 8088:8088 zhenghaoz/gorse-in-one --playground
```

::: tip

对于 Gorse-in-one，RESTful 地址是 http://localhost:8088。

:::

### 选项 2：通过 Docker Compose 搭建 Gorse 集群

有一个示例 [docker-compose.yml](https://github.com/gorse-io/gorse/blob/master/docker-compose.yml)，其中包含一个主节点、一个服务器节点和一个工作节点，以及一个 MySQL 实例。

1. 下载 [docker-compose.yml](https://github.com/zhenghaoz/gorse/blob/master/docker-compose.yml) 和配置文件 [config.toml](https://github.com/gorse-io/gorse/blob/master/config/config.toml)。

```bash
# 创建一个新目录
mkdir github
cd github

# 下载 docker-compose.yml 和 config.toml
wget https://raw.githubusercontent.com/gorse-io/gorse/master/docker-compose.yml
wget https://raw.githubusercontent.com/gorse-io/gorse/master/config/config.toml -P config
```

2. 使用 Docker Compose 搭建 Gorse 集群。

```bash
docker compose up -d
```

3. 下载转储文件 [github.bin.gz](https://cdn.gorse.io/example/github.bin.gz) 并导入 Gorse。该数据集包含 GitHub 用户、GitHub 仓库以及用户和仓库之间的交互记录。

```bash
# 下载示例数据。
wget https://cdn.gorse.io/example/github.bin.gz

# 解压示例数据。
gzip -d github.bin.gz

# 导入示例数据。
curl -X POST --data-binary @github.bin http://localhost:8088/api/restore
```

4. 重新启动主节点以立即重新加载导入的数据。

```bash
docker compose restart master
```

## 获取推荐

在浏览器中打开 http://localhost:8088，控制台会展示 Gorse 中的所有状态和数据。在“任务”页面上完成“Generate item-to-item recommendation”任务后，尝试向 Gorse 插入一些反馈。

假设 Bob 是一位对 LLM 相关仓库感兴趣的开发人员。我们通过 RESTful API 将他的星标反馈插入 Gorse。

```bash
read -d '' JSON << EOF
[
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"ollama:ollama\", \"Value\": 1, \"Timestamp\": \"2022-02-24\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"huggingface:transformers\", \"Value\": 1, \"Timestamp\": \"2022-02-25\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"asbt:llms-from-scratch\", \"Value\": 1, \"Timestamp\": \"2022-02-26\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"vllm-project:vllm\", \"Value\": 1, \"Timestamp\": \"2022-02-27\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"hiyouga:llama-factory\", \"Value\": 1, \"Timestamp\": \"2022-02-28\" }
]
EOF

curl -X POST http://localhost:8087/api/feedback \
   -H 'Content-Type: application/json' \
   -d "$JSON"
```

然后，从 Gorse 获取 10 个推荐物品。

```bash
curl http://localhost:8087/api/recommend/bob?n=10
```

::: tip
对于 Gorse-in-one，请访问 http://localhost:8088 获取 RESTful API，对于 Gorse 集群，请访问 http://localhost:8087。
:::
