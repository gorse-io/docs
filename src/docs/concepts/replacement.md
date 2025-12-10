---
icon: download
---
# Replacement

In some cases, read items should be recommended to users again but with lower (or higher) priorities.

## Configuration

Replacement is configured in the [`[recommend.replacement]`](../config#recommend-replacement) section of configuration file:

- `enable_replacement` enables or disables replacement of read items back to recommendations. Defaults to `false`.
- `positive_replacement_decay` is the decay factor for ranking replaced items from positive feedback. Defaults to `0.8`.
- `read_replacement_decay` is the decay factor for ranking replaced items from read feedback. Defaults to `0.6`.

Set decay factor greater than 1.0 if you want to increase the priority of read items.

## Algorithm

If `enable_replacement` is set to `true`:

1. Gorse collects read items from user feedback.
2. Gorse adds read items back to the recommendation list with decayed scores. For an item $i$ read by user $u$, if the original score from the ranker is $\hat y_{ui}$, the new score after replacement is

$$
\hat y'_{ui}=\begin{cases}
\hat y_{ui}\cdot \lambda_p & i\in R^p_u\\
\hat y_{ui}\cdot \lambda_r & i\in R^r_u\\
\hat y_{ui}&else
\end{cases}
$$

where $R^p_u$ is the set of items with positive feedback from user $u$, $R^r_u$ is the set of items with read feedback from user $u$, $\lambda_p$ is the `positive_replacement_decay` and $\lambda_r$ is the `read_replacement_decay`.
