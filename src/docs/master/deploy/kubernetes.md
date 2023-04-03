---
icon: kubernetes
---
# Kubernetes Deployment

A [Helm chart](https://artifacthub.io/packages/helm/gorse-io/gorse) provided for kubernetes deployment. The chart bootstraps a Gorse deployment on a [Kubernetes](http://kubernetes.io) cluster using the [Helm](https://helm.sh) package manager.

It also packages the [Bitnami MongoDB chart](https://github.com/bitnami/charts/tree/main/bitnami/mongodb) which is required for bootstrapping a MongoDB deployment for the database requirements of the Gorse application.

::: warning

The Helm chart is under development, Parameters and default values might be changed in later versions. Pull requests are welcomed: https://github.com/gorse-io/charts/tree/main/charts/gorse

:::

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+
- PV provisioner support in the underlying infrastructure

## Installing the Chart

To install the chart with the release name `gorse`:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add gorse-io https://charts.gorse.io
helm install gorse gorse-io/gorse
```

The command deploys Gorse on the Kubernetes cluster in the default configuration. The [Parameters](#parameters) section lists the parameters that can be configured during installation.

::: tip

List all releases using `helm list`

:::

## Uninstalling the Chart

To uninstall/delete the `gorse` deployment:

```bash
helm unistall gorse
```

The command removes all the Kubernetes components associated with the chart and deletes the release.

## Parameters

Parameters have been listed in the [README.md](https://github.com/gorse-io/charts/tree/main/charts/gorse#parameters) file of Gorse Helm chart.

```bash
helm install gorse \
  --set gorse.dashboard.username=admin \
  --set gorse.dashboard.password=password \
  --set gorse.api.key=api_key \
    gorse-io/gorse
```

The above command sets the Gorse administrator account username and password to `admin` and `password` respectively. Additionally, it sets the RESTful API key to `api_key`.

::: note

Once this chart is deployed, it is not possible to change the application's access credentials, such as usernames or passwords, using Helm. To change these application credentials after deployment, delete any persistent volumes (PVs) used by the chart and re-deploy it, or use the application's built-in administrative tools if available.

:::

Alternatively, a YAML file that specifies the values for the above parameters can be provided while installing the chart. For example,

```bash
helm install gorse -f values.yaml gorse-io/gorse
```

::: tip

You can use the default values.yaml

:::
