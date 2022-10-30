const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Gorse Docs',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: 'src',
    editLinkText: '',
    lastUpdated: true,
    logo: '/gorse.png',
    algolia: {
      apiKey: 'edd7075e83b0f14d48ea946c8fd98d0f',
      indexName: 'gorse',
      appId: 'KH1GFD6Q0P',
    },
    nav: [
      {
        text: 'Getting Started',
        link: '/quick-start/',
      },
      {
        text: 'FAQ',
        link: '/faq/',
      },
      {
        text: 'More Gorse',
        ariaLabel: 'More Gorse Menu',
        items: [
          { text: 'GitHub', link: 'https://github.com/gorse-io/gorse' },
          { text: 'Twitter', link: 'https://twitter.com/gorse_io' },
          { text: 'Discord', link: 'https://github.com/gorse-io' },
          { text: 'QQ', link: 'https://qm.qq.com/cgi-bin/qm/qr?k=lOERnxfAM2U2rj4C9Htv9T68SLIXg6uk&jump_from=webapi' }
        ]
      }
    ],
    sidebar: [
      {
        title: '🚀 Getting Started',
        path: '/introduction/',
        collapsable: false,
        children: [
          '/introduction/',
          {
            title: 'Quick Start',
            path: '/quick-start/',
          },
          {
            title: 'RESTful APIs',
            path: '/quick-start/restful-apis'
          },
          {
            title: 'Configuration',
            path: '/quick-start/configuration'
          },
          {
            title: 'GitRec, The Live Demo',
            path: '/quick-start/demo'
          }
        ]
      },
      {
        title: '⚙️ Recommender',
        path: '/build-recommender/',
        collapsable: false,
        children: [
          {
            title: 'Workflow',
            path: '/build-recommender/'
          },
          {
            title: 'Item Management',
            path: '/build-recommender/item-management',
          },
          {
            title: 'Feedback Collection',
            path: '/build-recommender/feedback-collection',
          },
          {
            title: 'Recommendation Strategies',
            path: '/build-recommender/recommendation-strategies',
          },
          {
            title: 'Performance vs Precision',
            path: '/build-recommender/performance-vs-precision',
          },
          {
            title: 'Gorse Dashboard',
            path: '/build-recommender/gorse-dashboard',
          }
        ]
      },
      {
        title: 'Monitoring',
        path: '/monitoring/',
        collapsable: false,
        children: [
          {
            title: 'Setup Monitoring Infraestructures',
            path: '/monitoring/setup-monitoring-infraestructures',
          }
        ]
      },
      {
        title: "Developer's Guide",
        path: '/developers-guide/',
        collapsable: false,
        children: [
          {
            title: 'Benchmark',
            path: '/developers-guide/benchmark',
          }
        ]
      },
      {
        title: 'FAQ',
        path: '/faq/',
        collapsable: false
      }
    ]
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    [
      '@vuepress/google-analytics',
      {
        'ga': 'G-ZPKMQVNFGX'
      }
    ]
  ],

  markdown: {
    extendMarkdown: md => {
      md.use(require("markdown-it-footnote"));
    }
  }
}
