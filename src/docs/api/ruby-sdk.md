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

# Insert a user
client.insert_user({
    'UserId' => 'bob',
    'Labels' => {
        'company' => 'gorse',
        'location' => 'hangzhou, china'
    },
    'Comment' => 'Bob is a software engineer.'
})

# Insert an item
client.insert_item({
    'ItemId' => 'gorse-io:gorse',
    'IsHidden' => false,
    'Labels' => {
        'topics' => ['recommendation', 'machine-learning']
    },
    'Categories' => ['go']
    'Timestamp' => '2022-02-22',
    'Comment' => 'Gorse is an open-source recommender system.'
})

# Insert feedbacks
client.insert_feedback([
    { 'FeedbackType' => 'star', 'UserId' => 'bob', 'ItemId' => 'ollama:ollama' , 'Value' => 1.0, 'Timestamp' => '2022-02-24' },
    { 'FeedbackType' => 'star', 'UserId' => 'bob', 'ItemId' => 'huggingface:transformers' , 'Value' => 1.0, 'Timestamp' => '2022-02-25' },
    { 'FeedbackType' => 'star', 'UserId' => 'bob', 'ItemId' => 'rasbt:llms-from-scratch', 'Value' => 1.0, 'Timestamp' => '2022-02-26' },
    { 'FeedbackType' => 'star', 'UserId' => 'bob', 'ItemId' => 'vllm-project:vllm', 'Value' => 1.0, 'Timestamp' => '2022-02-27' },
    { 'FeedbackType' => 'star', 'UserId' => 'bob', 'ItemId' => 'hiyouga:llama-factory', 'Value' => 1.0, 'Timestamp' => '2022-02-28' }
])

# Get recommendation
client.get_recommend('bob')
```
