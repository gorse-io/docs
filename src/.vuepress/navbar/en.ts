import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/",
  { text: "Documentation", icon: "discover", link: "/docs/" },
  {
    text: "Projects",
    icon: "creative",
    children: [
      {
        text: "Bar",
        icon: "creative",
        children: [],
      },
      {
        text: "SDK",
        icon: "config",
        children: [ { text: "Gorse Java SDK", link: "" }],
      },
    ],
  },
]);
