---
icon: dashboard-fill
---
# Benchmark

In this page, different database backends of Gorse are compared.

## RESTful APIs

Before benchmark RESTful APIs, [the develop environment](contribution-guide#setup-develop-environment) should be set up first. Then, change working directory to `server` and run benchmark script:

```bash
cd server
bash bench_test.sh --cache redis --data mysql
```

- The `cache` argument should be one of `redis`, `mysql`, `postgres` or `mongodb`.
- The `data` argument should be one of `clickhouse`, `mysql`, `postgres` or `mongodb`.

The benchmark result (in milliseconds) is as follows:

| Database[^1] | <FontIcon icon="mysql"/> <FontIcon icon="redis"/> | <FontIcon icon="postgresql"/> <FontIcon icon="redis"/> | <FontIcon icon="clickhouse"/> <FontIcon icon="redis"/> | <FontIcon icon="mongodb"/> <FontIcon icon="redis"/> | <FontIcon icon="mysql"/> <FontIcon icon="mysql"/> | <FontIcon icon="postgresql"/> <FontIcon icon="postgresql"/> | <FontIcon icon="mongodb"/> <FontIcon icon="mongodb"/> |
|-|-|-|-|-|-|-|-|
| InsertUser | 1.39 | 2.60 | 1.33 | 0.45 | 17.97 | 4.03 | 0.41 |
| PatchUser | 1.43 | 0.67 | 10.56 | 0.44 | 19.55 | 4.49 | 0.41 |
| GetUser | 0.28 | 0.28 | 2.21 | 0.30 | 0.30 | 0.30 | 0.20 |
| InsertUsers/10 | 1.48 | 2.21 | 1.47 | 1.00 | 21.59 | 4.51 | 0.92 |
| InsertUsers/100 | 2.26 | 3.85 | 2.48 | 5.01 | 17.97 | 7.52 | 4.95 |
| InsertUsers/1000 | 17.55 | 18.97 | 9.41 | 51.13 | 52.84 | 40.60 | 46.63 |
| GetUsers/10 | 0.42 | 0.34 | 2.72 | 0.37 | 0.44 | 0.35 | 0.27 |
| GetUsers/100 | 0.81 | 0.61 | 3.02 | 0.83 | 0.90 | 0.69 | 0.63 |
| GetUsers/1000 | 3.57 | 2.89 | 6.28 | 5.20 | 4.81 | 10.23 | 3.85 |
| DeleteUser | 11.76 | 2.26 | 31.15 | 0.45 | 12.27 | 2.40 | 0.37 |
| InsertItem | 13.30 | 2.64 | 4.61 | 0.89 | 38.12 | 8.70 | 1.22 |
| PatchItem | 12.47 | 3.18 | 24.69 | 1.30 | 41.50 | 9.47 | 1.80 |
| GetItem | 0.29 | 0.30 | 3.15 | 0.21 | 0.37 | 0.37 | 0.26 |
| InsertItems/10 | 10.72 | 2.98 | 5.02 | 1.09 | 18.32 | 7.57 | 2.70 |
| InsertItems/100 | 11.42 | 5.19 | 6.83 | 4.50 | 46.67 | 15.04 | 13.01 |
| InsertItems/1000 | 38.76 | 29.40 | 20.56 | 39.57 | 454.27 | 91.44 | 101.66 |
| GetItems/10 | 0.39 | 0.40 | 3.64 | 0.32 | 0.49 | 0.48 | 0.31 |
| GetItems/100 | 0.92 | 0.95 | 4.10 | 0.85 | 1.22 | 1.15 | 0.87 |
| GetItems/1000 | 5.84 | 13.93 | 10.57 | 6.65 | 7.71 | 5.85 | 6.42 |
| DeleteItem | 10.42 | 3.39 | 27.15 | 1.06 | 25.00 | 6.15 | 1.73 |
| InsertCategory | 11.23 | 2.34 | 4.81 | 0.57 | 21.02 | 4.92 | 0.71 |
| DeleteCategory | 0.65 | 2.47 | 4.78 | 0.60 | 1.03 | 2.87 | 0.64 |
| PutFeedback/10 | 10.09 | 3.08 | 5.67 | 2.28 | 31.26 | 8.33 | 2.65 |
| PutFeedback/100 | 16.62 | 8.59 | 8.19 | 14.43 | 53.50 | 20.48 | 17.79 |
| PutFeedback/1000 | 56.39 | 57.64 | 21.36 | 105.29 | 185.60 | 102.84 | 148.21 |
| InsertFeedback/10 | 11.25 | 3.62 | 4.68 | 1.93 | 32.90 | 7.96 | 2.63 |
| InsertFeedback/100 | 15.03 | 8.54 | 7.50 | 11.43 | 56.50 | 16.54 | 17.32 |
| InsertFeedback/1000 | 62.52 | 58.02 | 23.98 | 103.05 | 152.69 | 121.93 | 153.70 |
| GetFeedback/10 | 0.35 | 0.49 | 3.19 | 0.29 | 0.43 | 0.45 | 0.28 |
| GetFeedback/100 | 0.63 | 0.88 | 3.56 | 0.70 | 0.85 | 0.82 | 0.70 |
| GetFeedback/1000 | 3.11 | 2.98 | 9.79 | 4.56 | 4.26 | 2.97 | 4.78 |
| GetUserItemFeedback | 0.31 | 0.33 | 2.63 | 0.23 | 0.39 | 0.37 | 0.23 |
| DeleteUserItemFeedback | 10.10 | 2.00 | 12.80 | 0.24 | 10.93 | 2.25 | 0.28 |
| GetUserFeedback | 0.32 | 0.31 | 2.68 | 0.26 | 0.38 | 0.34 | 0.23 |
| GetItemFeedback | 0.31 | 0.31 | 2.50 | 0.22 | 0.38 | 0.35 | 0.22 |
| GetRecommendCache/10 | 0.26 | 0.29 | 0.31 | 0.27 | 0.68 | 0.63 | 0.44 |
| GetRecommendCache/100 | 0.50 | 0.48 | 0.60 | 0.49 | 3.05 | 1.30 | 1.25 |
| GetRecommendCache/1000 | 2.48 | 2.48 | 3.20 | 2.67 | 119.33 | 13.80 | 8.25 |
| RecommendFromOfflineCache/10 | 0.35 | 0.38 | 0.39 | 0.34 | 0.93 | 0.76 | 0.58 |
| RecommendFromOfflineCache/100 | 0.59 | 0.60 | 0.73 | 0.58 | 1.98 | 1.49 | 1.43 |
| RecommendFromOfflineCache/1000 | 2.83 | 2.84 | 3.73 | 2.87 | 14.69 | 5.11 | 7.89 |
| RecommendFromLatest/10 | 0.69 | 0.71 | 3.20 | 0.61 | 1.47 | 1.23 | 0.91 |
| RecommendFromLatest/100 | 1.04 | 0.93 | 3.89 | 1.13 | 2.82 | 1.69 | 2.21 |
| RecommendFromLatest/1000 | 4.61 | 3.53 | 10.45 | 5.14 | 20.44 | 5.45 | 9.37 |
| RecommendFromItemBased/10 | 2.21 | 2.21 | 5.86 | 1.94 | 6.75 | 5.10 | 3.79 |
| RecommendFromItemBased/100 | 4.35 | 3.86 | 9.75 | 3.87 | 21.53 | 10.08 | 10.81 |
| RecommendFromItemBased/1000 | 23.65 | 21.59 | 36.04 | 22.25 | 183.78 | 57.02 | 59.73 |

[^1]: The first logo in the cell represents the database for data storage, and the second logo represents the database for cache storage.
