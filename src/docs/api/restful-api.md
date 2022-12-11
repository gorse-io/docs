---
icon: http
---
# RESTful APIs

RESTful APIs provided by the Gorse server are listed in this section. For more detailed information, please browse the interactive API document at:

`http://<server_node_IP>:<server_node_port>/apidocs`.

## Authorization

By default, there is no authorization required for RESTful APIs. Authorization can be enabled by set `api_key` in config file. The API key is passed through `X-API-Key` header.

```bash
curl -H "X-API-Key: *****"  http://127.0.0.1:8087/api/recommend/bob?n=10
```

::: tip

The API key is defined in the configuration file:

```toml
[server]

# Secret key for RESTful APIs (SSL required).
api_key = ""
```

:::

@include(./apidocs.md)
