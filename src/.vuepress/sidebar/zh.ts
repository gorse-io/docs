import fs from 'fs';
import { sidebar, SidebarItem } from "vuepress-theme-hope";

var sidebars = {}

const text = fs.readFileSync('src/zh/docs/sidebar.json', 'utf-8');
sidebars['/zh/docs/'] = JSON.parse(text) as SidebarItem;

export const zhSidebar = sidebar(sidebars);
