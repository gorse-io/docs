import fs from 'fs';
import { sidebar, SidebarItem } from "vuepress-theme-hope";

var sidebars = {}

if (fs.existsSync('src/zh/docs/sidebar.json')) {
    const text = fs.readFileSync('src/zh/docs/sidebar.json', 'utf-8');
    sidebars['/zh/docs/'] = JSON.parse(text) as SidebarItem;
} else {
    const versions = fs.readdirSync('src/zh/docs/', { withFileTypes: true })
        .filter((item) => item.isDirectory())
        .map((item) => item.name);
    for (const version of versions) {
        if (!fs.existsSync(`src/zh/docs/${version}/sidebar.json`)) {
            const text = fs.readFileSync(`src/zh/docs/${version}/sidebar.json`, 'utf-8');
            sidebars[`/zh/docs/${version}/`] = JSON.parse(text) as SidebarItem;
        }
    }
}

export const zhSidebar = sidebar(sidebars);
