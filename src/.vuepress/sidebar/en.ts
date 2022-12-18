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
      children: [
        {
          text: 'RESTful API',
          icon: 'http',
          link: '/docs/api/restful-api',
        },
        {
          text: 'Go SDK',
          icon: 'go',
          link: '/docs/api/go-sdk',
        },
        {
          text: 'Python SDK',
          icon: 'python',
          link: '/docs/api/python-sdk',
        },
        {
          text: 'TypeScript SDK',
          icon: 'typescript',
          link: '/docs/api/typescript-sdk',
        },
        {
          text: 'Java SDK',
          icon: 'java',
          link: '/docs/api/java-sdk',
        },
        {
          text: 'Rust SDK',
          icon: 'rust',
          link: '/docs/api/rust-sdk',
        },
        {
          text: 'PHP SDK',
          icon: 'php',
          link: '/docs/api/php-sdk',
        },
        {
          text: 'Ruby SDK',
          icon: 'ruby',
          link: '/docs/api/ruby-sdk',
        },
        {
          text: '.NET SDK',
          icon: 'dot-net',
          link: '/docs/api/dotnet-sdk',
        }
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
