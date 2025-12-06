---
icon: typescript
---

# TypeScript SDK

::: warning

TypeScript SDK 正在开发中，API 可能会在以后的版本中发生变化。欢迎参与贡献：https://github.com/gorse-io/gorse-js

:::

[](https://www.npmjs.com/package/gorsejs)![npm](https://img.shields.io/npm/v/gorsejs)

## 安装

::: code-tabs#install

@tab:active npm

```bash
npm install gorsejs
```

@tab yarn

```bash
yarn add gorsejs
```

:::

## 用法

通过 API 地址和 API 密钥创建客户端。

```js
import { Gorse } from "gorsejs";

// Create the client.
const client = new Gorse({ endpoint: "http://127.0.0.1:8087", secret: "api_key" });

// Insert a user.
await client.insertUser({
    UserId: "bob",
    Labels: {
        company: "gorse",
        location: "hangzhou, china"
    },
    Comment: "Bob is a software engineer."
});

// Insert an item.
await client.insertItem({
    ItemId: "gorse-io:gorse",
    IsHidden: false,
    Labels: {
        topics: ["recommendation", "machine-learning"]
    },
    Categories: ["go"],
    Timestamp: "2022-02-22",
    Comment: "Gorse is an open-source recommender system."
});

// Insert feedbacks.
await client.insertFeedbacks([
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'ollama:ollama' , Value: 1.0, Timestamp: '2022-02-24' },
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'huggingface:transformers' , Value: 1.0, Timestamp: '2022-02-25' },
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'rasbt:llms-from-scratch', Value: 1.0, Timestamp: '2022-02-26' },
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'vllm-project:vllm', Value: 1.0, Timestamp: '2022-02-27' },
    { FeedbackType: 'star', UserId: 'bob', ItemId: 'hiyouga:llama-factory', Value: 1.0, Timestamp: '2022-02-28' }
]);

// Get recommendation.
await client.getRecommend({ userId: 'bob', cursorOptions: { n: 10 } });
```
