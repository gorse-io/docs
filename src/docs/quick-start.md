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

1. Download [docker-compose.yml](https://github.com/gorse-io/gorse/blob/master/docker-compose.yml) and the config file [config.toml](https://github.com/gorse-io/gorse/blob/master/config/config.toml).

::: tabs

@tab:active Linux/macOS

```bash
# Create a new directory
mkdir github
cd github

# Download docker-compose.yml and config.toml
wget https://raw.githubusercontent.com/gorse-io/gorse/master/docker-compose.yml
wget https://raw.githubusercontent.com/gorse-io/gorse/master/config/config.toml -P config
```

@tab Windows

```powershell
# Create a new directory
New-Item -ItemType Directory -Path github
Set-Location github
New-Item -ItemType Directory -Path config

# Download docker-compose.yml and config.toml
Invoke-WebRequest -UseBasicParsing -Uri "https://raw.githubusercontent.com/gorse-io/gorse/master/docker-compose.yml" -OutFile "docker-compose.yml"
Invoke-WebRequest -UseBasicParsing -Uri "https://raw.githubusercontent.com/gorse-io/gorse/master/config/config.toml" -OutFile "config/config.toml"
```

:::

2. Setup the Gorse cluster using Docker Compose.

```bash
docker compose up -d
```

3. Download the dump file [github.bin.gz](https://cdn.gorse.io/example/github.bin.gz) and import to Gorse. This dataset consists of GitHub users, GitHub repositories and interactions between users and repositories.

::: tabs

@tab:active Linux/macOS

```bash
# Download sample data.
wget https://cdn.gorse.io/example/github.bin.gz

# Decompress sample data.
gzip -d github.bin.gz

# Import sample data.
curl -X POST --data-binary @github.bin http://localhost:8088/api/restore
```

@tab Windows

```powershell
# Download sample data.
Invoke-WebRequest -UseBasicParsing -Uri "https://cdn.gorse.io/example/github.bin.gz" -OutFile "github.bin.gz"

# Decompress sample data.
$gzip = [IO.Compression.GZipStream]::new([IO.File]::OpenRead("$PWD/github.bin.gz"), [IO.Compression.CompressionMode]::Decompress)
$output = [IO.File]::Create("$PWD/github.bin")
try { $gzip.CopyTo($output) } finally { $output.Dispose(); $gzip.Dispose() }

# Import sample data.
Invoke-RestMethod -Method Post -Uri "http://localhost:8088/api/restore" `
    -ContentType "application/octet-stream" `
    -InFile "github.bin"
```

:::

4. Restart the master node to reload imported data immediately.

```bash
docker compose restart master
```

## Get Recommendation

Open http://localhost:8088 in browser and the dashboard summarizes all status and data in Gorse. After the "Generate item-to-item recommendation" task is completed on the "Tasks" page, try to insert some feedback into Gorse.

Suppose Bob is a developers who interested in LLM related repositories. We insert his star feedback to Gorse via the RESTful API.

::: tabs

@tab:active Linux/macOS

```bash
JSON=$(cat <<'EOF'
[
    { "FeedbackType": "star", "UserId": "bob", "ItemId": "ollama:ollama", "Value": 1, "Timestamp": "2022-02-24" },
    { "FeedbackType": "star", "UserId": "bob", "ItemId": "huggingface:transformers", "Value": 1, "Timestamp": "2022-02-25" },
    { "FeedbackType": "star", "UserId": "bob", "ItemId": "asbt:llms-from-scratch", "Value": 1, "Timestamp": "2022-02-26" },
    { "FeedbackType": "star", "UserId": "bob", "ItemId": "vllm-project:vllm", "Value": 1, "Timestamp": "2022-02-27" },
    { "FeedbackType": "star", "UserId": "bob", "ItemId": "hiyouga:llama-factory", "Value": 1, "Timestamp": "2022-02-28" }
]
EOF
)

curl -X POST http://localhost:8087/api/feedback \
   -H 'Content-Type: application/json' \
   -d "$JSON"
```

@tab Windows

```powershell
$JSON = @'
[
    { "FeedbackType": "star", "UserId": "bob", "ItemId": "ollama:ollama", "Value": 1, "Timestamp": "2022-02-24" },
    { "FeedbackType": "star", "UserId": "bob", "ItemId": "huggingface:transformers", "Value": 1, "Timestamp": "2022-02-25" },
    { "FeedbackType": "star", "UserId": "bob", "ItemId": "asbt:llms-from-scratch", "Value": 1, "Timestamp": "2022-02-26" },
    { "FeedbackType": "star", "UserId": "bob", "ItemId": "vllm-project:vllm", "Value": 1, "Timestamp": "2022-02-27" },
    { "FeedbackType": "star", "UserId": "bob", "ItemId": "hiyouga:llama-factory", "Value": 1, "Timestamp": "2022-02-28" }
]
'@

Invoke-RestMethod -Method Post -Uri "http://localhost:8087/api/feedback" `
    -ContentType "application/json" `
    -Body $JSON
```

:::

Then, fetch 10 recommended items from Gorse.

::: tabs

@tab:active Linux/macOS

```bash
curl http://localhost:8087/api/recommend/bob?n=10
```

@tab Windows

```powershell
Invoke-RestMethod -Uri "http://localhost:8087/api/recommend/bob?n=10"
```

:::

::: tip
Access http://localhost:8088 for RESTful API of Gorse-in-one, and http://localhost:8087 for RESTful API of Gorse cluster.
:::
