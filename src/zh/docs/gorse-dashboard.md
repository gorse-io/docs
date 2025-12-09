# Gorse 控制台

Gorse 的主节点提供了 Gorse 控制台，并可以通过主节点的 HTTP 端口（默认为`8088` ）访问。 HTTP 端口可在配置文件中指定。控制台可以让您观察推荐系统的当前状态，预览用户推荐结果，导入和导出数据。

## 登录页

默认配置允许不登录就可以访问控制台。在配置文件中可以设置登录控制台的用户名和密码。

```toml
[master]

# Username for the master node dashboard.
dashboard_user_name = ""

# Password for the master node dashboard.
dashboard_password = ""
```

设置用户名和密码后，您将在第一次访问控制台时被重定向到登录页面。
