# Configuration

## Database Configuration

The database configuration is located under `[database]`.

| Key | Type | Description | Default |
|-|-|-|-|
| `cache_store` | string | Database for data (supports MySQL/MongoDB) | redis://127.0.0.1:6379 |
| `data_store` | string | Database for cache (supports Redis) | mysql://root@tcp(127.0.0.1:3306)/gorse |
| `auto_insert_user` | bool | Automatically insert new users when inserting new feedback | true |
| `auto_insert_item` | bool | Automatically insert new items when inserting new feedback | true |

The DSN (Database Source Name) format of the `data_store` and `cache_store` is as follows.

- Redis: `redis://hostname:port`
- MySQL: `mysql://[username[:password]@][protocol[(hostname:port)]]/database[?config1=value1&...configN=valueN]`
- MongoDB: `mongodb://[username:password@]hostname1[:port1][,... hostnameN[:portN]]][/[database][?options]]`

## Similar Item Configuration

Similar item configurations are located under `[similar]`.

| Key | Type | Description | Default |
|-|-|-|-|
| `n_similar` | int | Number of similar items to cache, 0 means disabled | 100 |
| `update_period` | int | Time interval (in minutes) to update similar items | 60 |

## Latest Item Configuration

The latest item configuration is located under `[latest]`.

| Key | Type | Description | Default |
|-|-|-|-|
| `n_latest` | int | Number of latest items to cache, 0 means disabled | 100 |
| `update_period` | int | Time interval to update the latest items (in minutes) | 10 |

## Popular Item Configuration

The popular item configuration is located under `[popular]`.

| Key | Type | Description | Default |
|-|-|-|-|
| `n_popular` | int | Number of popular items to cache, 0 means disabled | 100 |
| `update_period` | int | Time interval to update popular items (in minutes) | 1440 |
| `time_window` | int | Popular items within the previous N days | 365 |

## Collaborative Filtering Configuration

The collaborative filtering configuration is located under `[cf]`.

| Key | Type | Description | Default |
|-|-|-|-|
| `n_cf` | int | Number of collaborative filtering matched items, 0 means disabled | 800 |
| `cf_model` | string | Collaborative filtering model (select from `als`, `bpr` and `ccd`) | als |
| `fit_period` | int | Interval (in minutes) to update the collaborative filtering model | 1440 |
| `predict_period` | int | Update collaborative filtering matched items interval (in minutes) | 60 |
| `feedback_types` | int | Feedback types used by collaborative filtering model | [""] |
| `fit_jobs` | int | Number of model training threads | 1 |
| `verbose` | int | Iteration interval for reporting costs and recommendation accuracy | 10 |
| `n_candidates` | int | Number of candidates used to estimate the recommendation accuracy | 100 |
| `top_k` | int | Length of the recommendation list to estimate the recommendation accuracy, i.e. N in NDCG@N | 10 |
| `n_test_users` | int | Number of users in the test set (0 means use all users to test) | 0 |

The configurations related to the model hyper-parameters are as follows. The default values of hyper-parameters depend on the corresponding model settings.

| Key | Type | Description | Corresponding model |
| -|-|-|-|
| `lr` | float | Learning rate | BPR |
| `reg` | float | Regularization coefficient | BPR/ALS/CCD |
| `n_epochs` | int | Number of iterations | BPR/ALS/CCD |
| `n_factors` | int | Number of latent factors | BPR/ALS/CCD |
| `init_mean` | float | Mean of gaussian random initializer | BPR/ALS/CCD |
| `init_std` | float | Standard deviation of gaussian random initializer | BPR/ALS/CCD |
| `alpha` | float | Weight for negative samples | ALS/CCD |

## Ranking Configuration

The ranking configuration is located under `[rank]`.

| Key | Type | Description | Default |
|-|-|-|-|
| `task` | int | Task type (`r` for regression, `c` for classification) | `r` |
| `feedback_types` | int | Types of feedback used for ranking | [""] |
| `fit_period` | int | Time interval to update the ranking model (in minutes) | 1440 |
| `fit_jobs` | int | Number of threads for model training | 1 |
| `verbose` | int | Iteration interval for reporting costs and prediction accuracies | 10 |

The configurations related to the model hyper-parameters are as follows.

| Key | Type | Description |
|-|-|-|
| `lr` | float | Learning rate |
| `reg` | float | Regularization coefficient |
| `n_epochs` | int | Number of iterations |
| `n_factors` | int | Number of latent factors |
| `init_mean` | float | Mean of gaussian random initializer |
| `init_std` | float | Standard deviation of gaussian random initializer |

## Master Configuration

The master configuration is located under `[cf]`.

| Key | Type | Description | Default |
|-|-|-|-|
| `host` | string | Master node listening host | 127.0.0.1 |
| `port` | int | Master node listening port | 8086 |
| `jobs` | int | Number of working threads | 1 |
| `cluster_meta_timeout` | int | Metadata timeout | 60 |
