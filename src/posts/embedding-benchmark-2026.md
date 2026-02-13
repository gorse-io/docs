---
date: 2026-03-01
category:
  - technical
tag:
  - AI/ML
---
# Benchmark Text Embedding Models for RecSys in 2026

In the 2025 post [Text Embedding Benchmark for Recommender Systems](./embedding-benchmark.md), we benchmarked the performance of text embedding models in similarity-based recommendations. Within six months of that post's publication, Alibaba Cloud and Google launched a new generation of open-source text embedding models: [qwen3-embedding](https://github.com/QwenLM/Qwen3-Embedding) by Alibaba Cloud and [embeddinggemma](https://ai.google.dev/gemma/docs/embeddinggemma) by Google. Recently, the [gorse-cli](https://github.com/gorse-io/gorse/tree/master/cmd/gorse-cli) also added a benchmarking feature for text embedding models. This post will use [gorse-cli](https://github.com/gorse-io/gorse/tree/master/cmd/gorse-cli) and the playground dataset to conduct a comprehensive benchmark of popular open-source text embedding models.

## Evaluation: 1-shot Similarity-based Recommendation

The 2026 benchmark uses a methodology closer to actual recommendation scenarios. The specific steps are as follows:

1. **Sample Split**: For each user, their feeedback is sorted chronologically. The latest feedback is taken as the test set, and the feedback immediately preceding it is taken as the training set. Since there is no training process, the training set is not used for training but for calculating the similarity between items in the candidate set and the training set item as the scores for ranking.
2. **Candidate Generation**: 99 items that the user has not interacted with are randomly selected and combined with the item from the test set to form a candidate set of 100 items.
3. **Ranking**: The Euclidean distance between the embedding vector of the training set item and the embedding vectors of the 100 items in the candidate set is calculated. Items are ranked in ascending order of distance, with smaller distances indicating higher similarity.
4. **Evaluation Metric**: NDCG@10 is calculated based on the ranking. A higher value indicates better ranking accuracy.

## Configuration

First, you need to add the API endpoint and API key to the following fields in the configuration file:

```toml
[openai]

# Base URL of OpenAI API.
base_url = "https://integrate.api.nvidia.com/v1"

# API key of OpenAI API.
auth_token = "NVIDIA_API_KEY"
```

These fields can also be overridden via environment variables:

```bash
OPENAI_BASE_URL="https://integrate.api.nvidia.com/v1"
OPENAI_AUTH_TOKEN="NVIDIA_API_KEY"
```

Compile [gorse-cli](https://github.com/gorse-io/gorse/tree/master/cmd/gorse-cli) from Gorse repository and run the following command to evaluate the performance of the text embedding model:

```bash
./gorse-cli bench-embedding --config ./config/config.toml \
  --text-column item.Comment \
  --embedding-model qwen3-embedding:0.6b \
  --embedding-dimensions 1024 \
  --shot 1
```

- The `--text-column` parameter specifies the text field used to generate embeddings.
- The `--embedding-model` parameter specifies the text embedding model to use.
- The `--embedding-dimensions` parameter specifies the dimension of the embedding vector.
- The `--shot` parameter specifies how many training samples to use for calculating similarity. This post uses 1-shot.

## Results

The evaluated open-source models include `qwen3-embedding` from Alibaba Cloud and the `embeddinggemma` from Google, building upon the models in [Comparing Text Embedding Model Performance in Recommendation Scenarios](./embedding-benchmark.md). Additionally, Alibaba Cloud's `text-embedding-v4` is included as a reference for commercial models:

::: echarts Ranking Performance Comparison

```json
{
  "legend": {
    "data": ["text-embedding-v4", "qwen3-embedding:0.6b", "qwen3-embedding:4b", "qwen3-embedding:8b", "embeddinggemma:300m", "nomic-embed-text", "mxbai-embed-large", "bge-m3"]
  },
  "xAxis": {
    "name": "Vector Dimensions",
    "data": [32, 64, 128, 256, 512, 768, 1024, 2048]
  },
  "yAxis": {
    "name": "NDCG@10",
    "type": "value",
    "min": 0.08
  },
  "tooltip": {
    "trigger": "item",
    "formatter": "{c}"
  },
  "series": [
    {
      "name": "text-embedding-v4",
      "data": [null, 0.1425, 0.1485, 0.1519, 0.1622, 0.1666, 0.1668, 0.1727],
      "type": "line",
      "smooth": true
    },
    {
      "name": "qwen3-embedding:0.6b",
      "data": [0.1192, 0.1372, 0.1459, 0.1489, 0.1469, 0.1445, 0.1435],
      "type": "line",
      "smooth": true
    },
    {
      "name": "qwen3-embedding:4b",
      "data": [0.1233, 0.1362, 0.1470, 0.1507, 0.1577, 0.1566, 0.1553, 0.1523],
      "type": "line",
      "smooth": true
    },
    {
      "name": "qwen3-embedding:8b",
      "data": [0.1124, 0.1321, 0.1380, 0.1390, 0.1474, 0.1459, 0.1460, 0.1473],
      "type": "line",
      "smooth": true
    },
    {
      "name": "embeddinggemma:300m",
      "data": [null, null, 0.0920, 0.1057, 0.1146, 0.1251],
      "type": "line",
      "smooth": true
    },
    {
      "name": "nomic-embed-text",
      "data": [null, null, null, null, null, 0.1309],
      "type": "line"
    },
    {
      "name": "mxbai-embed-large",
      "data": [null, null, null, null, null, null, 0.16595],
      "type": "line"
    },
    {
      "name": "bge-m3",
      "data": [null, null, null, null, null, null, 0.1128],
      "type": "line"
    }
  ]
}
```

:::

Based on the results, we can draw the following conclusions:

- **Commercial Models Still Lead**: Alibaba Cloud's `text-embedding-v4` performed best in most dimensions. Particularly at 2048 dimensions, the NDCG@10 reached 0.1727, demonstrating its powerful semantic representation capabilities.
- **Impressive Performance of the Qwen3 Embedding**:
    - [qwen3-embedding:4b](https://huggingface.co/Qwen/Qwen3-Embedding-4B) performed very robustly, reaching a performance peak at around 512 dimensions, even surpassing the [8b](https://huggingface.co/Qwen/Qwen3-Embedding-8B) model with more parameters. This indicates that in embedding tasks, larger model size is not always better.
    - [qwen3-embedding:0.6b](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B), as a lightweight model, demonstrated high efficiency at extremely low dimensions (32, 64, 128), making it very suitable for resource-constrained edge scenarios.
- **Trade-off Between Dimensions and Performance**: Most models reach performance saturation between 512 and 1024 dimensions. For most recommendation systems, choosing 512 dimensions can ensure accuracy while significantly reducing storage and indexing costs.

## Conclusion

For text embedding models for recommender systems in 2026, we offer the following advice:

- **Pursue Ultimate Performance**: Commercial models are the top choice. They have high performance ceilings across various dimensions and excellent multilingual support.
- **Cost-Efficiency/Private Deployment**: [qwen3-embedding:4b](https://huggingface.co/Qwen/Qwen3-Embedding-4B) is the current king of cost-efficiency. It achieves recommendation accuracy comparable to commercial models with fewer parameters.
- **Low Latency/Edge**: [qwen3-embedding:0.6b](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B) with 64 or 128-dimension is the best lightweight solution.

While this post provides some guidance, it is recommended to use [gorse-cli](https://github.com/gorse-io/gorse/tree/master/cmd/gorse-cli) to evaluate on your own dataset to choose the text embedding model that best fits your specific business scenario.
