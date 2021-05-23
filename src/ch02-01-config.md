# 配置介绍

## 数据库配置

数据库配置位于`[database]`之下：

| 配置项 | 类型 | 说明 | 默认值 |
|-|-|-|-|
| `cache_store` | string | 数据存储数据库（支持MySQL/MongoDB） | redis://127.0.0.1:6379 |
| `data_store` | string | 缓存存储数据库（支持Redis） | mysql://root@tcp(127.0.0.1:3306)/gorse |
| `auto_insert_user` | bool | 在插入新反馈的时候自动插入新用户 | true |
| `auto_insert_item` | bool | 在插入新反馈的时候自动插入新物品 | true |

`data_store`和`cache_store`设置数据库的DSN（Database Source Name）格式如下：

- Redis：`redis://主机名:端口`
- MySQL：`mysql://[用户名[:密码]@][协议[(地址)]]/数据库[?配置项1=值1&...¶配置项N=值N]`
- MongoDB：`mongodb://[用户名:密码@]主机名1[:端口1][,...主机名N[:端口N]]][/[数据库][?选项]]`

## 相似物品更新配置

相似物品召回配置位于`[similar]`之下：

| 配置项 | 类型 | 说明 | 默认值 |
|-|-|-|-|
| `n_similar` | int | 缓存相似物品的数量，0表示禁用 | 100 |
| `update_period` | int | 更新相似物品时间间隔（分钟） | 60 |

## 最新物品召回配置

最新物品召回配置位于`[latest]`之下：

| 配置项 | 类型 | 说明 | 默认值 |
|-|-|-|-|
| `n_latest` | int | 召回最新物品的数量，0表示禁用 | 100 |
| `update_period` | int | 更新最新物品时间间隔（分钟） | 10 |

## 热门物品召回配置

热门物品召回配置位于`[popular]`之下：

| 配置项 | 类型 | 说明 | 默认值 |
|-|-|-|-|
| `n_popular` | int | 召回热门物品的数量，0表示禁用 | 100 |
| `update_period` | int | 更新热门物品时间间隔（分钟） | 1440 |
| `time_window` | int | 召回前N天之内的热门物品 | 365 |

## 协同过滤召回配置

协同过滤召回配置位于`[cf]`之下：

| 配置项 | 类型 | 说明 | 默认值 |
|-|-|-|-|
| `n_cf` | int | 协同过滤召回物品的数量，0表示禁用 | 800 |
| `cf_model` | string | 协同过滤模型（从`als`、`bpr`和`ccd`选择） | als |
| `fit_period` | int | 更新协同过滤推荐模型时间间隔（分钟） | 1440 |
| `predict_period` | int | 更新协同过滤推荐物品时间间隔（分钟） | 60 |
| `feedback_types` | int | 协同过滤推荐使用的反馈类型 | [""] |
| `fit_jobs` | int | 模型训练线程数 | 1 |
| `verbose` | int | 报告损失函数值和推荐准确率的迭代间隔 | 10 |
| `n_candidates` | int | 计算推荐准确率使用候选物品数量 | 100 |
| `top_k` | int | 计算推荐准确率的推荐列表长度，也就是NDCG@N中的N | 10 |
| `n_test_users` | int | 测试集用户数量（0表示使用全体用户测试） | 0 |

模型参数相关的配置如下，模型参数的默认值取决于具体的模型设定：

| 配置项 | 类型 | 说明 | 对应模型 |
|-|-|-|-|
| `lr` | float | 学习率 | BPR |
| `reg` | float | 正则化系数 | BPR/ALS/CCD |
| `n_epochs` | int | 迭代次数 | BPR/ALS/CCD |
| `n_factors` | int | 隐向量维度 | BPR/ALS/CCD |
| `init_mean` | float | 高斯随机初始化平均 | BPR/ALS/CCD |
| `init_std` | float | 高斯随机初始化方差 | BPR/ALS/CCD |
| `alpha` | float | 负样本权重 | ALS/CCD |

## 个性化排序模型配置

个性化排序模型配置位于`[rank]`之下：

| 配置项 | 类型 | 说明 | 默认值 |
|-|-|-|-|
| `task` | int | 排序任务类型（r表示回归，c表示分类） | r |
| `feedback_types` | int | 排序使用的反馈类型 | [""] |
| `fit_period` | int | 更新排序模型时间间隔（分钟） | 1440 |
| `fit_jobs` | int | 模型训练线程数 | 1 |
| `verbose` | int | 报告损失函数值和预测准确率的迭代间隔 | 10 |

模型参数相关的配置如下：

| 配置项 | 类型 | 说明 |
|-|-|-|
| `lr` | float | 学习率 |
| `reg` | float | 正则化系数 |
| `n_epochs` | int | 迭代次数 |
| `n_factors` | int | 隐向量维度 |
| `init_mean` | float | 高斯随机初始化平均 |
| `init_std` | float | 高斯随机初始化方差 |

## 主节点配置

主节点配置位于`[cf]`之下：

| 配置项 | 类型 | 说明 | 默认值 |
|-|-|-|-|
| `host` | string | 主节点监听地址 | 127.0.0.1 |
| `port` | int | 主节点监听端口 | 8086 |
| `jobs` | int | 主节点工作线程数量 | 1 |
| `cluster_meta_timeout` | int | 元数据超时时间 | 60 |
