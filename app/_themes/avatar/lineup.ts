import type { ElementKey } from "./tokens";

// The Four Nations lineup: 100 artists, 25 from each nation, 25 a day across
// Thursday to Sunday. Each day belongs to an element (its color); each artist
// belongs to a nation (their emblem and underline).

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
export type Slot = (typeof SLOTS)[number];

export const DAY_ORDER: ElementKey[] = ["water", "earth", "fire", "air"];

export type FestivalSet = {
  artist: string;
  nation: ElementKey;
  blurb: string;
  day: ElementKey;
  time: Slot;
  stage: Stage;
};

/* The artists ---------------------------------------------------------------- */

// Three headliners a day, from three different nations; every nation headlines three times.
const HEADLINERS: Record<ElementKey, [string, ElementKey][]> = {
  water: [
    ["Moon Spirit Choir", "water"],
    ["The Ember Island Players", "fire"],
    ["Kyoshi Warriors", "earth"],
  ],
  earth: [
    ["Toph & the Blind Bandits", "earth"],
    ["Appa & the Herd", "air"],
    ["Yue & the Tides", "water"],
  ],
  fire: [
    ["Dragon of the West", "fire"],
    ["The Boulder", "earth"],
    ["Monk Gyatso", "air"],
  ],
  air: [
    ["The Southern Raiders", "water"],
    ["Air Nomad Chant", "air"],
    ["Fire Lilies", "fire"],
  ],
};

// Everyone else, 22 per nation, in billing order.
const ARTISTS: Record<ElementKey, string[]> = {
  water: [
    "Whale-Tooth Drums", "Ocean Spirit", "The Polar Leopards", "Tui & La", "Northern Lights",
    "Pakku's Pupils", "Foggy Swamp Tribe", "The Unagi", "Spirit Oasis", "Wolf Cove", "Glacier Spirits",
    "Healing Hands", "Bato's Boat", "Blood Moon", "Snowbenders", "Sea Prunes", "Ice Dodgers",
    "Arctic Hens", "Otter Penguin Slide", "The Canoe Club", "Hundred-Year Iceberg", "The Waterbending Scroll",
  ],
  earth: [
    "Secret Tunnel", "The Dai Li", "Earth Rumble Six", "Bumi's Bunch", "Jasmine Dragon Trio",
    "Badgermoles", "Cabbage Merchant Brass", "Si Wong Sandbenders", "The Freedom Fighters", "Lake Laogai", "The Mechanist",
    "Omashu Mail Chute", "Bosco the Bear", "Elephant Koi", "Lower Ring", "Pao Family Tea Shop", "Joo Dee Smiles",
    "The Hippo", "Outer Wall", "Gaoling Prep", "Rock Gloves", "Earth King's Court",
  ],
  fire: [
    "Sun Warriors", "Agni Kai", "Combustion Man", "Ran & Shaw", "Mai & the Knives",
    "Ty Lee's Circus", "Royal Fire Orchestra", "Lightning Redirected", "The Boiling Rock", "Phoenix King", "Fire Sages",
    "Kuzon's Crew", "Ember Island Beach Party", "Sozin's Comet", "Day of Black Sun", "Volcano Island", "Shirshu Trackers",
    "Komodo Rhinos", "Hot Squats", "Fire Flakes", "Uncle's Pai Sho", "Rough Rhinos",
  ],
  air: [
    "Sky Bison Drift", "Guru Pathik", "The Glider Boys", "Seven Chakras", "Momo's Mischief",
    "Western Air Temple Echo", "Eastern Air Temple Bells", "Teo's Gliders", "Air Scooters", "Cloud Kites", "Wind Chimes",
    "Meditation Circle", "Flying Lemurs", "Arrows & Tattoos", "The Last Airbender", "Fruit Pie Game", "Airball Champions",
    "Sky Bison Polo", "Whistle Pipes", "Updraft", "Spirit World Wanderers", "The Airbending Staff",
  ],
};

const GENRES: Record<ElementKey, string[]> = {
  water: ["Tidal folk", "Ice-cave ambient", "Whale-bone percussion", "Moonlit choral", "Sea shanties", "Glacial dream-pop"],
  earth: ["Stone-and-gong rock", "Earth Rumble metal", "Tea-house jazz", "Desert blues", "Brass band", "Mountain folk"],
  fire: ["Sun Warrior dance", "Volcanic drum and bass", "Court orchestra", "Theater pop", "Lantern-lit jazz", "Comet punk"],
  air: ["Temple bells", "Wind-chime ambient", "Glider pop", "Chant and drone", "Sky folk", "Lemur funk"],
};

// How many non-headliners each nation sends to each day (22 a day, 22 per nation).
const PER_DAY: Record<ElementKey, Record<ElementKey, number>> = {
  water: { water: 5, earth: 6, fire: 5, air: 6 },
  earth: { water: 6, earth: 5, fire: 6, air: 5 },
  fire: { water: 5, earth: 6, fire: 5, air: 6 },
  air: { water: 6, earth: 5, fire: 6, air: 5 },
};

// Slots fill from the top of the bill: 3 at 8:30, then 5, 5, 4, 4, 4.
const BILL: Slot[] = [
  ...Array<Slot>(3).fill("8:30 PM"),
  ...Array<Slot>(5).fill("7:00 PM"),
  ...Array<Slot>(5).fill("5:30 PM"),
  ...Array<Slot>(4).fill("4:00 PM"),
  ...Array<Slot>(4).fill("2:30 PM"),
  ...Array<Slot>(4).fill("1:00 PM"),
];

function buildLineup(): FestivalSet[] {
  const taken: Record<ElementKey, number> = { water: 0, earth: 0, fire: 0, air: 0 };
  const sets: FestivalSet[] = [];

  for (const day of DAY_ORDER) {
    // Each nation's share of the day, then dealt out in turn so the bill mixes.
    const pools = DAY_ORDER.map((n) => {
      const names = ARTISTS[n].slice(taken[n], taken[n] + PER_DAY[day][n]);
      taken[n] += PER_DAY[day][n];
      return names.map((artist) => [artist, n] as [string, ElementKey]);
    });
    const dealt: [string, ElementKey][] = [...HEADLINERS[day]];
    for (let i = 0; pools.some((p) => p.length > 0); i++) {
      const pool = pools[i % pools.length];
      const next = pool.shift();
      if (next) dealt.push(next);
    }

    // Stages: prefer one that belongs to the artist's nation, else the next free one.
    const used: Partial<Record<Slot, Set<string>>> = {};
    dealt.forEach(([artist, nation], i) => {
      const time = BILL[i];
      const free = (used[time] ??= new Set());
      const home = STAGES.find((s) => s.nation === nation && !free.has(s.name));
      const stage = home ?? STAGES[[...Array(6).keys()].map((k) => (i + k) % 6).find((k) => !free.has(STAGES[k].name))!];
      free.add(stage.name);
      const genres = GENRES[nation];
      sets.push({ artist, nation, blurb: genres[(i + DAY_ORDER.indexOf(day)) % genres.length], day, time, stage });
    });
  }
  return sets;
}

export const LINEUP = buildLineup();

// 8:30 sets headline; billing comes from the slot.
export function isHeadliner(set: FestivalSet) {
  return set.time === "8:30 PM";
}

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
