---
date: 2025-06-28
category:
  - technical
tag:
  - GitHub
---
# RISC-V Workflows on GitHub Actions (QEMU)

GitHub Actions provides various continuous integration environments for projects hosted on GitHub, including three operating systems (Linux, macOS, and Windows) and two architectures (AMD64 and ARM64). These environments are sufficient for most projects, but RISC-V developers may find it challenging to run RISC-V workflows on GitHub Actions. Commercial companies can use self-hosted runners (refer to [Supporting runners on 64bit RISC-V](https://github.com/actions/runner/issues/2157)) or service providers ([RISC-V Runners](https://www.riscvrunners.com/) and [Cloud-V](https://cloud-v.co/risc-v-cicd)), but for individual developers, this represents a significant expense.

## The Savior: QEMU

An obvious solution is to use QEMU to emulate RISC-V on GitHub Actions and run workflows within the virtual machine. Configuring and launching QEMU isn't straightforward, but [uraimo/run-on-arch-action](https://github.com/uraimo/run-on-arch-action) can help handle the tedious QEMU operations.

Let's take the [GoAT](https://github.com/gorse-io/goat/tree/main) project as an example to create a RISC-V workflow. The [GoAT](https://github.com/gorse-io/goat/tree/main) project compiles C code into Go assembly, supporting AMD64, ARM64, and RISC-V architectures. Below is the RISC-V test workflow:

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

After checking out, [uraimo/run-on-arch-action](https://github.com/uraimo/run-on-arch-action) is used. Here’s an explanation of each parameter:
- `arch`: The architecture, set to `riscv64`.
- `distro`: The Linux distribution used, here Ubuntu 24.04.
- `githubToken`: Used to save workflow caches.
- `dockerRunArgs`: Maps the current directory into the virtual machine.
- `install`: Installs dependencies, with the resulting image saved in the cache for future use.
- `run`: The corresponding test commands.

## The Cost of Emulation

Emulating RISC-V on AMD64 comes at a cost. For complex logic or computationally intensive tests, QEMU struggles to keep up. Below is a comparison of execution times for some unit tests from [the Gorse recommender system](https://github.com/gorse-io/gorse) on AMD64 versus QEMU-emulated RISC-V:

| Test | AMD64 | RISC-V (QEMU) |
|---|---|---|
| common/ann.TestMNIST | 22.58s | 562.50s |
| common/ann.TestMovieLens | 25.96s | 91.42s |
| common/nn.TestNeuralNetwork | 1.22s | 12.10s |
| common/nn.TestIris | 8.98s | 139.29s |
| model/cf.TestBPR_MovieLens | 23.328s | 247.33s |
| model/cf.TestCCD_MovieLens | 8.73s | 102.63s |
| TestFactorizationMachines_Classification_Frappe | 29.13s | 176.41s |

The tests listed are computationally intensive, and the execution times on QEMU-emulated RISC-V show a significant gap compared to AMD64. Running unit tests on QEMU is no longer practical.

## Conclusion

This article explains how to run RISC-V workflows on GitHub Actions. Using [uraimo/run-on-arch-action](https://github.com/uraimo/run-on-arch-action) makes it easy to run workflows in a QEMU-emulated RISC-V environment. Although the performance of QEMU-emulated RISC-V falls short of real hardware, it is sufficient for most testing purposes. For individual developers, using QEMU to emulate RISC-V is an economical choice.
