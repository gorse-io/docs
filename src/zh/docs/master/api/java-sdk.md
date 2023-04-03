---
icon: java
---

# Java SDK

::: warning

Java SDK正在开发中，后续版本可能会更改API。欢迎贡献代码：https://github.com/gorse-io/gorse4j

:::

[](https://mvnrepository.com/artifact/io.gorse/gorse-client)![Maven Central](https://img.shields.io/maven-central/v/io.gorse/gorse-client)

## 安装

::: code-tabs#install

@tab:active Maven

```xml
<dependency>
    <groupId>io.gorse</groupId>
    <artifactId>gorse-client</artifactId>
    <version>0.4.0</version>
</dependency>
```

@tab Gradle

```groovy
implementation 'io.gorse:gorse-client:0.4.0'
```

@tab SBT

```scala
libraryDependencies += "io.gorse" % "gorse-client" % "0.4.0"
```

@tab Grape

```groovy
@Grapes(
    @Grab(group='io.gorse', module='gorse-client', version='0.4.0')
)
```

@tab Leiningen

```clojure
[io.gorse/gorse-client "0.4.0"]
```

:::

## 用法

```java
import io.gorse.gorse4j.*;

public class Main {

    public static void main(String[] args) {
        // Create a client.
        Gorse client = new Gorse("http://127.0.0.1:8087", "api_key");

        // Insert feedback.
        List<Feedback> feedbacks = List.of(
                new Feedback("read", "100", "300", "2022-11-20T13:55:27Z"),
                new Feedback("read", "100", "400", "2022-11-20T13:55:27Z")
        );
        client.insertFeedback(feedbacks);

        // Get recommendation.
        client.getRecommend("100");
    }
}
```
