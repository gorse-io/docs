import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/zh/": [
    {
      text: '🚀 快速开始',
      link: '/zh/introduction/',
    },
    {
      icon: "discover",
      text: "案例",
      prefix: "demo/",
      link: "demo/",
      children: "structure",
    },
    {
      text: "文档",
      icon: "note",
      prefix: "guide/",
      children: "structure",
    },
    "slides",
  ],
});
