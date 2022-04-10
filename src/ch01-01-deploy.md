# Deploy

The best practice to manage Gorse nodes is using orchestration tools such as Docker Compose, etc. There are Docker images of the master node, the server node, and the worker node.

| Docker Image         | Version | Size | Pulls |
| ------------ | - | -------- | - |
| [zhenghaoz/gorse-master](https://hub.docker.com/repository/docker/zhenghaoz/gorse-master) | ![Docker Image Version (latest semver)](https://img.shields.io/docker/v/zhenghaoz/gorse-master?sort=semver) | ![gorse-master](https://img.shields.io/docker/image-size/zhenghaoz/gorse-master?sort=semver) | ![Docker Pulls](https://img.shields.io/docker/pulls/zhenghaoz/gorse-master) |
| [zhenghaoz/gorse-server](https://hub.docker.com/repository/docker/zhenghaoz/gorse-server) | ![Docker Image Version (latest semver)](https://img.shields.io/docker/v/zhenghaoz/gorse-server?sort=semver) | ![gorse-server](https://img.shields.io/docker/image-size/zhenghaoz/gorse-server?sort=semver) | ![Docker Pulls](https://img.shields.io/docker/pulls/zhenghaoz/gorse-server) |
| [zhenghaoz/gorse-worker](https://hub.docker.com/repository/docker/zhenghaoz/gorse-worker) | ![Docker Image Version (latest semver)](https://img.shields.io/docker/v/zhenghaoz/gorse-worker?sort=semver) | ![gorse-worker](https://img.shields.io/docker/image-size/zhenghaoz/gorse-worker?sort=semver) | ![Docker Pulls](https://img.shields.io/docker/pulls/zhenghaoz/gorse-worker) |

## Prerequisite

Gorse depends on following software:

- *Redis* is used to store caches.
- One of *MySQL/PostgresSQL/ClickHouse/MongoDB* is used to store data.

The minimal versions of dependent software are as follows:

| Software    | Minimal Version | Compatible Product |
|-------------|-----------------|-|
| Redis       | 5.0             | |
| MySQL       | 5.7             | MariaDB >= 10.2 |
| PostgresSQL | 10.0            | |
| ClickHouse  | 21.10           | |
| MongoDB     | 4.0             | |

## Command Line Flags

Command line flags are useful when deploy the Gorse cluster.

- Flags of the master node.

| Flag | Default | Description |
|-|-|-|
| `-v,--version` | | print Gorse version |
| `-c,--config` | | configuration file path |
| `--debug` | | use debug log mode |
| `--log-path` | | path of log file |
| `--cache-path` | `worker_cache.data` | path of cache file |

- Flags of the server node.

| Flag | Default | Description |
|-|-|-|
| `-v,--version` | | print Gorse version |
| `--master-host` | `127.0.0.1` | host of master node |
| `--master-port` | `8086` | port of master port |
| `--http-host` | `127.0.0.1` | host for RESTful APIs and<br>Prometheus metrics export |
| `--http-port` | `8087` | port for RESTful APIs and<br>Prometheus metrics export |
| `--debug` | | use debug log mode |
| `--log-path` | | path of log file |
| `--cache-path` | `worker_cache.data` | path of cache file |

- Flags of the worker node.

| Flag | Default | Description |
|-|-|-|
| `-v,--version` | | print Gorse version |
| `--master-host` | `127.0.0.1` | host of master node |
| `--master-port` | `8086` | port of master port |
| `--http-host` | `127.0.0.1` | host for Prometheus metrics export |
| `--http-port` | `8089` | port for Prometheus metrics export |
| `--debug` | | use debug log mode |
| `-j,--jobs` | `1` | number of working jobs |
| `--log-path` | | path of log file |
| `--cache-path` | `worker_cache.data` | path of cache file |

## Deploy Gorse in Docker Compose

docker-compose.yaml for a minimal Gorse cluster is as follows:

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

  worker:
    image: zhenghaoz/gorse-worker
    restart: unless-stopped
    ports:
      - 8089:8089
    command: >
      --master-host master 
      --master-port 8086 
      --http-host 0.0.0.0 
      --http-port 8089
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
      --master-host master 
      --master-port 8086 
      --http-host 0.0.0.0 
      --http-port 8087
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
    command: >
      -c /etc/gorse/config.toml 
      --log-path /var/log/gorse/master.log 
      --cache-path /var/lib/gorse/master_cache.data
    volumes:
      - ./config.toml:/etc/gorse/config.toml
      - gorse_log:/var/log/gorse
      - master_data:/var/lib/gorse
    depends_on:
      - redis
      - mysql

volumes:
  mysql_data:
  worker_data:
  server_data:
  master_data:
  gorse_log:
```

- The master node loads the config file from `/etc/gorse/config.toml` (mounted to `./config.toml`), writes the log file to `/var/log/gorse/master.log` (mounted in "gorse_log" volume) and writes the cache file to `/var/lib/gorse/master_cache.data` (mounted in "master_data" volume). The addresses of Redis and MySQL are specified in configuration file [(1.3)](ch01-03-config.md#database) or by environment variables [(1.3)](ch01-03-config.md#environment-variables).

```toml
# The database for caching, support Redis only:
#   redis://<user>:<password>@<host>:<port>/<db_number>
cache_store = "redis://redis:6379"

# The database for persist data, support MySQL, Postgres, ClickHouse and MongoDB:
#   mysql://[username[:password]@][protocol[(address)]]/dbname[?param1=value1&...&paramN=valueN]
#   postgres://bob:secret@1.2.3.4:5432/mydb?sslmode=verify-full
#   clickhouse://user:password@host[:port]/database?param1=value1&...&paramN=valueN
#   mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
data_store = "mysql://gorse:gorse_pass@tcp(mysql:3306)/gorse?parseTime=true"
```

- The server node synchronizes with the master node at port `8086`, writes the log file to `/var/log/gorse/server.log` (mounted in "gorse_log" volume) and writes the cache file to `/var/lib/gorse/server_cache.data` (mounted in "server_data" volume). The entrypoint for RESTful APIs and Prometheus metrics export is `worker:8087`.

- The worker node synchronizes with the master node at port `8086`, writes the log file to `/var/log/gorse/worker.log` (mounted in "gorse_log" volume) and writes the cache file to `/var/lib/gorse/worker_cache.data` (mounted in "worker_data" volume). The entrypoint for Prometheus metrics export is `worker:8089`.

## Deploy Gorse in Kubernetes (Experimental)

Coming soon.

## Version Compatibility

The version release of Gorse follows [semantic versioning](https://semver.org/) from v0.4.0.

1. Major version is set to 0 during incubating stage.
2. Minor version Y (0.Y.z) indicates there are break changes which are incompatible with lower minor versions or larger minor versions. To upgrade or downgrade between minor versions, additional operations are required, eg., refactor config file or change database schema.
3. Patch version Z (0.y.Z) is used for bug fixes and incremental features. Lower patch version can be upgrade to larger patch version seamlessly. When downgrade patch version, there are no side effects except losing bug fixes and new features in the larger patch version.
