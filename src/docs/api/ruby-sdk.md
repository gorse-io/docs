---
icon: ruby
---
# Ruby SDK

::: warning

The Ruby SDK is under development, and APIs might be changed in later versions. Pull requests are welcomed: https://github.com/gorse-io/gorse-rb

:::

[![Gem](https://img.shields.io/gem/v/gorse)](https://rubygems.org/gems/gorse)[![Gem](https://img.shields.io/gem/dt/gorse)](https://rubygems.org/gems/gorse)

## Install

```bash
gem install gorse
```

## Usage

```ruby
require 'gorse'

client = Gorse.new('http://127.0.0.1:8087', 'api_key')

client.insert_feedback([
    Feedback.new("star", "bob", "vuejs:vue", "2022-02-24"),
    Feedback.new("star", "bob", "d3:d3", "2022-02-25"),
    Feedback.new("star", "bob", "dogfalo:materialize", "2022-02-26"),
    Feedback.new("star", "bob", "mozilla:pdf.js", "2022-02-27"),
    Feedback.new("star", "bob", "moment:moment", "2022-02-28")
])

client.get_recommend('10')
```
