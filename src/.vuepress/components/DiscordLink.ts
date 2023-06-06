import { type FunctionalComponent, h } from "vue";

const DiscordLink: FunctionalComponent = () =>
  h(
    "div",
    { class: "nav-item vp-repo" },
    h("a", {
      class: "vp-repo-link",
      href: "https://discord.gg/x6gAtNNkAE",
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "discord",
      innerHTML:
        '<i class="iconfont icon-discord"></i>',
    })
  );

DiscordLink.displayName = "DiscordLink";

export default DiscordLink;