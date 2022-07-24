# Setup Monitoring Infrastructures

This section demonstrates how to setup monitoring infrastructures in three steps:

1. *Scrape and store logs.* The mainstream log monitoring solutions are ELK and Loki. Loki is chosen in this section because it is more lightweight compared to ELK.
2. *Scrape and store metrics.* Prometheus is used for metrics monitoring.
3. *Monitoring via Grafana.* Monitoring from metrics and logs in Grafana.

![dashboard-logs-preview](../img/ch3/gorse_rev1.png)

## Monitoring in Docker Compose 

There is a `docker-compose.yml` example as follows.

1. The HTTP port of workers, servers and the master should be exported for Prometheus.
2. The logs of workers, servers and the master should be written to files. 
3. Metrics are scraped by Prometheus.
3. Logs are scraped by Promtail and pushed to Loki.
5. Grafana loads data sources and dashboards from provision files.

```yaml
version: "3"
services:
  # ...
  worker:
    image: zhenghaoz/gorse-worker:nightly
    restart: unless-stopped
    ports:
      # Export HTTP Port for Prometheus.
      - 8089:8089
    command: >
      --master-host master --master-port 8086 
      --http-host 0.0.0.0 --http-port 8089
      --log-path /var/log/gorse/worker.log 
      --cache-path /var/lib/gorse/worker_cache.data
    volumes:
      # Write logs to a file in the volume.
      - log_data:/var/log/gorse
      - worker_data:/var/lib/gorse
    depends_on:
      - master

  server:
    image: zhenghaoz/gorse-server:nightly
    restart: unless-stopped
    ports:
      # Export HTTP Port for Prometheus.
      - 8087:8087
    environment:
      GORSE_CACHE_STORE: redis://redis:6379/0
      GORSE_DATA_STORE: mysql://gorse:gorse_pass@tcp(mysql:3306)/gorse?parseTime=true
    command: >
      --master-host master --master-port 8086 
      --http-host 0.0.0.0 --http-port 8087
      --log-path /var/log/gorse/server.log 
      --cache-path /var/lib/gorse/server_cache.data
    volumes:
      # Write logs to a file in the volume.
      - log_data:/var/log/gorse
      - server_data:/var/lib/gorse
    depends_on:
      - master

  master:
    image: zhenghaoz/gorse-master:nightly
    restart: unless-stopped
    ports:
      - 8086:8086
      # Export HTTP Port for Prometheus.
      - 8088:8088
    environment:
      GORSE_CACHE_STORE: redis://redis:6379
      GORSE_DATA_STORE: mysql://gorse:gorse_pass@tcp(mysql:3306)/gorse?parseTime=true
      GORSE_DASHBOARD_USER_NAME: ${GORSE_DASHBOARD_USER_NAME}
      GORSE_DASHBOARD_PASSWORD: ${GORSE_DASHBOARD_PASSWORD}
    command: >
      -c /etc/gorse/config.toml 
      --log-path /var/log/gorse/master.log 
      --cache-path /var/lib/gorse/master_cache.data
    volumes:
      - ./config.toml:/etc/gorse/config.toml
      # Write logs to a file in the volume.
      - log_data:/var/log/gorse
      - master_data:/var/lib/gorse
    depends_on:
      - redis
      - mysql

  prometheus:
    image: prom/prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    expose:
      - 9090

  grafana:
    image: grafana/grafana:8.4.6
    restart: unless-stopped
    environment:
      PROMETHEUS_HOST: prometheus
      PROMETHEUS_PORT: 9090
      LOKI_HOST: loki
      LOKI_PORT: 3100
    volumes:
      - grafana_data:/var/lib/grafana
      # Grafana loads data sources and dashboards from provision files.
      - ./provisioning:/etc/grafana/provisioning
    ports:
      - 3000:3000

  loki:
    image: grafana/loki:2.3.0
    restart: unless-stopped
    command: -config.file=/etc/loki/local-config.yaml
    ports:
      - 3100:3100
    volumes:
      - ./loki.yaml:/etc/loki/local-config.yaml

  promtail:
    image: grafana/promtail
    restart: unless-stopped
    command: -config.file=/etc/promtail/config.yml
    ports:
      - 9080:9080
    volumes:
      - log_data:/var/log/gorse
      - ./promtail.yml:/etc/promtail/config.yml

volumes:
  mysql_data:
  worker_data:
  server_data:
  master_data:
  log_data:
  prometheus_data:
  grafana_data:
```

Configuration files and provision files could be downloaded from [GitRec source](https://github.com/zhenghaoz/gitrec).

<details>
<summary><code>prometheus.yml</code></summary>

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name:       'gorse'
    static_configs:
      - targets: ['worker:8089', 'server:8087', 'master:8088']
```

</details>

<details>
<summary><code>promtail.yml</code></summary>

```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /var/log/positions.yaml # This location needs to be writeable by Promtail.

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: system
    static_configs:
    - targets:
        - localhost
      labels:
        job: gorse
        __path__: /var/log/gorse/*.log
    pipeline_stages:
    - json:
        expressions:
          level: level
          ts: ts
    - labels:
        level:
    - timestamp:
        source: ts
        format: Unix
```

</details>


<details>
<summary><code>loki.yaml</code></summary>

```yaml
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    address: 127.0.0.1
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1
    final_sleep: 0s
  chunk_idle_period: 5m
  chunk_retain_period: 30s

schema_config:
  configs:
    - from: 2020-05-15
      store: boltdb
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 168h

storage_config:
  boltdb:
    directory: /tmp/loki/index

  filesystem:
    directory: /tmp/loki/chunks

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h
```

</details>

<details>
<summary><code>provisioning/dashboards/dashboards.yml</code></summary>

```yaml
apiVersion: 1

providers:
- name: 'Default'
  folder: ''
  type: file
  options:
    path: /etc/grafana/provisioning/dashboards/
```

</details>

<details>
<summary><code>provisioning/dashboards/gorse_rev1.json</code></summary>

[Download link](https://raw.githubusercontent.com/zhenghaoz/gitrec/master/provisioning/dashboards/gorse_rev1.json)

</details>

<details>
<summary><code>provisioning/datasources/loki.yml</code></summary>

```yaml
apiVersion: 1

datasources:
- name: Loki
  type: loki
  url: http://$LOKI_HOST:$LOKI_PORT
```

</details>

<details>
<summary><code>provisioning/datasources/prometheus.yml</code></summary>

```yaml
apiVersion: 1

datasources:
- name: Prometheus
  type: prometheus
  url: http://$PROMETHEUS_HOST:$PROMETHEUS_PORT
```

</details>
