---
icon: search
shortTitle: Item-to-Item
---
# Item-to-Item Recommenders

Recommending similar items based on user preferred items is a simple and effective recommendation strategy. Gorse has implemented item-to-item recommenders that supports embedding similarity, tags similarity and users similarity.

## Configuration

The new item-to-item recommenders need to be explicitly configured. The following three fields need to be filled in:
- `name` is the name of the recommender.
- `type` is the similarity type, and the following values are supported:
  - `embedding` is the Euclidean distance between embedding vectors.
  - `tags` is the similarity based on the number of common tags.
  - `users` is the similarity based on the number of common users.
- `column` is the field used by the recommender to calculate the similarity, expressed in the [Expr](https://expr-lang.org/) language. Suppose the embedding vectors of the README of GitHub repositories are stored in the `embedding` field of `Labels`, and the tags are stored in the `topics` field: 

```json
{
    "ItemId": "gorse-io:gorse",
    "IsHidden": false,
    "Categories": [],
    "Timestamp": "2022-10-23T03:50:24Z",
    "Labels": {
        "embedding": [0.0017246103, -0.009725488, 0.005806058, -0.0187753, -0.015343021, ...],
        "topics": ["machine-learning", "service", "recommender", "go", "recommender-system", "knn", "collaborative-filtering"]
    },
    "Comment": "An open source recommender system service written in Go"
}
```

If `embedding` similarity is used, the value of column should be `item.Labels.embedding`; if `tags` similarity is used, the value of column should be `item.Labels.topics`. When type is `embedding` or `tags`, column cannot be empty. However, when type is `users`, column must be empty.

## Algorithms

### Embedding Similarity

There are $K$-dimensional embedding vectors $p$ and $q$ for two items respectively, the embedding similarity between them is

$$
\sqrt{\sum^K_{k=1}(p_k-q_k)^2}
$$

The dimension of embedding vectors is usually relatively large. For example, the `text-embedding-3-small` model of OpenAI generates embedding vectors with 1536 dimensions. Using embedding vectors requires more disk space and memory compared to tags. Compared with tags similarity, encoding text and images into embedding vectors can eliminate the cost of manual tags maintenance or automatic tags generation, and the similarity calculated by embedding vectors is more accurate. Embedding vectors can be generated from APIs provided by AI providers such as OpenAI and Anthropic, or self-deployed projects like [Ollama](https://ollama.com/) and [CLIP-as-service](https://clip-as-service.jina.ai/index.html).

### Tags Similarity

Tags similarity holds that the more overlapping tags there are between items, the more similar they are. First, calculate the TF-IDF of each tag

$$
w_l=-\log\left(\frac{|I|}{|I_l|}\right)
$$

where $|I|$ represents the total number of items, and $I_l$ represents the number of items labeled with tag $l$. If a tag is used by more items, it is more general and thus has a lower weight. Then, calculate the tags similarity between items

$$
\frac{\sum_{l\in L_i \cap L_j}w_l}{\sqrt{\sum_{l\in L_i}w_l^2}\sqrt{\sum_{l\in L_j}w_l^2}}
$$

where $L_i$ and $L_j$ represent the tag sets of item $i$ and item $j$ respectively. Although tag similarity is not as accurate as embedding similarity, it can help users discover more content that has similarities but also differences.

### Users Similarity

Users similarity believes that the more overlapping users there are between items, the more similar they are. Similarly, first, it is necessary to calculate the TF-IDF of each user

$$
w_u = -\log\left(\frac{|I|}{|I_u|}\right)
$$

where $|I|$ represents the total number of items, and $|I_u|$ represents the number of items liked by user $u$. Then, calculate the user similarity between items

$$
\frac{\sum_{u\in U_i \cap U_j}w_u}{\sqrt{\sum_{u\in U_i}w_u^2}\sqrt{\sum_{u\in U_j}w_u^2}}
$$

where $U_i$ and $U_j$ represent the user sets of item $i$ and item $j$ respectively. One drawback of users similarity is that it tends to recommend popular items because popular items always have a high overlap of users with other items.

## API

You can access item-to-item recommendations through the following API:

```bash
curl http://localhost:8087/api/item-to-item/<name>/<item-id>
```

## Examples

Take the dataset of the demo project [GitRec](https://gitrec.gorse.io/) as an example. The embedding vectors of the README file of GitHub projects are stored in the `embedding` field, and the tags are saved in the `topics` field.

```json
{
    "ItemId": "gorse-io:gorse",
    "IsHidden": false,
    "Categories": [],
    "Timestamp": "2022-10-23T03:50:24Z",
    "Labels": {
        "embedding": [0.0017246103, -0.009725488, 0.005806058, -0.0187753, -0.015343021, ...],
        "topics": ["machine-learning", "service", "recommender", "go", "recommender-system", "knn", "collaborative-filtering"]
    },
    "Comment": "An open source recommender system service written in Go"
}
```

The configuration entry of an embedding similarity based item-to-item recommender:

```toml
[[recommend.item-to-item]]
name = "similar_embedding"
type = "embedding"
column = "item.Labels.embedding"
```
The configuration entry of a tags similarity based item-to-item recommender:

```toml
[[recommend.item-to-item]]
name = "similar_topics"
type = "tags"
column = "item.Labels.topics"
```
