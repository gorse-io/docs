# System Architecture

This chapter will introduce the design of data storage and cache storage, and the division of labor between master nodes, server nodes and worker nodes. RESTful APIs and CLI tools can be found in [RESTful APIs](ch02-03-api.md) and [Commands](ch02-02-command.md).

<center><img src="img/arch.png" height="200"></center>

## Data Storage

The data storage consists of three tables (in MongoDB that's three collections): the items table, the users table, and the feedback table.

- **Items**

| Field Name | Type | Description |
|-|-|-|
| `item_id` | string | Item ID |
| `time_stamp` | time | Item update date |
| `labels` | array of strings | Item labels |

- **Users**

| Field Name | Type | Description |
|-|-|-|
| `user_id` | string | User ID |
| `labels` | array of strings | User labels |

- **Feedback**

| Field Name | Type | Description |
|-|-|-|
| `feedback_type` | string | Feedback type |
| `user_id` | string | User ID |
| `item_id` | string | Item ID |
| `time_stamp` | time | Feedback time |

All operations are performed on these three tables (three collections), with the help of indexes to speed things up if necessary. `feedback_type` specifies the type of feedback: for example, stars, forks, and watches are different types of feedback for GitHub. When inserting feedback, you will encounter that the relevant user or item does not exist in the user and item table. This time `auto_insert_user` and `auto_insert_item` can control the insertion behavior, you can choose to insert the user or item automatically, or you can choose to abort the insertion of feedback.

## Cache Storage

The cache database stores key-value pairs of both key-string and key-list types. A key consists of two parts: a prefix and a name, which in the Redis implementation are stitched together to become the final key. Since all operations on the cache are point queries, the cache store can easily be scaled to a distributed form.

## Master Node

<center><img src="img/master.png" height="320"></center>

The master node is responsible for the following tasks.

- **Metadata/members management:** Manages system configuration and cluster membership, cluster node heartbeat timeout is `cluster_meta_timeout` seconds.
- **Non-personalized matching:** Collecting the latest items and recent popular items, the update frequency is determined by `update_period` in minutes.
- **Cooperative filtering model training:** Train collaborative filtering model every `fit_period` minutes for worker nodes.
- **Ranking model training:** The ranking model is trained every `fit_period` minutes for use by the server nodes.

## Service Node

<center><img src="img/server.png" height="320"></center>

The server node provides two main functions.

- **Exposing RESTful APIs:** The reading and writing of users/items/feedback is done in the form of HTTP requests. The service node receives the HTTP request and then operates on the database and returns the HTTP response.
- **Performs online recommendation:** At this time, the server node reads the matched items from the cache database, then removes duplicate items and items viewed by users, ranks these matched items after obtaining the items and user labels from the database, and then returns the top `n` items. The server node needs to continuously check and update the ranking model in the background.

## Worker Node

<center><img src="img/worker.png" height="240"></center>

The task of the worker node is a bit simpler - it is to generate a personalized collection of matched items for the user. After connecting to the master node, the worker node constantly checks for updates to the collaborative filtering model. Every once in a while (this time is `predict_period`) it pulls the information of all worker nodes in the cluster to calculate the range of user IDs it is responsible for, and then generates matched items for the range of users it is responsible for and writes them to the cache database.
