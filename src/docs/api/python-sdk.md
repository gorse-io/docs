---
icon: python
---
# Python SDK

::: warning
The Python SDK is under development, APIs might be changed in later versions. Pull requests are welcomed: https://github.com/gorse-io/PyGorse
:::

## Install

- Install from PyPI:

```bash
pip install PyGorse
```

- Install from source:

```bash
git clone https://github.com/gorse-io/PyGorse.git
cd PyGorse
pip install .
```

## Usage

Create a client by the entrypoint and api key.

```python
from gorse import Gorse

client = Gorse('http://127.0.0.1:8087', 'api_key')
client.insert_feedbacks([
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'vuejs:vue', 'Timestamp': '2022-02-24' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'd3:d3', 'Timestamp': '2022-02-25' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'dogfalo:materialize', 'Timestamp': '2022-02-26' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'mozilla:pdf.js', 'Timestamp': '2022-02-27' },
    { 'FeedbackType': 'star', 'UserId': 'bob', 'ItemId': 'moment:moment', 'Timestamp': '2022-02-28' }
])

client.get_recommend('bob', n=10)
```
