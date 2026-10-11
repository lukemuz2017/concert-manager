import type { CSSProperties } from "react";

// The Classical theme's source of truth. The mood board, design system, and
// (if chosen) the site import from here.

export const color = {
  ivory: "#F9F7F0", // page
  paper: "#FFFFFF", // cards, inputs, panels
  linen: "#F3EFE6", // wash: selected tab, empty states
  charcoal: "#2F2F2F", // text
  muted: "#5F5B52", // secondary text, 6.3:1 on ivory
  hairline: "#E3DED2", // decorative dividers only
  rule: "#8F8879", // control edges, 3.3:1 on ivory
  forest: "#2F4031", // the primary action, and anything selected
  forestHover: "#243328",
  sage: "#8D9B7B",
  dustyBlue: "#A7B8C6",
  terracotta: "#C97B63", // the double-booking rule; never text
  gold: "#D4B06A", // gilt ornament only: 1.9:1 on ivory
  antiqueGold: "#8A6D2F", // engraved icons, 4.6:1 on ivory
};

// Soft and low, like daylight in a gallery.
export const shadow = {
  card: "0 1px 2px rgba(47, 47, 47, 0.06), 0 12px 28px -16px rgba(47, 47, 47, 0.28)",
  raised: "0 2px 4px rgba(47, 47, 47, 0.08), 0 24px 48px -20px rgba(47, 47, 47, 0.4)",
};

// Four type roles. Buttons and tabs use the label role.
export const TYPE = {
  display: "font-(family-name:--font-playfair) text-[40px] leading-[1.1] font-normal sm:text-[56px]",
  heading: "font-(family-name:--font-playfair) text-2xl leading-snug font-normal",
  body: "text-base leading-relaxed",
  label: "text-xs font-semibold uppercase tracking-[0.2em]",
};

// The palette as CSS variables, so Tailwind classes like bg-(--forest) can use it.
export const cssVars = {
  "--ivory": color.ivory,
  "--paper": color.paper,
  "--linen": color.linen,
  "--charcoal": color.charcoal,
  "--muted": color.muted,
  "--hairline": color.hairline,
  "--rule": color.rule,
  "--forest": color.forest,
  "--forest-hover": color.forestHover,
  "--terracotta": color.terracotta,
  "--gold": color.gold,
  "--antique-gold": color.antiqueGold,
} as CSSProperties;
