import fs from 'fs';
import { navbar, NavbarItem } from "vuepress-theme-hope";

var navbars: NavbarItem[] = [];

const versions = fs.readdirSync('src/docs/', { withFileTypes: true })
  .filter((item) => item.isDirectory())
  .map((item) => item.name);
for (const version of versions) {
  navbars.push({ text: version, link: `/docs/${version}/` });
}

export const enNavbar = navbar([
  "/",
  { text: "Docs", icon: "explore", children: navbars },
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
