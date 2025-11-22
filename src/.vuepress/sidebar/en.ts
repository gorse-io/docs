import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
    "/docs/": [
        {
            "text": "Quick Start",
            "icon": "launch",
            "link": "quick-start"
        },
        {
            "text": "Deploy",
            "icon": "start",
            "collapsible": true,
            "prefix": "deploy/",
            "children": [
                "binary",
                "docker",
                "kubernetes"
            ]
        },
        {
            "text": "Configuration",
            "icon": "config_s",
            "link": "config"
        },
        {
            "text": "Concepts",
            "icon": "idea",
            "collapsible": true,
            "prefix": "concepts/",
            "children": [
                "data-objects",
                "algorithms",
                "non-personalized",
                "item-to-item",
                "user-to-user",
                "external",
                "how-it-works",
                "evaluation"
            ]
        },
        {
            "text": "API",
            "icon": "api",
            "collapsible": true,
            "prefix": "api/",
            "children": [
                "restful-api",
                "go-sdk",
                "python-sdk",
                "typescript-sdk",
                "java-sdk",
                "rust-sdk",
                "php-sdk",
                "ruby-sdk",
                "dotnet-sdk"
            ]
        },
        {
            "text": "Gorse Dashboard",
            "icon": "dashboard",
            "link": "gorse-dashboard"
        },
        {
            "text": "Benchmark",
            "icon": "dashboard-fill",
            "link": "benchmark/"
        },
        {
            "text": "Contribution Guide",
            "icon": "pullrequest",
            "link": "contribution-guide/"
        },
        {
            "text": "FAQ",
            "icon": "faq",
            "link": "faq/"
        }
    ]
});
