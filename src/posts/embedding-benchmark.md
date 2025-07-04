---
date: 2025-07-05
category:
  - technical
tag:
  - AI/ML
---
# Text Embedding Benchmark for Recommender Systems

Embedding models encode multimodal information such as images and text into high-dimensional vectors, enabling the calculation of relationships between multimodal information by measuring the distance between embedding vectors in online services like search engines and recommender systems. Text embeddings are the most widely used. Major AI service providers offer text embedding APIs to their users, and there are also many open-source text embedding models available for self-hosting. The current mainstream evaluation standard for text embedding models is [MTEB](https://github.com/embeddings-benchmark/mteb). However, [MTEB](https://github.com/embeddings-benchmark/mteb) does not assess the capabilities of text embedding models in recommender systems, and this post will attempt to evaluate the performance of text embedding models in recommender systems.

## Measurement

Embedding vectors in recommender systems are typically used for similar or related recommendations, with the goal that the distance between embedding vectors accurately reflects the similarity or relevance between items. The de facto relevance or similarity between items does not exist, but in recommender systems, the overlap of users between items, denoted as $s_{ij}$, can be used as an approximate measure of similarity or relevance.

$$
s_{ij} = \frac{|U_i \cap U_j|}{|U_i \cup U_j|}
$$

Here, $U_i$ and $U_j$ represent the user sets for items $i$ and $j$, respectively. A higher $s_{ij}$ value indicates greater user overlap between items $i$ and $j$. The distance between embedding vectors can be calculated using Euclidean distance:

$$
d_{ij} = ||\textbf{v}_i - \textbf{v}_j||
$$

Here, $\textbf{v}_i$ and $\textbf{v}_j$ represent the embedding vectors for items $i$ and $j$, respectively. To evaluate how well the distance between embedding vectors reflects the similarity or relevance between items, we can use Top-K recall ($Recall@K$). Top-K recall measures the proportion of items among the $K$ items with the smallest embedding vector distance from item $i$ that also appear in the list of $K$ items with the highest user overlap with item $i$. Higher Top-K recall indicates stronger capability of embedding vectors to recommend similar or relevant items.

The dataset used in the experiment is the [MovieLens 1M](https://grouplens.org/datasets/movielens/1m/) dataset, which contains 1 million user ratings for movies. We convert the synopsis of each movie into embedding vectors using a text embedding model. We then calculate the Top-K recall for each movie and take the average of all movies' Top-K recall as the performance measurement for the model in recommender systems.

## Text Embedding Models

For open-source models, we selected the top three models by download count on Ollama:

- [nomic-embed-text](https://ollama.com/library/nomic-embed-text)
- [mxbai-embed-large](https://ollama.com/library/mxbai-embed-large)
- [bge-m3](https://ollama.com/library/bge-m3)

For commercial models, we chose the strongest text embedding models from Alibaba Cloud and OpenAI:

- [text-embedding-v4](https://bailian.console.aliyun.com/?spm=5176.29597918.J_SEsSjsNv72yRuRFS2VknO.2.52007ca0kyUn9Q&tab=api#/api/?type=model&url=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F2712515.html) (Alibaba Cloud) supports 8 dimensions and over 100 major languages as well as programming languages.
- [text-embedding-3-large](https://openai.com/index/new-embedding-models-and-api-updates/) (OpenAI) also supports multiple dimensions and languages.

::: note

Testing commercial models incurs costs, and to control expenses, we did not test models from additional service providers. We have open-sourced the [testing script](https://github.com/gorse-cloud/embedding4rec) and welcome to run it with other models.

:::

## Results  

::: echarts Text Embedding Benchmark for Recommender Systems

```json
{
  "legend": {
    "data": ["text-embedding-v4", "text-embedding-3-large", "nomic-embed-text", "mxbai-embed-large", "bge-m3"]
  },
  "xAxis": {
    "name": "Dimension",
    "data": [64, 128, 256, 512, 768, 1024, 2048, 3072]
  },
  "yAxis": {
    "name": "Recall@100",
    "type": "value",
    "min": 0.1
  },
  "tooltip": {
    "trigger": "item",
    "formatter": "{c}"
  },
  "series": [
    {
      "name": "text-embedding-v4",
      "data": [0.11969, 0.13873, 0.15280, 0.1627, 0.16674, 0.16946, 0.17262],
      "type": "line",
      "smooth": true
    },
    {
      "name": "text-embedding-3-large",
      "data": [0.11272, 0.13769, 0.15086, 0.16362, 0.16610, 0.17026, 0.17241, 0.17395],
      "type": "line",
      "smooth": true
    },
    {
      "name": "nomic-embed-text",
      "data": [null, null, null, null, 0.15161],
      "type": "line"
    },
    {
      "name": "mxbai-embed-large",
      "data": [null, null, null, null, null, 0.16595],
      "type": "line"
    },
    {
      "name": "bge-m3",
      "data": [null, null, null, null, null, 0.11492],
      "type": "line"
    }
  ]
}
```

:::

Based on the results, the following conclusions can be drawn:  

1. Under the same dimension, commercial models such as [text-embedding-v4](https://bailian.console.aliyun.com/?spm=5176.29597918.J_SEsSjsNv72yRuRFS2VknO.2.52007ca0kyUn9Q&tab=api#/api/?type=model&url=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F2712515.html) and [text-embedding-3-large](https://openai.com/index/new-embedding-models-and-api-updates/) generally outperform open-source models, while the differences between commercial models are minimal.  
2. Among open-source models, [mxbai-embed-large](https://ollama.com/library/mxbai-embed-large) performs the best and can be the preferred choice for self-hosting.
3. Dimensionality significantly impacts model performance. As the dimension increases, the Top-K recall of the models generally improves, but the rate of improvement gradually diminishes. It is necessary to balance recommendation precision with computational and storage costs to select an appropriate dimension.  

::: tip  

Unless there are strict computational or storage resource limits, it is recommended to use vector lengths of 512 or higher to achieve better recommendation precision.  

:::  

In addition to quantitative comparisons, we can also intuitively evaluate model performance through recommendation results. Below are lists of similar movies recommended for ["Vertigo"](https://www.imdb.com/title/tt0052357/) using embeddings of two different dimensions from [text-embedding-v4](https://bailian.console.aliyun.com/?spm=5176.29597918.J_SEsSjsNv72yRuRFS2VknO.2.52007ca0kyUn9Q&tab=api#/api/?type=model&url=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F2712515.html):  

::: tabs

@tab 2048

| Movie                                     | Year | Director         | Genre                         |
|-------------------------------------------|------|------------------|-------------------------------|
| Rear Window                               | 1954 | Alfred Hitchcock | Suspenseful Thriller          |
| Spellbound                                | 1945 | Alfred Hitchcock | Psychological Thriller        |
| Psycho                                    | 1960 | Alfred Hitchcock | Psychological Thriller/Horror |
| North by Northwest                        | 1959 | Alfred Hitchcock | Suspense Thriller             |
| Stage Fright                              | 1950 | Alfred Hitchcock | Mystery Thriller              |
| Dial M for Murder                         | 1954 | Alfred Hitchcock | Mystery Thriller              |
| The Spiral Staircase                      | 1946 | Robert Siodmak   | Psychological Thriller/Noir   |
| The Hitch-Hiker                           | 1953 | Ida Lupino       | Noir Thriller                 |
| Shadow of a Doubt                         | 1943 | Alfred Hitchcock | Suspense Thriller             |
| Woman on the Verge of a Nervous Breakdown | 1988 | Pedro Almodóvar  | Dark Comedy/Drama             |

@tab 64

| Movie                                     | Year | Director         | Genre                  |
|-------------------------------------------|------|------------------|------------------------|
| Pi                                        | 1998 | Darren Aronofsky | Psychological Thriller |
| Silent Fall                               | 1994 | Bruce Beresford  | Psychological Thriller |
| Woman on the Verge of a Nervous Breakdown | 1988 | Pedro Almodóvar  | Dark Comedy/Drama      |
| Crash                                     | 1996 | David Cronenberg | Psychological Drama    |
| Eyes Wide Shut                            | 1999 | Stanley Kubrick  | Drama/Thriller         |
| Psycho                                    | 1960 | Alfred Hitchcock | Psychological Horror   |
| Windows                                   | 1980 | Herb Freed       | Psychological Thriller |
| The Morning After                         | 1986 | Sidney Lumet     | Suspense Drama         |
| North by Northwest                        | 1959 | Alfred Hitchcock | Suspense Thriller      |
| Peeping Tom                               | 1960 | Michael Powell   | Psychological Horror   |

:::

For users who have just watched *Vertigo*, the movies recommended by the 2048-dimensional embedding vectors exhibit higher relevance and similarity to *Vertigo*.

## Conclusion  

This post evaluates the performance of text embedding models in recommender systems. The results indicate that commercial models generally outperform open-source models, with [mxbai-embed-large](https://ollama.com/library/mxbai-embed-large) standing out among open-source models. Dimensionality significantly affects model performance, and it is recommended to use vector lengths of 512 or higher for better recommendation results.
