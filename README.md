# Gorse Document

[![Build Docs](https://github.com/gorse-io/docs/actions/workflows/build_docs.yml/badge.svg)](https://github.com/gorse-io/docs/actions/workflows/build_docs.yml)

## Build and Serve

1. [Install Rust](https://www.rust-lang.org/tools/install).

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. Install `mdbook`.

```bash
cargo install mdbook
```

3. Build and serve.

```bash
mdbook serve
```
