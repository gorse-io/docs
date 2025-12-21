---
icon: sort
---
# Ranking

Gorse merges recommendation from multiple recommenders and ranks them to produce the final recommendation list.

## Configuration

- `type` is the ranker type. The supported ranker is:
  - `none` means no ranking is performed.
  - `fm` uses factorization machines[^1] to rank recommended items.
  - `llm` uses large language models (LLMs) to rank recommended items.
- `prompt` is the prompt template used by LLM ranker. This field is required when `type` is `llm`. The template supports the following variables:
  - `feedback` is the user's historical feedback.
  - `items` is a list of recommended items to be ranked.
::: details Type definitions of `feedback` and `items`.
The type of `feedback` is:
```go
type FeedbackItem struct {
	FeedbackType string
	ItemId       string
	IsHidden     bool
	Categories   []string
	Timestamp    time.Time
	Labels       any
	Comment      string
}
```
The type of `items` is:
```go
type Item struct {
	ItemId     string
	IsHidden   bool
	Categories []string
	Timestamp  time.Time
	Labels     any
	Comment    string
}
```
:::
- `recommenders` are the names of recommenders whose recommendations are merged and ranked. Values should be one of the following:
  - `latest` uses the latest items recommender.
  - `collaborative` uses the collaborative filtering recommender.
  - `non-personalized/NAME` uses a non-personalized recommender with name `NAME`.
  - `item-to-item/NAME` uses an item-to-item recommender with name `NAME`.
  - `user-to-user/NAME` uses a user-to-user recommender with name `NAME`.
- `early_stopping.patience` is the number of epochs with no improvement after which factoring machine training will be stopped. Defaults to `10`.

## Example

In the demo project [GitRec](https://gitrec.gorse.io/), factorization machines are used to rank recommended items from multiple recommenders:
- Latest repositories from the latest items recommender.
- Collaborative filtering recommendations.
- Most starred repositories in the past week from the non-personalized recommender.
- Similar repositories from the item-to-item recommender.
- Repositories from positive feedback of similar users from the user-to-user recommender.

```toml
[recommend.ranker]
type = "fm"
recommenders = ["latest", "collaborative", "non-personalized/most_starred_weekly", "item-to-item/neighbors", "user-to-user/neighbors"]
```

## Algorithms

### Factorization Machines

Different from the learning algorithms for matrix factorization, negative feedback are used in factorization machine training. The training dataset is constructed by

$$
D=\{((x_1,\dots,x_f,\dots,x_F),1)|(u,i)\in R\}\cup\{((x_1,\dots,x_f,\dots,x_F),0)|(u,i)\in\not R\}
$$

The dimension of input vectors $\mathbf{x}$ is the sum of the numbers of items, users, item labels and user labels: $F = |I| + |U| + |L_I| + |L_U|$. Each element in $\mathbf{x}$ for a pair $(u,i)$ is defined by

$$
x_f=\begin{cases}
\mathbb{I}(f=u)&0<f\le |I|\\
\mathbb{I}(f-|I|=u)&|I|<f\le |I|+|U|\\
\mathbb{I}(f-|I|-|U|\in L_i)&|I|+|U|<f<\le |I|+|U|+|L_I|\\
\mathbb{I}(f-|I|-|U|-|L_U| \in L_u)&|I|+|U|+|L_I|<f<\le F
\end{cases}
$$

The prediction output for a input vector $\mathbf{x}$ is

$$
\hat y = w_0 + \sum^n_{i=1}w_i x_i + \sum^n_{i=1}\sum^n_{j=i+1}\left<\mathbf{v}_i,\mathbf{v}_j\right>x_i x_j
$$

where the model parameters that have to be estimated are: $w_0\in\mathbb{R}$, $\mathbf{w}\in\mathbb{R}^n$, $\mathbf{V}\in\mathbb{R}^{n\times k}$. And $\left<\cdot,\cdot\right>$ is the dot product of two vectors. Parameters are optimized by logit loss with SGD. The loss function is

$$
\mathcal C=\sum_{(\mathbf{x},y)\in D}−y\log(\hat y)−(1−y)\log(1-\hat y)
$$

The gradient for each parameter is

$$
\frac{\partial}{\partial\theta}\hat y=\begin{cases}
1,&\text{if }\theta\text{ is }w_0\\
x_i,&\text{if }\theta\text{ is }w_i\\
x_i\sum^n_{j=1}v_{j,f}x_j-v_{i,f}x^2_i,&\text{if }\theta\text{ is }v_{i,f}
\end{cases}
$$

### Large Language Models

Recent studies have shown that large language models (LLMs) such as ChatGPT can effectively perform recommendation through prompt engineering[^2][^3]. Gorse leverages this capability by using LLMs to rank recommended items based on user feedback and item information.

Before using the LLM ranker, OpenAI API must be configured in the [`[openai]`](../../docs/config#openai) of the configuration file. A prompt template must also be provided in the ranker configuration. An example prompt template for recommending GitHub repositories is as follows:

````jinja
You are a GitHub repository recommender system. Given a user is interested in the following repositories:
{% for repo in feedback -%}
- {{ repo.Comment }}
{% endfor -%}
Please sort the following repositories by the user's interests:
```csv
item_id,description
{% for repo in items -%}
{{ repo.ItemId }},{{ repo.Comment | replace(",", " ") | replace("\n", " ") }}
{% endfor -%}
```
Return the sorted list of repository IDs in CSV format. For example:
```csv
{% for repo in items[:3] -%}
{{ repo.ItemId }}
{% endfor -%}
```
````

`feedback` contains the user's recent feedback and `items` contains the list of recommended items to be ranked. The number of `feedback` items can be controlled by the `recommend.context_size`. The LLM ranker renders the prompt template and sends it to the OpenAI API. The response is then parsed to extract the ranked list of item IDs.

[^1]: Rendle, Steffen. "Factorization machines." 2010 IEEE International conference on data mining. IEEE, 2010.
[^2]: Liu, Junling, et al. "Is chatgpt a good recommender? a preliminary study." arXiv preprint arXiv:2304.10149 (2023).
[^3]: Dai, Sunhao, et al. "Uncovering chatgpt’s capabilities in recommender systems." Proceedings of the 17th ACM Conference on Recommender Systems. 2023.
