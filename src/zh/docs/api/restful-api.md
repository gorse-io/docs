---
icon: http
---

# RESTful APIs

本节列出了 Gorse 服务器提供的 RESTful API。如需更多详细信息，请浏览交互式 API 文档：

`http://<server_node_IP>:<server_node_port>/apidocs`.

## 认证

默认配置下，RESTful API 不需要认证。可以通过在配置文件中设置`api_key`来启用认证。 API 密钥通过`X-API-Key`请求头传递。

```bash
curl -H "X-API-Key: *****"  http://127.0.0.1:8087/api/recommend/bob?n=10
```

::: tip

API 密钥在配置文件中设置：

```toml
[server]

# Secret key for RESTful APIs (SSL required).
api_key = ""
```

:::

<!-- @include: ./apidocs.md -->
