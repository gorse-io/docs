import { sidebar } from "vuepress-theme-hope";

var sidebars = {}

import('../../docs/sidebar').then((e) => {
  sidebars['/docs/'] = e.sidebar;
});

export const enSidebar = sidebar(sidebars);
