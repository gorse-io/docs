import { type FunctionalComponent, h } from "vue";

const TwitterLink: FunctionalComponent = () =>
  h(
    "div",
    { class: "vp-nav-item vp-action" },
    h("a", {
      class: "vp-action-link",
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