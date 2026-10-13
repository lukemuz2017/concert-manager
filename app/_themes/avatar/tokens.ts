import type { CSSProperties } from "react";

// The Four Nations theme's source of truth. The mood board, design system,
// and (if chosen) the site import from here.

export const color = {
  parchment: "#F4ECDF", // page
  paper: "#FBF7EF", // cards, inputs, scrolls
  ink: "#2B2B2B", // text, linework, and anything you chose
  inkMuted: "#5C5650", // secondary text
  line: "#8F8270", // edges you must see, 3.2:1 on parchment
};

// Each festival day belongs to an element, and the interface takes on that
// element: its color, its emblem, and the way it moves ("bending").
//   fill: the day's primary action. on: the text on that fill, chosen by contrast.
//   line: the element drawn on parchment (outlines, underlines, emblems), at least 3:1.
//   wash: a light tint for the selected day.
export type ElementKey = "water" | "earth" | "fire" | "air";

export type Motion = {
  name: string;
  ease: string; // easing for color and small-control transitions
  duration: string;
  lift: string;
  press: string;
  glow: string;
  hover: string; // button animation while hovered (see globals.css)
  pressAnim: string; // button animation when pressed
  hoverLabel: string;
  pressLabel: string;
  note: string;
};

export const ELEMENTS: Record<
  ElementKey,
  {
    name: string;
    nation: string;
    day: string;
    dayName: string;
    glyph: string;
    fill: string;
    on: string;
    line: string;
    wash: string;
    motion: Motion;
  }
> = {
  water: {
    name: "Water",
    nation: "Water Tribe",
    day: "Thu",
    dayName: "Thursday",
    glyph: "水",
    fill: "#2E5D7C",
    on: "#FFFFFF",
    line: "#2E5D7C",
    wash: "#DCE6EC",
    motion: {
      name: "Flow",
      ease: "cubic-bezier(0.45, 0.05, 0.35, 1)",
      duration: "420ms",
      lift: "-2px",
      press: "scale(0.97)",
      glow: "none",
      hover: "bend-water-hover 1.8s ease-in-out infinite, bend-water-ripple 1.8s ease-out infinite",
      pressAnim: "bend-water-press 520ms ease-out",
      hoverLabel: "Rocks like a boat, ripples spreading",
      pressLabel: "Squashes, then springs back",
      note: "Eases in and out like a tide. Nothing starts or stops abruptly.",
    },
  },
  earth: {
    name: "Earth",
    nation: "Earth Kingdom",
    day: "Fri",
    dayName: "Friday",
    glyph: "土",
    fill: "#5E6B3A",
    on: "#FFFFFF",
    line: "#5E6B3A",
    wash: "#E4E6D3",
    motion: {
      name: "Stand",
      ease: "linear",
      duration: "80ms",
      lift: "0px",
      press: "translateY(3px)",
      glow: "none",
      hover: "bend-earth-hover 380ms linear infinite",
      pressAnim: "bend-earth-press 380ms cubic-bezier(0.2, 0, 0.1, 1) forwards",
      hoverLabel: "Earthquake: a hard, rapid shake",
      pressLabel: "Slams down and stays down",
      note: "No float, no bounce. It shakes the ground, and pressed, it drops straight into it.",
    },
  },
  fire: {
    name: "Fire",
    nation: "Fire Nation",
    day: "Sat",
    dayName: "Saturday",
    glyph: "火",
    fill: "#A84530",
    on: "#FFFFFF",
    line: "#A3262A",
    wash: "#F1DDD5",
    motion: {
      name: "Strike",
      ease: "cubic-bezier(0.2, 0.9, 0.3, 1.4)",
      duration: "160ms",
      lift: "-2px",
      press: "scale(0.94)",
      glow: "0 0 0 5px rgba(168, 69, 48, 0.2)",
      hover: "bend-fire-hover 800ms ease-in-out infinite",
      pressAnim: "bend-fire-press 340ms cubic-bezier(0.2, 0.9, 0.3, 1.2) forwards",
      hoverLabel: "Flares and flickers, glowing",
      pressLabel: "Bursts, then settles hot",
      note: "Fast and explosive: it flares, flickers, and glows, then bursts when pressed.",
    },
  },
  air: {
    name: "Air",
    nation: "Air Nomads",
    day: "Sun",
    dayName: "Sunday",
    glyph: "氣",
    fill: "#CB8131",
    on: "#2B2B2B",
    line: "#B07514",
    wash: "#F6E3C6",
    motion: {
      name: "Drift",
      ease: "cubic-bezier(0.3, 0, 0.2, 1)",
      duration: "600ms",
      lift: "-5px",
      press: "scale(0.98)",
      glow: "none",
      hover: "bend-air-hover 2.6s ease-in-out infinite",
      pressAnim: "bend-air-press 620ms ease-in-out",
      hoverLabel: "Floats up and bobs, weightless",
      pressLabel: "Puffs and twirls, then drifts",
      note: "Slow and weightless: it lifts off, bobs on the breeze, and twirls when pressed.",
    },
  },
};

export const ELEMENT_ORDER: ElementKey[] = ["water", "earth", "fire", "air"];

// Everything that changes with the day, as CSS variables on one wrapper.
export function elementVars(key: ElementKey) {
  const e = ELEMENTS[key];
  return {
    "--el": e.fill,
    "--el-on": e.on,
    "--el-line": e.line,
    "--el-wash": e.wash,
    "--el-ease": e.motion.ease,
    "--el-dur": e.motion.duration,
    "--el-lift": e.motion.lift,
    "--el-press": e.motion.press,
    "--el-glow": e.motion.glow,
    "--el-hover": e.motion.hover,
    "--el-press-anim": e.motion.pressAnim,
  } as CSSProperties;
}

export const baseVars = {
  "--parchment": color.parchment,
  "--paper": color.paper,
  "--ink": color.ink,
  "--ink-muted": color.inkMuted,
  "--line": color.line,
} as CSSProperties;

// Five type roles. The glyph role is only ever the four element characters.
export const TYPE = {
  display: "font-(family-name:--font-marker) text-[40px] leading-[1.05] sm:text-[56px]",
  heading: "font-(family-name:--font-marker) text-2xl leading-snug",
  body: "text-base leading-relaxed",
  label: "text-xs font-medium uppercase tracking-[0.25em]",
  glyph: "font-(family-name:--font-brush) leading-none",
};

// Hand-cut paper: no two corners quite the same.
export const SHAPE = {
  card: "rounded-[18px_14px_20px_12px/14px_20px_12px_18px]",
  button: "rounded-[22px_16px_24px_18px/18px_24px_16px_22px]",
  field: "rounded-[10px_8px_11px_9px]",
};
