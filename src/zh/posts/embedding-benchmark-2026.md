---
icon: zhinengsuanfa
date: 2026-03-01
category:
  - 技术分享
tag:
  - 机器学习
---
# 2026年哪个本文嵌入模型最适合推荐系统

在2025年的文章[推荐场景下文本嵌入模型性能对比](./embedding-benchmark.md)中，我们评估了本文嵌入模型在相似推荐上的表现。在文章发布之后的半年内，阿里云和谷歌相继推出了新一代的开源本文嵌入模型，分别是阿里云的[qwen3-embedding](https://github.com/QwenLM/Qwen3-Embedding)和谷歌的[embeddinggemma](https://ai.google.dev/gemma/docs/embeddinggemma)。最近[gorse-cli](https://github.com/gorse-io/gorse/tree/master/cmd/gorse-cli)工具也新增了文本嵌入模型的基准测试功能，本文将使用[gorse-cli](https://github.com/gorse-io/gorse/tree/master/cmd/gorse-cli)和playground数据集，对热门的开源本文嵌入模型进行一次全面的评测。

## 评估方法：基于相似度的单样本推荐

在2026年的评测使用了更贴近实际推荐场景的评测方法，具体步骤如下：

1. **样本划分**：对于每个用户，将其行为序列按时间排序。取最新的一个反馈作为测试集，紧邻其前的一个反馈作为训练集。由于没有训练的过程，训练集并不是用于训练，而是用于计算候选集物品和训练集物品之间的相似度作为排序的依据。
2. **候选集生成**：随机选择99个用户未产生反馈的物品，与测试集中的物品组成一个包含100个物品的候选集。
3. **排序逻辑**：计算训练集物品的嵌入向量与候选集中100个物品的嵌入向量之间的欧式距离，按照距离从小到大进行排序，距离越小表示物品越相似。
4. **评估指标**：根据相似度得分对 100 个物品进行排序，计算NDCG@10，数值越大表示排序准确率越高。

## 实验配置

首先需要将API地址和API密钥添加到配置文件的以下字段中：

```toml
[openai]

# Base URL of OpenAI API.
base_url = "https://integrate.api.nvidia.com/v1"

# API key of OpenAI API.
auth_token = "NVIDIA_API_KEY"
```

也可以将这些字段通过环境变量覆盖：

```bash
OPENAI_BASE_URL="https://integrate.api.nvidia.com/v1"
OPENAI_AUTH_TOKEN="NVIDIA_API_KEY"
```

从代码仓库编译好[gorse-cli](https://github.com/gorse-io/gorse/tree/master/cmd/gorse-cli)运行以下命令评估文本嵌入模型的准确率：

```bash
./gorse-cli bench-embedding --config ./config/config.toml \
  --text-column item.Comment \
  --embedding-model qwen3-embedding:0.6b \
  --embedding-dimensions 1024 \
  --shot 1
```

- `--text-column`参数指定用于生成嵌入的文本字段。
- `--embedding-model`参数指定使用的文本嵌入模型。
- `--embedding-dimensions`参数指定嵌入向量的维度
- `--shot`参数指定使用多少条训练样本来计算相似度，本文使用单样本。

## 实验结果

评测的开源模型在[推荐场景下文本嵌入模型性能对比](./embedding-benchmark.md)一文的基础上新增了阿里云的`qwen3-embedding`系列和谷歌的`embeddinggemma`系列。另外，阿里云的`text-embedding-v4`作为商业模型的代表作为参考：

::: echarts 排序准确率对比

```json
{
  "legend": {
    "data": ["text-embedding-v4", "qwen3-embedding:0.6b", "qwen3-embedding:4b", "qwen3-embedding:8b", "embeddinggemma:300m", "nomic-embed-text", "mxbai-embed-large", "bge-m3"]
  },
  "xAxis": {
    "name": "向量长度",
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

根据实验结果，我们可以得出以下结论：

- **商业模型依然领先**：阿里云的 `text-embedding-v4` 在绝大多数维度下都表现最佳。特别是在2048维时，NDCG@10达到了0.1727，展现了其强大的语义表征能力。
- **千闻3系列的惊艳表现**：
    - [qwen3-embedding:4b](https://huggingface.co/Qwen/Qwen3-Embedding-4B)模型表现非常稳健，在 512 维左右达到了性能峰值，甚至超过了参数量更大的[8b](https://huggingface.co/Qwen/Qwen3-Embedding-8B)模型。这表明在嵌入任务中，模型规模并不是越大越好。
    - [qwen3-embedding:0.6b](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B)作为轻量级模型，在极低维度（32, 64, 128）下展现了极高的效率，非常适合资源受限的端侧推荐场景。
4. **维度与性能的权衡**：大多数模型在512维到1024维之间进入性能饱和期。对于大多数推荐系统，选择512维可以在保证准确率的同时，大幅降低存储和索引计算成本。

## 总结与建议

在2026年的推荐系统本文嵌入向量选型中，本文的建议如下：

- **追求极致效果**：首选商业模型。其在各种维度下均有极高的上限，且对多语言支持极佳。
- **追求高性价比/私有化部署**：[qwen3-embedding:4b](https://huggingface.co/Qwen/Qwen3-Embedding-4B)是目前的性价比之王。它以较小的参数量实现了媲美商业模型的推荐精度。
- **低延迟/端侧场景**：[qwen3-embedding:0.6b](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B)结合64或128维向量，是最佳的轻量化方案。

即使本文提供了一些建议，但是在实际选型时，建议使用[gorse-cli](https://github.com/gorse-io/gorse/tree/master/cmd/gorse-cli)在自己的数据集上进行评测，以选择最适合自己业务场景的文本嵌入模型。
