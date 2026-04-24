import { defineComponent, h, onBeforeUnmount, onMounted, ref } from "vue";

export default defineComponent({
  name: "WeChatLink",
  setup() {
    const containerRef = ref<HTMLElement | null>(null);
    const showPopup = ref(false);

    const togglePopup = () => {
      showPopup.value = !showPopup.value;
    };

    const closePopup = () => {
      showPopup.value = false;
    };

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target;

      if (
        showPopup.value &&
        target instanceof Node &&
        containerRef.value &&
        !containerRef.value.contains(target)
      ) {
        closePopup();
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleDocumentClick);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleDocumentClick);
    });

    return () =>
      h(
        "div",
        {
          ref: containerRef,
          class: "vp-nav-item vp-action wechat-container",
          style: { position: "relative" },
        },
        [
          h("a", {
            class: "vp-action-link",
            href: "#",
            "aria-label": "wechat",
            onClick: (e: Event) => {
              e.preventDefault();
              togglePopup();
            },
            innerHTML: '<i class="iconfont icon-wechat-fill"></i>',
          }),
          showPopup.value
            ? h(
                "div",
                {
                  class: "wechat-popup",
                  style: {
                    position: "absolute",
                    top: "100%",
                    right: "0",
                    marginTop: "8px",
                    padding: "16px",
                    zIndex: "100",
                  },
                },
                [
                  h("img", {
                    src: "https://gorse.io/weixin.jpg",
                    alt: "WeChat QR Code",
                    style: {
                      width: "150px",
                      height: "150px",
                      display: "block",
                    },
                  }),
                  h(
                    "div",
                    {
                      class: "wechat-popup-text",
                    },
                    "扫码关注公众号"
                  ),
                ]
              )
            : null,
        ]
      );
  },
});
