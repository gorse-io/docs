---
home: true
icon: home
title: Home
heroImage: /logo.png
heroText: Gorse
tagline: AI powered open-source recommender system engine written in Go
actions:
  - text: Documentation
    link: /docs/
    type: primary

  - text: Live Demo
    link: https://gitrec.gorse.io

features:
  - title: Multi-source
    icon: cluster
    details: Recommend items from latest, user-to-user, item-to-item and collaborative filtering and etc.
    link: docs/concepts/recommenders/

  - title: Multimodal
    icon: si-glyph-multifunction-knife
    details: Support multimodal content (text, images, videos, etc.) via embedding.
    link: docs/concepts/data-source.md#describe-items-via-labels

  - title: AI-powered
    icon: brightness-auto
    details: Support both classical recommenders and LLM-based recommenders.
    link: docs/concepts/ranking.md

  - title: GUI dashboard
    icon: dashboard
    details: Provide GUI dashboard for recommendation pipeline editing, and data management.
    link: docs/dashboard/recflow.md

  - title: RESTful APIs
    icon: http
    details: Expose RESTful APIs for data CRUD and recommendation requests.
    link: docs/api/restful-api.md

  - title: Cross database
    icon: database
    details: Support Redis, MySQL, Postgres, MongoDB, and ClickHouse.
    link: docs/config.md#database

  - title: Online evaluation
    icon: chart
    details: Analyze online recommendation performance from recent user feedback.
    link: docs/concepts/evaluation.md

  - title: Open source
    icon: open-source-fill
    details: The codebase is released under Apache 2 license and driven by the community.
    link: https://github.com/gorse-io/gorse/blob/master/LICENSE

---

Gorse is an AI powered open-source recommender system written in Go. Gorse aims to be a universal open-source recommender system that can be easily integrated into a wide variety of online services. By importing items, users and interaction data into Gorse, the system will automatically train models to generate recommendations for each user.

# Quick Start

The playground mode has been prepared for beginners. Just set up a recommender system for GitHub repositories by following the commands.

```bash
docker run -p 8088:8088 zhenghaoz/gorse-in-one --playground
```

