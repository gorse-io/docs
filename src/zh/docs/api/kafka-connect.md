---
icon: Kafka
---
# Kafka Connect

::: warning

Kafka Connect正在开发中，欢迎贡献代码：https://github.com/gorse-io/gorse4j

:::

[![Maven Central](https://img.shields.io/maven-central/v/io.gorse/gorse-kafka-connect)](https://mvnrepository.com/artifact/io.gorse/gorse-kafka-connect)[![GitHub](https://img.shields.io/github/license/gorse-io/gorse4j)](https://github.com/gorse-io/gorse4j)

## 安装 connector

下载 [`io.gorse:gorse-kafka-connect:0.5.1`](https://mvnrepository.com/artifact/io.gorse/gorse-kafka-connect/0.5.1)，并将 connector JAR 和运行时依赖放入 Kafka Connect worker 的 `plugin.path` 目录，例如 `/usr/local/share/kafka/plugins/gorse-kafka-connect`。

然后在 worker 配置中加载插件目录：

```properties
plugin.path=/usr/local/share/kafka/plugins
```

修改 `plugin.path` 后需要重启 Kafka Connect worker。

## 创建 sink connector

connector 类名为 `io.gorse.gorse4j.connect.GorseSinkConnector`。当 topic 名称中包含 `user`、`item` 或 `feedback` 时，connector 可以自动推断目标 Gorse 实体；如果无法从 topic 名称推断，请设置 `gorse.entity` 或 `topic.<topic>.entity`。

```bash
curl -X PUT http://localhost:8083/connectors/gorse-feedback-sink/config \
  -H 'Content-Type: application/json' \
  -d '{
    "connector.class": "io.gorse.gorse4j.connect.GorseSinkConnector",
    "tasks.max": "1",
    "topics": "feedback",
    "gorse.endpoint": "http://gorse-server:8088",
    "gorse.api.key": "api_key",
    "gorse.entity": "feedback",
    "gorse.batch.size": "500"
  }'
```

## 配置项

| 配置项 | 说明 |
| --- | --- |
| `gorse.endpoint` | Gorse 服务地址，例如 `http://gorse-server:8088`。 |
| `gorse.api.key` | 发送给 Gorse 的 API key。 |
| `gorse.entity` | 所有 topic 默认使用的实体类型：`user`、`item` 或 `feedback`。 |
| `topic.<topic>.entity` | 指定 topic 的实体类型覆盖配置。 |
| `gorse.batch.size` | 每次写入请求的最大记录数，默认值为 `500`。 |
| `field.<field>` | 全局字段映射，值为逗号分隔的源字段路径。 |
| `topic.<topic>.field.<field>` | 指定 topic 的字段映射，值为逗号分隔的源字段路径。 |
| `field.labels.<labelName>` | 用于构造单个 Gorse label 的全局源字段路径。 |
| `topic.<topic>.field.labels.<labelName>` | 用于构造单个 Gorse label 的指定 topic 源字段路径。 |

## 记录格式

Kafka record value 可以是 JSON 对象、JSON 数组、map、struct，或记录数组/集合。默认情况下，connector 会识别 Gorse API 字段名以及常见的 lower-camel 和 snake-case 变体。

反馈示例：

```json
{
  "FeedbackType": "click",
  "UserId": "u1",
  "ItemId": "i1",
  "Value": 1,
  "Timestamp": "2024-01-01T00:00:00Z",
  "Labels": { "source": "kafka" },
  "Comment": "optional"
}
```

用户示例：

```json
{
  "UserId": "u1",
  "Labels": { "role": "member" },
  "Comment": "optional"
}
```

物品示例：

```json
{
  "ItemId": "i1",
  "IsHidden": false,
  "Labels": { "category": "book" },
  "Categories": ["book"],
  "Timestamp": "2024-01-01T00:00:00Z",
  "Comment": "optional"
}
```

如果 Kafka 消息使用嵌套字段或自定义字段名，可以使用字段映射覆盖默认路径。例如，将 `events` topic 映射为 Gorse 反馈：

```json
{
  "connector.class": "io.gorse.gorse4j.connect.GorseSinkConnector",
  "tasks.max": "1",
  "topics": "events",
  "gorse.endpoint": "http://gorse-server:8088",
  "gorse.api.key": "api_key",
  "topic.events.entity": "feedback",
  "topic.events.field.feedback_type": "event.type",
  "topic.events.field.user_id": "user.id",
  "topic.events.field.item_id": "item.id",
  "topic.events.field.value": "score"
}
```

如果需要从自定义 label 字段的 topic 写入用户，可以将每个源 label 路径映射到 Gorse label 名称：

```json
{
  "connector.class": "io.gorse.gorse4j.connect.GorseSinkConnector",
  "tasks.max": "1",
  "topics": "profiles",
  "gorse.endpoint": "http://gorse-server:8088",
  "gorse.api.key": "api_key",
  "topic.profiles.entity": "user",
  "topic.profiles.field.user_id": "profile.id",
  "topic.profiles.field.labels.role": "profile.role",
  "topic.profiles.field.labels.country": "profile.country",
  "topic.profiles.field.labels.source": "context.source",
  "topic.profiles.field.comment": "profile.bio"
}
```

`profiles` topic 中的记录可以写成：

```json
{
  "profile": {
    "id": "u1",
    "role": "member",
    "country": "US",
    "bio": "optional"
  },
  "context": {
    "source": "web"
  }
}
```

connector 会将上面的记录写入为 `Labels` 等于 `{ "role": "member", "country": "US", "source": "web" }` 的用户。

如果需要从自定义 label 字段的 topic 写入物品，可以按需映射物品 ID、label 字段、分类、时间戳和其他可选字段：

```json
{
  "connector.class": "io.gorse.gorse4j.connect.GorseSinkConnector",
  "tasks.max": "1",
  "topics": "products",
  "gorse.endpoint": "http://gorse-server:8088",
  "gorse.api.key": "api_key",
  "topic.products.entity": "item",
  "topic.products.field.item_id": "product.id",
  "topic.products.field.labels.brand": "product.brand",
  "topic.products.field.labels.category": "product.category",
  "topic.products.field.categories": "product.categories",
  "topic.products.field.timestamp": "product.created_at",
  "topic.products.field.comment": "product.description"
}
```

`products` topic 中的记录可以写成：

```json
{
  "product": {
    "id": "i1",
    "brand": "gorse",
    "category": "book",
    "categories": ["book"],
    "created_at": "2024-01-01T00:00:00Z",
    "description": "optional"
  }
}
```

connector 会将上面的记录写入为 `Labels` 等于 `{ "brand": "gorse", "category": "book" }` 的物品。
