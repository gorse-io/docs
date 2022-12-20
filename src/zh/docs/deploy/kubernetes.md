---
icon: kubernetes
---

# Kubernetes 部署

大规模编排或多租户的场景下，建议使用 Kubernetes 部署。

::: warning

The Helm charts is under development, Parameters and default values might be changed in later versions. Pull requests are welcomed: https://github.com/gorse-io/charts/tree/main/charts/gorse

:::

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+
- PV provisioner support in the underlying infrastructure

## Install

To install the chart with the release name `my-release` in the `gorse` namespace:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add gorse-io https://charts.gorse.io
helm upgrade --name my-release --install gorse-io/gorse --create-namespace --namespace gorse --devel
```

The command deploys Gorse on the Kubernetes cluster in the default configuration. The [Parameters](https://github.com/gorse-io/charts/blob/main/charts/gorse/README.md#parameters) section of `README.md` lists the parameters that can be configured during installation.

::: tip

Tou can override the default values by passing `-f ./values.yaml` to the `helm upgrade` command.

:::

## Uninstall

To uninstall/delete the `my-release` deployment in the `gorse` namespace:

```bash
$ helm unistall my-release --namespace gorse
```

The command removes all the Kubernetes components associated with the chart and deletes the release.
