---
date: 2026-09-25
category:
  - Tech Share
tag:
  - Vector Search
---
# xvec: An Embedded Vector Database in Pure Go

Large language models have driven the development of embedding models and vector databases, making vector databases an essential part of recommender systems. Drawing on [zvec](https://github.com/alibaba/zvec), we used GPT to develop [xvec](https://github.com/gorse-io/xvec), an embedded vector database written in pure Go for single-node Gorse and unit tests.

## Why We Built xvec

1. [sqlite-vec](https://github.com/asg017/sqlite-vec): Missing Features

Gorse has long used modernc.org/sqlite for both data and cache storage in single-node deployments and unit tests. When we first added vector database support, the sqlite-vec extension for modernc.org/sqlite was a natural choice, and we were deeply involved in developing [support for the vector query extension](./sqlite-vec). However, as we integrated vector databases more extensively, we encountered two problems with sqlite-vec that we could not resolve:

- **No inner product.** Matrix factorization computes scores using the inner product of two vectors. While other vector databases support inner product, its absence in sqlite-vec hindered the development of core Gorse features.
- **No vector index.** sqlite-vec only supports brute-force search, with no support for vector indexes such as HNSW or IVF. This falls short of the query performance required for single-node deployments in production.

Given the relatively low activity in the sqlite-vec project and the additional need to translate C code into Go, both contributing upstream and maintaining a fork would have been difficult. We ultimately had to stop using it.

2. [zvec](https://github.com/alibaba/zvec): The CGO Barrier

After ruling out sqlite-vec, we had no remaining options for an embedded vector database implemented in pure Go, so building our own was the only choice. Designing one from scratch was impractical, so we needed an existing embedded vector database as a reference. zvec was an ideal candidate for several reasons:

- **Few dependencies.** Apart from a few basic libraries, its core functionality is implemented from scratch in C++, making it straightforward to reimplement in Go.
- **A comprehensive feature set.** It offers multiple vector indexes and quantization methods to meet the needs of different use cases.
- **Go bindings.** [zvec-go](https://github.com/zvec-ai/zvec-go) provides Go bindings, making performance comparisons convenient.

The zvec developers also asked me [why we did not use zvec directly](https://github.com/gorse-io/xvec/issues/26). A pure Go implementation has several advantages:

- **No GCC dependency.** Only the Go compiler is needed to build and run the code; GCC is not required for compilation or linking.
- **No platform restrictions.** zvec-go supports a limited set of platforms, while a pure Go implementation can run on any platform supported by Go.

## Development

No AI can rewrite a project as complex as zvec in a single pass. The development process can be divided into two stages:

- **Initial development:** Give the AI a broad task.

> Implement a vector database in pure Go using zvec as a reference.

At this stage, require the AI to make a plan before writing code. Missing features and deviations from the intended design are not a major concern yet; they can be addressed in later iterations.

- **Iteration:** Focus on missing features and performance issues left over from the initial stage. Addressing missing features is relatively straightforward:

> Add support for FP16 vectors, following the zvec implementation.

To support performance optimization, xvec also includes a port of [VectorDBBench](https://github.com/zilliztech/vectordbbench). Optimization starts with benchmarks to identify bottlenecks, followed by targeted improvements:

> Use cmd/vector-db-bench to compare the HNSW index performance of zvec and xvec in the Performance768D1M scenario.
> (The AI runs the benchmarks.)
> Optimize performance using the zvec implementation as a reference.
> (The AI implements the optimizations.)

SIMD is essential for high-performance vector computation. xvec uses [goat](https://github.com/gorse-io/goat) to generate Go assembly with SIMD instructions.

## Usage

xvec requires Go 1.27 or later. Install it with the following command:

```bash
go get github.com/gorse-io/xvec
```

The following example creates a local collection, inserts vectors with metadata, and returns the two documents most similar to the query vector.

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

Collection data is persisted to the `./data/articles` directory. For the complete API, see the [Go documentation](https://pkg.go.dev/github.com/gorse-io/xvec).

## Benchmarks

The benchmarks ran on a GCP e2-standard-16 instance with 16 vCPUs and 64 GB of memory, using the Go rewrite of VectorDBBench and the Performance768D1M case.

### Brute-Force Search

```bash
go run ./cmd/vector-db-bench zvec \
    --path ./Performance768D1M \
    --case-type Performance768D1M \
    --index-type flat \
    --optimize-concurrency 16 \
    --num-concurrency 16
```

A Flat index does not build an approximate index; it performs brute-force search. This benchmark primarily illustrates the performance gap between sqlite-vec and zvec/xvec.

| Metric                         | zvec-go       | xvec          | sqlite-vec |
|--------------------------------|---------------|---------------|------------|
| QPS at concurrency 16          | **208.04**    | 204.75        | 32.15      |
| Mean latency at concurrency 16 | **76.66 ms**  | 78.05 ms      | 493.58 ms  |
| P95 at concurrency 16          | 111.06 ms     | **95.80 ms**  | 542.45 ms  |
| P99 at concurrency 16          | 123.85 ms     | **102.53 ms** | 557.73 ms  |
| Recall@100                     | **100%**      | **100%**      | **100%**   |
| Import and optimization time   | **6.94 s**    | 10.64 s       | 44.89 s    |

In brute-force search, zvec-go and xvec perform similarly: zvec-go achieves about 1.6% higher QPS and 1.8% lower mean latency than xvec. xvec has lower tail latency, with P95 and P99 about 13.7% and 17.2% lower than zvec-go, respectively. Compared with sqlite-vec, xvec delivers roughly 6.4 times the QPS and reduces import and optimization time by about 76%.

### HNSW Index

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

I tested the HNSW index performance of zvec (Python), zvec-go, and xvec using the parameters from the [official zvec benchmarks](https://zvec.org/zh/docs/db/benchmarks/).

| Metric                             | zvec (Python) | zvec-go      | xvec         |
|------------------------------------|---------------|--------------|--------------|
| QPS at concurrency 16              | 5,329.53      | **5,985.34** | 5,705.42     |
| Mean latency at concurrency 16     | 2.786 ms      | **2.671 ms** | 2.802 ms     |
| P95 at concurrency 16              | 3.572 ms      | 4.012 ms     | **3.443 ms** |
| P99 at concurrency 16              | 4.132 ms      | 5.800 ms     | **4.037 ms** |
| Recall@100                         | 92.840%       | 92.862%      | **94.183%**  |
| Total import and optimization time | 587.90 s      | **460.14 s** | 542.21 s     |

zvec-go delivers the best throughput and mean latency, with xvec's QPS only about 4.7% lower. Meanwhile, xvec achieves the lowest P95 and P99, about 14.2% and 30.4% lower than zvec-go, respectively, providing more stable tail latency under high concurrency. xvec reaches a Recall@100 of 94.183%, about 1.3 percentage points higher than the other two implementations, although its import and optimization time is about 17.8% longer than zvec-go's.

## Conclusion

Thanks to SIMD assembly, and with zvec-go's performance affected by CGO overhead, xvec can deliver performance close to zvec-go despite being implemented in pure Go. In my view, considering its feature set, insertion and query performance, and development activity, [zvec](https://github.com/alibaba/zvec) is currently the best embedded vector database, and zvec-go remains the best choice for an embedded vector database in Go. However, if you want to avoid a CGO dependency, xvec is a high-performance pure Go implementation worth considering.
