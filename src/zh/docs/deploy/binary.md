---
icon: console
---

# 二进制部署

For single node deployment, the gorse-in-one single binary can be used.

::: warning For the multi-nodes scenario, binary deployment is not recommended. :::

## Prerequisites

Gorse depends on following software:

- 缓存存储数据库， *MySQL* 、 *PostgreSQL* 、 *MongoDB*或*Redis*之一。
- 数据存储数据库， *MySQL* 、 *PostgreSQL* 、 *ClickHouse*或*MongoDB*之一。

依赖软件的最低版本如下：

软件 | 最小版本 | 兼容产品
--- | --- | ---
Redis | 5.0 |
MySQL | 5.7 | MariaDB &gt;= 10.2
PostgresSQL | 10.0 |
ClickHouse | 21.10 |
MongoDB | 4.0 |

## Run Gorse-in-one

1. 从 GitHub Release 下载 Gorse-in-one。

::: code-tabs#download

@tab:active Linux

```bash
# For amd64 CPU:
wget -O gorse.zip https://github.com/gorse-io/gorse/releases/latest/download/gorse_linux_amd64.zip

# For arm64 CPU:
wget -O gorse.zip https://github.com/gorse-io/gorse/releases/latest/download/gorse_linux_arm64.zip
```

@tab macOS

```bash
# For amd64 CPU:
wget -O gorse.zip https://github.com/gorse-io/gorse/releases/latest/download/gorse_darwin_amd64.zip

# For arm64 CPU:
wget -O gorse.zip https://github.com/gorse-io/gorse/releases/latest/download/gorse_darwin_arm64.zip
```

@tab Windows

```powershell
# For amd64 CPU:
Invoke-WebRequest https://github.com/gorse-io/gorse/releases/latest/download/gorse_darwin_amd64.zip -OutFile gorse.zip

# For arm64 CPU:
Invoke-WebRequest https://github.com/gorse-io/gorse/releases/latest/download/gorse_darwin_arm64.zip -OutFile gorse.zip
```

::::

1. Install Gorse-in-one.

::: code-tabs#download

@tab:active Linux

```bash
unzip gorse.zip

sudo cp gorse/gorse-in-one /usr/local/bin/gorse
```

@tab macOS

```bash
unzip gorse.zip

sudo cp gorse/gorse-in-one /usr/local/bin/gorse
```

@tab Windows

```powershell
Expand-Archive gorse.zip -DestinationPath gorse
```

::::

1. Create a configuration file `config.toml` based on [config.toml.template](https://github.com/gorse-io/gorse/blob/release-0.4/config/config.toml.template).

2. Run Gorse-in-one.

```
gorse -c config.toml
```

### Flags of Gorse-in-one

There are commend line flags for Gorse-in-one:

 | Flag | 默认值 | 描述
--- | --- | --- | ---
`-c` | `-c,--config` |  | 配置文件路径。
 | `--debug` |  | 调试日志模式。
`-h` | `--help` |  | Help for gorse-in-one.
 | `--log-path` |  | 日志文件路径。
 | `--master-cache-path` | `master_cache.data` | 主节点缓存路径。
 | `--playground` |  | Playground mode.
`-v` | `--version` |  | Gorse version.
 | `--worker-cache-path` | `worker_cache.data` | 工作节点缓存路径。
 | `--worker-jobs` | `1` | 工作节点工作作业。

## Setup Systemd

1. 将 Gorse-in-one 二进制文件复制到`/usr/local/bin`并将配置文件复制到`/etc/gorse` ：

```bash
sudo cp ./gorse-in-one /usr/local/bin/gorse
sudo cp config.toml /etc/gorse/
```

1. 在`/etc/systemd/system/gorse.service`创建 systemd 配置文件：

```systemd
[Unit]
Description=Gorse, an open source recommender system service written in Go.
After=network.target

[Service]
Type=simple
Restart=always
ExecStart=/usr/local/bin/gorse -c /etc/gorse/config.toml

[Install]
WantedBy=multi-user.target
```

1. After that you're supposed to reload systemd:

```bash
sudo systemctl daemon-reload
```

1. Launch Gorse-in-one on system startup with:

```bash
sudo systemctl enable gorse
```

1. 立即启动 Gorse-in-one：

```bash
sudo systemctl start gorse
```

1. Check the health and logs of Gorse-in-one with:

```bash
systemctl status clash
```
