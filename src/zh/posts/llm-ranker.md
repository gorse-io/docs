---
icon: robot
date: 2026-02-01
category:
  - 使用教程
tag:
  - 教程
---
# 使用大语言模型排序推荐

Gorse推荐系统在[v0.5.2](https://github.com/gorse-io/gorse/releases/tag/v0.5.2)到[v0.5.4](https://github.com/gorse-io/gorse/releases/tag/v0.5.4)版本引入了[可视化编排推荐流程](../docs/dashboard/recflow.md)和[大语言模型排序](../docs/concepts/ranking.md)两大新功能。本文将介绍如何结合这两项功能，使用可视化流程编辑器创建一个使用大语言模型进行排序的推荐流程。

## 准备工作

首先需要准备好兼容OpenAI API的大语言模型服务，在本文发布的时间点，[英伟达](https://build.nvidia.com/)提供了免费的大模型推理服务值得尝试。

如果您已经部署好了Gorse推荐系统，那么以[英伟达](https://build.nvidia.com/)为例，需要将API地址、API密钥和模型名称添加到配置文件的以下字段中：

```toml
[openai]

# Base URL of OpenAI API.
base_url = "https://integrate.api.nvidia.com/v1"

# API key of OpenAI API.
auth_token = "NVIDIA_API_KEY"

# Name of chat completion model.
chat_completion_model = "openai/gpt-oss-120b"
```

也可以将这些字段通过环境变量覆盖：

```bash
OPENAI_BASE_URL="https://integrate.api.nvidia.com/v1"
OPENAI_AUTH_TOKEN="NVIDIA_API_KEY"
OPENAI_CHAT_COMPLETION_MODEL="openai/gpt-oss-120b"
```

没有部署过Gorse也不用担心，可以启动一个临时的Gorse实例来体验这些功能：

```bash
docker run -p 8088:8088 \
  -e OPENAI_BASE_URL="https://integrate.api.nvidia.com/v1" \
  -e OPENAI_AUTH_TOKEN="NVIDIA_API_KEY" \
  -e OPENAI_CHAT_COMPLETION_MODEL="openai/gpt-oss-120b" \
  zhenghaoz/gorse-in-one --playground
```

## 可视化编排

进入控制台（默认端口8088），点击左侧导航栏的*RecFlow*，进入推荐流程编辑器页面：

![](../../img/dashboard/recflow.png)

推荐流程的起点为数据源节点，终点为推荐节点，详细的节点介绍请参考[推荐流程文档](../docs/dashboard/recflow.md)，本文我们只关心基于大语言模型的排序节点。受限于上下文长度，大语言模型没有办法对全体物品进行排序，因此先由多种召回推荐算法（如协同过滤、相似物品等）召回一批候选物品，这些候选物品合并后由排序节点进行排序。

双击排序节点，选择类型为*LLM*，即可看到大语言模型排序的配置界面：

![=600x](../../img/dashboard/llm.png)

大语言模型排序需要一个提示词模板，使用交互历史和候选集渲染Jinja2模板，然后将渲染好的提示词发送给大语言模型。大模型的返回格式要求为CSV，每行包含物品ID。输入用户ID后点击运行按钮，预览功能将读取用户最近的反馈和最新物品，使用提示词模板渲染提示词。将渲染好的提示词发送给大预言模型。

保存推荐流程后，Gorse将加载流程编辑器定义的推荐流程，而不是配置文件中的推荐流程。备用节点在大模型排序中尤为重要，当大语言模型无法提供排序服务时，Gorse将使用备用节点的推荐结果。

## 排序准确率评估

控制台中的预览确保大语言模型可以返回正确的格式，但是排序的准确率需要使用*gorse-benchmark*工具进行评估。

1. 从代码仓库编译[gorse-benchmark](https://github.com/gorse-io/gorse/tree/master/cmd/gorse-benchmark)
1. *gorse-benchmark*暂时不支持流程编辑器定义的推荐流程，因此需要将推荐工作流的配置写入配置文件中。另外，数据库的访问方式也需要通过配置文件或者环境变量提供。
3. 运行以下命令评估大语言模型排序的准确率：

```bash
./gorse-benchmark llm --config config.toml -s 1
```

`-s`参数指定每个用户的训练样本数量。划分训练集和测试集的时候，对于每个用户，首先将反馈按照时间从最新到最旧排序，然后取最新反馈作为测试集，后续的`s`条反馈作为训练集，剩余的反馈不参与训练。在评估排序能力时，对于每个用户，随机选择99个未反馈物品与测试集物品一起排序，计算NDCG@10，数值越大表示排序准确率越高。

将协同过滤和多种大语言模型在playground数据集上的评测结果绘制如下：

::: echarts 大模型排序准确率对比

```json
{
  "legend": {
    "data": ["协同过滤", "gpt-oss-120b", "deepseek-v3.2"]
  },
  "xAxis": {
    "name": "训练样本数量",
    "data": [1, 5, 10, 20, 50]
  },
  "yAxis": {
    "name": "NDCG@10",
    "type": "value"
  },
  "tooltip": {
    "trigger": "item",
    "formatter": "{c}"
  },
  "series": [
    {
      "name": "协同过滤",
      "data": [0.1454, 0.2130, 0.2671, 0.2895, 0.3082],
      "type": "bar"
    },
    {
      "name": "gpt-oss-120b",
      "data": [0.2509, 0.2802, 0.2998, 0.3086, 0.3060],
      "type": "bar"
    },
    {
      "name": "deepseek-v3.2",
      "data": [0.2595, 0.2873, 0.3084, 0.3140, 0.3207],
      "type": "bar"
    }
  ]
}
```
:::

本文对比了协同过滤（矩阵分解）、gpt-oss-120b和deepseek-v3.2三种排序算法在不同训练样本数量下的NDCG@10。大语言模型在训练样本数量较少时显著优于协同过滤，随着训练样本数量的增加，协同过滤和大语言模型的差距逐渐缩小。当样本数量达到50时，协同过滤的排序准确指标已经高于gpt-oss-120b，但仍然低于deepseek-v3.2。实验结果对大模型排序的使用有以下启示：

1. 大语言模型在冷启动场景下具有显著优势，可以有效提升推荐系统的排序能力。
2. 排序任务使用120B参数量级的大语言模型已经可以取得不错的效果，更大参数量级的模型提升有限。
3. 随着训练数据的积累，大模型排序的优势逐渐减小，需要根据测试结果选择合适的排序算法。

::: note 点击率预测模型去哪里了？
细心的读者不难发现，负责排序任务的点击率预测模型怎么不在本文的对比中出现？这是因为点击率预测模型预测的是用户点击（产生正反馈）的概率，并不是为排序任务而优化，使用排序指标评估点击率预测模型并不公平。使用协同过滤和大模型排序进行对比是无奈之举，不过已经足够说明大模型排序在推荐系统中的潜力。
:::

## 未来展望

本文只是对大模型排序非常初步的探索，我们后续会用更丰富的指标在更多的场景下测试更多的大语言模型。未来也会探索微调中小规模的大语言模型是否能进一步提升其排序能力，敬请期待！
