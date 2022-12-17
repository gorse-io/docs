---
icon: console
---

# 二进制部署

当单节点部署时，可以使用 gorse-in-one 这个独立的二进制文件。

::: warning

对于多节点场景，不推荐使用二进制部署。 

:::

## 前提条件

Gorse依赖于以下软件：

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

## 运行Gorse-in-one

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

1. 运行Gorse-in-one

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

1. 基于[配置文件模板](https://github.com/gorse-io/gorse/blob/release-0.4/config/config.toml) 创建配置文件 `config.toml`

2. 运行Gorse-in-one

```
gorse -c config.toml
```

### Gorse-in-one的参数

这是Gorse-in-one的命令行参数：

| | 标志 | 默认值 | 描述
| --- | --- | --- | ---
| `-c` | `-c,--config` |  | 配置文件路径。
| | `--debug` |  | 调试日志模式。
| `-h` | `--help` |  | gorse-in-one的帮助。
| | `--log-path` |  | 日志文件路径。
| | `--master-cache-path` | `master_cache.data` | 主节点缓存路径。
| | `--playground` |  | playground模式。
| `-v` | `--version` |  | gorse版本。
| | `--worker-cache-path` | `worker_cache.data` | 工作节点缓存路径。
| | `--worker-jobs` | `1` | 工作节点工作作业。

## 设置systemd

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

1. 然后重新加载systemd：

```bash
sudo systemctl daemon-reload
```

1. 在系统启动的同时启动Gorse-in-one：

```bash
sudo systemctl enable gorse
```

1. 立即启动 Gorse-in-one：

```bash
sudo systemctl start gorse
```

1. 检查 Gorse-in-one 的运行状态和日志：

```bash
systemctl status clash
```
