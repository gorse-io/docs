---
icon: vue
date: 2023-02-01
category:
  - 技术分享
tag:
  - 前端
---

# 使用Go Modules引入前端产物到Go项目

> 本文分享了[Gorse开源推荐系统](https://gorse.io/)使用Go Modules管理前端产物的心得，将前后端开发彻底分离。

能够编译成一个单独的二进制文件是Go语言的一大特色，避免了部署时繁琐的依赖管理。然而，如果项目包含了前端代码，在编译的时候就需要想办法将前端产物嵌入到Go二进制文件中。编译流程大致如下：

```mermaid
flowchart LR
  frontend[编译前端代码]-->embed[嵌入到Go代码]-->build[编译Go代码]
```

1. 编译前端代码。
2. 将前端生成物转换为Go嵌入文件。例如，[rakyll/statik](https://github.com/rakyll/statik)这个项目就能够将任何文件嵌入到Go源代码中。另外，Go语言目前提供了官方资源嵌入方案[embed](https://pkg.go.dev/embed)，可以在编译期间完成嵌入，免去步骤2。
3. 构建Go代码。

一般前端代码和Go代码放在同一仓库中，或者通过git子模块放入Go仓库，通过Makefile或者构建脚本的形似编译。但是这样的方案存在一个小缺点，开发Go项目的时候需要安装前端工具链。*对于Gorse这样的项目，大部分的开发工作都在后端，前端改动非常至少，每次拉取仓库开发的时候都编译一次前端大可不必，因此需要一个方案在Go开发过程中屏蔽掉前端编译的过程。*

## 将前端产物编译成Go包

[rakyll/statik](https://github.com/rakyll/statik)可以将前端生成物嵌入到Go代码中，那么完全可以将转换后的代码单独作为一个Go包被Gorse引用。那么每次修改前端代码之后：

1. 编译前端代码。
2. 使用[rakyll/statik](https://github.com/rakyll/statik)将前端生成物转换为Go嵌入文件，并使用`go mod init`和`go mod tidy`初始化Go包。
3. 将Go包推送到用于保存生成物的仓库或者分支。

可以将上述流程写成一个脚本，由于[Gorse前端仓库](https://github.com/gorse-io/dashboard)通过GitHub托管，因此可以通过GitHub Action在每次提交前端代码时自动更新生产物。

```yaml
name: build

on:
  push:
    branches: [ master ]  # 当master提交代码时触发

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # 编译前端代码
      - uses: actions/checkout@v2
      - name: Install dependencies
        uses: borales/actions-yarn@v2.0.0
        with:
          cmd: install
      - name: Build for production
        uses: borales/actions-yarn@v2.0.0
        with:
          cmd: build
      # 嵌入到Go源代码
      - name: Install Go
        uses: actions/setup-go@v2
      - name: Install statik & build embed files
        run: |
          export PATH=$PATH:$(go env GOPATH)/bin
          go get github.com/rakyll/statik
          statik -src=dist
      # 提交Go源代码
      - name: Commit embed files
        run: |
          cd ..
          git clone https://github.com/gorse-io/dashboard.git dashboard-statik
          cd dashboard-statik
          git config --local user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git checkout statik || git checkout --orphan statik
          git rm -r --cached .
          rm statik.go go.mod go.sum
          cp -f ../dashboard/statik/statik.go statik.go
          go mod init github.com/gorse-io/dashboard
          go mod tidy
          git add statik.go go.mod go.sum
          git commit -m "Build embed files"
          git remote set-url origin https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }}
          git push origin statik
```

上述的GitHub Action会将Go代码提交到[statik](https://github.com/gorse-io/dashboard/tree/statik)分支上。

## 通过Go Modules使用前端产物

首先，下载前端产物包。因为产物保存在[statik](https://github.com/gorse-io/dashboard/tree/statik)分支上，所以包地址后面需要添加`@statik`。

```
go get -u github.com/gorse-io/dashboard@statik
```

然后，引入`github.com/gorse-io/dashboard`，前端静态资源会被包含在`fs.New()`创建的文件系统中。

```go
import (
  "github.com/rakyll/statik/fs"
  _ "github.com/gorse-io/dashboard"
)

  // ...

  statikFS, err := fs.New()
  if err != nil {
    log.Fatal(err)
  }
  
  // 例子：通过HTTP访问文件系统
  http.Handle("/", http.FileServer(statikFS))
  http.ListenAndServe(":8080", nil)
```

## 总结

使用Go Modules管理前端产物非常优雅，但是只适合前端改动较少的项目。对于前后端经常需要联动开发的项目，例如商城项目，将前后端代码放在同一个仓库中更加合适。
