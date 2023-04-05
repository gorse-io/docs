import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/zh/",
  { text: "文档", icon: "explore", link: "/zh/docs/master/" },
  { text: "博客", icon: "article-fill", link: "/zh/blog/" },
  {
    text: "GitHub",
    icon: "github-fill",
    link: "https://github.com/gorse-io"
  },
  {
    text: "公众号",
    icon: "wechat-fill",
    link: "https://gorse.io/weixin.jpg"
  },
  {
    text: "QQ群",
    icon: "QQ",
    link: "https://qm.qq.com/cgi-bin/qm/qr?k=lOERnxfAM2U2rj4C9Htv9T68SLIXg6uk&jump_from=webapi"
  },
]);
