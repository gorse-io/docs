# Chapter 2: Gorse Development

This chapter introduces how to use the Gorse recommender system, including writing configuration files, starting the system, and using the exposed HTTP interface.

## Preparation

Before using Gorse, the following preparations need to be completed.

- **Database:** Gorse requires two databases, one for data storage and the other for cache storage. The data storage currently supports MySQL and MongoDB, while the cache storage only supports Redis.

- **Hardware:** The Gorse system uses a single machine training and distributed prediction architecture. The master node trains the model and distributes it to server nodes and worker nodes, and multiple server nodes and worker nodes use the trained model for prediction.Gorse recommends the following hardware requirements for the system
  - Processor: Multi-core processors can speed up various tasks by parallel processing.
  - Memory: server nodes and worker nodes need to meet the model storage, master node memory needs to meet the data and model storage.

## Installation

Gorse can be installed in the following different ways

- Download the pre-compiled binary executable from [Release](https://github.com/zhenghaoz/gorse/releases).
- Get images from DockerHub

| Image | Compile Status |
| ------------ | -------- |
| gorse-master | [![](https://img.shields.io/docker/cloud/build/zhenghaoz/gorse-master)](https://hub.docker.com/repository/docker/zhenghaoz/gorse-master) | gorse-server | [!
| gorse-server | [![](https://img.shields.io/docker/cloud/build/zhenghaoz/gorse-server)](https://hub.docker.com/repository/docker/zhenghaoz/gorse-server) | gorse-worker | [!
| gorse-worker | [![](https://img.shields.io/docker/cloud/build/zhenghaoz/gorse-worker)](https://hub.docker.com/repository/docker/zhenghaoz/gorse-worker) | gorse-cli | [!
| gorse-cli | [![](https://img.shields.io/docker/cloud/build/zhenghaoz/gorse-cli)](https://hub.docker.com/repository/docker/zhenghaoz/gorse-cli) |

- Compiling from source

You need to install the Go compiler first, and then use `go get` to install

```
$ go get github.com/zhenghaoz/gorse/...
```

The project code is automatically downloaded locally, and the four programs `gorse-cli`, `gorse-leader`, `gorse-worker` and `gorse-server` are installed in the folder specified by the ` $GOBIN` path.

## Start

First, you need to write a configuration file. The way Gorse works has been described in detail in [Chapter 1](chapter_1.md), refer to [Configuration](ch02-01-config.md) in the document to write the recommender system configuration file as `config.toml`. The section [Commands](ch02-02-command.md) in the documentation describes the usage of each command, and the following commands are used to start Gorse's components one by one.

- **Start the master node**

To start the master node you need to specify the configuration file, and the other nodes get the configuration from the master node.

```bash
$ gorse-master -c config.toml
```

- **Start the worker node**

The worker node needs to specify the host and port of the master node, and the number of working threads.

```bash
$ gorse-worker --master-host 127.0.0.1 --master-port 8086 -j 4
```

- **Start the server node**

The worker node needs to specify the address and port of the master node, in addition to the address and port of the HTTP interface.

```bash
$ gorse-server --master-host 127.0.0.1 --master-port 8086 \
    --host 127.0.0.1 --port 8087
```

## Interact with Gorse

- **Command line tools**

Before using the command line tool ``gorse-cli``, you need to save the host and port information of the master node in the ``~/.gorse/cli.toml`` directory.

```toml
[master]
port = 8086         # master port
host = "127.0.0.1"  # master host
```

**Step 1: Check the cluster status.** 

```bash
$ gorse-cli cluster
+--------+-----------------+
|  ROLE  |     ADDRESS     |
+--------+-----------------+
| master | 127.0.0.1:8086  |
| server | 127.0.0.1:14778 |
| worker | 127.0.0.1:1238  |
+--------+-----------------+
```

The `gorse-cli cluster` command shows the nodes in the cluster. The `ADDRESS` field indicates the address to connect the master node.

**Step 2: Import the item data.** 

Assuming the recommended items are repositories on GitHub, the raw data file `repos.csv` is as follows.

```
01org/cc-oci-runtime,2021-01-25 14:32:01 +0000 UTC,containers|container|docker|kvm|oci|security
02sh/4chanMarkovText,2021-02-08 14:38:55 +0000 UTC,scrapper|data-mining|markov-chain
05bit/peewee-async,2021-01-25 09:35:57 +0000 UTC,peewee|python|asyncio|mysql|postgresql|orm
...
```

Each field from left to right is: repository, update time, tag, then the command line to import the data is

```bash
$ gorse-cli import items repos.csv
+---------------------------------+--------------------------------+--------------------------------+
|             ITEM ID             |           TIMESTAMP            |             LABEL              |
+---------------------------------+--------------------------------+--------------------------------+
| 01org/cc-oci-runtime            | 2021-01-25 14:32:01 +0000      | [containers container          |
|                                 | +0000                          | docker kvm oci security        |
|                                 |                                | virtual-machine                |
|                                 |                                | virtualization]                |
| 02sh/4chanMarkovText            | 2021-02-08 14:38:55 +0000      | [scrapper data-mining          |
|                                 | +0000                          | markov-chain]                  |
+---------------------------------+--------------------------------+--------------------------------+
Import items to database? [Y/n] 
```

The command line tool recognizes the data and confirms that it can be imported into the database.

**Step 3: Import the interactive data.** 

Assuming that the interaction data is the user's likes to the repository, the original data file ``stars.csv`` is as follows.

```
0xAX,0xAX/erlang-bookmarks,2013-08-31 19:48:01 +0000 UTC
0xAX,abo-abo/hydra,2020-12-27 17:35:57 +0000 UTC
0xAX,alebcay/awesome-shell,2015-06-16 17:17:17 +0000 UTC
0xAX,angrave/SystemProgramming,2015-02-22 16:47:33 +0000 UTC
0xAX,binhnguyennus/awesome-scalability,2018-01-27 18:00:00 +0000 UTC
...
```

Each field from left to right is: user, repository, and time of likes. Then the command line to import the data is.

```bash
$ gorse-cli import feedback
+------+---------+-----------------------------------+--------------------------------+
| TYPE | USER ID |              ITEM ID              |           TIMESTAMP            |
+------+---------+-----------------------------------+--------------------------------+
|      | 0xAX    | 0xAX/erlang-bookmarks             | 2013-08-31 19:48:01 +0000      |
|      |         |                                   | +0000                          |
|      | 0xAX    | abo-abo/hydra                     | 2020-12-27 17:35:57 +0000      |
|      |         |                                   | +0000                          |
|      | 0xAX    | alebcay/awesome-shell             | 2015-06-16 17:17:17 +0000      |
|      |         |                                   | +0000                          |
|      | 0xAX    | angrave/SystemProgramming         | 2015-02-22 16:47:33 +0000      |
|      |         |                                   | +0000                          |
|      | 0xAX    | binhnguyennus/awesome-scalability | 2018-01-27 18:00:00 +0000      |
|      |         |                                   | +0000                          |
|      | 0xAX    | bitwalker/conform                 | 2015-06-10 13:32:03 +0000      |
|      |         |                                   | +0000                          |
+------+---------+-----------------------------------+--------------------------------+
Import feedback into database (type = "", auto_insert_user = true, auto_insert_item = false) [Y/n] 
```

The data file is also successfully identified, and you can see that the interaction data type `TYPE` column is empty, because the command does not set the interaction type. Note that the data type set when importing data needs to correspond to the matching feedback type or ranking feedback type in the configuration file, otherwise the feedback data will not be loaded.

**Step 4: Generate recommendations.** 

If everything goes well, Gorse will load the data and train the model after some time.

```bash
time="2021-03-03T14:00:27+08:00" level=info msg="master: load data from database"
time="2021-03-03T14:00:28+08:00" level=info msg="master: data loaded (#user = 982, #item = 45247, #feedback = 5922)"
time="2021-03-03T14:00:28+08:00" level=info msg="master: collect latest items"
time="2021-03-03T14:00:28+08:00" level=info msg="master: completed collecting latest items"
time="2021-03-03T14:30:28+08:00" level=info msg="fit FM(r): train set size (positive) = 3432, test set size = 1716"
...
```

- **RESTful APIs**

The server node opens the [RESTful APIs](ch02-03-api.md) to facilitate interaction with Gorse. The server node provides the RESTful APIs with specific documentation under the `apidocs` path. If the address of the service node HTTP service is `127.0.0.1:8087`, then the URL of the documentation is [`http://127.0.0.1:8087/apidocs`](http://127.0.0.1:8087/apidocs).

! [](img/swagger.png)
