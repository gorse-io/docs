import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/",
  { text: "Docs", icon: "explore", link: "/docs/master/" },
  { text: "Blog", icon: "article-fill", link: "/blog/" },
  {
    text: "GitHub",
    icon: "github-fill",
    link: "https://github.com/gorse-io"
  },
  {
    text: "Twitter",
    icon: "iconmonstr-twitter-1",
    link: "https://twitter.com/gorse_io"
  },
  {
    text: "Discord",
    icon: "discord",
    link: "https://discord.gg/x6gAtNNkAE"
  },
]);
