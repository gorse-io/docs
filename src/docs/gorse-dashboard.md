---
icon: dashboard
---
# Gorse Dashboard

The master node provides the Gorse dashboard, which can be accessed through the HTTP port (the default value is `8088`) of the master node. The HTTP host and the HTTP port are specified in the [`[master]`](./config#master) section of configuration file.

## Authorization

The default configuration allows access to the console without authorization.

- Username and password: The username and password for the dashboard can be set In the [`[master]`](./config#master) section of configuration file. A login page will appear when accessing the dashboard if the username and password are set.
::: center
![=x400](../img/login.png)
:::
- OpenID Connect: Enable and config the [`[oidc]`](./config#oidc) section of configuration file. You will be redirected to the identity provider for authentication when accessing the dashboard if OpenID Connect is enabled.

## Guide

### System Overview

In the "Overview" page of the dashboard, you can view the overall status of the system, including:
- The number of users, items, and feedback.
- NDCG, precision and recall of the collaborative filtering recommender.
- AUC, precision and recall of the ranker (factorization machine).
- Non-personalized recommendations and latest items.

### Tasks Status

In the "Tasks" page of the dashboard, you can view the status of all running tasks and completed tasks. The information includes task name, task status, start time, end time, and progress.

### Cluster Status

In the "Cluster" page of the dashboard, you can view the status of all nodes in the cluster, including server nodes and worker nodes. The information includes node type, hostname, UUID and version.

### Users Management

In the "Users" page of the dashboard, users are listed in a table. You can perform the following operations:

- Click the ::view:: button to navigate to the user detail page. In the user detail page, you can view the user details and user neighbors from user-to-user recommenders.

- Click the ::likefill:: button to view the user's feedback and recommendations. In the feedback and recommendations page, you can view the user's feedback history and recommended items from various recommenders.

- Click the ::delete:: button to delete the user.

### Items Management

In the "Items" page of the dashboard, items are listed in a table. You can perform the following operations:

- Click the ::view:: button to navigate to the item detail page. In the item detail page, you can view the item details and item neighbors from item-to-item recommenders.

- Click the ::delete:: button to delete the item.

### Advance Operations

In the advance page of the dashboard, you can perform the following operations:

| Operation   | Instruction                                                                  |
|-------------|------------------------------------------------------------------------------|
| Export User | Click the "Export User" button to export all user data as a JSON lines file. |
| Export Item | Click the "Export Item" button to export all item data as a JSON lines file. |
| Export Feedback | Click the "Export Feedback" button to export all feedback data as a JSON lines file. |
| Import User | 1. Click the "Import User" button to navigate to the "Import User" page.<br>2. Click "Browse" to select a JSON lines file containing user data.<br>3. Click "Confirm Import" to start importing users from the selected file. |
| Import Item | 1. Click the "Import Item" button to navigate to the "Import Item" page.<br>2. Click "Browse" to select a JSON lines file containing item data.<br>3. Click "Confirm Import" to start importing items from the selected file. |
| Import Feedback | 1. Click the "Import Feedback" button to navigate to the "Import Feedback" page.<br>2. Click "Browse" to select a JSON lines file containing feedback data.<br>3. Click "Confirm Import" to start importing feedback from the selected file. |
| Purge Database | Click the "Purge Database" button to delete all data in the database.<br>This operation is irreversible, so please proceed with caution. |

### System Settings

In the "Settings" page of the dashboard, you can view the system settings.

::: warning
Modification of recommend config through the dashboard is not supported yet. It will be supported in future versions.
:::
