---
icon: robot
date: 2026-02-01
category:
  - 使用教程
tag:
  - 教程
---
# 可视化编排使用大语言模型排序的推荐流程

Gorse推荐系统在[v0.5.2](https://github.com/gorse-io/gorse/releases/tag/v0.5.2)到[v0.5.4](https://github.com/gorse-io/gorse/releases/tag/v0.5.4)版本引入了[可视化编排推荐流程](../docs/dashboard/recflow.md)和[大语言模型排序](../docs/concepts/ranking.md)两大新功能。本文将介绍如何结合这两项功能，使用可视化流程编辑器创建一个使用大语言模型进行排序的推荐流程。

## 准备工作

首先需要准备好兼容OpenAI API的大语言模型服务，在本文发布的时间点，[英伟达](https://build.nvidia.com/)提供了免费的大模型推理服务值得尝试。

如果您已经部署好了Gorse推荐系统，那么以Ollama为例，需要将API地址、API密钥和模型名称添加到配置文件的以下字段中：

```toml
[openai]

# Base URL of OpenAI API.
base_url = "http://localhost:11434/v1"

# API key of OpenAI API.
auth_token = "ollama"

# Name of chat completion model.
chat_completion_model = "gpt-oss:120b"
```

也可以将这些字段通过环境变量覆盖：

```bash
OPENAI_BASE_URL="http://localhost:11434/v1"
OPENAI_AUTH_TOKEN="ollama"
OPENAI_CHAT_COMPLETION_MODEL="gpt-oss:120b"
```

没有部署过Gorse也不用担心，可以启动一个临时的Gorse实例来体验这些功能：

```bash
docker run -p 8088:8088 \
  -e OPENAI_BASE_URL="http://host.docker.internal:11434/v1" \
  -e OPENAI_AUTH_TOKEN="ollama" \
  -e OPENAI_CHAT_COMPLETION_MODEL="gpt-oss:120b" \
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
      "data": [0.1454, 0.2130, 0.2671, 0.2895],
      "type": "bar"
    },
    {
      "name": "gpt-oss-120b",
      "data": [0.2509, 0.2802, 0.2998, 0.3086],
      "type": "bar"
    },
    {
      "name": "deepseek-v3.2",
      "data": [0.2595, 0.2873, 0.3084],
      "type": "bar"
    }
  ]
}
```
