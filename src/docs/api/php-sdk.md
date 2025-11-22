---
icon: php
---
# PHP SDK

::: warning

The PHP SDK is under development, and APIs might be changed in later versions. Pull requests are welcomed: https://github.com/gorse-io/php-gorse

:::

[![Packagist Version](https://img.shields.io/packagist/v/gorse/php-gorse)](https://packagist.org/packages/gorse/php-gorse)[![Packagist Downloads](https://img.shields.io/packagist/dt/gorse/php-gorse)](https://packagist.org/packages/gorse/php-gorse)

## Install

```bash
composer require gorse/php-gorse
```

## Usage

```php
$client = new Gorse("http://127.0.0.1:8087/", "api_key");

$rowsAffected = $client->insertFeedback([
    new Feedback("star", "bob", "vuejs:vue", "2022-02-24"),
    new Feedback("star", "bob", "d3:d3", "2022-02-25"),
    new Feedback("star", "bob", "dogfalo:materialize", "2022-02-26"),
    new Feedback("star", "bob", "mozilla:pdf.js", "2022-02-27"),
    new Feedback("star", "bob", "moment:moment", "2022-02-28")
]);

$client->getRecommend('10');
```
