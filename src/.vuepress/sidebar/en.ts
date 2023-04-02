import fs from 'fs';
import { sidebar, SidebarItem } from "vuepress-theme-hope";

var sidebars = {}

const text = fs.readFileSync('src/docs/sidebar.json', 'utf-8');
sidebars['/docs/'] = JSON.parse(text) as SidebarItem;

export const enSidebar = sidebar(sidebars);
