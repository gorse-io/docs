---
date: 2025-08-01
category:
  - release
tag:
  - RISC-V
---
# Gorse Now Supports RISC-V Architecture

Thanks to the [Bianbu Cloud](https://cloud.spacemit.com/#/) RISC-V cloud computing instances provided by [SpacemiT](https://www.spacemit.com/en/), Gorse has now completed support for the RISC-V architecture.

## Download

The RISC-V version of Gorse does not currently offer Docker images. You can choose to:

- Download the binary compressed package `gorse_linux_riscv64.zip` from the [Release](https://github.com/gorse-io/gorse/releases) page.
- Or compile the binary or Docker image yourself.

## Vector Computation Performance

Although Gorse, written in pure Go, can run on any architecture supported by the Go language, vector computations in Gorse will be inefficient without SIMD instructions. The only adaptation required for the RISC-V architecture was to support the RISC-V Vector Extension instruction set. The RISC-V cloud computing instances provided by Bianbu Cloud feature a 256-bit RVV instruction set.

::: echarts Dot Product

```json
{
  "legend": {
    "data": ["No SIMD", "With SIMD"]
  },
  "xAxis": {
    "name": "Vector Length",
    "type": "category",
    "data": [16, 32, 64, 128]
  },
  "yAxis": {
    "name": "ns/op",
    "type": "value"
  },
  "series": [
    {
      "name": "No SIMD",
      "data": [82.01, 136.4, 267.8, 563.8],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    },
    {
      "name": "With SIMD",
      "data": [72.83, 78.70, 93.67, 119.3],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    }
  ]
}
```

:::

::: echarts Matrix Multiplication

```json
{
  "legend": {
    "data": ["No SIMD", "With SIMD"]
  },
  "yAxis": {
    "name": "Matrix Size",
    "type": "category",
    "data": ["64x64", "128x128"]
  },
  "xAxis": {
    "name": "ns/op",
    "type": "value"
  },
  "series": [
    {
      "name": "No SIMD",
      "data": [1439655, 11497952],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    },
    {
      "name": "With SIMD",
      "data": [266943, 2715033],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    }
  ]
}
```

:::

The longer the vector length, the more pronounced the acceleration effect of RVV instructions. When the vector length is 128, the acceleration can reach fourfold.

## Comparison with Other CPUs

The CPU in the RISC-V cloud computing instances provided by Bianbu Cloud is the SpacemiT X60. As a CPU primarily designed for development boards, its vector computation capabilities lag significantly behind older and low-end CPUs on the AMD64 and ARM64 platforms.

We compared the vector computation capabilities of the SpacemiT X60 with four other CPUs:

- MediaTek MT7981BA is a wireless router CPU with a maximum clock speed of 2.0GHz and supports the Neon SIMD instruction set.
- Qualcomm Snapdragon 820, released in 2016, has a maximum frequency of 2.2GHz and supports the Neon SIMD instruction set.
- Qualcomm Snapdragon 845, released in 2018, has a maximum frequency of 2.8GHz and supports the Neon SIMD instruction set.
- Intel Core i7-4500U, a low-power processor released in Q4 2013, has a base frequency of 1.8GHz, can turbo up to 3.0GHz, and supports the AVX SIMD instruction set.

Whether it's a brand-new router with the MT7981BA, a second-hand phone with a Snapdragon 820 or 845, or a second-hand laptop with an i7-4500U, the price is lower than that of a development board with the SpacemiT X60. The final comparison results are as follows:

::: echarts Dot Product

```json
{
  "legend": {
    "data": ["MT7981BA", "SpacemiT X60", "Snapdragon 820", "Snapdragon 845", "Core i7-4500U"]
  },
  "xAxis": {
    "name": "Vector Length",
    "type": "category",
    "data": [16, 32, 64, 128]
  },
  "yAxis": {
    "name": "Nanoseconds per Instruction",
    "type": "value"
  },
  "series": [
    {
      "name": "MT7981BA",
      "data": [70.86, 108.5, 149.3, 256],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    },
    {
      "name": "SpacemiT X60",
      "data": [72.83, 78.70, 93.67, 119.3],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    },
    {
      "name": "Snapdragon 820",
      "data": [18.04, 28.96, 38.29, 69.46],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    },
    {
      "name": "Snapdragon 845",
      "data": [11.9, 14.82, 24.75, 42.67],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    },
    {
      "name": "Core i7-4500U",
      "data": [10.5, 11.57, 13.51, 19.02],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    }
  ]
}
```

:::

::: echarts Matrix Multiplication

```json
{
  "legend": {
    "data": ["MT7981BA", "SpacemiT X60", "Snapdragon 820", "Snapdragon 845", "Core i7-4500U"]
  },
  "yAxis": {
    "name": "Matrix Size",
    "type": "category",
    "data": ["64x64", "128x128"]
  },
  "xAxis": {
    "name": "Nanoseconds per Instruction",
    "type": "value"
  },
  "series": [
    {
      "name": "MT7981BA",
      "data": [541314, 5072757],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    },
    {
      "name": "SpacemiT X60",
      "data": [266943, 2715033],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    },
    {
      "name": "Snapdragon 820",
      "data": [93625, 766049],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    },
    {
      "name": "Snapdragon 845",
      "data": [94600, 796345],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    },
    {
      "name": "Core i7-4500U",
      "data": [26916, 213187],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    }
  ]
}
```

:::

The SpacemiT X60's vector computation capabilities are slightly better than the wireless router CPU MT7981BA but weaker than the 2016 flagship smartphone CPU Snapdragon 820 and significantly weaker than the 2014 low-power ultrabook CPU Core i7-4500U.

## Conclusion

The SpacemiT X60 is primarily intended for development boards, so absolute performance is not particularly critical. However, on the other hand, RISC-V server products are not yet mature, and in the short term, Gorse is not suitable for deployment on RISC-V architecture devices.
