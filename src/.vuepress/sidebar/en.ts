import fs from 'fs';
import { sidebar, SidebarItem } from "vuepress-theme-hope";

var sidebars = {}

const versions = fs.readdirSync('src/docs/', { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name);
for (const version of versions) {
    if (fs.existsSync(`src/docs/${version}/sidebar.json`)) {
        const text = fs.readFileSync(`src/docs/${version}/sidebar.json`, 'utf-8');
        sidebars[`/docs/${version}/`] = JSON.parse(text) as SidebarItem;
    }
}

export const enSidebar = sidebar(sidebars);
