import { defineClientConfig } from "vuepress/client";

import DiscordLink from "./components/DiscordLink.js";
import GitHubLink from "./components/GitHubLink.js";
import QQLink from "./components/QQLink.js";
import TwitterLink from "./components/TwitterLink.js";
import WeChatLink from "./components/WeChatLink.js";
import Swiper from "./components/Swiper.vue";

export default defineClientConfig({
  enhance: ({ app }) => {
    app.component("DiscordLink", DiscordLink);
    app.component("GitHubLink", GitHubLink);
    app.component("QQLink", QQLink);
    app.component("TwitterLink", TwitterLink);
    app.component("WeChatLink", WeChatLink);
    app.component("Swiper", Swiper);
  },
});
