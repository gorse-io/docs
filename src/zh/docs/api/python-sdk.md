---
icon: python
---

# Python SDK

::: warning

Python SDK 正在开发中，后续版本可能会更改API。欢迎贡献代码：https://github.com/gorse-io/PyGorse

:::

[](https://pypi.org/project/PyGorse/)![PyPI](https://img.shields.io/pypi/v/pygorse)

## 安装

- 选项 1：从 PyPI 安装：

```bash
pip install PyGorse
```

- 选项 2：从源代码安装：

```bash
git clone https://github.com/gorse-io/PyGorse.git
cd PyGorse
pip install .
```

## 用法

默认客户端`Gorse`是阻塞客户端。

```python
from gorse import Gorse

# Create a blocking client.
client = Gorse('http://127.0.0.1:8087', 'api_key')

# Insert feedbacks.
client.insert_feedbacks([
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'vuejs:vue', 'Timestamp': '2022-02-24' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'd3:d3', 'Timestamp': '2022-02-25' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'dogfalo:materialize', 'Timestamp': '2022-02-26' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'mozilla:pdf.js', 'Timestamp': '2022-02-27' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'moment:moment', 'Timestamp': '2022-02-28' }
])

# Get recommendation.
client.get_recommend('bob', n=10)
```

`AsyncGorse`是一个异步客户端。

```python
import asyncio

from gorse import AsyncGorse

async def main():
    # Create an async client.
    client = AsyncGorse('http://127.0.0.1:8087', 'api_key')

    # Insert feedbacks.
    client.insert_feedbacks([
        { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'vuejs:vue', 'Timestamp': '2022-02-24' },
        { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'd3:d3', 'Timestamp': '2022-02-25' },
        { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'dogfalo:materialize', 'Timestamp': '2022-02-26' },
        { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'mozilla:pdf.js', 'Timestamp': '2022-02-27' },
        { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'moment:moment', 'Timestamp': '2022-02-28' }
    ])

    # Get recommendation.
    client.get_recommend('bob', n=10)

asyncio.run(main())
```
