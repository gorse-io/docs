---
icon: rust
---

# Rust SDK

::: warning

Rust SDK 正在开发中， API 可能会在以后的版本中更改。欢迎参与贡献：https://github.com/gorse-io/gorse-rs

:::

[](https://crates.io/crates/gorse_rs)![Crates.io](https://img.shields.io/crates/v/gorse_rs) [](https://docs.rs/gorse_rs/latest/gorse_rs/)![docs.rs](https://img.shields.io/docsrs/gorse_rs)

## 安装

```toml
[dependencies]
gorse_rs = "0.4.1"
```

## 用法

Rust SDK 实现了两个客户端：异步客户端`gorse_rs::Gorse`和阻塞客户端`gorse_rs::blocking::Gorse` 。

### 异步客户端

异步函数中应该使用异步客户端。

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

### 阻塞客户端

阻塞函数应该使用阻塞客户端。

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
