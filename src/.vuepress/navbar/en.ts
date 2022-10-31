import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/",
  { text: "Documentation", icon: "discover", link: "/docs/" },
  {
    text: "Projects",
    icon: "creative",
    children: [
      {
        text: "Core",
        icon: "creative",
        children: [ { text: "Gorse", link: "" }],
      },
      {
        text: "SDK",
        icon: "config",
        children: [ { text: "Gorse Java SDK", link: "" }],
      },
    ],
  },
]);
