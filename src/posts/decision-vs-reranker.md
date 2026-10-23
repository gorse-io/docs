---
date: 2026-10-22
category:
  - technical
tag:
  - AI/ML
---
# Decision Models vs. Rerankers in Recommendation Ranking

In [Build Recommender System with LLM-based Reranker](./llm-ranker.md), we explored turning a user’s past interests into a query and using a reranker to rank candidate items. With the emergence of decision models such as Jev, recommender systems have another option: treat “Will this user like this item?” as a judgment task and rank items directly by the probabilities returned by the decision model.

Both approaches can rank candidate items using text descriptions of a user’s past interests and profile, without first training a ranking model on self-maintained data. So which is better suited to recommender systems: rerankers trained for relevance ranking, or decision models trained for judgment tasks? This post compares their ranking performance on the MovieLens 100K dataset using Gorse’s `gorse-bench` tool.

## How the Two Types of Models Differ

A reranker takes a `query` and multiple `documents`, then returns a relevance score for each document relative to the query. A decision model such as Jev takes a `state` and a set of `questions`, returning a structured result for each question. It supports `choice` (selection), `score` (scoring), and `noul` (true-or-false judgment). For `noul`, the returned value ranges from 0 to 1 and represents the probability that a proposition is true. A recommender system can use this type of judgment to score candidate items.

The following examples show requests and responses for decision models and rerankers using the APIs provided by llama.cpp:

::: code-tabs

@tab:active Decision API

```bash
$ curl --request POST 'http://localhost:8080/v1/systemone' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-binary @- <<'JSON'
{
  "model": "OpenJev-GGUF",
  "state": "A user likes the following movies:\n- The Lion King (1994). A animation, children's, musical movie.\nPlease recommend more movies.",
  "questions": {
    "1": {
      "type": "noul",
      "instructions": "Toy Story (1995). A animation, children's, comedy movie."
    },
    "2": {
      "type": "noul",
      "instructions": "GoldenEye (1995). A action, adventure, thriller movie."
    }
  }
}
JSON
{
  "model": "OpenJev-GGUF",
  "answers": {
    "1": {
      "type": "noul",
      "noul": 0.91
    },
    "2": {
      "type": "noul",
      "noul": 0.35
    }
  }
}
```

@tab Reranker API

```bash
$ curl --request POST 'http://localhost:8080/v1/rerank' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-binary @- <<'JSON'
{
  "model": "Qwen3-Reranker-8B-GGUF",
  "query": "A user likes the following movies:\n- The Lion King (1994). A animation, children's, musical movie.\nPlease recommend more movies.",
  "documents": [
    "Toy Story (1995). A animation, children's, comedy movie.",
    "GoldenEye (1995). A action, adventure, thriller movie."
  ]
}
JSON
{
  "model": "Qwen3-Reranker-8B-GGUF",
  "results": [
    {
      "index": 0,
      "relevance_score": 0.87
    },
    {
      "index": 1,
      "relevance_score": 0.24
    }
  ]
}
```

:::



## Dataset and Evaluation Method

We use the MovieLens 100K dataset. The dataset contains 943 users, 1,682 movies, and 100,000 ratings on a scale from 1 to 5. The experiment treats ratings of 4 or higher as positive feedback and all other rated entries as negative samples:

```toml
[recommend.data_source]
positive_feedback_types = ["rating>=4"]
read_feedback_types = ["rating"]
```

::: info

