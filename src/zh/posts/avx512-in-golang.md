---
icon: cpu
date: 2023-03-01
category:
  - 技术分享
tag:
  - SIMD
---

# 在Go语言中优雅地使用AVX512

AVX512是英特尔发布的最新最新一代SIMD指令。

## 从C语言编译汇编代码

## 从汇编代码构造Go代码

## 使用`go generate`构建

```go
//go:generate go run ../../cmd/goat src/floats_avx.c -O3 -mavx
//go:generate go run ../../cmd/goat src/floats_avx512.c -O3 -mavx -mfma -mavx512f -mavx512dq
```
