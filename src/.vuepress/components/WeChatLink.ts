import { defineComponent, h, ref } from "vue";

export default defineComponent({
  name: "WeChatLink",
  setup() {
    const showPopup = ref(false);

    const togglePopup = () => {
      showPopup.value = !showPopup.value;
    };

    const closePopup = () => {
      showPopup.value = false;
    };

    return () =>
      h(
        "div",
        {
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
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    zIndex: "100",
                    textAlign: "center",
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
                      style: {
                        marginTop: "8px",
                        fontSize: "14px",
                        color: "#666",
                      },
                    },
                    "扫码关注公众号"
                  ),
                ]
              )
            : null,
          showPopup.value
            ? h("div", {
                class: "wechat-popup-overlay",
                style: {
                  position: "fixed",
                  top: "0",
                  left: "0",
                  right: "0",
                  bottom: "0",
                  zIndex: "99",
                },
                onClick: closePopup,
              })
            : null,
        ]
      );
  },
});
