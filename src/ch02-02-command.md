# 命令介绍

## 主节点程序

```
$ gorse-master -h
The master node of gorse recommender system.

Usage:
  gorse-master [flags]

Flags:
  -c, --config string   configuration file path (default "/etc/gorse.toml")
  -h, --help            help for gorse-master
      --host string     host of master node (default "127.0.0.1")
      --port int        port of master node (default 8086)
  -v, --version         gorse version
```

主节点程序需要指定配置文件路径，另外可以使用命令行设置监听的地址和端口，命令行中指定的地址和端口会覆盖配置文件中的地址和端口设置。

## 服务节点程序

```
$ gorse-server -h
The server node of gorse recommender system.

Usage:
  gorse-server [flags]

Flags:
  -h, --help                  help for gorse-server
      --host string           host of server node (default "127.0.0.1")
      --master-host string   host of master node (default "127.0.0.1")
      --master-port int       port of master node (default 8086)
      --port int              port of server node (default 8087)
  -v, --version               gorse version
```

服务节点程序需要指定主节点的地址和端口，以及开启HTTP服务的地址和端口。

## 工作节点程序


```
$ gorse-worker -h
The worker node of gorse recommender system.

Usage:
  gorse-worker [flags]

Flags:
  -h, --help                 help for gorse-worker
  -j, --jobs int             number of working jobs. (default 4)
      --master-host string   host of master node (default "127.0.0.1")
      --master-port int      port of master node (default 8086)
```

工作节点程序需要指定主节点的地址和端口，以及工作线程数量。

## 控制台程序

```
$ gorse-cli -h
CLI for gorse recommender system.

Usage:
  gorse-cli [command]

Available Commands:
  cluster     cluster information
  export      export data
  help        Help about any command
  import      import data
  status      status of recommender system
  test        test recommendation model
  tune        tune recommendation model by random search
  version     gorse version

Flags:
  -h, --help   help for gorse-cli

Use "gorse-cli [command] --help" for more information about a command.
```

控制台程序能够列出集群成员、查看系统状态、导入/导出数据、测试模型推荐准去率以及随即搜索模型最佳参数。
