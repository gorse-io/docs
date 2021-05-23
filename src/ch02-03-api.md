# 接口介绍

服务节点提供了HTTP接口，`apidocs`路径下有具体文档，如果服务节点HTTP服务的地址为`127.0.0.1:8087`，那么文档的URL就是[`http://127.0.0.1:8087/apidocs`](http://127.0.0.1:8087/apidocs)。

![](img/swagger.png)

## 数据接口

数据接口中涉及原始数据的操作。

| 方法 | URL | 说明 |
|-|-|-|
| POST | /user | 插入一个用户 |
| DELETE | /user | 删除一个用户，同时删除所有相关的反馈 |
| GET | /user/{user-id} | 获取一个用户 |
| GET | /users | 获取所有用户 |
| POST | /item | 插入一个物品 |
| DELETE | /item | 删除一个物品 |
| GET | /item/{item-id} | 获取一个物品，同时删除所有相关的反馈 |
| GET | /items | 获取所有物品 |
| POST | /feedback | 批量插入反馈，可以选择是否自动插入新用户/物品 |
| GET | /feedback | 获取所有反馈 |
| GET | /user/{user-id}/feedback/{feedback-type} | 获取用户反馈 |
| GET | /item/{item-id}/feedback/{feedback-type} | 获取物品反馈 |

## 缓存接口

缓存接口的数据都是从原始数据处理之后得到的。

| 方法 | URL | 说明 |
|-|-|-|
| GET | /latest | 获取最新物品 |
| GET | /popular | 获取最近热门物品 |
| GET | /neighbors/{item-id} | 获取相似物品 |
| GET | /cf/{user-id} | 获取协同过滤推荐物品 |

## 推荐接口

实时推荐由服务节点实时计算生成。

| 方法 | URL | 说明 |
|-|-|-|
| GET | /recommend/{user-id} | 获取实时推荐 |
