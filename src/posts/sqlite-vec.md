---
icon: database
date: 2026-03-15
category:
  - Tech Share
tag:
  - SQLite
  - Vector Search
---
# `modernc.org/sqlite` Now Supports `sqlite-vec`

After [joint efforts](https://gitlab.com/cznic/sqlite/-/merge_requests/93) by the author and [Jan Mercl](https://gitlab.com/cznic), the CGo-free port of SQLite `modernc.org/sqlite` now supports [sqlite-vec](https://github.com/asg017/sqlite-vec).

```go
import (
    _ "modernc.org/sqlite"
    _ "modernc.org/sqlite/vec"
)
```

By simply blank-importing `modernc.org/sqlite/vec` when using `modernc.org/sqlite`, you can directly use the vector index creation and query features provided by `sqlite-vec` without any additional loading steps.

## What is it for

[Gorse](https://github.com/gorse-io/gorse) is planning to use vector databases to store embedding vectors to provide more timely recommendation. In small-scale data scenarios or unit tests, using an embedded vector database is more convenient and efficient than using a standalone vector database. Python, JavaScript, and Rust all have excellent embedded vector database implementations, such as [LanceDB](https://lancedb.com/) and [Zvec](https://zvec.org/en/). While in Go:
- [chromem-go](https://github.com/philippgille/chromem-go) provides limited hybrid query capabilities.
- [sqlite-vec-go-bindings](https://github.com/asg017/sqlite-vec-go-bindings) provides CGO and WASM bindings, but the CGO version requires a C compilation environment, while the WASM version consumes more memory. If the project already depends on `modernc.org/sqlite`, you would need to switch the SQLite port to the CGO or WASM version.

The `modernc.org/sqlite` version of the [sqlite-vec](https://github.com/asg017/sqlite-vec) extension offers more flexible hybrid query capabilities compared to [chromem-go](https://github.com/philippgille/chromem-go), does not rely on a C compilation environment like the CGO version, and consumes less memory than the WASM version.

## How to use

If you are using `modernc.org/sqlite` for the first time, you need to install the package first:

```bash
go get modernc.org/sqlite
```

### Load Extension

Since [sqlite-vec](https://github.com/asg017/sqlite-vec) works as an auto-registered extension, we only need to blank import it in the code, and the `init` function within the package will automatically load the extension.

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
    // Establish connection
    db, err := sql.Open("sqlite", ":memory:")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    // Check if the sqlite-vec extension is correctly loaded
    var vecVersion string
    err = db.QueryRow("SELECT vec_version()").Scan(&vecVersion)
    if err != nil {
        log.Fatal("failed to get vec_version: ", err)
    }
    fmt.Println("sqlite-vec version:", vecVersion)
}
```

### Create Vector Table and Insert Data

[sqlite-vec](https://github.com/asg017/sqlite-vec) provides a specific virtual table format to store vectors. We usually create a virtual table with the `vec0` module specifically for storing IDs and vectors.

```go
// Create a virtual table for vectors (assuming our vector dimension is 3)
_, err := db.Exec(`
    CREATE VIRTUAL TABLE vec_items USING vec0(
        id INTEGER PRIMARY KEY,
        embedding float[3]
    );
`)
if err != nil {
    log.Fatal(err)
}

// Insert sample vector data
// Note: The vectors here usually require the vec_f32() function to ensure correct storage format
_, err = db.Exec(`
    INSERT INTO vec_items (id, embedding) VALUES 
    (1, vec_f32('[0.1, 0.2, 0.3]')),
    (2, vec_f32('[0.9, 0.1, 0.1]')),
    (3, vec_f32('[0.2, 0.8, 0.2]'));
`)
if err != nil {
    log.Fatal(err)
}
fmt.Println("Data inserted successfully!")
```

### Vector Query

Once the data is ready, we can use nearest neighbor queries. Use functions like `vec_distance_L2` or `vec_distance_cosine` for sorting.

```go
// Assuming we want to search for the top 2 records most similar to [0.1, 0.25, 0.35]
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

fmt.Println("Similarity search results:")
for rows.Next() {
    var id int
    var distance float64
    if err := rows.Scan(&id, &distance); err != nil {
        log.Fatal(err)
    }
    fmt.Printf("ID: %d, Distance: %.4f\n", id, distance)
}
```