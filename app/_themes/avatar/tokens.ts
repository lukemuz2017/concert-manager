// The Four Nations theme's source of truth. The mood board, design system,
// and (if chosen) the site import from here.

export const color = {
  parchment: "#F4ECDF", // page
  paper: "#FBF7EF", // cards, panels
  ink: "#2B2B2B", // text and linework
  inkMuted: "#5C5650", // captions
  sage: "#797C58", // secondary chips
  sky: "#527B95",
};

// Each festival day belongs to an element: Thursday water through Sunday air.
export const NATIONS = [
  { name: "Water Tribe", element: "Water", day: "Thu", word: "Flow", hex: "#2E5D7C" },
  { name: "Earth Kingdom", element: "Earth", day: "Fri", word: "Stability", hex: "#8B6F47" },
  { name: "Fire Nation", element: "Fire", day: "Sat", word: "Passion", hex: "#C75A3A" },
  { name: "Air Nomads", element: "Air", day: "Sun", word: "Freedom", hex: "#E8E4D9" },
] as const;
export type Nation = (typeof NATIONS)[number];

export const SAND = "#D9C9A7";
