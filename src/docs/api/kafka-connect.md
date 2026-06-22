---
icon: Kafka
---
# Kafka Connect

The [`gorse-kafka-connect`](https://github.com/gorse-io/gorse4j/tree/main/gorse-kafka-connect) module provides a Kafka Connect sink connector for importing users, items, and feedback from Kafka topics into Gorse.

## Install the connector

Use Maven to download the connector from Maven Central and copy it, together with its runtime dependencies, to a directory listed by the Kafka Connect worker's `plugin.path`.

```bash
PLUGIN_DIR=/usr/local/share/kafka/plugins/gorse-kafka-connect
VERSION=0.5.1

mkdir -p "$PLUGIN_DIR"
WORK_DIR=$(mktemp -d)

cat > "$WORK_DIR/pom.xml" <<EOF
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>local</groupId>
  <artifactId>gorse-kafka-connect-installer</artifactId>
  <version>1.0.0</version>
  <dependencies>
    <dependency>
      <groupId>io.gorse</groupId>
      <artifactId>gorse-kafka-connect</artifactId>
      <version>${VERSION}</version>
    </dependency>
  </dependencies>
</project>
EOF

mvn -f "$WORK_DIR/pom.xml" dependency:copy-dependencies \
  -DincludeScope=runtime \
  -DoutputDirectory="$PLUGIN_DIR"

rm -rf "$WORK_DIR"
```

Then configure the worker to load the plugin directory:

```properties
plugin.path=/usr/local/share/kafka/plugins
```

Restart the Kafka Connect worker after changing `plugin.path`.

## Create a sink connector

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

## Connector options

| Option | Description |
| --- | --- |
| `gorse.endpoint` | Gorse server endpoint, for example `http://gorse-server:8088`. |
| `gorse.api.key` | API key passed to Gorse. |
| `gorse.entity` | Default entity type for all topics: `user`, `item`, or `feedback`. |
| `topic.<topic>.entity` | Entity type override for a specific topic. |
| `gorse.batch.size` | Maximum records per write request. The default is `500`. |
| `field.<field>` | Global comma-separated source field paths for a Gorse field. |
| `topic.<topic>.field.<field>` | Topic-level source field paths for a Gorse field. |

## Record format

Kafka record values may be JSON objects, JSON arrays, maps, structs, or arrays/collections of records. By default, the connector recognizes both Gorse API field names and common lower-camel or snake-case variants.

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

Use field overrides when Kafka messages use nested or custom names. For example, this maps an `events` topic into Gorse feedback:

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
