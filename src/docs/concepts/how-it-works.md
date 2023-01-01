---
icon: process
---
# How It Works

```mermaid
flowchart TD
    database[(Database)]--user, items and feedback-->load[Load dataset]
    load--latest and popular items-->cache[(Cache)]
    find_users--User Neighbors-->cache
    find_items--Item Neighbors-->cache
    subgraph Master Node
        load--dataset-->find_users[Find neighbors of users]
        load--dataset-->find_items[Find neighbors of items]
        load--dataset-->fit_mf[Fit MF]
        load--dataset-->fit_fm[Fit FM]
    end

    cache2--cached recommendations-->api[RESTful APIs]
    database2[(Database)]<--user, items and feedback-->api
    subgraph Server Node
        api<--popular and hidden items-->local_cache[Local Cache]
    end

    cache--user neighbors-->user_based(User Similarity-based\nRecommendation)
    cache--item neighbors-->item_based(Item Similarity-based\nRecommendation)
    cache--latest and popular items-->fm_predict
    fm_predict--recommendation-->cache2[(Cache)]
    subgraph Worker Node
        user_based--recommendation-->fm_predict
        item_based--recommendation-->fm_predict
        mf_predict--recommendation-->fm_predict
        fit_mf--MF model-->mf_predict[MF Recommendation]
        fit_fm--FM model-->fm_predict[FM Recommendation]
    end
```


## Architecture

```toml
[master]

# GRPC port of the master node. The default value is 8086.
port = 8086

# gRPC host of the master node. The default values is "0.0.0.0".
host = "0.0.0.0"

# Number of working jobs in the master node. The default value is 1.
n_jobs = 1

# Meta information timeout. The default value is 10s.
meta_timeout = "10s"
```

## Recommendation Flow
