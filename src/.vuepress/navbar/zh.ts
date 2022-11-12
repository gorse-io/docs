import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  { text: "文档", icon: "explore", link: "/docs/" },
  { text: "博客", icon: "article-fill", link: "/blog/" },
  {
    text: "源码",
    icon: "github-fill",
    children: [
      {
        text: "核心",
        children: [
          { text: "Gorse", icon: "code", link: "https://github.com/gorse-io/gorse" },
        ],
      },
      {
        text: "示例",
        children: [
          { text: "GitRec", icon: "preview", link: "https://github.com/gorse-io/gitrec" },
        ],
      },
      {
        text: "SDK",
        children: [
          { text: "Gorse Go SDK", icon: "go", link: "https://github.com/gorse-io/gorse/tree/master/client" },
          { text: "PyGorse - Gorse Python SDK", icon: "python", link: "https://github.com/gorse-io/PyGorse" },
          { text: "Gorse.js - Gorse TypeScript SDK", icon: "typescript", link: "https://github.com/gorse-io/gorse-js" },
          { text: "Gorse4J - Gorse Java SDK", icon: "java", link: "https://github.com/gorse-io/gorse4j" },
          { text: "gorse-rs - Gorse Rust SDK", icon: "rust", link: "https://github.com/gorse-io/gorse-rs" }
        ],
      },
    ],
  },
]);
