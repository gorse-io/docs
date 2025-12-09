import { hopeTheme } from "vuepress-theme-hope";

import { enNavbar, zhNavbar } from "./navbar/index.js";
import { enSidebar, zhSidebar } from "./sidebar/index.js";

export default hopeTheme({
  hostname: "https://gorse.io",

  logo: "/logo.png",

  repo: "gorse-io/docs",

  repoDisplay: false,

  docsDir: "src",

  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],


  locales: {
    "/": {
      // navbar
      navbar: enNavbar,

      navbarLayout: {
        start: ["Brand"],
        center: ["Links"],
        end: ["Language", "GitHubLink", "TwitterLink", "DiscordLink", "Outlook", "Search"],
      },

      // sidebar
      sidebar: enSidebar,

      footer: "Apache 2 Licensed | Copyright © 2022-present zhenghaoz",

      displayFooter: true,

      metaLocales: {
        editLink: "Edit this page on GitHub",
      },
    },

    /**
     * Chinese locale config
     */
    "/zh/": {
      // navbar
      navbar: zhNavbar,

      navbarLayout: {
        start: ["Brand"],
        center: ["Links"],
        end: ["Language", "GitHubLink", "WeChatLink", "QQLink", "Outlook", "Search"],
      },

      // sidebar
      sidebar: zhSidebar,

      footer: "采用 Apache 2 许可 | 版权所有 © 2022 至今 zhenghaoz",

      displayFooter: true,

      // page meta
      metaLocales: {
        editLink: "在 GitHub 上编辑此页",
      },
    },
  },

  // These features are enabled for demo, only preserve features you need here
  markdown: {
    align: true,
    attrs: true,
    codeTabs: true,
    component: true,
    demo: true,
    figure: true,
    gfm: true,
    imgLazyload: true,
    imgSize: true,
    include: true,
    mark: true,
    plantuml: true,
    spoiler: true,
    stylize: [
      {
        matcher: "Recommended",
        replacer: ({ tag }) => {
          if (tag === "em")
            return {
              tag: "Badge",
              attrs: { type: "tip" },
              content: "Recommended",
            };
        },
      },
    ],
    sub: true,
    sup: true,
    tabs: true,
    tasklist: true,
    vPre: true,

    // uncomment these if you need TeX support
    math: {
      // install katex before enabling it
      type: "katex",
      //   // or install @mathjax/src before enabling it
      //   type: "mathjax",
    },

    // install chart.js before enabling it
    // chartjs: true,

    // install echarts before enabling it
    echarts: true,

    // install flowchart.ts before enabling it
    flowchart: true,

    // install mermaid before enabling it
    mermaid: true,

    // playground: {
    //   presets: ["ts", "vue"],
    // },

    // install @vue/repl before enabling it
    // vuePlayground: true,

    // install sandpack-vue3 before enabling it
    // sandpack: true,

    // install @vuepress/plugin-revealjs and uncomment these if you need slides
    // revealjs: {
    //   plugins: ["highlight", "math", "search", "notes", "zoom"],
    // },
  },

  plugins: {
    // Note: This is for testing ONLY!
    // You MUST generate and use your own comment service in production.
    comment: {
      provider: "Giscus",
      repo: "gorse-io/docs",
      repoId: "MDEwOlJlcG9zaXRvcnkzNTg4NjUwNjc",
      category: "Giscus",
      categoryId: "DIC_kwDOFWPYq84CSXxH",
    },

    components: {
      components: ["Badge", "VPCard"],
    },

    icon: {
      assets: "https://at.alicdn.com/t/c/font_3748819_mza9wm36qn.css",
    },

    // Install @vuepress/plugin-pwa and uncomment these if you want a PWA
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cacheImage: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },

    blog: {
      article: "/blog/",
      filter: ({ pathLocale, filePathRelative }) =>
        filePathRelative ? filePathRelative.startsWith(pathLocale.substring(1) + "posts/") : false
    },

    docsearch: {
      apiKey: 'edd7075e83b0f14d48ea946c8fd98d0f',
      indexName: 'gorse',
      appId: 'KH1GFD6Q0P',
    },

    redirect: {
      switchLocale: "modal",
    },

    backToTop: false
  },
});
