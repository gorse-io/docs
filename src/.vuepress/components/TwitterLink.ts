import { type FunctionalComponent, h } from "vue";

const TwitterLink: FunctionalComponent = () =>
  h(
    "div",
    { class: "vp-nav-item vp-action" },
    h("a", {
      class: "vp-action-link",
      href: "https://twitter.com/gorse_io",
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "twitter",
      innerHTML:
        '<i class="iconfont icon-iconmonstr-twitter-1"></i>',
    })
  );

TwitterLink.displayName = "DiscordLink";

export default TwitterLink;