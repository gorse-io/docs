---
icon: rust
---
# Rust SDK

::: warning
The Rust SDK is under development, APIs might be changed in later versions. Pull requests are welcomed: https://github.com/gorse-io/gorse-rs
:::

[![Crates.io](https://img.shields.io/crates/v/gorse_rs)](https://crates.io/crates/gorse_rs)
[![docs.rs](https://img.shields.io/docsrs/gorse_rs)](https://docs.rs/gorse_rs/latest/gorse_rs/)

## Install

```toml
[dependencies]
gorse_rs = "0.4.1"
```

## Example

The Rust SDK implements two client: the async client `gorse_rs::Gorse` and the blocking client `gorse_rs::blocking::Gorse`.

### Async Client

The async client should be used in async functions.

```rust
use gorse_rs::{Feedback, Gorse};

#[tokio::main]
async fn main() {
    // Create an async client.
    let client = Gorse::new("http://127.0.0.1:8087", "api_key");

    // Insert feedbacks.
    let feedback = vec![
        Feedback::new("star", "bob", "vuejs:vue", "2022-02-24"),
        Feedback::new("star", "bob", "d3:d3", "2022-02-25"),
        Feedback::new("star", "bob", "dogfalo:materialize", "2022-02-26"),
        Feedback::new("star", "bob", "mozilla:pdf.js", "2022-02-27"),
        Feedback::new("star", "bob", "moment:moment", "2022-02-28")
    ];
    client.insert_feedback(&feedback).await;

    // Get recommendation.
    client.get_recommend("100").await;
}
```

### Blocking Client

The blocking client should be used in blocking functions.

```rust
use gorse_rs::Feedback;
use gorse_rs::blocking::Gorse;

fn main() {
    // Create a blocking client.
    let client = Gorse::new("http://127.0.0.1:8087", "api_key");

    // Insert feedbacks.
    let feedback = vec![
        Feedback::new("star", "bob", "vuejs:vue", "2022-02-24"),
        Feedback::new("star", "bob", "d3:d3", "2022-02-25"),
        Feedback::new("star", "bob", "dogfalo:materialize", "2022-02-26"),
        Feedback::new("star", "bob", "mozilla:pdf.js", "2022-02-27"),
        Feedback::new("star", "bob", "moment:moment", "2022-02-28")
    ];
    client.insert_feedback(&feedback);

    // Get recommendation.
    client.get_recommend("100");
}
```
