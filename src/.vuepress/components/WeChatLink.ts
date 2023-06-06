import { type FunctionalComponent, h } from "vue";

const TwitterLink: FunctionalComponent = () =>
  h(
    "div",
    { class: "nav-item vp-repo" },
    h("a", {
      class: "vp-repo-link",
      href: "https://gorse.io/weixin.jpg",
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "wechat",
      innerHTML:
        '<i class="iconfont icon-wechat-fill"></i>',
    })
  );

TwitterLink.displayName = "DiscordLink";

export default TwitterLink;