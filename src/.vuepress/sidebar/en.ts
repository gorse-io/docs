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
      prefix: '/docs/deploy/',
      children: [
        'binary',
        'docker',
        'kubernetes'
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
      prefix: '/docs/concepts/',
      children: [
        'data-objects',
        'algorithms',
        'how-it-works',
        "evaluation"
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
