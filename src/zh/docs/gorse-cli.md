---
icon: terminal
---

# Gorse CLI

`gorse-cli` 是用于管理 Gorse 集群的命令行工具。它把常见的控制台和运维操作集成到终端中，包括查看集群状态、任务进度、用户和物品数据、推荐结果、推荐流程配置，以及数据备份和恢复。

## 安装

::: code-tabs#install

@tab:active Linux/macOS

```bash
curl -fsSL https://gorse.io/install.sh | sh
```

@tab Windows

```powershell
irm https://gorse.io/install.ps1 | iex
```

@tab Homebrew

```bash
brew tap gorse-io/tap
brew install gorse-cli
```

@tab Scoop

```powershell
scoop bucket add gorse https://github.com/gorse-io/scoop-bucket
scoop install gorse-cli
```

:::

Bash 安装脚本支持 AMD64、ARM64、RISCV64 架构的 Linux，以及 ARM64 架构的 macOS。PowerShell 安装脚本支持 AMD64 和 ARM64 架构的 Windows。也可以使用 [Homebrew](https://brew.sh/) 或 [Scoop](https://scoop.sh/) 安装 `gorse-cli`。

## 认证

大多数命令都需要 Gorse master 节点的 HTTP 地址和管理员 API 密钥。你可以通过以下三种方式提供认证信息。

### 保存上下文

上下文会把 master 节点地址和 API 密钥保存到本地，并将该上下文设为当前上下文：

```bash
gorse-cli context add local --endpoint http://localhost:8088
```

如果没有传入 `--api-key`，命令会提示输入 API 密钥。后续命令会自动使用当前上下文：

```bash
gorse-cli context current
gorse-cli stats
```

管理上下文：

```bash
gorse-cli context list
gorse-cli context use local
gorse-cli context delete local
```

### 使用环境变量

```bash
export GORSE_ADMIN_ENDPOINT=http://localhost:8088
export GORSE_ADMIN_API_KEY=<api-key>
gorse-cli stats
```

### 在单次命令中传入认证信息

```bash
gorse-cli stats \
  --endpoint http://localhost:8088 \
  --api-key <api-key>
```

## 集群和任务状态

使用以下命令查看正在运行的集群：

```bash
# 列出集群节点
gorse-cli cluster-info

# 查看统计信息
gorse-cli stats

# 查看任务进度
gorse-cli ps
```

## 数据查看

`get` 命令用于读取用户、物品、反馈和类别。

```bash
# 列出用户或物品
gorse-cli get users -n 20
gorse-cli get items -n 20

# 查看单个用户或物品
gorse-cli get user <user-id>
gorse-cli get item <item-id>

# 列出物品类别
gorse-cli get categories
```

反馈可以按类型、用户和物品过滤：

```bash
# 最新反馈记录
gorse-cli get feedback -n 20

# 某个用户的反馈
gorse-cli get feedback --user <user-id>

# 某个物品的反馈
gorse-cli get feedback --item <item-id>

# 某个用户-物品对的指定类型反馈
gorse-cli get feedback --type like --user <user-id> --item <item-id>
```

## 推荐结果预览

`recommend` 命令可以在终端中预览推荐接口的结果。

```bash
# 最新物品，可按分类过滤
gorse-cli recommend latest -n 10 --category news

# 指定名称的非个性化推荐
gorse-cli recommend non-personalized popular -n 10

# 给用户推荐物品
gorse-cli recommend item-to-user <user-id> -n 10

# 使用指定推荐器和名称给用户推荐物品
gorse-cli recommend item-to-user <user-id> collaborative similar -n 10

# 相似物品和相似用户
gorse-cli recommend item-to-item similar <item-id> -n 10
gorse-cli recommend user-to-user similar <user-id> -n 10
```

可以重复传入 `--category` 以按多个类别过滤：

```bash
gorse-cli recommend item-to-user <user-id> --category news --category sports
```

## 推荐流程配置

使用 `pipeline` 命令查看或修改推荐流程配置。这些命令操作的是 Gorse 配置中的 `recommend` 部分。

```bash
# 以 YAML 输出当前推荐流程配置
gorse-cli pipeline get

# 以 YAML 输出推荐流程 JSON Schema
gorse-cli pipeline schema
```

使用 JSON Patch 修改推荐流程：

```bash
# 替换单个配置值
gorse-cli pipeline patch '[{"op":"replace","path":"/cache_size","value":1000}]'

# 替换多个配置值
gorse-cli pipeline patch '[{"op":"replace","path":"/cache_size","value":1000},{"op":"replace","path":"/data_source/item_ttl","value":72}]'
```

把推荐流程重置为配置文件中的默认值：

```bash
gorse-cli pipeline reset
```

::: warning
`pipeline reset` 会覆盖当前推荐流程设置。命令会在执行前请求确认。
:::

## 备份和恢复

把所有 Gorse 数据导出为二进制备份文件：

```bash
gorse-cli dump backup.bin
```

从备份文件恢复数据：

```bash
gorse-cli restore backup.bin
```

::: warning
`restore` 会覆盖现有用户、物品、反馈和缓存数据。命令会在恢复前请求确认。
:::

## 命令参考

| 命令 | 说明 |
| --- | --- |
| `gorse-cli context add <name>` | 添加或更新保存的上下文。 |
| `gorse-cli context list` | 列出保存的上下文。 |
| `gorse-cli context use <name>` | 切换当前上下文。 |
| `gorse-cli context current` | 显示当前上下文。 |
| `gorse-cli context delete <name>` | 删除保存的上下文。 |
| `gorse-cli cluster-info` | 列出集群节点。 |
| `gorse-cli stats` | 显示统计信息。 |
| `gorse-cli ps` | 列出任务进度。 |
| `gorse-cli get users` | 列出用户。 |
| `gorse-cli get user <user-id>` | 显示单个用户。 |
| `gorse-cli get items` | 列出物品。 |
| `gorse-cli get item <item-id>` | 显示单个物品。 |
| `gorse-cli get feedback` | 列出或过滤反馈。 |
| `gorse-cli get categories` | 列出物品类别。 |
| `gorse-cli recommend latest` | 获取最新物品。 |
| `gorse-cli recommend non-personalized <name>` | 获取非个性化推荐。 |
| `gorse-cli recommend item-to-user <user-id> [recommender] [name]` | 给用户推荐物品。 |
| `gorse-cli recommend item-to-item <name> <item-id>` | 获取相似物品。 |
| `gorse-cli recommend user-to-user <name> <user-id>` | 获取相似用户。 |
| `gorse-cli pipeline get` | 获取推荐流程配置。 |
| `gorse-cli pipeline schema` | 获取推荐流程 Schema。 |
| `gorse-cli pipeline patch <json-patch>` | 修改推荐流程配置值。 |
| `gorse-cli pipeline reset` | 重置推荐流程为文件默认值。 |
| `gorse-cli dump <file>` | 把所有 Gorse 数据导出为二进制备份。 |
| `gorse-cli restore <file>` | 从二进制备份恢复 Gorse 数据。 |

运行 `gorse-cli <command> --help` 查看具体命令的参数和示例。
