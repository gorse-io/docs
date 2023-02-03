---
icon: docker
---

# Docker 部署

使用Docker Compose或Docker Swarm管理小规模微服务集群是不错的选择。Gorse官方提供了Docker镜像：

Docker镜像 | 版本 | 镜像大小 | 拉取次数
--- | --- | --- | ---
[gorse-master](https://hub.docker.com/r/zhenghaoz/gorse-master) | ![Docker 镜像版本（标记最新的 semver）](https://img.shields.io/docker/v/zhenghaoz/gorse-master/latest) | ![金雀花大师](https://img.shields.io/docker/image-size/zhenghaoz/gorse-master) | ![码头工人拉动](https://img.shields.io/docker/pulls/zhenghaoz/gorse-master)
[gorse-server](https://hub.docker.com/r/zhenghaoz/gorse-server) | ![Docker 镜像版本（标记最新的 semver）](https://img.shields.io/docker/v/zhenghaoz/gorse-server/latest) | ![金雀服务器](https://img.shields.io/docker/image-size/zhenghaoz/gorse-server) | ![码头工人拉动](https://img.shields.io/docker/pulls/zhenghaoz/gorse-server)
[gorse-worker](https://hub.docker.com/r/zhenghaoz/gorse-worker) | ![Docker 镜像版本（标记最新的 semver）](https://img.shields.io/docker/v/zhenghaoz/gorse-worker/latest) | ![金雀花工](https://img.shields.io/docker/image-size/zhenghaoz/gorse-worker) | ![码头工人拉动](https://img.shields.io/docker/pulls/zhenghaoz/gorse-worker)
[gorse-in-one](https://hub.docker.com/r/zhenghaoz/gorse-in-one) | ![Docker 镜像版本（标记最新的 semver）](https://img.shields.io/docker/v/zhenghaoz/gorse-in-one/latest) | ![金雀花](https://img.shields.io/docker/image-size/zhenghaoz/gorse-in-one) | ![码头工人拉动](https://img.shields.io/docker/pulls/zhenghaoz/gorse-in-one)

::: tip

这些带有`nightly`标签的镜像是从 master 分支构建的。生产中应当使用指定版本的标签。

::::

## 在Docker上部署多合一节点

单节点部署时，可以使用 gorse-in-one 的 Docker 镜像。单节点部署的`docker-compose.yaml`示例如下：

```yaml
version: "3"
services:
  gorse:
    image: zhenghaoz/gorse-in-one
    restart: unless-stopped
    ports:
      - 8086:8086   # gRPC port
      - 8088:8088   # HTTP port
    environment:
      # Use Redis as cache storage backend.
      GORSE_CACHE_STORE: redis://redis:6379
      # Use MySQL as data storage backend.
      GORSE_DATA_STORE: mysql://gorse:gorse_pass@tcp(mysql:3306)/gorse?parseTime=true
    command: >
      -c /etc/gorse/config.toml
      --log-path /var/log/gorse/master.log
      --cache-path /var/lib/gorse/master_cache.data
    volumes:
      # Mount the configuration file.
      - ./config.toml:/etc/gorse/config.toml
    depends_on:
      - redis
      - mysql
```

阅读[二进制部署](binary.md#flags-of-gorse-in-one)以获取有关 gorse-in-one 命令行参数的详细信息。

::: details 完整示例

1. 使用以下内容创建`docker-compose.yaml` ：

```yaml
version: "3"
services:
  redis:
    image: redis
    restart: unless-stopped
    ports:
      - 6379:6379

  mysql:
    image: mysql/mysql-server
    restart: unless-stopped
    ports:
      - 3306:3306
    environment:
      MYSQL_ROOT_PASSWORD: root_pass
      MYSQL_DATABASE: gorse
      MYSQL_USER: gorse
      MYSQL_PASSWORD: gorse_pass

  gorse:
    image: zhenghaoz/gorse-in-one
    restart: unless-stopped
    ports:
      - 8086:8086   # gRPC port
      - 8088:8088   # HTTP port
    environment:
      # Use Redis as cache storage backend.
      GORSE_CACHE_STORE: redis://redis:6379
      # Use MySQL as data storage backend.
      GORSE_DATA_STORE: mysql://gorse:gorse_pass@tcp(mysql:3306)/gorse?parseTime=true
    command: >
      -c /etc/gorse/config.toml
      --log-path /var/log/gorse/master.log
      --cache-path /var/lib/gorse/master_cache.data
    volumes:
      # Mount the configuration file.
      - ./config.toml:/etc/gorse/config.toml
    depends_on:
      - redis
      - mysql
```

1. 基于[配置文件模板](https://github.com/gorse-io/gorse/blob/release-0.4/config/config.toml)在同一目录下创建配置文件 `config.toml` 。

2. 启动所有服务：

```bash
docker-compose up -d
```

::::

## Docker 上的 Gorse 集群

Gorse 工作节点和服务节点具有水平可扩展性，增加服务节点的数量可以提高在线推荐吞吐量，增加工作节点的数量可以提高离线推荐吞吐量。

```mermaid
flowchart RL
  master(Master Node)
  server_0(Server Node 0)
  server_1(Server Node 1)
  server_2(Server Node 2)
  worker_0(Worker Node 0)
  worker_1(Worker Node 1)
  worker_2(Worker Node 2)
  server_0 --- |gRPC| master
  server_1 --- |gRPC| master
  server_2 --- |gRPC| master
  worker_0 --- |gRPC| master
  worker_1 --- |gRPC| master
  worker_2 --- |gRPC| master
```

这是一个带有一个主节点、一个服务器节点和一个工作节点的 Gorse 集群的示例：

```yaml
version: "3"
services:
  worker:
    image: zhenghaoz/gorse-worker
    restart: unless-stopped
    ports:
      - 8089:8089 # Prometheus metrics export port.
    command: >
      --master-host master --master-port 8086
      --http-host 0.0.0.0 --http-port 8089
      --log-path /var/log/gorse/worker.log
      --cache-path /var/lib/gorse/worker_cache.data
    volumes:
      - gorse_log:/var/log/gorse    # Mount log files in volume.
      - worker_data:/var/lib/gorse  # Mount cache files in volume.
    depends_on:
      - master

  server:
    image: zhenghaoz/gorse-server
    restart: unless-stopped
    ports:
      - 8087:8087 # RESTful APIs and Prometheus metrics export port.
    command: >
      --master-host master --master-port 8086
      --http-host 0.0.0.0 --http-port 8087
      --log-path /var/log/gorse/server.log
      --cache-path /var/lib/gorse/server_cache.data
    volumes:
      - gorse_log:/var/log/gorse    # Mount log files in volume.
      - server_data:/var/lib/gorse  # Mount cache files in volume.
    depends_on:
      - master

  master:
    image: zhenghaoz/gorse-master
    restart: unless-stopped
    ports:
      - 8086:8086 # HTTP port
      - 8088:8088 # gRPC port
    environment:
      # Use Redis as cache storage backend.
      GORSE_CACHE_STORE: redis://redis:6379
      # Use MySQL as data storage backend.
      GORSE_DATA_STORE: mysql://gorse:gorse_pass@tcp(mysql:3306)/gorse
    command: >
      -c /etc/gorse/config.toml
      --log-path /var/log/gorse/master.log
      --cache-path /var/lib/gorse/master_cache.data
    volumes:
      # Mount the configuration file.
      - ./config/config.toml:/etc/gorse/config.toml
      # Mount log files in volume.
      - gorse_log:/var/log/gorse
      # Mount cache files in volume.
      - master_data:/var/lib/gorse
    depends_on:
      - redis
      - mysql

volumes:
  worker_data:
  server_data:
  master_data:
  gorse_log:
```

::: details 完整示例

1. 使用以下内容创建`docker-compose.yaml` ：

```yaml
version: "3"
services:
  redis:
    image: redis
    restart: unless-stopped
    ports:
      - 6379:6379

  mysql:
    image: mysql/mysql-server
    restart: unless-stopped
    ports:
      - 3306:3306
    environment:
      MYSQL_ROOT_PASSWORD: root_pass
      MYSQL_DATABASE: gorse
      MYSQL_USER: gorse
      MYSQL_PASSWORD: gorse_pass
    volumes:
      - mysql_data:/var/lib/mysql

  # postgres:
  #   image: postgres:10.0
  #   ports:
  #     - 5432:5432
  #   environment:
  #     POSTGRES_DB: gorse
  #     POSTGRES_USER: gorse
  #     POSTGRES_PASSWORD: gorse_pass
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data

  # mongo:
  #   image: mongo:4.0
  #   ports:
  #     - 27017:27017
  #   environment:
  #     MONGO_INITDB_DATABASE: gorse
  #     MONGO_INITDB_ROOT_USERNAME: root
  #     MONGO_INITDB_ROOT_PASSWORD: password
  #   volumes:
  #     - mongo_data:/data/db

  # clickhouse:
  #   image: yandex/clickhouse-server:21.10
  #   ports:
  #     - 8123:8123
  #   environment:
  #     CLICKHOUSE_DB: gorse
  #     CLICKHOUSE_USER: gorse
  #     CLICKHOUSE_PASSWORD: gorse_pass
  #   volumes:
  #     - clickhouse_data:/var/lib/clickhouse

  worker:
    image: zhenghaoz/gorse-worker
    restart: unless-stopped
    ports:
      - 8089:8089
    command: >
      --master-host master --master-port 8086
      --http-host 0.0.0.0 --http-port 8089
      --log-path /var/log/gorse/worker.log
      --cache-path /var/lib/gorse/worker_cache.data
    volumes:
      - gorse_log:/var/log/gorse
      - worker_data:/var/lib/gorse
    depends_on:
      - master

  server:
    image: zhenghaoz/gorse-server
    restart: unless-stopped
    ports:
      - 8087:8087
    command: >
      --master-host master --master-port 8086
      --http-host 0.0.0.0 --http-port 8087
      --log-path /var/log/gorse/server.log
      --cache-path /var/lib/gorse/server_cache.data
    volumes:
      - gorse_log:/var/log/gorse
      - server_data:/var/lib/gorse
    depends_on:
      - master

  master:
    image: zhenghaoz/gorse-master
    restart: unless-stopped
    ports:
      - 8086:8086
      - 8088:8088
    environment:
      GORSE_CACHE_STORE: redis://redis:6379
      GORSE_DATA_STORE: mysql://gorse:gorse_pass@tcp(mysql:3306)/gorse
      # GORSE_DATA_STORE: postgres://gorse:gorse_pass@postgres/gorse?sslmode=disable
      # GORSE_DATA_STORE: mongodb://root:password@mongo:27017/gorse?authSource=admin&connect=direct
      # GORSE_DATA_STORE: clickhouse://gorse:gorse_pass@clickhouse:8123/gorse
    command: >
      -c /etc/gorse/config.toml
      --log-path /var/log/gorse/master.log
      --cache-path /var/lib/gorse/master_cache.data
    volumes:
      - ./config/config.toml:/etc/gorse/config.toml
      - gorse_log:/var/log/gorse
      - master_data:/var/lib/gorse
    depends_on:
      - redis
      - mysql
      # - postgres
      # - mongo
      # - clickhouse

volumes:
  worker_data:
  server_data:
  master_data:
  gorse_log:
  mysql_data:
  # postgres_data:
  # mongo_data:
  # clickhouse_data:
```

1. 基于[配置文件模板](https://github.com/gorse-io/gorse/blob/release-0.4/config/config.toml)在同一目录下创建配置文件 `config.toml` 。

2. 启动所有服务：

```bash
docker-compose up -d
```

:::

### 命令行参数

主节点的命令行参数：

<fonticon icon="rightarrow"></fonticon> | 参数 | 默认值 | 描述
--- | --- | --- | ---
 | `--cache-path` | `worker_cache.data` | 缓存文件路径
`-c` | `--config` |  | 配置文件路径
 | `--debug` |  | 开启DEBUG日志模式
`-h` | `--help` |  | 显示帮助信息
 | `--log-path` |  | 日志文件路径
`-v` | `--version` |  | 显示版本信息

服务节点的命令行参数：

<fonticon icon="rightarrow"></fonticon> | 参数 | 默认值 | 描述
--- | --- | --- | ---
 | `--cache-path` | `worker_cache.data` | 缓存文件路径
 | `--debug` |  | 开启DEBUG日志模式
`-h` | `--help` |  | 显示帮助信息
 | `--http-host` | `127.0.0.1` | RESTful API 和 Prometheus<br>度量所在IP地址
 | `--http-port` | `8087` | RESTful API 和 Prometheus<br>度量所在端口
 | `--log-path` |  | 日志文件路径
 | `--master-host` | `127.0.0.1` | 主节点的IP地址
 | `--master-port` | `8086` | 主节点的端口
`-v` | `--version` |  | 显示版本信息

工作节点的命令行参数：

<fonticon icon="rightarrow"></fonticon> | 参数 | 默认值 | 描述
--- | --- | --- | ---
 | `--cache-path` | `worker_cache.data` | 缓存文件路径
 | `--debug` |  | 开启DEBUG日志模式
`-h` | `--help` |  | 显示帮助信息
 | `--http-host` | `127.0.0.1` | Prometheus metrics HTTP接口IP地址
 | `--http-port` | `8089` | Prometheus metrics HTTP接口端口。
`-j` | `--jobs` | `1` | 工作线程数量
 | `--log-path` |  | 日志文件路径
 | `--master-host` | `127.0.0.1` | 主节点的IP地址
 | `--master-port` | `8086` | 主节点的端口
`-v` | `--version` |  | 显示版本信息
