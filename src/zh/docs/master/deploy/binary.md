---
icon: console
---

# 二进制部署

单节点部署时，可以使用 gorse-in-one 这个独立的二进制文件。

::: warning

对于多节点场景，不推荐二进制部署。

::::

## 前提条件

Gorse 依赖于以下软件：

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

## 运行gorse-in-one

1. 从 GitHub Release 下载 gorse-in-one。

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
Invoke-WebRequest https://github.com/gorse-io/gorse/releases/latest/download/gorse_windows_amd64.zip -OutFile gorse.zip

# For arm64 CPU:
Invoke-WebRequest https://github.com/gorse-io/gorse/releases/latest/download/gorse_windows_arm64.zip -OutFile gorse.zip
```

::::

1. 安装 gorse-in-one

::: code-tabs#download

@tab:active Linux

```bash
sudo unzip gorse.zip -d /usr/local/bin
```

@tab macOS

```bash
sudo unzip gorse.zip -d /usr/local/bin
```

@tab Windows

```powershell
# Create install directory
New-Item -Type Directory -Path $env:ProgramFiles/Gorse/bin

# Extract binaries
Expand-Archive gorse.zip -DestinationPath $env:ProgramFiles/Gorse/bin
```

:::

1. 基于[配置文件模板](https://github.com/gorse-io/gorse/blob/release-0.4/config/config.toml) 创建配置文件 `config.toml`

2. 运行gorse-in-one

::: code-tabs#download

@tab:active Linux

```bash
gorse-in-one -c config.toml
```

@tab macOS

```bash
gorse-in-one -c config.toml
```

@tab Windows

```powershell
& $env:ProgramFiles/Gorse/bin/gorse-in-one -c config.toml
```

:::

### Gorse-in-one 的参数

Gorse-in-one的命令行参数如下：

<fonticon icon="rightarrow"></fonticon> | 标志 | 默认值 | 描述
--- | --- | --- | ---
`-c` | `-c,--config` |  | 配置文件路径
 | `--debug` |  | 调试日志模式
`-h` | `--help` |  | 显示帮助信息
 | `--log-path` |  | 日志文件路径
 | `--log-max-size` |  | 日志文件的最大兆字节数
 | `--log-max-age` |  | 保留旧日志文件的最大天数
 | `--log-max-backups` |  | 保留的旧日志文件的最大数量
 | `--master-cache-path` | `master_cache.data` | 主节点缓存路径
 | `--playground` |  | playground模式
`-v` | `--version` |  | 显示版本信息
 | `--worker-cache-path` | `worker_cache.data` | 工作节点缓存路径
 | `--worker-jobs` | `1` | 工作节点工作线程数

## 配置 Systemd (Linux)

1. 为日志文件和缓存文件创建目录。

```bash
sudo mkdir -p /etc/gorse/
sudo mkdir -p /var/log/gorse/
sudo mkdir -p /var/lib/gorse/
```

1. 将配置文件复制到`/etc/gorse` ：

```bash
sudo mv config.toml /etc/gorse/
```

1. 在`/etc/systemd/system/gorse.service`创建 systemd 配置文件：

```systemd
[Unit]
Description=Gorse, an open source recommender system service written in Go.
After=network.target

[Service]
Type=simple
Restart=always
ExecStart=/usr/local/bin/gorse-in-one -c /etc/gorse/config.toml \
    --log-path /var/log/gorse/gorse.log \
    --cache-path /var/lib/gorse/gorse.data

[Install]
WantedBy=multi-user.target
```

1. 然后重新加载systemd：

```bash
sudo systemctl daemon-reload
```

1. 在系统启动的同时启动 gorse-in-one：

```bash
sudo systemctl enable gorse
```

1. 立即启动 gorse-in-one：

```bash
sudo systemctl start gorse
```

1. 检查 gorse-in-one 的运行状态和日志：

```bash
systemctl status gorse
```

## 配置服务 (Windows)

::: warning

在 Windows 上创建 Gorse 服务需要安装[NSSM](https://nssm.cc/) 。

:::

1. 为日志文件和缓存文件创建目录。

```powershell
New-Item -Type Directory -Path $env:ProgramFiles/Gorse/log
New-Item -Type Directory -Path $env:ProgramFiles/Gorse/data
```

1. 将配置文件复制到`C:/Program Files/Gorse/bin` ：

```powershell
Move-Item config.toml -Destination $env:ProgramFiles/Gorse/bin
```

1. 使用[NSSM](https://nssm.cc/)创建服务。

```powershell
nssm install Gorse $env:ProgramFiles\Gorse\bin\gorse-in-one.exe
nssm set Gorse AppParameters -c bin\config.toml --cache-path data\gorse.data
nssm set Gorse AppDirectory $env:ProgramFiles\Gorse
nssm set Gorse AppStdout $env:ProgramFiles\Gorse\log\gorse.log
nssm set Gorse AppStderr $env:ProgramFiles\Gorse\log\gorse.log
nssm start Gorse
```
