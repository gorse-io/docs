---
icon: python
---
# Python SDK

::: warning

The Python SDK is under development, and APIs might be changed in later versions. Pull requests are welcomed: https://github.com/gorse-io/PyGorse

:::

[![PyPI](https://img.shields.io/pypi/v/pygorse)](https://pypi.org/project/PyGorse/)[![PyPI - Downloads](https://img.shields.io/pypi/dm/PyGorse)](https://pypi.org/project/PyGorse/)

## Install

- Option 1: Install from PyPI:

```bash
pip install PyGorse
```

- Option 2: Install from source:

```bash
git clone https://github.com/gorse-io/PyGorse.git
cd PyGorse
pip install .
```

## Usage

The default client `Gorse` is the blocking client.

```python
from gorse import Gorse

# Create a blocking client.
client = Gorse('http://127.0.0.1:8087', 'api_key')

# Insert a user.
client.insert_user({
    'UserId': 'bob',
    'Labels': {
        'company': 'gorse',
        'location': 'hangzhou, china'
    },
    'Comment': 'Bob is a software engineer.'
})

# Insert an item.
client.insert_item({
    'ItemId': 'gorse-io:gorse',
    'IsHidden': False,
    'Labels': {
        'topics': ['recommendation', 'machine-learning']
    },
    'Categories': ['go'],
    'Timestamp': '2022-02-22',
    'Comment': 'Gorse is an open-source recommender system.'
})

# Insert feedbacks.
client.insert_feedbacks([
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'ollama:ollama', 'Value': 1.0, 'Timestamp': '2022-02-24' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'huggingface:transformers', 'Value': 1.0, 'Timestamp': '2022-02-25' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'rasbt:llms-from-scratch', 'Value': 1.0, 'Timestamp': '2022-02-26' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'vllm-project:vllm', 'Value': 1.0, 'Timestamp': '2022-02-27' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'hiyouga:llama-factory', 'Value': 1.0, 'Timestamp': '2022-02-28' }
])

# Get recommendation.
client.get_recommend('bob', n=10)
```

`AsyncGorse` is an async client.

```python
import asyncio

from gorse import AsyncGorse

async def main():
    # Create an async client.
    client = AsyncGorse('http://127.0.0.1:8087', 'api_key')

    # Get recommendation.
    await client.get_recommend('bob', n=10)

asyncio.run(main())
```
