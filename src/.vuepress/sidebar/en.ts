import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/": [
    {
      text: "Docs",
      icon: "note",
      prefix: "docs/",
      children: "structure",
    },
  ],
});
