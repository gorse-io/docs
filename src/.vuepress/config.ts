import { Buffer } from "node:buffer";
import { instance } from "@viz-js/viz";
import { defineUserConfig } from "vuepress";
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics';
import { logger } from "vuepress/utils";
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
    {
      name: "vuepress-plugin-graphviz",
      async extendsMarkdown(md) {
        const viz = await instance();
        const renderFence = md.renderer.rules.fence!;
        md.renderer.rules.fence = (tokens, index, options, env, renderer) => {
          const token = tokens[index];
          const match = /^graphviz(?:\s+(.+))?$/.exec(token.info.trim());
          if (match) {
            const result = viz.render(token.content, { format: "svg" });
            if (result.status === "success") {
              const alt = md.utils.escapeHtml(match[1] || "Graphviz diagram");
              const svg = Buffer.from(result.output).toString("base64");
              return `<p class="graphviz-diagram"><img src="data:image/svg+xml;base64,${svg}" alt="${alt}"></p>\n`;
            }
            const location = env.filePathRelative ?? "Markdown";
            const message = result.errors.map(({ message }) => message).join("\n");
            logger.warn(`[graphviz] ${location}\n${message}`);
          }
          return renderFence(tokens, index, options, env, renderer);
        };
      },
    },
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
