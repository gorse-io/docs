---
date: 2025-06-01
category:
  - technical
tag:
  - BF16
---
# BF16 in the Go Programming Language

In the era of large language models, low-precision floating-point numbers are no strangers to developers, with BF16 being one of the most widely supported low-precision floating-point formats. This article will introduce how to use BF16 in the Go programming language.

## Introduction to BF16

```
+------------+-----------------+-----------------+
| 1 sign bit | 8 exponent bits | 7 mantissa bits |
+------------+-----------------+-----------------+
```

BF16 consists of 1 sign bit, 8 exponent bits, and 7 mantissa bits. Compared to FP32, it has the same number of exponent bits but significantly fewer mantissa bits. As a result, BF16 maintains the same dynamic range as FP32 (approximately $±3.4×10³⁸$), sacrificing some precision (around $2⁻⁷$) for a larger exponent range. The larger exponent range effectively avoids gradient overflow and underflow, making it suitable for backpropagation in deep learning. Additionally, it has strong compatibility with FP32, simplifying hardware design. BF16 is used to replace FP32 in model training and inference scenarios, reducing memory usage and bandwidth requirements while increasing the number of data processed by SIMD instructions in a single operation.

## BF16 in Go

Since Go does not natively support BF16, we cannot use it by the way of using `float32` or `float64`. Using BF16 in Go presents two challenges:

- **How to handle BF16 on CPUs that do not support it?** Software emulation can be used, such as the project github.com/chenxingqiang/go-floatx. However, software emulation is inefficient, combining the drawbacks of BF16's low precision with FP32's low parallelism. If the CPU does not support hardware-level BF16 computation, it is better to stick with FP32.
- **How to compute BF16 on CPUs that support it?** If the CPU is detected to support BF16 or it is ensured that the program will run on a BF16-supporting CPU, then BF16 can be considered. The remainder of this article will introduce how to use BF16 instructions via Cgo and assembly, respectively. Since the most accessible consumer-grade CPUs supporting BF16 are Apple's M3 and later processors, this article will use ARM-based BF16 computation as an example.

### Using BF16 via Cgo

Cgo can leverage C language to generate BF16 instructions. BF16 typically requires batch processing. Below is a Cgo implementation for batch addition and conversion of BF16:

```go
package cgo

/*
#cgo CFLAGS: -march=armv8.2-a+bf16 -O3
#include <arm_bf16.h>
#include <stdint.h>

void convert_float32_to_bf16(float *a, uint16_t *b, int n) {
	bfloat16_t *bf16_b = (bfloat16_t *)b;
	for (int i = 0; i < n; i++) {
		bf16_b[i] = (bfloat16_t)a[i];
	}
}

void convert_bf16_to_float32(uint16_t *a, float *b, int n) {
	bfloat16_t *bf16_a = (bfloat16_t *)a;
	for (int i = 0; i < n; i++) {
		b[i] = (float)bf16_a[i];
	}
}

void add_bf16(uint16_t *a, uint16_t *b, uint16_t *c, int n) {
	bfloat16_t *bf16_a = (bfloat16_t *)a;
	bfloat16_t *bf16_b = (bfloat16_t *)b;
	bfloat16_t *bf16_c = (bfloat16_t *)c;
	for (int i = 0; i < n; i++) {
		bf16_c[i] = bf16_a[i] + bf16_b[i];
	}
}
*/
import "C"

func ConvertFloat32ToBF16(a []float32) []uint16 {
	b := make([]uint16, len(a))
	C.convert_float32_to_bf16((*C.float)(&a[0]), (*C.uint16_t)(&b[0]), C.int(len(a)))
	return b
}

func ConvertBF16ToFloat32(a []uint16) []float32 {
	b := make([]float32, len(a))
	C.convert_bf16_to_float32((*C.uint16_t)(&a[0]), (*C.float)(&b[0]), C.int(len(a)))
	return b
}

func AddBF16(a, b, c []uint16) {
	if len(a) != len(b) || len(a) != len(c) {
		panic("slices must have the same length")
	}
	C.add_bf16((*C.uint16_t)(&a[0]), (*C.uint16_t)(&b[0]), (*C.uint16_t)(&c[0]), C.int(len(a)))
}
```

- `convert_float32_to_bf16` converts FP32 to BF16  
- `convert_bf16_to_float32` converts BF16 to FP32  
- `add_bf16` performs BF16 addition  

The `bfloat16_t` type pointer cannot be directly passed between C and Go, so it needs to be transmitted via a `uint16_t` pointer.  

### Generating BF16 Assembly Using GoAT  

