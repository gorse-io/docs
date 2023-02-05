---
icon: console
---
# Binary Deployment

For single node deployment, the gorse-in-one single binary can be used.

::: warning

For the multi-node scenario, binary deployment is not recommended.

:::

## Prerequisites

Gorse depends on the following software:

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
Invoke-WebRequest https://github.com/gorse-io/gorse/releases/latest/download/gorse_windows_amd64.zip -OutFile gorse.zip

# For arm64 CPU:
Invoke-WebRequest https://github.com/gorse-io/gorse/releases/latest/download/gorse_windows_arm64.zip -OutFile gorse.zip
```

:::

2. Install Gorse-in-one.


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

3. Create a configuration file `config.toml` based on [the configuration template](https://github.com/gorse-io/gorse/blob/release-0.4/config/config.toml).

4. Run Gorse-in-one.

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

### Flags of Gorse-in-one

There are command line flags for Gorse-in-one:

| <FontIcon icon="rightarrow"/> | Flag | Default Value | Description |
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

## Setup Systemd (Linux)

1. Create directories for the log file and the cache file.

```bash
sudo mkdir -p /etc/gorse/
sudo mkdir -p /var/log/gorse/
sudo mkdir -p /var/lib/gorse/
```

2. Copy the configuration file to `/etc/gorse`:

```bash
sudo mv config.toml /etc/gorse/
```

3. Create the systemd configuration file at `/etc/systemd/system/gorse.service`:

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

4. After that you're supposed to reload systemd:

```bash
sudo systemctl daemon-reload
```

5. Launch Gorse-in-one on system startup with:

```bash
sudo systemctl enable gorse
```

6. Launch Gorse-in-one immediately with:

```bash
sudo systemctl start gorse
```

7. Check the health and logs of Gorse-in-one with:

```bash
systemctl status gorse
```

## Setup Service (Windows)

::: warning

Gorse service on Windows requires [NSSM](https://nssm.cc/) installed.

:::

1. Create directories for the log file and the cache file.

```powershell
New-Item -Type Directory -Path $env:ProgramFiles/Gorse/log
New-Item -Type Directory -Path $env:ProgramFiles/Gorse/data
```

2. Copy the configuration file to `C:/Program Files/Gorse/bin`:

```powershell
Move-Item config.toml -Destination $env:ProgramFiles/Gorse/bin
```

3. Create service using [NSSM](https://nssm.cc/).

```powershell
nssm install Gorse $env:ProgramFiles\Gorse\bin\gorse-in-one.exe
nssm set Gorse AppParameters -c bin\config.toml --cache-path data\gorse.data
nssm set Gorse AppDirectory $env:ProgramFiles\Gorse
nssm set Gorse AppStdout $env:ProgramFiles\Gorse\log\gorse.log
nssm set Gorse AppStderr $env:ProgramFiles\Gorse\log\gorse.log
nssm start Gorse
```
