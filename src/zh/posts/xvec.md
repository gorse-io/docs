---
icon: robot
date: 2026-09-25
category:
  - 技术分享
tag:
  - 向量搜索
---
# xvec: 一个纯 Go 嵌入式向量数据库

大语言模型带动了嵌入模型和向量数据库的发展，进一步导致向量数据库成为了推荐系统必不可少的一部分。我们参考了 [zvec](https://github.com/alibaba/zvec)并使用 GPT 开发了一个纯 Go 语言编写的嵌入式向量数据库 [xvec](https://github.com/gorse-io/xvec)用于单节点 Gorse 和单元测试。

## 为什么开发 xvec

1. [sqlite-vec](https://github.com/asg017/sqlite-vec): 功能缺失的无奈

一直以来 Gorse 单节点版本和单元测试使用 modernc.org/sqlite 作为数据存储和缓存存储。自然支持向量数据库的初期也使用了 modernc.org/sqlite 的 sqlite-vec 扩展，我们深度参与了[支持向量查询扩展](./sqlite-vec)的开发工作。然而，随着向量数据库的深度集成，sqlite-vec 的使用遇到了两个无法解决的问题：

- **不支持内积**。矩阵分解需要计算两个向量的内积获得评分，在其他向量数据库都支持内积的情况下，sqlite-vec 不支持内积影响 Gorse 基础功能的开发。
- **不支持索引**。sqlite-vec 只支持暴力搜索，不支持例如 HNSW、IVF 这些向量索引，无法满足生产环境中单节点的查询性能要求。

考虑到 sqlite-vec 项目活跃度比较低，并且还需要将 C 代码转换为 Go，因此无论向社区贡献代码还是分叉维护都有相当大的难度，最终只能弃用。

2. [zvec](https://github.com/alibaba/zvec): CGO 的阻隔

当我们排除掉 sqlite-vec 之后，就不存在纯 Go 语言实现的嵌入式向量数据库了，自行开发是唯一的选择。从零设计是不现实的，因此需要参考一个现有的嵌入式向量数据库。zvec 是理想的参考对象，它具备以下几个优点：

- **依赖少**。除了一些比较基础的库之外，核心功能都是 C++ 从零实现的，方便使用 Go 重新实现。
- **功能全**。提供了多种向量索引和多种量化方法，能够满足不同场景的需求。
- **提供 Go 接口**。[zvec-go](https://github.com/zvec-ai/zvec-go)提供了 Go 接口，方便进行性能对比。

zvec 的开发人员也向笔者询问了[为何不直接使用 zvec](https://github.com/gorse-io/xvec/issues/26)，实际上纯 Go 实现有以下几个优势：

- **无 GCC 依赖**。只需要安装了 Go 编译器即可编译和运行，不依赖 GCC 编译和链接。
- **无平台限制**。zvec-go支持的平台有限，而纯 Go 实现可以在任何支持 Go 的平台上运行。

## 开发过程

对于 zvec 这样复杂的项目，没有任何一个 AI 可以一次完成重写。开发过程可以分为两个阶段：
- **初创阶段**：需要给 AI 一个总体的大任务

> 参考 zvec 实现一个纯 Go 语言的向量数据库。

此阶段必须要求先制定计划再开发，功能有缺失和偏差不需要太担心，留给后续迭代修复。
- **迭代阶段**：主要解决初创阶段遗漏的功能和性能问题。功能缺失的解决方法比较简单：

> 参考 zvec 实现，补充 FP16 类型向量的支持。

为了性能优化，xvec 同时移植了[VectorDBBench](https://github.com/zilliztech/vectordbbench)。性能优化需要先进行基准测试，找出性能瓶颈，再针对性地进行优化：

> 使用 cmd/vector-db-bench 对比 zvec 和 xvec 在 Performance768D1M 场景下 HNSW 索引的性能。
> （由AI完成性能测试）
> 参考 zvec 实现进行性能优化
> （由AI完成性能优化）

向量的高性能计算离不开 SIMD，xvec 在实现中充分利用了 [goat](https://github.com/gorse-io/goat) 生成 SIMD Go 汇编。

## 使用指南

xvec 需要 Go 1.27 或更高版本。使用以下命令安装：

```bash
go get github.com/gorse-io/xvec
```

下面的示例会创建一个本地集合，写入带有元数据的向量，并返回与查询向量最相近的两篇文档。

```go
package main

import (
	"context"
	"fmt"
	"log"

	"github.com/gorse-io/xvec"
)

func main() {
	ctx := context.Background()

	schema := xvec.NewCollectionSchema("articles",
		xvec.NewField("title", xvec.DataTypeString),
		xvec.NewField("category", xvec.DataTypeString),
		xvec.FieldSchema{
			Name:      "embedding",
			DataType:  xvec.DataTypeVectorFP32,
			Dimension: 3,
			Index:     xvec.NewFlatIndexParams(xvec.MetricTypeCosine),
		},
	)

	collection, err := xvec.CreateAndOpen(
		ctx,
		"./data/articles",
		schema,
		xvec.NewCollectionOptions(),
	)
	if err != nil {
		log.Fatal(err)
	}
	defer collection.Close()

	_, err = collection.Insert(ctx, []xvec.Document{
		{
			PrimaryKey: "go",
			Fields: map[string]any{
				"title":     "The Go Programming Language",
				"category":  "programming",
				"embedding": xvec.VectorFP32{1.0, 0.1, 0.0},
			},
		},
		{
			PrimaryKey: "vector",
			Fields: map[string]any{
				"title":     "Vector Search Fundamentals",
				"category":  "search",
				"embedding": xvec.VectorFP32{0.9, 0.2, 0.1},
			},
		},
		{
			PrimaryKey: "sql",
			Fields: map[string]any{
				"title":     "Database Internals",
				"category":  "database",
				"embedding": xvec.VectorFP32{0.0, 0.2, 1.0},
			},
		},
	})
	if err != nil {
		log.Fatal(err)
	}

	results, err := collection.Query(ctx, xvec.VectorQuery{
		Field:       "embedding",
		DenseVector: xvec.VectorFP32{1.0, 0.0, 0.0},
		TopK:        2,
		Projection: xvec.Projection{
			OutputFields: []string{"title", "category"},
		},
	})
	if err != nil {
		log.Fatal(err)
	}

	for _, result := range results {
		fmt.Printf("%s: %s (score %.4f)\n",
			result.PrimaryKey,
			result.Fields["title"],
			result.Score,
		)
	}
}
```

集合数据会持久化到 `./data/articles` 目录。完整 API 请参阅 [Go 文档](https://pkg.go.dev/github.com/gorse-io/xvec)。

## 性能测试

测试使用的机型为 GCP 的 e2-standard-16，具有 16 个 vCPU 和 64 GB 内存。测试程序使用 Go 语言重写的 VectorDBBench，测试场景为 Performance768D1M。

### 暴力检索

```bash
go run ./cmd/vector-db-bench zvec \
    --path ./Performance768D1M \
    --case-type Performance768D1M \
    --index-type flat \
    --optimize-concurrency 16 \
    --num-concurrency 16
```

Flat 索引不构建近似索引，也就是暴力检索，本测试主要展示 sqlite-vec 和 zvec/xvec 之间的性能差异。

| 指标            | zvec-go   | xvec      | sqlite-vec |
|-----------------|-----------|-----------|------------|
| 16 并发 QPS     | **208.04**    | 204.75    | 32.15      |
| 16 并发平均延迟 | **76.66 ms**  | 78.05 ms  | 493.58 ms  |
| 16 并发 P95     | 111.06 ms | **95.80 ms**  | 542.45 ms  |
| 16 并发 P99     | 123.85 ms | **102.53 ms** | 557.73 ms  |
| Recall@100      | **100%**      | **100%**      | **100%**       |
| 导入及优化耗时  | **6.94 s**    | 10.64 s   | 44.89 s    |

在暴力检索中，zvec-go 和 xvec 的性能较为接近：zvec-go 的 QPS 比 xvec 高约 1.6%，平均延迟低约 1.8%；xvec 的尾延迟更低，P95 和 P99 分别比 zvec-go 低约 13.7% 和 17.2%。相比 sqlite-vec，xvec 的 QPS 约为其 6.4 倍，导入及优化耗时缩短约 76%。

### HNSW 索引

```bash
go run ./cmd/vector-db-bench xvec \
  --path ./Performance768D1M \
  --case-type Performance768D1M \
  --index-type hnsw \
  --quantize-type int8 \
  --num-concurrency 16 \
  --m 15 \
  --ef-search 180
```

笔者使用 [zvec 官方基准测试](https://zvec.org/zh/docs/db/benchmarks/)参数测试了 zvec (Python)、zvec-go 和 xvec 在 HNSW 索引下的性能表现。

| 指标             | zvec (Python) | zvec-go  | xvec     |
|------------------|---------------|----------|----------|
| 16 并发 QPS      | 5,329.53      | **5,985.34** | 5,705.42 |
| 16 并发平均延迟  | 2.786 ms      | **2.671 ms** | 2.802 ms |
| 16 并发 P95      | 3.572 ms      | 4.012 ms | **3.443 ms** |
| 16 并发 P99      | 4.132 ms      | 5.800 ms | **4.037 ms** |
| Recall@100       | 92.840%       | 92.862%  | **94.183%**  |
| 导入及优化总耗时 | 587.90 s      | **460.14 s** | 542.21 s |

zvec-go 的吞吐量和平均延迟最佳，xvec 的 QPS 仅低约 4.7%；与此同时，xvec 的 P95 和 P99 最低，分别比 zvec-go 低约 14.2% 和 30.4%，高并发下的尾延迟更加稳定。xvec 的 Recall@100 达到 94.183%，比另外两种实现高约 1.3 个百分点，但其导入及优化耗时比 zvec-go 长约 17.8%。

## 总结

借助 SIMD 汇编，加上 zvec-go 性能受到 CGO 开销的影响，xvec 在纯 Go 实现下仍然能够提供接近 zvec-go。在笔者看来，综合考虑功能丰富程度、插入和查询性能、开发活跃度，[zvec](https://github.com/alibaba/zvec)是目前最好的嵌入式向量数据库，zvec-go 依然是 Go 语言嵌入式向量数据库的最佳选择。但是如果不希望依赖 CGO，xvec 是一个值得考虑的高性能纯 Go 实现。
