export const sidebar = [
    {
        text: '快速上手',
        icon: 'launch',
        link: 'quick-start',
    },
    {
        text: '部署',
        icon: 'start',
        collapsible: true,
        prefix: 'deploy/',
        children: [
            'binary',
            'docker',
            'kubernetes'
        ]
    },
    {
        text: '配置项',
        icon: 'config_s',
        link: 'config'
    },
    {
        text: '概念详解',
        icon: 'idea',
        collapsible: true,
        prefix: 'concepts/',
        children: [
            'data-objects',
            'algorithms',
            'how-it-works',
            "evaluation"
        ]
    },
    {
        text: '接口文档',
        icon: 'api',
        prefix: 'api/',
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
        text: 'Gorse 控制台',
        icon: 'dashboard',
        link: 'gorse-dashboard'
    },
    {
        text: '性能对比',
        icon: 'dashboard-fill',
        link: 'benchmark/'
    },
    {
        text: '贡献指南',
        icon: 'pullrequest',
        link: 'contribution-guide/'
    },
    {
        text: '常见问题',
        icon: 'faq',
        link: 'faq/'
    }
]