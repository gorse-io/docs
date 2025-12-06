---
icon: php
---

# PHP SDK

::: warning

PHP SDK 正在开发中， API 可能会在以后的版本中更改。欢迎参与贡献：https://github.com/gorse-io/php-gorse

:::

[![Packagist Version](https://img.shields.io/packagist/v/gorse/php-gorse)](https://packagist.org/packages/gorse/php-gorse)[![Packagist Downloads](https://img.shields.io/packagist/dt/gorse/php-gorse)](https://packagist.org/packages/gorse/php-gorse)

## 安装

```bash
composer require gorse/php-gorse
```

## 用法

```php
$client = new Gorse("http://127.0.0.1:8087/", "api_key");

// Insert a user
$client->insertUser(new User(
    "bob",
    [
        "company" => "gorse",
        "location" => "hangzhou, china"
    ],
    "Bob is a software engineer."
));

// Insert an item
$client->insertItem(new Item(
    "gorse-io:gorse",
    false,
    [
        "topics" => ["recommendation", "machine-learning"]
    ],
    ["go"],
    "2022-02-22",
    "Gorse is an open-source recommender system."
));

// Insert feedbacks
$rowsAffected = $client->insertFeedback([
    new Feedback("star", "bob", "ollama:ollama", 1.0, "2022-02-24"),
    new Feedback("star", "bob", "huggingface:transformers", 1.0, "2022-02-25"),
    new Feedback("star", "bob", "rasbt:llms-from-scratch", 1.0, "2022-02-26"),
    new Feedback("star", "bob", "vllm-project:vllm", 1.0, "2022-02-27"),
    new Feedback("star", "bob", "hiyouga:llama-factory", 1.0, "2022-02-28")
]);

// Get recommendation
$client->getRecommend('bob');
```
