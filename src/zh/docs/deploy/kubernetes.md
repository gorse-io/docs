---
icon: kubernetes
---

# Kubernetes 部署

大规模编排或多租户的场景下，建议使用 Kubernetes 部署。

::: warning

Helm chart正在开发中，参数和默认值可能会在以后的版本中更改。欢迎贡献代码：https://github.com/gorse-io/charts/tree/main/charts/gorse

:::

## 前提条件

- Kubernetes 1.19+
- Helm 3.2.0+
- 底层基础设施支持 PV provisioner

## 安装

在`gorse`命名空间中安装版本名称为`my-release`的 chart：

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add gorse-io https://charts.gorse.io
helm upgrade --name my-release --install gorse-io/gorse --create-namespace --namespace gorse --devel
```

该命令以默认配置在 Kubernetes 集群上部署 Gorse。 <code>README.md</code>的<a>参数</a>部分列出了可以在安装期间配置的参数。

::: tip

您可以将参数`-f ./values.yaml`传递给`helm upgrade`命令来覆盖默认值。

:::

## 卸载

卸载`gorse`命名空间中的`my-release`部署：

```bash
$ helm unistall my-release --namespace gorse
```

该命令删除与 chart 关联的所有 Kubernetes 组件并删除 release。
