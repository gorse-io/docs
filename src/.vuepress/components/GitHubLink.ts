import { type FunctionalComponent, h } from "vue";

const DiscordLink: FunctionalComponent = () =>
  h(
    "div",
    { class: "vp-nav-item vp-action" },
    h("a", {
      class: "vp-action-link",
      href: "https://github.com/gorse-io",
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "github",
      innerHTML:
        '<i class="iconfont icon-github-fill"></i>',
    })
  );

DiscordLink.displayName = "DiscordLink";

export default DiscordLink;