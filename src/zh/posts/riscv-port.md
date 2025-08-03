---
icon: cpu
date: 2025-08-01
category:
  - 产品发布
tag:
  - RISC-V
---
# Gorse现已支持RISC-V架构

感谢[进迭时空](https://www.spacemit.com/)提供的[Bianbu Cloud](https://cloud.spacemit.com/#/) RISC-V云计算实例，Gorse目前已经完成对于RISC-V架构的支持。

## 下载方式

RISC-V版本的Gorse暂时没有提供Docker镜像，您可以选择：

- 在[Release](https://github.com/gorse-io/gorse/releases)页面下载二进制文件压缩包gorse_linux_riscv64.zip
- 或者自行编译二进制文件或者Docker镜像

## 向量计算性能

虽然由纯Go语言编写的Gorse可以在任何Go语言支持的平台运行，但是如果缺少SIMD指令的支持，Gorse中的向量计算将非常低效。RISC-V架构适配的唯一工作就是适配RISC-V向量扩展指令集。Bianbu Cloud提供的RISC-V云计算实例拥有256位的RVV指令集。

::: echarts 向量点积

```json
{
  "legend": {
    "data": ["无SIMD加速", "有SIMD加速"]
  },
  "xAxis": {
    "name": "向量长度",
    "type": "category",
    "data": [16, 32, 64, 128]
  },
  "yAxis": {
    "name": "纳秒/指令",
    "type": "value"
  },
  "series": [
    {
      "name": "无SIMD加速",
      "data": [82.01, 136.4, 267.8, 563.8],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    },
    {
      "name": "有SIMD加速",
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

::: echarts 矩阵乘法

```json
{
  "legend": {
    "data": ["无SIMD加速", "有SIMD加速"]
  },
  "yAxis": {
    "name": "矩阵大小",
    "type": "category",
    "data": ["64x64", "128x128"]
  },
  "xAxis": {
    "name": "纳秒/指令",
    "type": "value"
  },
  "series": [
    {
      "name": "无SIMD加速",
      "data": [1439655, 11497952],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    },
    {
      "name": "有SIMD加速",
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

当向量长度越长，RVV指令的加速效果也就越明显。当向量长度为128的时候，加速可以到达四倍。

## 横向性能对比

Bianbu Cloud提供的RISC-V云计算实例的CPU为SpacemiT X60，作为一款主要服务开发板的CPU，向量计算能力和AMD64和ARM64平台的老款CPU和低端CPU都有较大的差距。
我们将SpacemiT X60和其他四款CPU进行了向量计算能力对比：

- 联发科MT7981BA是一款无线路由器CPU，主频最高可达2.0GHz，SIMD指令集为Neon。
- 高通骁龙820发布于2016年，频率最高可达2.2GHz，SIMD指令集为Neon。
- 高通骁龙845发布于2018年，频率最高可达2.8GHz，SIMD指令集为Neon。
- 英特尔酷睿i7-4500U是2013年第四季度发布的低功耗处理器，基础频率1.8GHz，支持睿频至3.0GHz，SIMD指令集为AVX。

无论是搭载MT7981BA的崭新路由器，搭载骁龙820或845的二手手机，还是搭载i7-4500U的二手笔记本，售价均低于搭载SpacemiT X60的开发板。最终对比结果如下：

::: echarts 向量点积

```json
{
  "legend": {
    "data": ["MT7981BA", "SpacemiT X60", "骁龙820", "骁龙845", "酷睿i7-4500U"]
  },
  "xAxis": {
    "name": "向量长度",
    "type": "category",
    "data": [16, 32, 64, 128]
  },
  "yAxis": {
    "name": "纳秒/指令",
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
      "name": "骁龙820",
      "data": [18.04, 28.96, 38.29, 69.46],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    },
    {
      "name": "骁龙845",
      "data": [11.9, 14.82, 24.75, 42.67],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    },
    {
      "name": "酷睿i7-4500U",
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

::: echarts 矩阵乘法

```json
{
  "legend": {
    "data": ["MT7981BA", "SpacemiT X60", "骁龙820", "骁龙845", "酷睿i7-4500U"]
  },
  "yAxis": {
    "name": "矩阵大小",
    "type": "category",
    "data": ["64x64", "128x128"]
  },
  "xAxis": {
    "name": "纳秒/指令",
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
      "name": "骁龙820",
      "data": [93625, 766049],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    },
    {
      "name": "骁龙845",
      "data": [94600, 796345],
      "type": "bar",
      "showBackground": true,
      "backgroundStyle": {
        "color": "rgba(180, 180, 180, 0.2)"
      }
    },
    {
      "name": "酷睿i7-4500U",
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

SpacemiT X60向量计算能力略强于无线路由器CPU MT7981BA，但是弱于2016年的旗舰手机CPU骁龙820，远弱于2014年的低功耗超极本CPU酷睿i7-4500U。

## 总结

SpacemiT X60主要用于开发板，因此绝对的性能并不是特别重要。然而，另一方面，RISC-V服务器产品并不成熟，短期内Gorse并不适合部署在RISC-V架构的设备上。