The playground mode will download data from [GitRec](https://gitrec.gorse.io) and import it into Gorse. The dashboard is available at http://localhost:8088.

<Swiper :items="['/img/dashboard/overview.png', '/img/dashboard/tasks.png', '/img/dashboard/recflow.png']" />

After the "Generate item-to-item recommendation" task is completed on the "Tasks" page, try to insert several feedbacks into Gorse. Suppose Bob is a developer who interested in LLM related repositories. We insert his star feedback to Gorse.

::: code-tabs#example

@tab:active HTTP

```bash
read -d '' JSON << EOF
[
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"ollama:ollama\", \"Value\": 1.0, \"Timestamp\": \"2022-02-24\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"huggingface:transformers\", \"Value\": 1.0, \"Timestamp\": \"2022-02-25\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"rasbt:llms-from-scratch\", \"Value\": 1.0, \"Timestamp\": \"2022-02-26\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"vllm-project:vllm\", \"Value\": 1.0, \"Timestamp\": \"2022-02-27\" },
    { \"FeedbackType\": \"star\", \"UserId\": \"bob\", \"ItemId\": \"hiyouga:llama-factory\", \"Value\": 1.0, \"Timestamp\": \"2022-02-28\" }
]
EOF

curl -X POST http://127.0.0.1:8088/api/feedback \
   -H 'Content-Type: application/json' \
   -d "$JSON"
```

@tab Go

```go
import "github.com/zhenghaoz/gorse/client"

gorse := client.NewGorseClient("http://127.0.0.1:8088", "")

gorse.InsertFeedback([]client.Feedback{
    {FeedbackType: "star", UserId: "bob", ItemId: "ollama:ollama", Value: 1.0, Timestamp: "2022-02-24"},
    {FeedbackType: "star", UserId: "bob", ItemId: "huggingface:transformers", Value: 1.0, Timestamp: "2022-02-25"},
    {FeedbackType: "star", UserId: "bob", ItemId: "rasbt:llms-from-scratch", Value: 1.0, Timestamp: "2022-02-26"},
    {FeedbackType: "star", UserId: "bob", ItemId: "vllm-project:vllm", Value: 1.0, Timestamp: "2022-02-27"},
    {FeedbackType: "star", UserId: "bob", ItemId: "hiyouga:llama-factory", Value: 1.0, Timestamp: "2022-02-28"},
})
```

@tab Python

```python
from gorse import Gorse

client = Gorse('http://127.0.0.1:8088', '')

client.insert_feedbacks([
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'ollama:ollama', 'Value': 1.0, 'Timestamp': '2022-02-24' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'huggingface:transformers', 'Value': 1.0, 'Timestamp': '2022-02-25' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'rasbt:llms-from-scratch', 'Value': 1.0, 'Timestamp': '2022-02-26' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'vllm-project:vllm', 'Value': 1.0, 'Timestamp': '2022-02-27' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'hiyouga:llama-factory', 'Value': 1.0, 'Timestamp': '2022-02-28' }
])
```

@tab TypeScript

```javascript
import { Gorse } from "gorsejs";

const client = new Gorse({ endpoint: "http://127.0.0.1:8088", secret: "" });

await client.insertFeedbacks([
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'ollama:ollama', Value: 1.0, Timestamp: '2022-02-24' },
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'huggingface:transformers', Value: 1.0, Timestamp: '2022-02-25' },
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'rasbt:llms-from-scratch', Value: 1.0, Timestamp: '2022-02-26' },
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'vllm-project:vllm', Value: 1.0, Timestamp: '2022-02-27' },
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'hiyouga:llama-factory', Value: 1.0, Timestamp: '2022-02-28' }
]);
```

@tab Java

```java
import io.gorse.gorse4j.*;

Gorse client = new Gorse(GORSE_ENDPOINT, GORSE_API_KEY);

List<Feedback> feedbacks = List.of(
        new Feedback("star", "bob", "ollama:ollama", 1.0, "2022-02-24"),
        new Feedback("star", "bob", "huggingface:transformers", 1.0, "2022-02-25"),
        new Feedback("star", "bob", "rasbt:llms-from-scratch", 1.0, "2022-02-26"),
        new Feedback("star", "bob", "vllm-project:vllm", 1.0, "2022-02-27"),
        new Feedback("star", "bob", "hiyouga:llama-factory", 1.0, "2022-02-28")
);
client.insertFeedback(feedbacks);
```

@tab Rust

```rust
use gorse_rs::{Feedback, Gorse};

let client = Gorse::new("http://127.0.0.1:8088", "");

let feedback = vec![
    Feedback {
        feedback_type: "star".into(),
        user_id: "bob".into(),
        item_id: "ollama:ollama".into(),
        value: 1.0,
        timestamp: "2022-02-24".into(),
    },
    Feedback {
        feedback_type: "star".into(),
        user_id: "bob".into(),
        item_id: "huggingface:transformers".into(),
        value: 1.0,
        timestamp: "2022-02-25".into(),
    },
    Feedback {
        feedback_type: "star".into(),
        user_id: "bob".into(),
        item_id: "rasbt:llms-from-scratch".into(),
        value: 1.0,
        timestamp: "2022-02-26".into(),
    },
    Feedback {
        feedback_type: "star".into(),
        user_id: "bob".into(),
        item_id: "vllm-project:vllm".into(),
        value: 1.0,
        timestamp: "2022-02-27".into(),
    },
    Feedback {
        feedback_type: "star".into(),
        user_id: "bob".into(),
        item_id: "hiyouga:llama-factory".into(),
        value: 1.0,
        timestamp: "2022-02-28".into(),
    },
];
client.insert_feedback(&feedback).await;
```

@tab Ruby

```ruby
require 'gorse'

client = Gorse.new('http://127.0.0.1:8088', 'api_key')

client.insert_feedback([
    { 'FeedbackType' => 'star', 'UserId' => 'bob', 'ItemId' => 'ollama:ollama' , 'Value' => 1.0, 'Timestamp' => '2022-02-24' },
    { 'FeedbackType' => 'star', 'UserId' => 'bob', 'ItemId' => 'huggingface:transformers' , 'Value' => 1.0, 'Timestamp' => '2022-02-25' },
    { 'FeedbackType' => 'star', 'UserId' => 'bob', 'ItemId' => 'rasbt:llms-from-scratch', 'Value' => 1.0, 'Timestamp' => '2022-02-26' },
    { 'FeedbackType' => 'star', 'UserId' => 'bob', 'ItemId' => 'vllm-project:vllm', 'Value' => 1.0, 'Timestamp' => '2022-02-27' },
    { 'FeedbackType' => 'star', 'UserId' => 'bob', 'ItemId' => 'hiyouga:llama-factory', 'Value' => 1.0, 'Timestamp' => '2022-02-28' }
])
```

@tab PHP

```php
$client = new Gorse("http://127.0.0.1:8088/", "api_key");

$rowsAffected = $client->insertFeedback([
    new Feedback("star", "bob", "ollama:ollama", 1.0, "2022-02-24"),
    new Feedback("star", "bob", "huggingface:transformers", 1.0, "2022-02-25"),
    new Feedback("star", "bob", "rasbt:llms-from-scratch", 1.0, "2022-02-26"),
    new Feedback("star", "bob", "vllm-project:vllm", 1.0, "2022-02-27"),
    new Feedback("star", "bob", "hiyouga:llama-factory", 1.0, "2022-02-28")
]);
```

@tab .NET

```cs
using Gorse.NET;

var client = new Gorse("http://127.0.0.1:8087", "api_key");

client.InsertFeedback(new Feedback[]
{
    new Feedback{FeedbackType="star", UserId="bob", ItemId="ollama:ollama", Value=1.0, Timestamp="2022-02-24"},
    new Feedback{FeedbackType="star", UserId="bob", ItemId="huggingface:transformers", Value=1.0, Timestamp="2022-02-25"},
    new Feedback{FeedbackType="star", UserId="bob", ItemId="rasbt:llms-from-scratch", Value=1.0, Timestamp="2022-02-26"},
    new Feedback{FeedbackType="star", UserId="bob", ItemId="vllm-project:vllm", Value=1.0, Timestamp="2022-02-27"},
    new Feedback{FeedbackType="star", UserId="bob", ItemId="hiyouga:llama-factory", Value=1.0, Timestamp="2022-02-28"},
});
```

:::

Then, fetch 10 recommended items from Gorse.

::: code-tabs#example

@tab:active HTTP

```bash
curl http://127.0.0.1:8088/api/recommend/bob?n=10
```

@tab Go

```go
gorse.GetRecommend("bob", "", 10)
```

@tab Python

```python
client.get_recommend('bob', n=10)
```

@tab TypeScript

```javascript
await client.getRecommend({ userId: 'bob', cursorOptions: { n: 10 } });
```

@tab Java

```java
client.getRecommend("bob");
```

@tab Rust

```rust
client.get_recommend("bob", RecommendOptions::default()).await;
```

@tab Ruby

```ruby
client.get_recommend('bob')
```

@tab PHP

```php
$client->getRecommend('bob');
```

@tab .NET

```cs
client.GetRecommend("bob");
```
