---
icon: kubernetes
---

# Kubernetes 部署

Gorse 为 Kubernetes 部署提供了[Helm Chart](https://artifacthub.io/packages/helm/gorse-io/gorse)。该图表使用[Helm](http://kubernetes.io)包管理器在[Kubernetes](https://helm.sh)集群上启动 Gorse 部署。

Helm Chart 另外包含了[Bitnami MongoDB Chart](https://github.com/bitnami/charts/tree/main/bitnami/mongodb)，该Chart是为满足Gorse应用程序的数据存储需求而引入的。

::: warning

Helm Chart 正在开发中，参数和默认值可能会在以后的版本中更改。欢迎提交PR：https://github.com/gorse-io/charts/tree/main/charts/gorse

:::

## 前提条件

- Kubernetes 1.19+
- Helm 3.2.0+
- 底层基础设施支持 PV provisioner

## 安装 Chart

安装名称为`gorse`的Chart：

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add gorse-io https://charts.gorse.io
helm install gorse gorse-io/gorse
```

该命令会在 Kubernetes 集群上以默认配置部署 Gorse。[参数](#parameters) 部分列出了安装期间可以配置的参数。

::: tip

使用`helm list`列出所有安装的实例

:::

## 卸载 Chart

卸载`gorse`部署：

```bash
helm unistall gorse
```

该命令删除与 chart 关联的所有 Kubernetes 组件并删除 release。

## 参数

参数已列在 Gorse Helm Chart 的 [README.md](https://github.com/gorse-io/charts/tree/main/charts/gorse#parameters) 文件中。

```bash
helm install gorse \
  --set gorse.dashboard.username=admin \
  --set gorse.dashboard.password=password \
  --set gorse.api.key=api_key \
    gorse-io/gorse
```

以上命令将Gorse管理员帐户的用户名和密码分别设置为`admin`和`password`。此外，它还将RESTful API密钥设置为`api_key`。

::: note

一旦部署了此 chart，就无法使用Helm更改应用程序的访问凭据，例如用户名或密码。要在部署后更改这些应用程序凭据，请删除chart使用的任何持久卷（PV），然后重新部署它，或者如果可以，则使用应用程序内置的管理工具。

:::

或者，在安装Chart时可以提供一个指定上述参数值的YAML文件。例如，

```bash
helm install gorse -f values.yaml gorse-io/gorse
```

::: tip

您可以使用默认的 values.yaml 文件。

:::
