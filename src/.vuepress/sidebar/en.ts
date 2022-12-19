import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/": [
    {
      text: 'Quick Start',
      icon: 'launch',
      link: '/docs/quick-start',
    },
    {
      text: 'Deploy',
      icon: 'start',
      collapsible: true,
      children: [
        {
          text: 'Binary Deployment',
          icon: 'console',
          link: '/docs/deploy/binary',
        },
        {
          text: 'Docker Deployment',
          icon: 'docker',
          link: '/docs/deploy/docker',
        },
        {
          text: 'Kubernetes Deployment',
          icon: 'kubernetes',
          link: '/docs/deploy/kubernetes',
        },
      ]
    },
    {
      text: 'Configuration',
      icon: 'config_s',
      link: '/docs/config'
    },
    {
      text: 'Concepts',
      icon: 'idea',
      collapsible: true,
      children: [
        {
          text: 'Data Objects',
          icon: "model",
          link: '/docs/concepts/data-objects',
        },
        {
          text: 'Algorithms',
          icon: "zhinengsuanfa",
          link: '/docs/concepts/algorithms',
        },
        {
          text: 'Workflow',
          icon: "process",
          link: '/docs/concepts/workflow',
        },
        {
          text: "Evaluation",
          icon: "chart",
          link: "/docs/concepts/evaluation",
        },
      ]
    },
    {
      text: 'API',
      icon: 'api',
      collapsible: true,
      prefix: '/docs/api/',
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
      text: 'Gorse Dashboard',
      icon: 'dashboard',
      link: '/docs/gorse-dashboard'
    },
    {
      text: 'Benchmark',
      icon: 'dashboard-fill',
      link: '/docs/benchmark/'
    },
    {
      text: 'Contribution Guide',
      icon: 'pullrequest',
      link: '/docs/contribution-guide/'
    },
    {
      text: 'FAQ',
      icon: 'faq',
      link: '/docs/faq/'
    }
  ],
});
