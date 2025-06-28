---
icon: github-fill
date: 2025-06-28
category:
  - 技术分享
tag:
  - GitHub
---
# 如何在GitHub Actions上运行RISC-V工作流

GitHub Actions为托管于GitHub上的项目提供了多种持续集成运行环境，包括三种操作系统Linux、macOS和Windows，以及两种架构AMD64和ARM64。这些环境对于大部分项目来说完全足够，但是RISC-V开发者会发现自己很难在GitHub Actions上运行RISC-V工作流。商业公司可以使用自托管（参考[Supporting runners on 64bit RISC-V](https://github.com/actions/runner/issues/2157)）或者服务商（[RISC-V Runners](https://www.riscvrunners.com/)和[Cloud-V](https://cloud-v.co/risc-v-cicd)），但是对于个人开发者来说是一笔巨大的支出。

## 大救星QEMU

很容易想到的解决方法就是在GitHub Actions使用QEMU模拟RISC-V，然后在虚拟机内运行工作流。配置和启动QEMU并不简单，但是[uraimo/run-on-arch-action](https://github.com/uraimo/run-on-arch-action)可以帮助我们完成繁琐的QEMU操作。
我们以[GoAT](https://github.com/gorse-io/goat/tree/main)这个项目为例创建一个RISC-V工作流。[GoAT](https://github.com/gorse-io/goat/tree/main)项目将C语言编译为Go汇编代码，支持AMD64、ARM64和RISC-V三种架构，以下是RISC-V测试工作流：

```yaml
name: test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  riscv:
    name: ubuntu-24.04-riscv
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: uraimo/run-on-arch-action@v3
        with:
          arch: riscv64
          distro: ubuntu24.04
          githubToken: ${{ github.token }}
          dockerRunArgs: |
            --volume "${PWD}:/opt/goat"
          install: |
            apt-get update
            apt-get install -y clang golang
          run: |
            cd /opt/goat
            go run . tests/src/universal.c -o tests -march=rv64imafd
            go test -v ./tests
```

检出代码之后使用了[uraimo/run-on-arch-action](https://github.com/uraimo/run-on-arch-action)，每个参数说明如下：
- `arch`代表架构，设置为`riscv64`
- `distro`表示使用的Linux发行版，为Ubuntu 24.04
- `githubToken`用于保存工作流缓存
- `dockerRunArgs`将当前目录映射到虚拟机中
- `install`安装依赖，安装好依赖的镜像会被保存到缓存中供下次使用
- `run`对应测试命令

## 模拟的代价

在AMD64上模拟RISC-V是要付出代价的，对于逻辑复杂、计算量大的测试来说，QEMU开始力不从心。以下是[Gorse推荐系统](https://github.com/gorse-io/gorse)的部分单元测试在AMD64和QEMU模拟RISC-V中的用时对比：


| 测试 |	AMD64	| RISC-V（QEMU）|
|---|---|---|
| common/ann.TestMNIST|	22.58s|	562.50s |
| common/ann.TestMovieLens|	25.96s|	91.42s |
| common/nn.TestNeuralNetwork|	1.22s|	12.10s |
| common/nn.TestIris|	8.98s|	139.29s |
| model/cf.TestBPR_MovieLens|	23.328s|	247.33s |
| model/cf.TestCCD_MovieLens|	8.73s|	102.63s |
| TestFactorizationMachines_Classification_Frappe|	29.13s|	176.41s |


表中的测试均为计算密集型，QEMU模拟RISC-V的用时和AMD64下的用时有显著的差距，使用QEMU运行单元测试已经不合时宜。

## 总结

本文介绍了如何在GitHub Actions上运行RISC-V工作流，使用[uraimo/run-on-arch-action](https://github.com/uraimo/run-on-arch-action)可以轻松地在QEMU模拟的RISC-V环境中运行工作流。虽然QEMU模拟RISC-V的性能不如真实的硬件，但是对于大部分测试来说已经足够使用。对于个人开发者来说，使用QEMU模拟RISC-V是一个经济实惠的选择。