To reproduce the experiment, start with the [base configuration file](https://github.com/gorse-io/gorse/blob/master/client/config.toml), which does not include reranker or decision API settings. Download the [ready-to-import dataset](https://cdn.gorse.io/example/github.bin.gz) and follow the [Quick Start](../docs/quick-start.md) to import it.

:::

All models run on llama.cpp and use Q4_K_M quantization. The rerankers and decision models use identical prompt templates. The following examples show the configurations.

::: code-tabs

@tab:active Decision API Configuration

```toml
[recommend.ranker.decision_api]
url = "http://127.0.0.1:8080/v1/systemone"
auth_token = "YOUR_API_KEY"
model = "OpenJev-GGUF"
state_template = """
A user likes the following movies:
{% for item in feedback -%}
- {{ item.Comment }}. A{% for category in item.Categories %}{% if not loop.first %},{% endif %} {{ category | lower }}{% endfor %} movie.
{% endfor -%}
Please recommend more movies.
"""
instructions_template = '{{ item.Comment }}. A{% for category in item.Categories %}{% if not loop.first %},{% endif %} {{ category | lower }}{% endfor %} movie.'
```

@tab Reranker API Configuration

```toml
[recommend.ranker.reranker_api]
url = "http://127.0.0.1:8080/v1/rerank"
auth_token = "YOUR_API_KEY"
model = "Qwen3-Reranker-8B-GGUF"
query_template = """
A user likes the following movies:
{% for item in feedback -%}
- {{ item.Comment }}. A{% for category in item.Categories %}{% if not loop.first %},{% endif %} {{ category | lower }}{% endfor %} movie.
{% endfor -%}
Please recommend more movies.
"""
document_template = '{{ item.Comment }}. A{% for category in item.Categories %}{% if not loop.first %},{% endif %} {{ category | lower }}{% endfor %} movie.'
```

:::

Evaluate the models with `gorse-bench`, specifying the configuration file.

::: code-tabs

@tab:active Benchmark a Decision Model

```bash
./gorse-bench decision --config config.toml
```

@tab Benchmark a Reranker

```bash
./gorse-bench reranker --config config.toml
```

:::

The `reranker` and `decision` subcommands of `gorse-bench` use the same evaluation procedure:

1. Sort each user’s ratings chronologically, using approximately the earliest 80% as history and the latest 20% as the test set.
2. Include only positive feedback from the history in the prompt. Do not provide test-set ratings to the model.
3. Use both positive and negative samples in the test set as candidate movies and ask the model to score them.
4. Calculate AUC for each user, then weight it by the number of test samples for that user to obtain GAUC.

GAUC is calculated as follows:

$$
\mathrm{GAUC} = \frac{\sum_{u \in U} n_u \cdot \mathrm{AUC}_u}{\sum_{u \in U} n_u}
$$

Here, $U$ is the set of users included in the evaluation, $n_u$ is the number of test samples for user $u$, and $\mathrm{AUC}_u$ is the AUC on that user’s test set. A higher GAUC means the model is better at distinguishing movies a user likes from those they dislike under this evaluation procedure.

## Results

We evaluated nine models: six decision models and three rerankers:

::: echarts GAUC Comparison of Decision Models and Rerankers

```json
{
  "color": ["#5470c6", "#eea23e"],
  "legend": {
    "data": ["Decision Models", "Rerankers"],
    "top": 0
  },
  "grid": {
    "left": 10,
    "right": 65,
    "top": 40,
    "bottom": 30,
    "containLabel": true
  },
  "tooltip": {
    "trigger": "axis",
    "axisPointer": {
      "type": "shadow"
    }
  },
  "xAxis": {
    "type": "value",
    "name": "GAUC",
    "min": 0.5,
    "max": 0.66
  },
  "yAxis": {
    "type": "category",
    "inverse": true,
    "axisLabel": {
      "fontSize": 11
    },
    "data": [
      "OpenJev-27B",
      "Clef-Flash-9B",
      "Qwen3-Reranker-8B",
      "Qwen3-Reranker-4B",
      "Kev-4B",
      "Clef-27B",
      "Bespoke-Nimble-9B-v3",
      "lev-4B",
      "Qwen3-Reranker-0.6B"
    ]
  },
  "series": [
    {
      "name": "Decision Models",
      "type": "bar",
      "stack": "GAUC",
      "barMaxWidth": 20,
      "label": {
        "show": true,
        "position": "right",
        "formatter": "{c}"
      },
      "data": [0.6463, 0.6163, null, null, 0.5852, 0.5782, 0.5771, 0.5714, null]
    },
    {
      "name": "Rerankers",
      "type": "bar",
      "stack": "GAUC",
      "barMaxWidth": 20,
      "label": {
        "show": true,
        "position": "right",
        "formatter": "{c}"
      },
      "data": [null, null, 0.5911, 0.5877, null, null, null, null, 0.5135]
    }
  ],
  "media": [
    {
      "query": {
        "maxWidth": 500
      },
      "option": {
        "yAxis": {
          "axisLabel": {
            "width": 120,
            "overflow": "break",
            "lineHeight": 14
          }
        }
      }
    }
  ]
}
```

:::

OpenJev’s GAUC is approximately 0.0552 higher than Qwen3-Reranker-8B’s, while Clef-Flash’s is about 0.0252 higher. These results suggest that decision models are worth considering for recommendation ranking. However, decision models do not win across the board: Kev, Clef, Nimble, and lev all score lower than Qwen3-Reranker-8B. Even within the decision model category, performance varies substantially.

## Which Type of Model Is Better?

**First, rerankers are the safest choice.** In this experiment, Qwen3-Reranker-4B outperforms most decision models, including Clef, a 27B-parameter model that ranks highly on the [decision model leaderboard](https://clef-evals.workers-ai-mle.workers.dev/). This may be because rerankers are trained specifically for ranking tasks, whereas decision models are trained on data covering more general scenarios and may not perform best on ranking tasks.

**Second, decision model performance depends on the specific model.** OpenJev and Clef-Flash perform well in this experiment. Clef-Flash significantly outperforms Qwen3-Reranker-8B, which has a similar parameter size, as well as Clef from the same company. Both Clef-Flash and Nimble are fine-tuned from Qwen 3.5 9B, but their different fine-tuning datasets lead to very different performance on recommendation tasks.

::: warning
Decision-model-based ranking is still experimental. It can only be configured through the configuration file; the web dashboard does not yet support editing these settings.
:::