import { defineUserConfig } from "vuepress";
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics';
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "en-US",
      title: "Gorse",
      description: "An open source recommender system service written in Go",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "Gorse",
      description: "开箱即用的开源推荐系统",
    },
  },

  theme,

  // Enable it with pwa
  shouldPrefetch: false,

  plugins: [
    googleAnalyticsPlugin({
      id: 'G-ZPKMQVNFGX',
    }),
  ],

  head: [
    ["script", {
      async: true,
      src: "https://widget.gurubase.io/widget.latest.min.js",
      "data-widget-id": "FubGXZNmNkHYTx7lvFf0wLfcENtPEAoyUBoronOGaE8",
      "data-text": "Ask AI",
      "data-margins": '{"bottom": "1rem", "right": "1rem"}',
      "data-bg-color": "#0a7bf4",
      id: "guru-widget-id",
    }],
  ]
});
