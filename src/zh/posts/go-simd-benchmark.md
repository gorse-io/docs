---
icon: cpu
date: 2026-08-28
category:
  - 技术分享
tag:
  - Go
  - SIMD
---

# Go 1.27 SIMD 性能测试：能否替代 GoAT 生成的 AVX512 汇编？

Go 1.27 引入了实验性的 [`simd`](https://pkg.go.dev/simd) 包，为整数和浮点数提供了可移植、与向量宽度无关的 SIMD 类型和运算。一直以来，Gorse 为了加速模型训练和推理中的向量计算，使用 [GoAT](https://github.com/gorse-io/goat) 将 C 语言编译生成的 SIMD 指令转换为 Go 汇编。`simd` 包让同一套 Go 代码在不同指令集上运行成为可能，但它的性能能否接近 [GoAT](https://github.com/gorse-io/goat) 借助 LLVM 生成汇编实现？

我们在 Gorse `common/floats` 包中使用 Go SIMD 实现了[部分向量运算](https://github.com/gorse-io/gorse/blob/master/common/floats/floats_simd.go)，也添加了对应的[基准测试](https://github.com/gorse-io/gorse/blob/master/common/floats/floats_simd_test.go)。本文将对比四种实现的性能：

- 不使用 SIMD 特性的基础实现，也就是普通 Go 标量循环。
- 由 C 代码编译并通过 GoAT 转换得到的 AVX 和 AVX512 汇编。
- 使用 Go 1.27 实验性 `simd` 包编写的实现。

## 实验环境与方法

实验环境如下：

| 项目 | 配置 |
|---|---|
| 操作系统 | Windows 11 专业版 25H2 |
| CPU | 11th Gen Intel Core i7-11370H @ 3.30 GHz |
| Go 版本 | 1.27.0 |
| 输入长度 | 16、32、64、128 个 `float32` |

运行全部基准测试的命令为：

```powershell
$env:GOEXPERIMENT = "simd"
go test ./common/floats -run '^$' -bench . -count=1
```

Intel Core i7-11370H 支持 AVX512，因此 Go SIMD 会调用 AVX512 指令完成向量运算。

::: warning

本次数据来自一次完整运行。它适合观察数量级和总体趋势，但没有给出置信区间；几个纳秒以内的差异容易受到 CPU 频率、温度和操作系统调度影响。

:::

## Go SIMD 实现

以原地向量减法为例，Go SIMD 实现先处理完整向量，再使用部分加载和存储处理任意长度的尾部：

```go
func simdSub(a, b []float32) {
	vectorLen := simd.VectorBitSize() / 32
	for len(a) >= vectorLen {
		simd.LoadFloat32s(a).Sub(simd.LoadFloat32s(b)).Store(a)
		a = a[vectorLen:]
		b = b[vectorLen:]
	}
	if len(a) > 0 {
		x, n := simd.LoadFloat32sPart(a)
		y, _ := simd.LoadFloat32sPart(b)
		x.Sub(y).StorePart(a[:n])
	}
}
```

Go 编译器会为同一个函数生成不同向量宽度的版本，例如 `simdSub@simd128`、`simdSub@simd256` 和 `simdSub@simd512`，运行时再选择合适的实现。在 Intel Core i7-11370H 上会使用 `simdSub@simd512`，它对应 AVX512 指令。

## 性能对比结果

- 长度 16 的 FP32 向量，恰好等于一个 512 位的 AVX512 寄存器。

| 操作 | 标量循环 | AVX | AVX512 | Go SIMD | 相对标量循环 | 相对 AVX512 |
|---|---:|---:|---:|---:|---:|---:|
| Dot | 10.94 ns | 8.81 ns | 8.55 ns | 14.55 ns | 0.75x | 0.59x |
| Euclidean | 33.99 ns | 10.06 ns | 8.94 ns | 19.96 ns | 1.70x | 0.45x |
| SubTo | 14.98 ns | 7.07 ns | 7.04 ns | 8.66 ns | 1.73x | 0.81x |
| MulTo | 27.82 ns | 7.59 ns | 7.62 ns | 7.70 ns | 3.61x | 0.99x |
| DivTo | 42.36 ns | 7.17 ns | 8.19 ns | 7.95 ns | 5.33x | 1.03x |
| SqrtTo | 124.10 ns | 6.36 ns | 6.38 ns | 6.04 ns | 20.55x | 1.06x |

- 长度 32 的 FP32 向量

| 操作 | 标量循环 | AVX | AVX512 | Go SIMD | 相对标量循环 | 相对 AVX512 |
|---|---:|---:|---:|---:|---:|---:|
| Dot | 45.94 ns | 8.82 ns | 10.23 ns | 14.03 ns | 3.27x | 0.73x |
| Euclidean | 45.66 ns | 10.44 ns | 9.56 ns | 24.15 ns | 1.89x | 0.40x |
| SubTo | 33.50 ns | 7.87 ns | 7.59 ns | 11.00 ns | 3.05x | 0.69x |
| MulTo | 49.98 ns | 8.23 ns | 8.43 ns | 12.71 ns | 3.93x | 0.66x |
| DivTo | 46.86 ns | 9.24 ns | 8.54 ns | 11.50 ns | 4.07x | 0.74x |
| SqrtTo | 93.70 ns | 8.06 ns | 9.45 ns | 10.80 ns | 8.68x | 0.88x |

- 长度 64 的 FP32 向量

| 操作 | 标量循环 | AVX | AVX512 | Go SIMD | 相对标量循环 | 相对 AVX512 |
|---|---:|---:|---:|---:|---:|---:|
| Dot | 76.25 ns | 11.68 ns | 10.80 ns | 19.17 ns | 3.98x | 0.56x |
| Euclidean | 73.29 ns | 11.96 ns | 11.40 ns | 27.50 ns | 2.67x | 0.41x |
| SubTo | 58.41 ns | 10.21 ns | 9.67 ns | 16.69 ns | 3.50x | 0.58x |
| MulTo | 79.18 ns | 8.39 ns | 8.15 ns | 18.48 ns | 4.28x | 0.44x |
| DivTo | 73.70 ns | 13.45 ns | 13.36 ns | 18.36 ns | 4.01x | 0.73x |
| SqrtTo | 339.00 ns | 16.11 ns | 15.30 ns | 16.86 ns | 20.11x | 0.91x |

- 长度 128 的 FP32 向量

| 操作 | 标量循环 | AVX | AVX512 | Go SIMD | 相对标量循环 | 相对 AVX512 |
|---|---:|---:|---:|---:|---:|---:|
| Dot | 124.60 ns | 13.81 ns | 11.43 ns | 23.84 ns | 5.23x | 0.48x |
| Euclidean | 161.60 ns | 23.16 ns | 17.24 ns | 33.68 ns | 4.80x | 0.51x |
| SubTo | 93.39 ns | 13.07 ns | 13.46 ns | 27.84 ns | 3.35x | 0.48x |
| MulTo | 125.90 ns | 13.66 ns | 9.21 ns | 29.52 ns | 4.26x | 0.31x |
| DivTo | 260.20 ns | 28.74 ns | 28.51 ns | 32.93 ns | 7.90x | 0.87x |
| SqrtTo | 484.00 ns | 27.73 ns | 31.07 ns | 36.24 ns | 13.36x | 0.86x |

::: echarts Dot 性能对比

```json
{
  "tooltip": { "trigger": "axis" },
  "legend": { "data": ["AVX", "AVX512", "Go SIMD"] },
  "xAxis": { "name": "向量长度", "type": "category", "data": [16, 32, 64, 128] },
  "yAxis": { "name": "用时（ns/op）", "type": "value" },
  "series": [
    { "name": "AVX", "type": "line", "data": [8.81, 8.82, 11.68, 13.81] },
    { "name": "AVX512", "type": "line", "data": [8.55, 10.23, 10.80, 11.43] },
    { "name": "Go SIMD", "type": "line", "data": [14.55, 14.03, 19.17, 23.84] }
  ]
}
```

:::

::: echarts Euclidean 性能对比

```json
{
  "tooltip": { "trigger": "axis" },
  "legend": { "data": ["AVX", "AVX512", "Go SIMD"] },
  "xAxis": { "name": "向量长度", "type": "category", "data": [16, 32, 64, 128] },
  "yAxis": { "name": "用时（ns/op）", "type": "value" },
  "series": [
    { "name": "AVX", "type": "line", "data": [10.06, 10.44, 11.96, 23.16] },
    { "name": "AVX512", "type": "line", "data": [8.94, 9.56, 11.40, 17.24] },
    { "name": "Go SIMD", "type": "line", "data": [19.96, 24.15, 27.50, 33.68] }
  ]
}
```

:::

::: echarts SubTo 性能对比

```json
{
  "tooltip": { "trigger": "axis" },
  "legend": { "data": ["AVX", "AVX512", "Go SIMD"] },
  "xAxis": { "name": "向量长度", "type": "category", "data": [16, 32, 64, 128] },
  "yAxis": { "name": "用时（ns/op）", "type": "value" },
  "series": [
    { "name": "AVX", "type": "line", "data": [7.07, 7.87, 10.21, 13.07] },
    { "name": "AVX512", "type": "line", "data": [7.04, 7.59, 9.67, 13.46] },
    { "name": "Go SIMD", "type": "line", "data": [8.66, 11.00, 16.69, 27.84] }
  ]
}
```

:::

::: echarts MulTo 性能对比

```json
{
  "tooltip": { "trigger": "axis" },
  "legend": { "data": ["AVX", "AVX512", "Go SIMD"] },
  "xAxis": { "name": "向量长度", "type": "category", "data": [16, 32, 64, 128] },
  "yAxis": { "name": "用时（ns/op）", "type": "value" },
  "series": [
    { "name": "AVX", "type": "line", "data": [7.59, 8.23, 8.39, 13.66] },
    { "name": "AVX512", "type": "line", "data": [7.62, 8.43, 8.15, 9.21] },
    { "name": "Go SIMD", "type": "line", "data": [7.70, 12.71, 18.48, 29.52] }
  ]
}
```

:::

::: echarts DivTo 性能对比

```json
{
  "tooltip": { "trigger": "axis" },
  "legend": { "data": ["AVX", "AVX512", "Go SIMD"] },
  "xAxis": { "name": "向量长度", "type": "category", "data": [16, 32, 64, 128] },
  "yAxis": { "name": "用时（ns/op）", "type": "value" },
  "series": [
    { "name": "AVX", "type": "line", "data": [7.17, 9.24, 13.45, 28.74] },
    { "name": "AVX512", "type": "line", "data": [8.19, 8.54, 13.36, 28.51] },
    { "name": "Go SIMD", "type": "line", "data": [7.95, 11.50, 18.36, 32.93] }
  ]
}
```

:::

::: echarts SqrtTo 性能对比

```json
{
  "tooltip": { "trigger": "axis" },
  "legend": { "data": ["AVX", "AVX512", "Go SIMD"] },
  "xAxis": { "name": "向量长度", "type": "category", "data": [16, 32, 64, 128] },
  "yAxis": { "name": "用时（ns/op）", "type": "value" },
  "series": [
    { "name": "AVX", "type": "line", "data": [6.36, 8.06, 16.11, 27.73] },
    { "name": "AVX512", "type": "line", "data": [6.38, 9.45, 15.30, 31.07] },
    { "name": "Go SIMD", "type": "line", "data": [6.04, 10.80, 16.86, 36.24] }
  ]
}
```

:::


从结果可以得到以下结论：

1. **Go SIMD 相比普通 Go 循环总体有显著收益。** 在 6 类计算中，随着向量长度从 16 增加到 128，相对标量循环的几何平均加速比从 3.09 倍上升到 5.79 倍。向量越长，固定调用开销越容易被摊薄，SIMD 并行计算的优势也越明显。
2. **短向量下，Go SIMD 在高延迟计算中能够接近甚至超过 AVX512 汇编代码。** 长度为 16 时，Go SIMD 在 6 类计算中的 `DivTo` 和 `SqrtTo` 上快于 AVX512 汇编代码，分别快约 3% 和 5%；`MulTo` 与 AVX512 汇编代码基本持平。不过这些差异都不到 0.4 ns，不能据此认定 Go SIMD 能够稳定领先。
3. **长向量下，AVX512 汇编代码整体仍然明显更快。** 长度为 128 时，Go SIMD 相对 AVX512 汇编代码的平均性能比为 0.55，即整体耗时约为 AVX512 汇编代码的 1.82 倍。其中 `MulTo` 的差距最大，Go SIMD 约慢 3.21 倍；`Dot` 和 `SubTo` 也均慢约 2.1 倍。
4. **高延迟指令更容易掩盖循环管理开销。** 长度为 128 时，Go SIMD 的 `DivTo` 和 `SqrtTo` 分别只比 AVX512 汇编代码慢约 16% 和 17%；除法和平方根本身的指令延迟较高，切片重切、边界检查和循环跳转占总耗时的比例更低。
5. **归约操作仍是明显短板。** `Dot` 和 `Euclidean` 需要将 SIMD 累加器保存到临时数组，再用标量代码进行横向求和。长度为 16 时，`Dot` 比普通 Go 循环慢约 33%；其余长度下二者虽然均快于标量循环，但相对 AVX512 汇编代码仍有明显差距。

Go SIMD 的 512 位版本确实生成了 `VMOVDQU64`、`VSUBPS` 等 AVX512 指令，但当前 Go 写法每处理 16 个元素仍然需要维护切片长度和容量、执行循环判断，并保留边界检查与尾部路径。相比之下，GoAT 借助 LLVM 生成的 AVX512 汇编使用更紧凑的指针循环，还可能进行循环展开。这解释了为什么“使用 AVX512 指令”并不自动等价于“达到 GoAT 生成的 AVX512 汇编代码的性能”。

## 应该选择哪种实现？

综合本次实验，可以得到一个相对清晰的选择顺序：

1. **优先考虑可维护性和跨架构支持时，Go SIMD 很有吸引力。** 一份代码可以根据运行时能力选择 128、256 或 512 位向量，还能自动处理硬件不支持时的模拟路径。与普通 Go 循环相比，本文测试中的加速通常达到数倍。
2. **追求固定平台上的极致性能时，GoAT 生成的 AVX512 汇编代码仍然占优。** GoAT 借助 LLVM 生成的 AVX512 循环可以更精确地控制指针、展开和归约方式。在 128 元素向量上，Go SIMD 的平均耗时仍接近该实现的两倍。
3. **实验性 API 适合验证，不宜马上删除成熟汇编路径。** `simd` 目前仍需要 `GOEXPERIMENT=simd`。更稳妥的演进方式是保留现有汇编作为性能基线，同时持续跟踪编译器对循环、边界检查和横向归约的优化。

## 总结

Go 1.27 的实验性 `simd` 包已经解决了 Go 语言长期缺少可移植 SIMD API 的问题。它确实能够在本次测试机器上生成并执行 AVX512 指令，并将普通 Go 向量循环加速。对于希望兼顾性能、可读性和跨架构能力的项目，这是一个非常有价值的特性。

不过，可移植性并不是免费的。当前 Go SIMD 实现在长向量和横向归并中仍然落后于 GoAT 生成的 AVX512 汇编代码。现阶段更合理的结论不是“Go SIMD 已经替代 GoAT 生成的 AVX512 汇编代码”，而是“Go SIMD 已经成为普通 Go 与 GoAT 生成的高性能汇编之间一个实用的新选择”。
