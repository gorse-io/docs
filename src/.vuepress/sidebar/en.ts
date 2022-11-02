import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/": [
    {
      text: '🚀 Getting Started',
      link: '/docs/introduction/',
      children: [
        {
          text: 'Quick Start',
          link: '/docs/quick-start/',
        },
        {
          text: 'RESTful APIs',
          link: '/docs/quick-start/restful-apis'
        },
        {
          text: 'Configuration',
          link: '/docs/quick-start/configuration'
        },
        {
          text: 'GitRec, The Live Demo',
          link: '/docs/quick-start/demo'
        }
      ]
    },
    {
      text: '⚙️ Recommender',
      link: '/docs/build-recommender/',
      children: [
        {
          text: 'Workflow',
          link: '/docs/build-recommender/'
        },
        {
          text: 'Item Management',
          link: '/docs/build-recommender/item-management',
        },
        {
          text: 'Feedback Collection',
          link: '/build-recommender/feedback-collection',
        },
        {
          text: 'Recommendation Strategies',
          link: '/docs/build-recommender/recommendation-strategies',
        },
        {
          text: 'Performance vs Precision',
          link: '/docs/build-recommender/performance-vs-precision',
        },
        {
          text: 'Gorse Dashboard',
          link: '/docs/build-recommender/gorse-dashboard',
        }
      ]
    },
    {
      text: 'Monitoring',
      link: '/docs/monitoring/',
      children: [
        {
          text: 'Setup Monitoring Infraestructures',
          link: '/docs/monitoring/setup-monitoring-infraestructures',
        }
      ]
    },
    {
      text: "Developer's Guide",
      link: '/docs/developers-guide/',
      children: [
        {
          text: 'Benchmark',
          link: '/docs/developers-guide/benchmark',
        }
      ]
    },
    {
      text: 'FAQ',
      link: '/docs/faq/'
    }
  ],
});
