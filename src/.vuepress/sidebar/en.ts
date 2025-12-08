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
        "kubernetes",
        "upgrade"
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
        "data-source",
        "pipeline",
        {
          "text": "Recommenders",
          "icon": "recommend-fill",
          "collapsible": true,
          "prefix": "recommenders/",
          "children": [
            "non-personalized",
            "item-to-item",
            "user-to-user",
            "collaborative",
            "external"
          ]
        },
        "ranking",
        "replacement",
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
      "text": "Contribution Guide",
      "icon": "pullrequest",
      "link": "contribution-guide"
    },
    {
      "text": "FAQ",
      "icon": "faq",
      "link": "faq"
    }
  ]
});
