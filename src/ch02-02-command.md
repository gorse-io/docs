# Commands

## Master Node Commands

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

The master node needs to specify the configuration file path, in addition, you can use the command line to set the listening host and port, the host and port specified in the command line will override the host and port settings in the configuration file.

## Service Node Commands

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

The server node needs to specify the host and port of the master node, as well as the host and port to open the HTTP service.

## Work Node Commands

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

The worker node needs to specify the host and port of the master node, and the number of working threads.

## CLI Tools

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

The CLI tools can list cluster members, view system status, import/export data, test model, and search for model optimal hyper-parameters.
