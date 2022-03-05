# Deploy

Gorse can be set up via Docker Compose or manually.

## Deploy Gorse in Docker Compose

The best practice to manage Gorse nodes is using orchestration tools such as Docker Compose, etc. There are Docker images of the master node, the server node, and the worker node.

| Docker Image         | Image Size |
| ------------ | -------- |
| gorse-master | [![gorse-master](https://img.shields.io/docker/image-size/zhenghaoz/gorse-master)](https://hub.docker.com/repository/docker/zhenghaoz/gorse-master) |
| gorse-server | [![gorse-server](https://img.shields.io/docker/image-size/zhenghaoz/gorse-server)](https://hub.docker.com/repository/docker/zhenghaoz/gorse-server) |
| gorse-worker | [![gorse-worker](https://img.shields.io/docker/image-size/zhenghaoz/gorse-worker)](https://hub.docker.com/repository/docker/zhenghaoz/gorse-worker) |

There is an example [docker-compose.yml](https://github.com/zhenghaoz/gorse/blob/master/docker/docker-compose.yml) consists of a master node, a server node and a worker node, a Redis instance, and a MySQL instance.

- Create a configuration file [config.toml](https://github.com/zhenghaoz/gorse/blob/master/docker/config.toml) (Docker Compose version) in the working directory.
- Setup the Gorse cluster using Docker Compose.

```bash
docker-compose up -d
```

- Download the SQL file [github.sql](https://cdn.gorse.io/example/github.sql) and import it to the MySQL instance.

```bash
mysql -h 127.0.0.1 -u root -proot_pass gorse < github.sql
```

- Restart the master node to apply imported data.

```bash
docker-compose restart
```

These images tagged with the `latest` tag are built from the master branch. The `tag` should be fixed to a specified version in production.

## Deploy Gorse in Kubernetes (Experimental)

Coming soon.
