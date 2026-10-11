import type { CSSProperties } from "react";

// The one source of truth for the Candyland theme. The mood board, the design
// system, and the site all import from here so they cannot drift apart.

export const color = {
  background: "#FFF6E6", // Cream
  surface: "#FFFFFF", // Icing
  wash: "#FFE3EE", // Frosting
  text: "#3B1F2B", // Cocoa
  muted: "#6B4A57", // Mocha
  border: "#9C7B86", // Taffy
  accent: "#D7263D", // Cherry: the primary action and nothing else
  accentHover: "#B81E33",
  accentShadow: "#8F1526",
};

// Stage colors do identity only (dots, chip borders, card edges). Never text.
export const STAGES = [
  { name: "Peppermint Forest", hex: "#E63946" },
  { name: "Lollipop Woods", hex: "#FFC93C" },
  { name: "Molasses Swamp", hex: "#A0612B" },
  { name: "Gumdrop Mountains", hex: "#3DBE5A" },
  { name: "Ice Cream Sea", hex: "#3FA9F5" },
  { name: "Licorice Castle", hex: "#7B3FC4" },
];
export type Stage = (typeof STAGES)[number];

// Hard offset shadows with no blur: candy and game pieces sit on a solid base.
export const shadow = {
  card: "0 4px 0 rgba(59, 31, 43, 0.15)",
  button: `0 5px 0 ${color.accentShadow}`,
};

// The four type roles. Buttons use Fredoka 600 at body size.
export const TYPE = {
  display: "font-(family-name:--font-fredoka) text-[40px] leading-none font-bold sm:text-[56px]",
  heading: "font-(family-name:--font-fredoka) text-2xl leading-tight font-semibold",
  body: "text-base leading-relaxed",
  label: "text-xs font-extrabold uppercase tracking-[0.16em]",
};

// The palette as CSS variables, so Tailwind classes like bg-(--accent) can use it.
export const cssVars = {
  "--bg": color.background,
  "--surface": color.surface,
  "--wash": color.wash,
  "--text": color.text,
  "--muted": color.muted,
  "--border": color.border,
  "--accent": color.accent,
  "--accent-hover": color.accentHover,
  "--accent-shadow": color.accentShadow,
} as CSSProperties;
