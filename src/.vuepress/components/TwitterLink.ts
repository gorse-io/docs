import { type FunctionalComponent, h } from "vue";

const TwitterLink: FunctionalComponent = () =>
  h(
    "div",
    { class: "nav-item vp-repo" },
    h("a", {
      class: "vp-repo-link",
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