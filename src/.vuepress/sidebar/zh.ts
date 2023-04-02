import { sidebar } from "vuepress-theme-hope";

var sidebars = {}

import('../../zh/docs/sidebar').then((e) => {
  sidebars['/zh/docs/'] = e.sidebar;
});

export const zhSidebar = sidebar(sidebars);
