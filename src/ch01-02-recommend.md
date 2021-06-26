# Recommend using Gorse

Recommendation consists of two phases: matching and ranking. The number of items in a recommender system is usually very large, and it is not practical to ranking all items. Therefore, the matching phase is needed to filter out candidate items from all items, and then the ranking model utilizes the item and user labels for more accurate ranking.

<center><img src="img/dataflow.png" height="180"></center>

## Matching Strategies

There are currently three matching strategies in the system: latest items, recently popular items and collaborative filtering. In fact, recall strategies are not limited to these three, but can also be based on the user's interested tags, items similar to the user's favorite items, etc. Feel free to discuss in [issues](https://github.com/zhenghaoz/gorse/issues).

- **Latest Items:** Add the latest items directly to the ranking phase so that new items are given the opportunity to be exposed.

- **Recent Popular Items:** Users are more likely to like popular items, but we need to set a time limit to avoid recommending "outdated" popular items.

- **Collaborative Filtering:** Use collaborative filtering to filter candidate items from the entire item pool. Since collaborative filtering does not use item labels, it is less computationally intensive and suitable for matching scenarios. Three collaborative filtering models, BPR, ALS and CCD, are implemented in the system.

| Model | Paper |
| ---- | ------------------------------------------------------------ |
| ALS  | Hu, Yifan, Yehuda Koren, and Chris Volinsky. "Collaborative filtering for implicit feedback datasets." *2008 Eighth IEEE International Conference on Data Mining*. Ieee, 2008. |
| BPR  | Rendle, Steffen, et al. "BPR: Bayesian personalized ranking from implicit feedback." arXiv preprint arXiv:1205.2618 (2012). |
| CCD | He, Xiangnan, et al. "Fast matrix factorization for online recommendation with implicit feedback." Proceedings of the 39th International ACM SIGIR conference on Research and Development in Information Retrieval. 2016. |

## Ranking Mechanism

The ranking model takes into account labels of the items, especially for new items, where the label is the basis for deciding whether to push the new item to the user or not. The ranking model for this system is factorization machines.

| Model | Paper |
| - | - |
| FM | Rendle, Steffen. "Factorization machines." *2010 IEEE International Conference on Data Mining*. IEEE, 2010. |
