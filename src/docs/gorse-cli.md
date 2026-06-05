---
icon: terminal
---

# Gorse CLI

`gorse-cli` is a command line tool for managing Gorse clusters. It provides terminal access to common dashboard and administration operations, including cluster status, task progress, data inspection, recommendation preview, recommendation pipeline configuration, and backup or restore operations.

## Installation

::: code-tabs#install

@tab:active Linux

```bash
curl -fsSL https://gorse.io/install.sh | sh
```

@tab macOS

```bash
brew tap gorse-io/tap
brew install gorse-cli
```

@tab Windows

```powershell
scoop bucket add gorse https://github.com/gorse-io/scoop-bucket
scoop install gorse-cli
```

:::

The install script supports Linux on AMD64, ARM64, and RISCV64, and macOS on ARM64. Windows installation uses [Scoop](https://scoop.sh/). The installed binary is named `gorse-cli`.

## Authentication

Most commands need the Gorse master HTTP endpoint and the admin API key. You can provide them in three ways.

### Save a context

A context stores the endpoint and API key in the system keyring and selects it as the current context:

```bash
gorse-cli context add local --endpoint http://localhost:8088
```

The command prompts for the API key if `--api-key` is not provided. Use the current context for subsequent commands:

```bash
gorse-cli context current
gorse-cli stats
```

Manage contexts with:

```bash
gorse-cli context list
gorse-cli context use local
gorse-cli context delete local
```

### Use environment variables

```bash
export GORSE_ADMIN_ENDPOINT=http://localhost:8088
export GORSE_ADMIN_API_KEY=<api-key>

gorse-cli stats
```

### Pass credentials per command

```bash
gorse-cli stats \
  --endpoint http://localhost:8088 \
  --api-key <api-key>
```

## Cluster and task status

Use these commands to inspect the running cluster:

```bash
# List cluster nodes
gorse-cli cluster-info

# Show global statistics
gorse-cli stats

# List task progress
gorse-cli ps
```

## Data inspection

The `get` commands read users, items, feedback, and categories.

```bash
# List users or items
gorse-cli get users -n 20
gorse-cli get items -n 20

# Get one user or item
gorse-cli get user <user-id>
gorse-cli get item <item-id>

# List item categories
gorse-cli get categories
```

Feedback can be filtered by type, user, and item:

```bash
# Latest feedback records
gorse-cli get feedback -n 20

# Feedback from a user
gorse-cli get feedback --user <user-id>

# Feedback on an item
gorse-cli get feedback --item <item-id>

# Typed feedback for a user-item pair
gorse-cli get feedback --type like --user <user-id> --item <item-id>
```

## Recommendation preview

The `recommend` commands preview dashboard recommendation results from the terminal.

```bash
# Latest items, optionally filtered by category
gorse-cli recommend latest -n 10 --category news

# Non-personalized recommendations by configured recommender name
gorse-cli recommend non-personalized popular -n 10

# Recommendations for a user
gorse-cli recommend item-to-user <user-id> -n 10

# Recommendations for a user from a specific recommender and name
gorse-cli recommend item-to-user <user-id> collaborative similar -n 10

# Item-to-item and user-to-user neighbors
gorse-cli recommend item-to-item similar <item-id> -n 10
gorse-cli recommend user-to-user similar <user-id> -n 10
```

Repeat `--category` to filter by multiple categories:

```bash
gorse-cli recommend item-to-user <user-id> --category news --category sports
```

## Recommendation pipeline configuration

Use `pipeline` commands to view or modify the recommendation pipeline configuration. These commands operate on the `recommend` section of the Gorse configuration.

```bash
# Print the current recommendation pipeline configuration as YAML
gorse-cli pipeline get

# Print the recommendation pipeline JSON schema as YAML
gorse-cli pipeline schema
```

Patch the pipeline with a JSON Patch document:

```bash
# Replace one value
gorse-cli pipeline patch '[{"op":"replace","path":"/cache_size","value":1000}]'

# Replace multiple values
gorse-cli pipeline patch '[{"op":"replace","path":"/cache_size","value":1000},{"op":"replace","path":"/data_source/item_ttl","value":72}]'
```

Reset the recommendation pipeline to the file defaults:

```bash
gorse-cli pipeline reset
```

::: warning
`pipeline reset` overwrites the current pipeline settings. The command asks for confirmation before applying the reset.
:::

## Backup and restore

Export all Gorse data to a binary backup file:

```bash
gorse-cli dump backup.bin
```

Restore data from a backup file:

```bash
gorse-cli restore backup.bin
```

::: warning
`restore` overwrites existing users, items, feedback, and cache data. The command asks for confirmation before restoring.
:::

## Command reference

| Command | Description |
| --- | --- |
| `gorse-cli context add <name>` | Add or update a saved context. |
| `gorse-cli context list` | List saved contexts. |
| `gorse-cli context use <name>` | Switch the current context. |
| `gorse-cli context current` | Show the current context. |
| `gorse-cli context delete <name>` | Delete a saved context. |
| `gorse-cli cluster-info` | List cluster nodes. |
| `gorse-cli stats` | Show global statistics. |
| `gorse-cli ps` | List task progress. |
| `gorse-cli get users` | List users. |
| `gorse-cli get user <user-id>` | Show one user. |
| `gorse-cli get items` | List items. |
| `gorse-cli get item <item-id>` | Show one item. |
| `gorse-cli get feedback` | List or filter feedback. |
| `gorse-cli get categories` | List item categories. |
| `gorse-cli recommend latest` | Get latest items. |
| `gorse-cli recommend non-personalized <name>` | Get non-personalized recommendations. |
| `gorse-cli recommend item-to-user <user-id> [recommender] [name]` | Get recommendations for a user. |
| `gorse-cli recommend item-to-item <name> <item-id>` | Get item-to-item recommendations. |
| `gorse-cli recommend user-to-user <name> <user-id>` | Get user-to-user recommendations. |
| `gorse-cli pipeline get` | Get recommendation pipeline configuration. |
| `gorse-cli pipeline schema` | Get recommendation pipeline schema. |
| `gorse-cli pipeline patch <json-patch>` | Patch recommendation pipeline values. |
| `gorse-cli pipeline reset` | Reset recommendation pipeline to file defaults. |
| `gorse-cli dump <file>` | Dump all Gorse data as a binary backup. |
| `gorse-cli restore <file>` | Restore Gorse data from a binary backup. |

Run `gorse-cli <command> --help` for command-specific flags and examples.
