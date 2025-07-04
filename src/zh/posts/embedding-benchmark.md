---
icon: zhinengsuanfa
date: 2025-07-05
category:
  - 技术分享
tag:
  - 机器学习
---
# 推荐场景下文本嵌入模型性能对比

向量嵌入技术可以将图片、文字等信息转换为高维向量，从而能够在搜素推荐等场景下，通过计算向量之间的距离来计算图片、文本等原始内容之间的相关性。其中本文嵌入用到最多，市面上主要的AI服务商都会为他们的用户提供本文嵌入API，另外也有很多开源文本嵌入模型可供自行部署使用。目前主流的文本嵌入模型的评估标准为[MTEB](https://github.com/embeddings-benchmark/mteb)，但是[MTEB](https://github.com/embeddings-benchmark/mteb)并没有评估文本嵌入模型在推荐系统中的能力，而本文将尝试评估文本嵌入模型在推荐场景下的表现。

## 实验指标

嵌入向量在推荐系统中通常用于相似推荐或者相关推荐，希望嵌入向量之间的距离能够很好地表达推荐物料之前的相似性和相关性。物料之间的相关性和相似度实际上不存在标准答案，在推荐系统中可以使用物料之间用户的重叠程度$s_{ij}$来近似地衡量物料之间的相似度或者相关性。

$$
s_{ij} = \frac{|U_i \cap U_j|}{|U_i \cup U_j|}
$$

其中$U_i$和$U_j$分别表示物料$i$和$j$的用户集合，$s_{ij}$的值越大，表示物料$i$和$j$之间的用户重叠度越高。而向量之间的距离可以使用欧式距离计算：

$$
d_{ij} = ||\textbf{v}_i - \textbf{v}_j||
$$

其中$\textbf{v}_i$和$\textbf{v}_j$分别表示物料$i$和$j$的嵌入向量。为了衡量嵌入向量之间的距离反馈物料相似度或者相关度的能力，我们可以使用Top-K准确率（$Recall@K$），Top-K准确率表示在与物料$i$的向量距离最小的$K$个物料中，有多少比例的物料也在与物料$i$用户重合度最高的$K$个物料列表中。Top-K准确率越高，意味着嵌入向量推荐相似或者相关物料的能力越强。

实验使用的数据集为[MovieLens 1M](https://grouplens.org/datasets/movielens/1m/)数据集，包含100万条用户对电影的评分数据。我们将每个电影的简介作为文本内容，使用文本嵌入模型将其转换为向量。然后计算每个电影上的Top-K准确率，最后对所有电影的Top-K准确率取平均值，作为模型在推荐场景下的性能指标。

## 文本嵌入模型

开源模型我们选择了Ollama下载量前三的模型，它们分别是：

- [nomic-embed-text](https://ollama.com/library/nomic-embed-text)
- [mxbai-embed-large](https://ollama.com/library/mxbai-embed-large)
- [bge-m3](https://ollama.com/library/bge-m3)

商业模型我们选择了阿里云和OpneAI各自的最强文本嵌入模型：

- [text-embedding-v4](https://bailian.console.aliyun.com/?spm=5176.29597918.J_SEsSjsNv72yRuRFS2VknO.2.52007ca0kyUn9Q&tab=api#/api/?type=model&url=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F2712515.html)（阿里云）支持8种向量维度，支持100+主流语种及多种编程语言
- [text-embedding-3-large](https://openai.com/index/new-embedding-models-and-api-updates/)（OpenAI）同样支持多种向量维度和多种语言

::: note

测试商业模型他需要花费一定的费用，为了控制成本，我们没有测试来自更多服务商的模型。我们开源了[测试脚本](https://github.com/gorse-cloud/embedding4rec)，欢迎大家在自己的环境中运行测试脚本来获取更多模型的性能数据。

:::

## 实验结果


::: echarts 推荐场景下文本嵌入模型性能对比

```json
{
  "legend": {
    "data": ["text-embedding-v4", "text-embedding-3-large", "nomic-embed-text", "mxbai-embed-large", "bge-m3"]
  },
  "xAxis": {
    "name": "向量长度",
    "data": [64, 128, 256, 512, 768, 1024, 2048, 3072]
  },
  "yAxis": {
    "name": "准确率@100",
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

根据实验结果可以得出一下结论：

1. 在相同维度下，商业模型[text-embedding-v4](https://bailian.console.aliyun.com/?spm=5176.29597918.J_SEsSjsNv72yRuRFS2VknO.2.52007ca0kyUn9Q&tab=api#/api/?type=model&url=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F2712515.html)和[text-embedding-3-large](https://openai.com/index/new-embedding-models-and-api-updates/)的性能普遍优于开源模型，而商业模型之间的差异并不大。
2. 在开源模型中，[mxbai-embed-large](https://ollama.com/library/mxbai-embed-large)的表现最好，可以作为自行部署的首选模型。
3. 向量维度对模型表现有显著影响，随着向量维度的增加，模型的Top-K准确率普遍提高，但是提高的幅度逐渐减小。需要权衡推荐准确率和计算存储成本，选择合适的向量维度。

::: tip

除非有严苛的计算存储资源限制，否则建议使用512维以上的向量长度，从而获得较好的推荐准确率。

:::

除了量化对比，我们还可以通过推荐结果来直观地感受模型的表现。以下是使用[text-embedding-v4](https://bailian.console.aliyun.com/?spm=5176.29597918.J_SEsSjsNv72yRuRFS2VknO.2.52007ca0kyUn9Q&tab=api#/api/?type=model&url=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F2712515.html)两种维度嵌入向量为[《迷魂记》](https://movie.douban.com/subject/1297294/)推荐的相似电影列表：

::: tabs

@tab 2048

| 电影名称         | 发布年份 | 导演                | 电影类型            |
|----------------|----------|-------------------|------------------|
| 《后窗》           | 1954     | 阿尔弗雷德·希区柯克 | 惊悚片/悬疑         |
| 《爱德华大夫》     | 1945     | 阿尔弗雷德·希区柯克 | 心理惊悚片          |
| 《惊魂记》         | 1960     | 阿尔弗雷德·希区柯克 | 心理惊悚片/恐怖     |
| 《西北偏北》       | 1959     | 阿尔弗雷德·希区柯克 | 悬疑惊悚片          |
| 《欲海惊魂》       | 1950     | 阿尔弗雷德·希区柯克 | 悬疑片              |
| 《电话谋杀案》     | 1954     | 阿尔弗雷德·希区柯克 | 悬疑/犯罪           |
| 《哑女惊魂记》     | 1946     | 罗伯特·西奥德马克   | 心理惊悚片/黑色电影 |
| 《搭便车的人》     | 1953     | 艾达·卢皮诺         | 黑色电影            |
| 《辣手摧花》       | 1943     | 阿尔弗雷德·希区柯克 | 悬疑/惊悚           |
| 《崩溃边缘的女人》 | 1988     | 佩德罗·阿莫多瓦     | 剧情/喜剧/社会讽刺  |

@tab 64

| 电影名称         | 发布年份 | 导演                | 电影类型          |
|-----------------|----------|---------------------|---------------|
| 《死亡密码》       | 1998     | 达伦·阿罗诺夫斯基   | 心理惊悚片        |
| 《沉默的陷阱》     | 1994     | -                   | 心理悬疑          |
| 《崩溃边缘的女人》 | 1988     | 佩德罗·阿莫多瓦     | 黑色喜剧          |
| 《欲望号快车》     | 1996     | 大卫·柯南伯格       | 先锋电影/心理惊悚 |
| 《大开眼戒》       | 1999     | 斯坦利·库布里克     | 心理惊悚/剧情     |
| 《惊魂记》         | 1960     | 阿尔弗雷德·希区柯克 | 恐怖/心理惊悚     |
| 《窗》             | 1980     | 赫伯·弗里德         | 心理惊悚          |
| 《含冤莫白酒醒时》 | 1986     | -                   | 悬疑/黑色电影     |
| 《西北偏北》       | 1959     | 阿尔弗雷德·希区柯克 | 悬疑/冒险         |
| 《偷窥狂》         | 1960     | 迈克尔·鲍威尔       | 心理惊悚/元电影   |

:::

对于刚看完《迷魂记》的用户来说，2048维的向量推荐的电影和《迷魂记》有着更高的相关性和相似度。

## 总结

本文对文本嵌入模型在推荐场景下的性能进行了评估，结果表明商业模型在推荐准确率上普遍优于开源模型，而开源模型中[mxbai-embed-large](https://ollama.com/library/mxbai-embed-large)表现较好。向量维度对模型性能有显著影响，建议使用512维以上的向量长度以获得较好的推荐效果。
