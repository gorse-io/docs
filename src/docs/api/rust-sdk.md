---
icon: rust
---
# Rust SDK

::: warning

The Rust SDK is under development, and APIs might be changed in later versions. Pull requests are welcomed: https://github.com/gorse-io/gorse-rs

:::

[![Crates.io](https://img.shields.io/crates/v/gorse_rs)](https://crates.io/crates/gorse_rs)[![docs.rs](https://img.shields.io/docsrs/gorse_rs)](https://docs.rs/gorse_rs/latest/gorse_rs/)[![Crates.io](https://img.shields.io/crates/d/gorse_rs)](https://docs.rs/gorse_rs/latest/gorse_rs/)

## Install

```toml
[dependencies]
gorse_rs = "0.5.0"
```

## Usage

The Rust SDK implements two clients: the async client `gorse_rs::Gorse` and the blocking client `gorse_rs::blocking::Gorse`.

### Async Client

The async client should be used in async functions.

```rust
use gorse_rs::{Feedback, Gorse, User, Item, RecommendOptions};
use serde_json::json;

#[tokio::main]
async fn main() {
    // Create an async client.
    let client = Gorse::new("http://127.0.0.1:8087", "api_key");

    // Insert a user.
    client.insert_user(&User {
        user_id: "bob".into(),
        labels: json!({
            "company": "gorse",
            "location": "hangzhou, china"
        }),
        comment: "Bob is a software engineer.".into(),
    }).await;

    // Insert an item.
    client.insert_item(&Item {
        item_id: "gorse-io:gorse".into(),
        is_hidden: false,
        labels: json!({
            "topics": ["recommendation", "machine-learning"]
        }),
        categories: vec!["go".into()],
        timestamp: "2022-02-22".into(),
        comment: "Gorse is an open-source recommender system.".into(),
    }).await;

    // Insert feedbacks.
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

    // Get recommendation.
    client.get_recommend("bob", RecommendOptions::default()).await;
}
```

### Blocking Client

The blocking client should be used in blocking functions.

```rust
use gorse_rs::{Feedback, User, Item, RecommendOptions};
use gorse_rs::blocking::Gorse;

fn main() {
    // Create a blocking client.
    let client = Gorse::new("http://127.0.0.1:8087", "api_key");

    // Get recommendation.
    client.get_recommend("bob", RecommendOptions::default());
}
```
