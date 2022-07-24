# Gorse Docs

Official documents for Gorse recommender system engine

[![Build Docs](https://github.com/gorse-io/docs/actions/workflows/build_docs.yml/badge.svg)](https://github.com/gorse-io/docs/actions/workflows/build_docs.yml)

## ⚙️ Setup environment

This is a [VuePress](https://vuepress.vuejs.org/) project, so you need to install:

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)

## 📦 Install dependencies and run

```
# Clone the repository
git clone git@github.com:gorse-io/docs.git
# Change directory
cd docs
# Install dependencies
yarn install
# Run Gorse Docs on http://localhost:8080
yarn dev
```

## ⚙️ Deployment

Gorse Docs is deployed as a static website. The main branch is deployed at https://docs.gorse.io.

You can build the static website like this:

```
 yarn build
```

The static files will be available in `.vuepress/dist` and you can use a webserver to serve the files.
