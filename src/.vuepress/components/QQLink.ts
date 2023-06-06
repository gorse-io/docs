import { type FunctionalComponent, h } from "vue";

const TwitterLink: FunctionalComponent = () =>
  h(
    "div",
    { class: "nav-item vp-repo" },
    h("a", {
      class: "vp-repo-link",
      href: "https://qm.qq.com/cgi-bin/qm/qr?k=lOERnxfAM2U2rj4C9Htv9T68SLIXg6uk&jump_from=webapi",
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "qq",
      innerHTML:
        '<i class="iconfont icon-QQ"></i>',
    })
  );

TwitterLink.displayName = "DiscordLink";

export default TwitterLink;