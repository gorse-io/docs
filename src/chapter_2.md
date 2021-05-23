# 第二章：使用手册

本章将介绍Gorse推荐系统的使用方法，包括编写配置文件、启动系统以及调用暴露的HTTP接口。

## 准备工作

在使用Gorse之前，需要完成以下准备工作：

- **数据库：** Gorse需要两个服务器，一个用于数据存储，另外一个用于缓存存储。数据存储目前支持MySQL和MongoDB，而缓存存储只支持Redis。

- **服务器：** Gorse系统使用了单机训练和分布式预测的架构。主节点训练好模型后分发给服务节点和工作节点，多个服务节点和工作节点使用训练好的模型进行预测。Gorse推荐系统对服务器配置要求如下
  - 处理器：多核处理器可以通过并行处理加快各类任务
  - 内存：服务节点和工作节点内存需要满足模型存储、主节点内存需要满足数据和模型的存储

## 安装

可以以下的不同方式安装Gorse

- 从[Release](https://github.com/zhenghaoz/gorse/releases)下载预编译的二进制可执行文件。
- 从DockerHub获取镜像

| 镜像         | 编译状态 |
| ------------ | -------- |
| gorse-master | [![](https://img.shields.io/docker/cloud/build/zhenghaoz/gorse-master)](https://hub.docker.com/repository/docker/zhenghaoz/gorse-master) |
| gorse-server | [![](https://img.shields.io/docker/cloud/build/zhenghaoz/gorse-server)](https://hub.docker.com/repository/docker/zhenghaoz/gorse-server) |
| gorse-worker | [![](https://img.shields.io/docker/cloud/build/zhenghaoz/gorse-worker)](https://hub.docker.com/repository/docker/zhenghaoz/gorse-worker) |
| gorse-cli | [![](https://img.shields.io/docker/cloud/build/zhenghaoz/gorse-cli)](https://hub.docker.com/repository/docker/zhenghaoz/gorse-cli) |

- 从源码编译

需要首先安装Go 编译器，然后使用 `go get` 安装

```
$ go get github.com/zhenghaoz/gorse/...
```

项目代码会被自动下载到本地， `gorse-cli` 、`gorse-leader`、`gorse-worker`和`gorse-server`四个程序被安装在` $GOBIN` 路径指定的文件夹中。

## 启动

首先需要编写配置文件，在[第一章](chapter_1.md)中已经详细介绍了Gorse的工作方式，参考文档中的[配置介绍](ch02-01-config.md)编写推荐系统的配置文件为`config.toml`。文档中的[命令介绍](ch02-02-command.md)一节介绍了每个命令的用法，下面使用命令逐个启动Gorse的组件。

- **启动主节点**

启动主节点需要指定配置文件，其他节点从主节点再获取配置。

```bash
$ gorse-master -c config.toml
```

- **启动工作节点**

工作节点需要指定主节点的地址和端口，以及工作的线程数量。

```bash
$ gorse-worker --master-host 127.0.0.1 --master-port 8086 -j 4
```

- **启动服务节点**

工作节点需要指定主节点的地址和端口，另外还要指定HTTP接口的地址和端口。

```bash
$ gorse-server --master-host 127.0.0.1 --master-port 8086 \
    --host 127.0.0.1 --port 8087
```

## 使用

- **命令行工具**

在使用命令行工具`gorse-cli`之前，需要将主节点的地址和端口信息保存在`~/.gorse/cli.toml`目录下：

```toml
[master]
port = 8086         # master port
host = "127.0.0.1"  # master host
```

**第一步：检查集群状态。** 

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

`gorse-cli cluster`命令展示了集群中的节点，`ADDRESS`字段表示的是节点和主节点连接的地址端口。

**第二步：导入物品数据。** 

假设推荐的物品是GitHub上的仓库，原始数据文件`repos.csv`如下：

```
01org/cc-oci-runtime,2021-01-25 14:32:01 +0000 UTC,containers|container|docker|kvm|oci|security
02sh/4chanMarkovText,2021-02-08 14:38:55 +0000 UTC,scrapper|data-mining|markov-chain
05bit/peewee-async,2021-01-25 09:35:57 +0000 UTC,peewee|python|asyncio|mysql|postgresql|orm
...
```

每个字段从左到右分别为：仓库、更新时间、标签，那么导入数据的命令行为：

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

命令行工具能够识别了数据，确认之后即可导入数据库。

**第三步：导入交互数据。** 

假设交互数据就是用户给仓库的点赞行为，原始数据文件`stars.csv`如下：

```
0xAX,0xAX/erlang-bookmarks,2013-08-31 19:48:01 +0000 UTC
0xAX,abo-abo/hydra,2020-12-27 17:35:57 +0000 UTC
0xAX,alebcay/awesome-shell,2015-06-16 17:17:17 +0000 UTC
0xAX,angrave/SystemProgramming,2015-02-22 16:47:33 +0000 UTC
0xAX,binhnguyennus/awesome-scalability,2018-01-27 18:00:00 +0000 UTC
...
```

每个字段从左到右分别为：用户、仓库、点赞时间。那么导入数据的命令行为：

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

数据文件同样成功识别，可以看到交互数据类型`TYPE`一栏是空的，因为命令没有设置交互类型。需要注意，导入数据时候设置的数据类型需要和配置文件中的召回反馈类型或者排序反馈类型对应，否则反馈数据将无法被利用。

**第四步：生成推荐。** 

如果一切顺利，Gorse会在一段时间后加载数据，训练模型。

```bash
time="2021-03-03T14:00:27+08:00" level=info msg="master: load data from database"
time="2021-03-03T14:00:28+08:00" level=info msg="master: data loaded (#user = 982, #item = 45247, #feedback = 5922)"
time="2021-03-03T14:00:28+08:00" level=info msg="master: collect latest items"
time="2021-03-03T14:00:28+08:00" level=info msg="master: completed collect latest items"
time="2021-03-03T14:30:28+08:00" level=info msg="fit FM(r): train set size (positive) = 3432, test set size = 1716"
...
```

- **HTTP服务**

服务节点开放了[HTTP接口](ch02-03-api.md)，方便其他程度和Gorse进行交互。服务节点提供了HTTP接口，`apidocs`路径下有具体文档，如果服务节点HTTP服务的地址为`127.0.0.1:8087`，那么文档的URL就是[`http://127.0.0.1:8087/apidocs`](http://127.0.0.1:8087/apidocs)。

![](img/swagger.png)
