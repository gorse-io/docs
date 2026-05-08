import { type FunctionalComponent, h } from "vue";

const HuggingFaceLink: FunctionalComponent = () =>
  h(
    "div",
    { class: "vp-nav-item vp-action" },
    h("a", {
      class: "vp-action-link",
      href: "https://huggingface.co/gorse-io",
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "huggingface",
      innerHTML: '<i class="iconfont icon-line-huggingface"></i>',
    })
  );

HuggingFaceLink.displayName = "HuggingFaceLink";

export default HuggingFaceLink;
