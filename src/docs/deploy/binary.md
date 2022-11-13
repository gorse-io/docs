---
icon: console
---
# Binary Deployment

For single node deployment, the gorse-in-one single binary can be used.

::: warning
For the multi-nodes scenario, binary deployment is not recommended.
:::

## Prerequisites

Gorse depends on following software:

- Cache storage database, one of *MySQL*, *PostgreSQL*, *MongoDB* or *Redis*.
- Data storage database, one of *MySQL*, *PostgreSQL*, *ClickHouse* or *MongoDB*.

The minimal versions of dependent software are as follows:

| Software    | Minimal Version | Compatible Product |
|-------------|-----------------|-|
| Redis       | 5.0             | |
| MySQL       | 5.7             | MariaDB >= 10.2 |
| PostgresSQL | 10.0            | |
| ClickHouse  | 21.10           | |
| MongoDB     | 4.0             | |

## Run Gorse-in-one

1. Download Gorse-in-one from GitHub Release.

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

:::

2. Install Gorse-in-one.


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

:::

3. Create a configuration file `config.toml` based on [config.toml.template](https://github.com/gorse-io/gorse/blob/release-0.4/config/config.toml.template).

4. Run Gorse-in-one.

```
gorse -c config.toml 
```

### Flags of Gorse-in-one

There are commend line flags for Gorse-in-one:

| | Flag | Default Value | Description |
|-|-|-|-|
| `-c` | `-c,--config` | | Configuration file path. |
| | `--debug` | | Debug log mode. |
| `-h` | `--help` | | Help for gorse-in-one. |
| | `--log-path` | | Log file path. |
| | `--master-cache-path` | `master_cache.data` | Master node cache path. |
| | `--playground` | | Playground mode. |
| `-v` | `--version` | | Gorse version. |
| | `--worker-cache-path` | `worker_cache.data` | Worker node cache path. |
| | `--worker-jobs` | `1` |  Worker node working jobs. |

## Setup Systemd

1. Copy Gorse-in-one binary to `/usr/local/bin` and configuration files to `/etc/gorse`:

```bash
sudo cp ./gorse-in-one /usr/local/bin/gorse
sudo cp config.toml /etc/gorse/
```

2. Create the systemd configuration file at `/etc/systemd/system/gorse.service`:

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

3. After that you're supposed to reload systemd:

```bash
sudo systemctl daemon-reload
```

4. Launch Gorse-in-one on system startup with:

```bash
sudo systemctl enable gorse
```

5. Launch Gorse-in-one immediately with:

```bash
sudo systemctl start gorse
```

6. Check the health and logs of Gorse-in-one with:

```bash
systemctl status clash
```
