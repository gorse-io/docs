---
icon: docker
---
# Docker Deployment

Docker Compose or Docker Swarm is a good choice for managing small-size microservice clusters. There are Docker images provided by the Gorse official:

| Docker Image | Version | Image Size | Pulls |
| ------------ | -------- | --- | --- |
| [gorse-master](https://hub.docker.com/r/zhenghaoz/gorse-master) | ![Docker Image Version (tag latest semver)](https://img.shields.io/docker/v/zhenghaoz/gorse-master/latest) | ![gorse-master](https://img.shields.io/docker/image-size/zhenghaoz/gorse-master) | ![Docker Pulls](https://img.shields.io/docker/pulls/zhenghaoz/gorse-master) |
| [gorse-server](https://hub.docker.com/r/zhenghaoz/gorse-server) | ![Docker Image Version (tag latest semver)](https://img.shields.io/docker/v/zhenghaoz/gorse-server/latest) | ![gorse-server](https://img.shields.io/docker/image-size/zhenghaoz/gorse-server) | ![Docker Pulls](https://img.shields.io/docker/pulls/zhenghaoz/gorse-server) |
| [gorse-worker](https://hub.docker.com/r/zhenghaoz/gorse-worker) | ![Docker Image Version (tag latest semver)](https://img.shields.io/docker/v/zhenghaoz/gorse-worker/latest) | ![gorse-worker](https://img.shields.io/docker/image-size/zhenghaoz/gorse-worker) | ![Docker Pulls](https://img.shields.io/docker/pulls/zhenghaoz/gorse-worker) |
| [gorse-in-one](https://hub.docker.com/r/zhenghaoz/gorse-in-one) | ![Docker Image Version (tag latest semver)](https://img.shields.io/docker/v/zhenghaoz/gorse-in-one/latest) | ![gorse-in-one](https://img.shields.io/docker/image-size/zhenghaoz/gorse-in-one) | ![Docker Pulls](https://img.shields.io/docker/pulls/zhenghaoz/gorse-in-one) |

::: tip Nightly Version

These images tagged with the `nightly` tag are built from the master branch.

:::

::: tip Windows Container

These images tagged with the `*-windowsservercore` tag are built for the Windows container.

:::

## Gorse-in-one on Docker

For single node deployment, the gorse-in-one Docker image can be used. There is an example of Gorse-in-one usage in `docker-compose.yaml`.


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

Read [Binary Deployment](binary.md#flags-of-gorse-in-one) for detailed information about command line flags of gorse-in-one.

::: details Full Example

1. Create `docker-compose.yaml` with the following content:

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

2. Create a configuration file `config.toml` in the same directory based on [the configuration template](https://github.com/gorse-io/gorse/blob/release-0.4/config/config.toml).

3. Start all services:

```bash
docker-compose up -d
```

:::

## Gorse Cluster on Docker

Gorse worker nodes and server nodes have horizontal scalability. Increase the number of server nodes to improve online recommendation throughput, while increase the number of worker nodes to improve offline recommendation throughput.

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

There is an example of a Gorse cluster with one master node, one server node and one worker node:

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

::: details Full Example

1. Create `docker-compose.yaml` with the following content:

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

2. Create a configuration file `config.toml` in the same directory based on [the configuration template](https://github.com/gorse-io/gorse/blob/release-0.4/config/config.toml).

3. Start all services:

```bash
docker-compose up -d
```

:::

### Command Line Flags

Command line flags of the master node:

| <FontIcon icon="rightarrow"/> | Flag | Default Value | Description |
|-|-|-|-|
| | `--cache-path` | `worker_cache.data` | Cache file path. |
| `-c` | `--config` | | Configuration file path. |
| | `--debug` | | Debug log mode. |
| `-h` | `--help` | | Help for gorse-master. |
| | `--log-path` | | Path of log file. |
| | `--log-max-size` | | Maximum size in megabytes of the log file. |
| | `--log-max-age` | | Maximum number of days to retain old log files. |
| | `--log-max-backups` | | Maximum number of old log files to retain. |
| `-v` | `--version` | | Gorse version. |

Command line flags of the server node:

| <FontIcon icon="rightarrow"/> | Flag | Default Value | Description |
|-|-|-|-|
| | `--cache-path` | `worker_cache.data` | Cache file path. |
| | `--debug` | | Debug log mode. |
| `-h` | `--help` | | Help for gorse-server. |
| | `--http-host` | `127.0.0.1` | RESTful APIs and Prometheus<br>metrics export host |
| | `--http-port` | `8087` | RESTful APIs and Prometheus<br>metrics export port |
| | `--log-path` | | Path of log file. |
| | `--log-max-size` | | Maximum size in megabytes of the log file. |
| | `--log-max-age` | | Maximum number of days to retain old log files. |
| | `--log-max-backups` | | Maximum number of old log files to retain. |
| | `--master-host` | `127.0.0.1` | Master node host. |
| | `--master-port` | `8086` | Master node port. |
| `-v` | `--version` | | Gorse version. |

Command line flags of the worker node:

| <FontIcon icon="rightarrow"/> | Flag | Default Value | Description |
|-|-|-|-|
| | `--cache-path` | `worker_cache.data` | Cache file path. |
| | `--debug` | | Debug log mode. |
| `-h` | `--help` | | Help for gorse-worker. |
| | `--http-host` | `127.0.0.1` | Prometheus metrics export host. |
| | `--http-port` | `8089` | Prometheus metrics export port. |
| `-j` | `--jobs` | `1` | Number of working jobs. |
| | `--log-path` | | Path of log file. |
| | `--log-max-size` | | Maximum size in megabytes of the log file. |
| | `--log-max-age` | | Maximum number of days to retain old log files. |
| | `--log-max-backups` | | Maximum number of old log files to retain. |
| | `--master-host` | `127.0.0.1` | Master node host. |
| | `--master-port` | `8086` | Master node port |
| `-v` | `--version` | | Gorse version. |
