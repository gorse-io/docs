---
icon: launch
---
# Quick Start

This guide walks you through the quickest way to setup a recommender system for GitHub repositories based on dataset from [GitRec](https://gitrec.gorse.io/). Make sure you have installed the following softwares at the beginning: 

- [Docker](https://docs.docker.com/get-docker/), nodes will run in containers.
- [Docker Compose](https://docs.docker.com/compose/install/), nodes will be orchestrated by Docker Compose.

## Setup Gorse

Gorse supports to be single node or multiple nodes. This section demonstrates how to setup a minimal usable Gorse single node via playground or a multiple nodes cluster via Docker Compose.

### Option 1: Setup Gorse-in-one node via Playground

Use the following command to setup a Gorse all-in-one node.

```bash
docker run -p 8088:8088 zhenghaoz/gorse-in-one --playground
```

::: tip

For Gorse-in-one, the RESTful endpoint is http://localhost:8088.

:::

### Option 2: Setup Gorse Cluster via Docker Compose

There is an example [docker-compose.yml](https://github.com/gorse-io/gorse/blob/master/docker-compose.yml) consists of a master node, a server node and a worker node, and a MySQL instance.

1. Download [docker-compose.yml](https://github.com/zhenghaoz/gorse/blob/master/docker-compose.yml) and the config file [config.toml](https://github.com/gorse-io/gorse/blob/master/config/config.toml).

```bash
# Create a new directory
mkdir github
cd github

# Download docker-compose.yml and config.toml
wget https://raw.githubusercontent.com/gorse-io/gorse/master/docker-compose.yml
wget https://raw.githubusercontent.com/gorse-io/gorse/master/config/config.toml -P config
```

2. Setup the Gorse cluster using Docker Compose.

```bash
docker compose up -d
```

3. Download the dump file [github.bin.gz](https://cdn.gorse.io/example/github.bin.gz) and import to Gorse. This dataset consists of GitHub users, GitHub repositories and interactions between users and repositories.

```bash
# Download sample data.
wget https://cdn.gorse.io/example/github.bin.gz

# Decompress sample data.
gzip -d github.bin.gz

# Import sample data.
curl -X POST --data-binary @github.bin http://localhost:8088/api/restore
```

4. Restart the master node to reload imported data immediately.

```bash
docker compose restart master
```

## Get Recommendation

Open http://localhost:8088 in browser and the dashboard summarizes all status and data in Gorse. After the "Generate item-to-item recommendation" task is completed on the "Tasks" page, try to insert some feedback into Gorse.

Suppose Bob is a developers who interested in LLM related repositories. We insert his star feedback to Gorse via the RESTful API.

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

Then, fetch 10 recommended items from Gorse.

```bash
curl http://localhost:8087/api/recommend/bob?n=10
```

::: tip
Access http://localhost:8088 for RESTful API of Gorse-in-one, and http://localhost:8087 for RESTful API of Gorse cluster.
:::
