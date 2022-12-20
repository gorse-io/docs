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
      collapsible: true,
      prefix: '/zh/docs/deploy/',
      children: [
        'binary',
        'docker',
        'kubernetes'
      ]
    },
    {
      text: '接口文档',
      icon: 'api',
      prefix: '/zh/docs/api/',
      collapsible: true,
      children: [
        'restful-api',
        'go-sdk',
        'python-sdk',
        'typescript-sdk',
        'java-sdk',
        'rust-sdk',
        'php-sdk',
        'ruby-sdk',
        'dotnet-sdk'
      ]
    },
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
