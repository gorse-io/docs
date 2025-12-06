---
icon: java
---

# Java SDK

::: warning

Java SDK正在开发中，后续版本可能会更改API。欢迎贡献代码：https://github.com/gorse-io/gorse4j

:::

[![Maven Central](https://img.shields.io/maven-central/v/io.gorse/gorse-client)](https://mvnrepository.com/artifact/io.gorse/gorse-client)[![GitHub](https://img.shields.io/github/license/gorse-io/gorse4j)](https://github.com/gorse-io/gorse4j)

## 安装

::: code-tabs#install

@tab:active Maven

```xml
<dependency>
    <groupId>io.gorse</groupId>
    <artifactId>gorse-client</artifactId>
    <version>0.5.0</version>
</dependency>
```

@tab Gradle

```groovy
implementation 'io.gorse:gorse-client:0.5.0'
```

@tab SBT

```scala
libraryDependencies += "io.gorse" % "gorse-client" % "0.5.0"
```

@tab Grape

```groovy
@Grapes(
    @Grab(group='io.gorse', module='gorse-client', version='0.5.0')
)
```

@tab Leiningen

```clojure
[io.gorse/gorse-client "0.5.0"]
```

:::

## 用法

```java
import io.gorse.gorse4j.*;

public class Main {

    public static void main(String[] args) {
        // Create a client.
        Gorse client = new Gorse("http://127.0.0.1:8087", "api_key");

        // Insert a user.
        client.insertUser(new User("bob", Map.of(
            "company", "gorse",
            "location", "hangzhou, china"
        )));

        // Insert an item.
        client.insertItem(new Item("gorse-io:gorse", false, Map.of(
            "topics", List.of("recommendation", "machine-learning")
        ), List.of("go"), "2022-02-22", "Gorse is an open-source recommender system."));

        // Insert feedback.
        List<Feedback> feedbacks = List.of(
            new Feedback("star", "bob", "ollama:ollama", 1.0, "2022-02-24"),
            new Feedback("star", "bob", "huggingface:transformers", 1.0, "2022-02-25"),
            new Feedback("star", "bob", "rasbt:llms-from-scratch", 1.0, "2022-02-26"),
            new Feedback("star", "bob", "vllm-project:vllm", 1.0, "2022-02-27"),
            new Feedback("star", "bob", "hiyouga:llama-factory", 1.0, "2022-02-28")
        );
        client.insertFeedback(feedbacks);

        // Get recommendation.
        client.getRecommend("bob");
    }
}
```
