import type { ElementKey } from "./tokens";

// Stages belong to a nation, shown by its emblem. Days belong to an element,
// shown by color. Color tells you the day; the emblem tells you the place.

export const STAGES = [
  { name: "Northern Water Tribe", nation: "water" },
  { name: "Ba Sing Se", nation: "earth" },
  { name: "Omashu", nation: "earth" },
  { name: "Fire Nation Capital", nation: "fire" },
  { name: "Ember Island", nation: "fire" },
  { name: "Western Air Temple", nation: "air" },
] as const satisfies readonly { name: string; nation: ElementKey }[];
export type Stage = (typeof STAGES)[number];

export const SLOTS = ["1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM", "7:00 PM", "8:30 PM"] as const;

export type FestivalSet = {
  artist: string;
  blurb: string;
  day: ElementKey;
  time: (typeof SLOTS)[number];
  stage: Stage;
};

const stage = (name: Stage["name"]) => STAGES.find((s) => s.name === name)!;

// Fire Lilies and the Ember Island Players share Saturday at 7:00: saving both is a clash.
export const SAMPLE_SETS: FestivalSet[] = [
  { artist: "The Southern Raiders", blurb: "Whale-bone drums and war songs from the south.", day: "water", time: "2:30 PM", stage: stage("Northern Water Tribe") },
  { artist: "Secret Tunnel", blurb: "Folk trio from the mountain caves outside Omashu.", day: "water", time: "5:30 PM", stage: stage("Omashu") },
  { artist: "Moon Spirit Choir", blurb: "Chants for a full moon over the oasis.", day: "water", time: "8:30 PM", stage: stage("Northern Water Tribe") },
  { artist: "Cabbage Merchant Brass", blurb: "A marching band. Please mind the cart.", day: "earth", time: "2:30 PM", stage: stage("Omashu") },
  { artist: "The Boulder", blurb: "Earth Rumble anthems, played extremely loud.", day: "earth", time: "7:00 PM", stage: stage("Ba Sing Se") },
  { artist: "Kyoshi Warriors", blurb: "Fans, face paint, and a very tight rhythm section.", day: "earth", time: "5:30 PM", stage: stage("Omashu") },
  { artist: "Fire Lilies", blurb: "Sun Warrior dance music at golden hour.", day: "fire", time: "7:00 PM", stage: stage("Fire Nation Capital") },
  { artist: "The Ember Island Players", blurb: "Theater pop, wildly inaccurate, beloved anyway.", day: "fire", time: "7:00 PM", stage: stage("Ember Island") },
  { artist: "Dragon of the West", blurb: "Slow jazz, served with tea.", day: "fire", time: "8:30 PM", stage: stage("Fire Nation Capital") },
  { artist: "Air Nomad Chant", blurb: "Bells, wind, and long silences.", day: "air", time: "4:00 PM", stage: stage("Western Air Temple") },
  { artist: "Sky Bison Drift", blurb: "Ambient music, played from very high up.", day: "air", time: "8:30 PM", stage: stage("Western Air Temple") },
];

// Other saved sets on the same day and in the same slot.
export function clashesWith(set: FestivalSet, saved: FestivalSet[]) {
  return saved.filter((s) => s.artist !== set.artist && s.day === set.day && s.time === set.time);
}

/* The grounds: where stages sit, and how long it takes to walk between them -- */

// Map coordinates on a 100 × 64 grid of the festival grounds.
export const GATE = { x: 50, y: 62 };
export const STAGE_POS: Record<Stage["name"], { x: number; y: number }> = {
  "Western Air Temple": { x: 14, y: 12 },
  "Northern Water Tribe": { x: 84, y: 10 },
  Omashu: { x: 20, y: 40 },
  "Ba Sing Se": { x: 50, y: 28 },
  "Fire Nation Capital": { x: 82, y: 44 },
  "Ember Island": { x: 67, y: 52 },
};

const WALK_PER_UNIT = 0.3; // minutes per map unit

export function walkMinutes(from: { x: number; y: number }, to: { x: number; y: number }) {
  return Math.max(1, Math.round(Math.hypot(from.x - to.x, from.y - to.y) * WALK_PER_UNIT));
}

// Sets fill every slot back to back, so moving stages between consecutive
// slots means leaving early. Ten minutes or more is a tight walk: a softer
// warning than a clash, where two sets share one slot.
export const TIGHT_WALK = 10;

export type Leg =
  | { kind: "stay" }
  | { kind: "walk"; minutes: number; tight: boolean }
  | { kind: "free"; slots: number };

export function legBetween(a: FestivalSet, b: FestivalSet): Leg {
  const gap = SLOTS.indexOf(b.time) - SLOTS.indexOf(a.time) - 1;
  if (gap > 0) return { kind: "free", slots: gap };
  if (a.stage.name === b.stage.name) return { kind: "stay" };
  const minutes = walkMinutes(STAGE_POS[a.stage.name], STAGE_POS[b.stage.name]);
  return { kind: "walk", minutes, tight: minutes >= TIGHT_WALK };
}

// Minutes since midnight for a slot like "7:00 PM".
export function slotMinutes(time: string) {
  const [h, m] = time.replace(" PM", "").split(":").map(Number);
  return (h % 12) * 60 + m + 12 * 60;
}
