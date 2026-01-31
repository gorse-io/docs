---
title: 文档
icon: explore
---

欢迎阅读 Gorse 推荐系统官方文档。

## 目录

- [快速上手](quick-start.md)
- [部署指南](deploy/)
    - [二进制部署](deploy/binary.md)
    - [Docker 部署](deploy/docker.md)
    - [Kubernetes 部署](deploy/kubernetes.md)
- [配置项](config.md)
- [概念详解](concepts/)
  - [数据源](concepts/data-source.md)
  - [流水线](concepts/pipeline.md)
  - [推荐算法](concepts/recommenders/)
    - [非个性化推荐算法](concepts/recommenders/non-personalized.md)
    - [物品到物品推荐算法](concepts/recommenders/item-to-item.md)
    - [用户到用户推荐算法](concepts/recommenders/user-to-user.md)
    - [协同过滤推荐算法](concepts/recommenders/collaborative.md)
    - [外部推荐API](concepts/recommenders/external.md)
  - [排序](concepts/ranking.md)
  - [放回](concepts/replacement.md)
  - [评估](concepts/evaluation.md)
- [API](api/)
    - [RESTful API](api/restful-api.md)
    - [Go SDK](api/go-sdk.md)
    - [Python SDK](api/python-sdk.md)
    - [TypeScript SDK](api/typescript-sdk.md)
    - [Java SDK](api/java-sdk.md)
    - [Rust SDK](api/rust-sdk.md)
    - [PHP SDK](api/php-sdk.md)
    - [Ruby SDK](api/ruby-sdk.md)
    - [.NET SDK](api/dotnet-sdk.md)
- [控制台](dashboard/overview.md)
- [贡献指南](contribution-guide.md)
- [常见问题](faq.md)

## 贡献指南

您可以从以下任何一项开始帮助改进 Gorse 文档：

- 修复拼写错误或格式（标点符号、空格、缩进、代码块等）
- 修复或更新不适当或过时的描述
- 添加缺失的内容（句子、段落或新文档）
