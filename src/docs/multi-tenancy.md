---
icon: lab
---
# Multi-Tenancy (Beta)

Gorse Manager provides a cloud-native solution to browse, deploy and manage the lifecycle of Gorse instances on a Kubernetes cluster.

## Install

The following steps walk you through the process of deploying Gorse Manager for your cluster.

### Step 1: Install Gorse Manager

Use the official Gorse Manager chart to install the latest version:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add gorse-io https://charts.gorse.io
helm upgrade --name my-release \
  --namespace gorse --create-namespace \
  --install gorse-io/gorse-manager --devel
```

For detailed information on installing, configuring and upgrading Gorse Manager, check out the [chart README](https://github.com/gorse-io/charts/tree/main/charts/gorse-manager).

The above commands deploy Gorse Manager into the gorse namespace in your cluster. It may take a few minutes to run. Once it has been deployed and the Gorse Manager pods are running, continue to step 2.

### Step 2: Create a Demo Credential to Access Kubernetes

To try out Gorse Manager for personal learning, we can create a Kubernetes service account and use that API token to authenticate with the Kubernetes API server via Gorse Manager:

```bash
kubectl create --namespace default serviceaccount gorse-manager
kubectl create clusterrolebinding gorse-manager \
  --clusterrole=cluster-admin \
  --serviceaccount=default:gorse-manager
```

### Step 3: Start the Gorse Manager Dashboard

Once Gorse Manager is installed, securely access the Gorse Manager Dashboard from your system by running:

```bash
kubectl port-forward -n gorse svc/gorse-manager 8888:8888
```

This starts an HTTP proxy for secure access to the Gorse Manager Dashboard. Visit http://127.0.0.1:8888/ in your preferred web browser to open the Dashboard.
