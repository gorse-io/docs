---
icon: database
date: 2026-03-15
category:
  - 技术分享
tag:
  - SQLite
  - 向量搜索
---
# `modernc.org/sqlite` 正式支持向量查询扩展

在经过笔者和[Jan Mercl](https://gitlab.com/cznic)的[共同努力](https://gitlab.com/cznic/sqlite/-/merge_requests/93)后，SQLite 纯 Go 语言移植版本`modernc.org/sqlite`现已正式支持[sqlite-vec](https://github.com/asg017/sqlite-vec)向量查询扩展。

```go
import (
    _ "modernc.org/sqlite"
    _ "modernc.org/sqlite/vec"
)
```

只要在使用`modernc.org/sqlite`时引入`modernc.org/sqlite/vec`，就可以直接使用`sqlite-vec`提供的向量索引创建和查询功能，无需任何额外的加载步骤。

## 什么用

[Gorse](https://github.com/gorse-io/gorse)正在计划使用向量数据库来存储嵌入向量以提供更加及时的推荐服务。而在小规模数据的场景和单元测试中，使用嵌入式向量数据库比使用独立的向量数据库更为方便和高效。Python、JavaScript 和 Rust 都有不错的嵌入式向量数据库实现，例如[LanceDB](https://lancedb.com/)和[Zvec](https://zvec.org/en/)。而在 Go 语言中：
- [chromem-go](https://github.com/philippgille/chromem-go)提供的混合查询能力有限
- [sqlite-vec-go-bindings](https://github.com/asg017/sqlite-vec-go-bindings)提供了 CGO 和 WASM 版本的绑定，但是 CGO 版本需要依赖 C 编译环境，而WASM版本需要消耗更多的内存。如果项目已经依赖了`modernc.org/sqlite`，那么还需要更换 SQLite 的移植到 CGO 版本或者 WASM 版本。

`modernc.org/sqlite`版本的[sqlite-vec](https://github.com/asg017/sqlite-vec)扩展相比[chromem-go](https://github.com/philippgille/chromem-go)有更灵活的混合查询能力，相比CGO版本不需要依赖 C 编译环境，并且相比 WASM 版本内存占用更小。

## 怎么用

如果是首次使用`modernc.org/sqlite`，首先需要安装该库：

```bash
go get modernc.org/sqlite
```

### 加载扩展

由于[sqlite-vec](https://github.com/asg017/sqlite-vec)是作为自动注册的扩展来工作的，我们只需要在代码中以空导入的形式引入它，包内的`init`函数就会自动加载该扩展。

```go
package main

import (
    "database/sql"
    "fmt"
    "log"

    _ "modernc.org/sqlite"
    _ "modernc.org/sqlite/vec"
)

func main() {
    // 建立连接
    db, err := sql.Open("sqlite", ":memory:")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    // 检查 sqlite-vec 扩展是否已正确加载
    var vecVersion string
    err = db.QueryRow("SELECT vec_version()").Scan(&vecVersion)
    if err != nil {
        log.Fatal("无法获取 vec_version: ", err)
    }
    fmt.Println("sqlite-vec version:", vecVersion)
}
```

### 创建向量表并插入数据

[sqlite-vec](https://github.com/asg017/sqlite-vec)提供了特定的虚拟表格式来存储向量数据。我们通常创建一个带有 `vec0` 模块的虚拟表，专门用于存储 ID 和向量。

```go
// 创建向量虚拟表 (假设我们的向量维度为 3)
_, err := db.Exec(`
    CREATE VIRTUAL TABLE vec_items USING vec0(
        id INTEGER PRIMARY KEY,
        embedding float[3]
    );
`)
if err != nil {
    log.Fatal(err)
}

// 插入示例向量数据
// 注意：这里的向量通常需要使用 vec_f32() 函数来确保存储格式正确
_, err = db.Exec(`
    INSERT INTO vec_items (id, embedding) VALUES 
    (1, vec_f32('[0.1, 0.2, 0.3]')),
    (2, vec_f32('[0.9, 0.1, 0.1]')),
    (3, vec_f32('[0.2, 0.8, 0.2]'));
`)
if err != nil {
    log.Fatal(err)
}
fmt.Println("数据插入成功！")
```

### 向量查询

一旦数据就绪，我们就可以使用近邻查询。使用 `vec_distance_L2` 或 `vec_distance_cosine` 等函数进行排序。

```go
// 假设我们要搜索与 [0.1, 0.25, 0.35] 最相似的前 2 条记录
queryVector := `'[0.1, 0.25, 0.35]'`

rows, err := db.Query(fmt.Sprintf(`
    SELECT id, vec_distance_L2(embedding, vec_f32(%s)) as distance
    FROM vec_items
    ORDER BY distance
    LIMIT 2;
`, queryVector))
if err != nil {
    log.Fatal(err)
}
defer rows.Close()

fmt.Println("相似度搜索结果：")
for rows.Next() {
    var id int
    var distance float64
    if err := rows.Scan(&id, &distance); err != nil {
        log.Fatal(err)
    }
    fmt.Printf("ID: %d, 距离: %.4f\n", id, distance)
}
```
