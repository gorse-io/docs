---
icon: Kafka
---
# Kafka Connect

::: warning

Kafka Connect is under development. Pull requests are welcomed: https://github.com/gorse-io/gorse4j

:::

[![Maven Central](https://img.shields.io/maven-central/v/io.gorse/gorse-kafka-connect)](https://mvnrepository.com/artifact/io.gorse/gorse-kafka-connect)[![GitHub](https://img.shields.io/github/license/gorse-io/gorse4j)](https://github.com/gorse-io/gorse4j)

## Install the Connector

Download [`io.gorse:gorse-kafka-connect`](https://mvnrepository.com/artifact/io.gorse/gorse-kafka-connect) and place the connector JAR, together with its runtime dependencies, in a directory listed by the Kafka Connect worker's `plugin.path`, for example `/usr/local/share/kafka/plugins/gorse-kafka-connect`.

Then configure the worker to load the plugin directory:

```properties
plugin.path=/usr/local/share/kafka/plugins
```

Restart the Kafka Connect worker after changing `plugin.path`.

## Create a Sink Connector

Use the connector class `io.gorse.gorse4j.connect.GorseSinkConnector`. The connector can infer the target Gorse entity from topic names containing `user`, `item`, or `feedback`; set `gorse.entity` or `topic.<topic>.entity` when the topic name cannot be inferred.

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

## Connector Options

| Option | Description |
| --- | --- |
| `gorse.endpoint` | Gorse server endpoint. |
| `gorse.api.key` | Gorse API key. |
| `gorse.entity` | Default entity type for all topics: `user`, `item`, or `feedback`. |
| `topic.<topic>.entity` | Entity type override for a specific topic. |
| `gorse.batch.size` | Maximum records per write request. The default is `500`. |
| `field.<field>` | Global source field paths for a Gorse field. |
| `topic.<topic>.field.<field>` | Topic-level source field paths for a Gorse field. |
| `field.labels.<labelName>` | Global source field path used to compose labels. |
| `topic.<topic>.field.labels.<labelName>` | Topic-level source field path used to compose labels. |

## Record Format

Kafka record values may be JSON objects, JSON arrays, maps, structs, or arrays/collections of records. By default, the connector recognizes both Gorse record field names and common lower-camel or snake-case variants.

For feedback:

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

For users:

```json
{
  "UserId": "u1",
  "Labels": { "role": "member" },
  "Comment": "optional"
}
```

For items:

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

### Field Mapping

Use field mapping when Kafka messages use nested or custom names.

#### Feedback

For example, this maps an `events` topic into Gorse feedback:

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

#### Users

To insert users from a topic with custom label fields, map each source label path to a Gorse label name:

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

A record from the `profiles` topic can then be written as:

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

The connector writes the record above with `Labels` set to `{ "role": "member", "country": "US", "source": "web" }`.

#### Items

To insert items from a topic with custom labels, map the item ID, label fields, categories, timestamp, and other optional fields as needed:

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

A record from the `products` topic can then be written as:

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

The connector writes the record above with `Labels` set to `{ "brand": "gorse", "category": "book" }`.
