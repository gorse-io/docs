---
icon: github-fill
date: 2026-01-01
category:
  - 案例分享
tag:
  - 案例
---

# 打造 GitHub 仓库智能推荐系统

和那些常见的前端、后端以及如日中天的AI开源项目不同，项目的潜在用户很难相对直接地感受到一个开源推荐系统的作用。因此，Gorse 的作者打造了 [GitRec](https://gitrec.gorse.io)，一个专门为 GitHub 仓库设计的推荐系统。这个项目既可以展示 Gorse 的基本能力，也能帮助他们在海量的开源项目中发现有趣且有用的仓库。

<iframe src="https://gitrec.gorse.io" style="width:100%; height:600px; border:none;"></iframe>

::: note
GitRec 已经运行了三年之久，但是在 2025 年针对 Gorse v0.5 进行了全面的升级和重构，本文介绍的内容均基于最新版本的 GitRec。用的 v0.5 版本新功能会在本文以<u>下划线</u>标注。
:::

## 数据收集

巧妇难为无米之炊，构建推荐系统的第一步是构造好物品、用户、反馈三种数据。

### 物品：GitHub 仓库

- `ItemId`：为了方便拼接URL，仓库名称中的`/`被替换为`:`并统一为小写。
- `Categories`：仓库的主要编程语言，用户可以使用编程语言过滤推荐结果。
- `Timestamp`：仓库的最后更新时间。
- `Labels`<u>是由两个字段组成的JSON</u>：
  - **话题**：由仓库管理员添加的话题标签 (Topics)。
  - **描述的本文嵌入向量**：GitRec 的一大亮点是它利用 OpenAI 的 `text-embedding-v3` 模型为每个仓库的描述（Description）生成了 512 维的向量嵌入。如果一个仓库没有描述，：GitRec 会使用 `gpt-5-nano` 大语言模型阅读其 `README.md` 文件，并生成一个单句摘要，然后再进行向量化。

以下是 [Gorse 仓库](https://github.com/gorse-io/gorse) 在 Gorse 中的物品记录，`Comment` 字段使用仓库描述作为备注方便后台查看。

```json
{
  "ItemId": "gorse-io:gorse",
  "IsHidden": false,
  "Categories": [
    "go"
  ],
  "Timestamp": "2025-05-24T19:41:09Z",
  "Labels": {
    "embedding": [-0.0913363918662071, -0.0101912319660187, -0.0689065530896187, 0.0137317562475801, ...],
    "topics": ["recommender-system", "collaborative-filtering", "go", "knn", "machine-learning"]
  },
  "Comment": "Gorse open source recommender system engine"
}
```

由于 GitHub 上的仓库数量庞大，GitRec 只收集 stars 数量超过 100 的仓库以在成本和覆盖率之间取得平衡。仓库主要由两种方式收集：

1. 每天爬取 GitHub trending 上的热门仓库。
2. 接受用户反馈时，顺便将用户反馈涉及的仓库加入到物品库中。 

### 用户：放弃个人信息

综合考虑之下，GitRec 选择不收集用户除了用户 ID 和反馈以外的任何个人信息，原因如下：
1. GitHub 用户的个人信息非常多样化，除了公司、位置等少量结构化数据外，用户还可以在个人简介、README 文件等非结构化文本中提供信息。同时，也有非常多的用户只填写了极少量的信息甚至没有，这使得基于个人信息的推荐变得非常困难。
2. 在注重隐私保护的当下，选择不收集个人信息是一个不错的选择。

Gorse 中一条用户记录的`UserId`对应 GitHub 用户ID，而其他字段都为空。每当新用户登录 GitRec，系统会自动创建一条用户记录。

```json
{
  "UserId": "zhenghaoz",
  "Labels": [],
  "Comment": ""
}
```

### 反馈：点赞和浏览

通过 GitHub 的 API，实际上只能获取到用户对仓库的 `star` 行为，但是无法获取“已读”的行为。因此，GitRec 提供了一个浏览器插件，可以收集用户浏览仓库的记录。最终，GitRec 中的反馈定义如下：

**正向反馈**：
- `star`: 用户在 GitHub 上为一个仓库点赞。
- `like`: 用户在 GitRec 网站上::likefill::一个仓库。
- `read>=3`: 用户查看一个仓库至少 3 次。

**浏览反馈**：
- `read`: 用户查看一个仓库。

`read`反馈由浏览器插件收集，`like`反馈由 GitRec 网站收集，而`star`反馈通过 GitHub API 每天同步一次。<u>`read`次数在每次用户访问仓库时累加，当次数达到 3 次时，系统会将其转换为正向反馈。</u>

## 推荐流水线配置

GitRec 推荐流水线的详细配置可以在仓库的 [config.toml](https://github.com/gorse-io/gitrec/blob/master/config.toml)文件中找到，主要内容为：

- 非个性化推荐`most_starred_weekly`：<u>分数由自定义公式计算</u>，推荐本周收藏数最多的仓库。
- 物品到物品推荐`neighbors`：<u>根据仓库描述的向量嵌入推荐相似的项目</u>。
- 用户到物品推荐`neighbors`：推荐来自收藏仓库重叠程度较高的用户所喜欢的项目。
- 协同过滤推荐保持默认配置。

排序阶段合并上述的推荐结果和最新物品后使用训练好的因子分解机进行最终排序。如果生成的推荐结果不足，会依次使用物品到物品推荐和最新物品进行补全。

## 用户界面和交互

GitRec 通过两种方式为用户提供服务。

### 网站

网站仿照抖音提供了一个沉浸式的仓库发现体验：

- **"发现页（Explore）**：这是网站的核心功能，全屏展示仓库的 `README` 内容。你可以选择：
  - 点击::likefill::按钮，这个行为会被记录为一次正向反馈。
  - 点击::start::按钮，系统会将当前仓库标记为“已读”，并为你呈现下一个推荐。
  - 页面上方可以选择编程语言过滤推荐结果。
- **收藏夹（Favorites）**：这里包含了所有你在 GitHub 上 `star` 过或在 GitRec 网站上 `like` 过的仓库。

### 浏览器插件

浏览器插件将推荐无缝集成到 GitHub 页面中：

- **GitHub 主页的“探索”模块**：在 GitHub 的主页，插件会注入一个“Explore repositories”模块，提供个性化的项目推荐。即使没有登录 GitRec，插件也能通过最近 `star` 的项目提供初步的个性化推荐。
- **仓库页面的“相关仓库”**：浏览任何一个 stars 超过 100的 GitHub 仓库时，插件会在页面右侧添加一个“Related repositories”栏目。这里会展示与当前仓库内容最相似的几个项目。
- **浏览记录收集**：插件会记录浏览过的仓库，并将这些信息发送回 GitRec 服务器，除此之外不会收集任何其他个人信息。

## 规模和成本

到 2025 年底，GitRec 的数据规模如下：
- 超过 24 万个 GitHub 仓库
- 超过 3000 名注册用户
- 超过 30 万条用户反馈记录

Gorse 推荐系统以及数据库部署在一台 2 核 CPU、8GB 内存的云服务器上，花费330人民币/月。

## 总结

GitRec 不仅仅是一个 GitHub 仓库推荐系统，更是 Gorse 推荐系统的试验场。欢迎使用 GitRec [网站](https://gitrec.gorse.io) 或安装浏览器插件（支持[Chrome](https://chromewebstore.google.com/detail/gitrec/eihokbaeiebdenibjophfipedicippfl)、[Firefox](https://addons.mozilla.org/zh-CN/firefox/addon/gitrec/)和[Edge](https://microsoftedge.microsoft.com/addons/detail/gitrec/cpcfbfpnagiffgpmfljmcdokmfjffdpa)），助力 Gorse 推荐系统的持续开发。
