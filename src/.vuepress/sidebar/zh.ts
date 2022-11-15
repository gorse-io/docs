import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/zh/": [
    {
      text: '快速上手',
      icon: 'launch',
      link: '/zh/docs/quick-start',
    },
    {
      text: '部署',
      icon: 'start',
      children: [
        {
          text: '二进制部署',
          icon: 'console',
          link: '/zh/docs/deploy/binary.md',
        },
        {
          text: 'Docker 部署',
          icon: 'docker',
          link: '/zh/docs/deploy/docker.md',
        },
        {
          text: 'Kubernetes 部署',
          icon: 'kubernetes',
          link: '/zh/docs/deploy/kubernetes.md',
        },
      ]
    },
    // {
    //   text: 'Recommender',
    //   link: '/docs/build-recommender/',
    //   children: [
    //     {
    //       text: 'Workflow',
    //       link: '/docs/build-recommender/'
    //     },
    //     {
    //       text: 'Item Management',
    //       link: '/docs/build-recommender/item-management',
    //     },
    //     {
    //       text: 'Feedback Collection',
    //       link: '/build-recommender/feedback-collection',
    //     },
    //     {
    //       text: 'Recommendation Strategies',
    //       link: '/docs/build-recommender/recommendation-strategies',
    //     },
    //     {
    //       text: 'Performance vs Precision',
    //       link: '/docs/build-recommender/performance-vs-precision',
    //     },
    //     {
    //       text: 'Gorse Dashboard',
    //       link: '/docs/build-recommender/gorse-dashboard',
    //     }
    //   ]
    // },
    {
      text: '概念详解',
      icon: 'idea',
      children: [
        {
          text: '数据对象',
          icon: "model",
          link: '/zh/docs/concepts/data-objects',
        },
        {
          text: '推荐算法',
          icon: "zhinengsuanfa",
          link: '/zh/docs/concepts/algorithms',
        },
        {
          text: '推荐工作流',
          icon: "process",
          link: '/zh/docs/concepts/workflow',
        },
      ]
    },
    {
      text: 'Gorse 控制台',
      icon: 'dashboard',
      link: '/zh/docs/gorse-dashboard'
    },
    {
      text: '性能对比',
      icon: 'dashboard-fill',
      link: '/zh/docs/benchmark/'
    },
    {
      text: '贡献指南',
      icon: 'pullrequest',
      link: '/zh/docs/contribution-guide/'
    },
    {
      text: '常见问题',
      icon: 'faq',
      link: '/zh/docs/faq/'
    }
  ],
});