While Cgo provides Go with greater extensibility, it comes with several issues, including performance problems (refer to the article ["cgo is not Go"](https://dave.cheney.net/2016/01/18/cgo-is-not-go)). To avoid the overhead of Cgo calls, you can use [GoAT](https://github.com/gorse-io/goat) to directly convert C code into Go assembly.  

First, save the implementation of BF16 vector addition and conversion functions to the [src/bfloat16.c](https://github.com/gorse-io/goat/blob/benchmark_bf16/benchmarks/asm/src/bfloat16.c) file:

```c
#include <arm_bf16.h>

void convert_float32_to_bf16(float *a, void *b, long n) {
	bfloat16_t *bf16_b = (bfloat16_t *)b;
	for (long i = 0; i < n; i++) {
		bf16_b[i] = (bfloat16_t)a[i];
	}
}

void convert_bf16_to_float32(void *a, float *b, long n) {
	bfloat16_t *bf16_a = (bfloat16_t *)a;
	for (long i = 0; i < n; i++) {
		b[i] = (float)bf16_a[i];
	}
}

void add_bf16(void *a, void *b, void *result, long n) {
	bfloat16_t *bf16_a = (bfloat16_t *)a;
	bfloat16_t *bf16_b = (bfloat16_t *)b;
	bfloat16_t *bf16_c = (bfloat16_t *)result;
	for (int i = 0; i < n; i++) {
		bf16_c[i] = bf16_a[i] + bf16_b[i];
	}
}
```

Then, after installing [GoAT](https://github.com/gorse-io/goat), use [GoAT](https://github.com/gorse-io/goat) to compile C code into Go assembly:

```bash
goat src/bfloat16.c -o . -O3 -march=armv8.2-a+bf16
```

The compilation produces two files: [bfloat16.s](https://github.com/gorse-io/goat/blob/benchmark_bf16/benchmarks/asm/bfloat16.s) and [bfloat16.go](https://github.com/gorse-io/goat/blob/benchmark_bf16/benchmarks/asm/bfloat16.go):
- [bfloat16.s](https://github.com/gorse-io/goat/blob/benchmark_bf16/benchmarks/asm/bfloat16.s) is the Go assembly file
- [bfloat16.go](https://github.com/gorse-io/goat/blob/benchmark_bf16/benchmarks/asm/bfloat16.go) contains the function declarations

```go
//go:build !noasm && arm64
// Code generated by GoAT. DO NOT EDIT.
// versions:
// 	clang   18.1.3 (1ubuntu1)
// 	objdump 2.42
// flags: -march=armv8.2-a+bf16 -O3
// source: bf16/asm_bf16/src/bfloat16.c

package asm_bf16

import "unsafe"

//go:noescape
func convert_float32_to_bf16(a, b unsafe.Pointer, n int64)

//go:noescape
func convert_bf16_to_float32(a, b unsafe.Pointer, n int64)

//go:noescape
func add_bf16(a, b, result unsafe.Pointer, n int64)
```

The way to call the function is to convert the slice into `unsafe.Pointer` and pass in the length.

```go
func AddBF16(a, b, c []uint16) {
	if len(a) != len(b) || len(a) != len(c) {
		panic("slices must have the same length")
	}
	add_bf16(unsafe.Pointer(&a[0]), unsafe.Pointer(&b[0]), unsafe.Pointer(&c[0]), int64(len(a)))
}
```

## Benchmark

This article compares the performance of BF16 vector addition implemented in Cgo and assembly on Alibaba Cloud's self-developed Yitian 710 ARM architecture CPU. FP32 vector addition was also tested for reference, and the test code has been uploaded to [GitHub](https://github.com/gorse-io/goat/tree/benchmark_bf16/benchmarks). Both Cgo and [GoAT](https://github.com/gorse-io/goat) used the same version of clang, meaning the assembly cod can be considered identical. The time consumption comparison for vector additions ranging from 8 to 1024 dimensions is as follows:

::: echarts BF16 Vector Addition Benchmark

```json
{
  "legend": {
    "data": ["FP32", "BF16(Cgo)", "BF16(Assembly)"]
  },
  "xAxis": {
    "name": "Vector Length",
    "type": "category",
    "data": [8, 16, 32, 64, 128, 256, 512, 1024]
  },
  "yAxis": {
    "name": "ns/op",
    "type": "value"
  },
  "series": [
    {
      "name": "FP32",
      "data": [4.927, 9.472, 18.67, 36.92, 73.55, 147.1, 303.2, 594.5],
      "type": "line",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    },
    {
      "name": "BF16(Cgo)",
      "data": [75.82, 74.38, 72.29, 75.35, 91.23, 123, 186.9, 303.2],
      "type": "line",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    },
    {
      "name": "BF16(Assembly)",
      "data": [12.02, 7.815, 10.59, 16.96, 33.44, 65.25, 121.2, 240.7],
      "type": "line",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    }
  ]
}
```

:::

Two interesting observations can be drawn from the chart:

1. **There is a consistent time gap between the Cgo implementation and the assembly implementation.** Due to the overhead of Cgo calls, the Cgo implementation is always slower than the assembly implementation.
2. **BF16 addition is twice as fast as FP32 addition.** The Yitian 710 CPU's SIMD instructions can process 8 BF16 numbers at once, whereas only 4 FP32 numbers can be processed in the same time, making BF16 addition twice as fast as FP32 addition.

## Conclusion

Go is not particularly adept at interacting with low-level instructions, and using BF16 in Go is not an easy task. If you must use instruction extensions like BF16 while working in Go, writing assembly code directly or using [GoAT](https://github.com/gorse-io/goat) to generate assembly code will yield better performance compared to using Cgo.
