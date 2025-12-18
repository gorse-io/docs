---
icon: download
---
# 放回

在某些情况下，已读物品应再次推荐给用户，但优先级应更低（或更高）。

## 配置

放回在配置文件的 [`[recommend.replacement]`](../config#recommend-replacement) 部分中配置：

- `enable_replacement` 启用或禁用将已读物品放回推荐。默认为 `false`。
- `positive_replacement_decay` 是对来自积极反馈的被放回物品进行排序的衰减因子。默认为 `0.8`。
- `read_replacement_decay` 是对来自已读反馈的被放回物品进行排序的衰减因子。默认为 `0.6`。

如果要增加已读物品的优先级，请将衰减因子设置为大于 1.0。

## 算法

如果 `enable_replacement` 设置为 `true`：

1. Gorse 从用户反馈中收集已读物品。
2. Gorse 将已读物品以衰减的分数添加回推荐列表。对于用户 $u$ 读取的物品 $i$，如果来自排序器的原始分数为 $\hat y_{ui}$，则替换后的新分数为

$$ 
\hat y'_{ui}=\begin{cases}
\hat y_{ui}\cdot \lambda_p & i\in R^p_u\
\hat y_{ui}\cdot \lambda_r & i\in R^r_u\
\hat y_{ui}&else
\end{cases} 
$$

其中 $R^p_u$ 是用户 $u$ 的积极反馈物品集，$R^r_u$ 是用户 $u$ 的已读反馈物品集，$\\lambda_p$ 是 `positive_replacement_decay`，$\\lambda_r$ 是 `read_replacement_decay`。
