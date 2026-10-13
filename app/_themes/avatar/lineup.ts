import type { ElementKey } from "./tokens";

// The Four Nations lineup: 100 artists, 25 from each nation, 25 a day across
// Thursday to Sunday. Each day belongs to an element (its color); each artist
// belongs to a nation (their emblem and underline).

export const STAGES = [
  { name: "Spirit Oasis", nation: "water" },
  { name: "Crystal Catacombs", nation: "earth" },
  { name: "Wan Shi Tong's Library", nation: "earth" },
  { name: "Royal Caldera", nation: "fire" },
  { name: "Ember Island", nation: "fire" },
  { name: "Western Air Temple", nation: "air" },
] as const satisfies readonly { name: string; nation: ElementKey }[];
export type Stage = (typeof STAGES)[number];

export const SLOTS = ["1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM", "7:00 PM", "8:30 PM"] as const;
export type Slot = (typeof SLOTS)[number];

export const DAY_ORDER: ElementKey[] = ["water", "earth", "fire", "air"];

// Four genre families keep the filter compact; each artist still has a specific sound.
export const GENRES = ["Spirit Songs", "Earthshakers", "Tea House Classics", "Firelight Dance"] as const;
export type Genre = (typeof GENRES)[number];

// Six of the 24 sounds in each family, so each filter option holds about a quarter of the lineup.
const FAMILY: Record<string, Genre> = {
  "Tidal folk": "Spirit Songs", "Sea shanties": "Spirit Songs", "Mountain folk": "Spirit Songs",
  "Sky folk": "Spirit Songs", "Chant and drone": "Spirit Songs", "Ice-cave ambient": "Spirit Songs",
  "Whale-bone percussion": "Earthshakers", "Stone-and-gong rock": "Earthshakers", "Earth Rumble metal": "Earthshakers",
  "Comet punk": "Earthshakers", "Temple bells": "Earthshakers", "Volcanic drum and bass": "Earthshakers",
  "Tea-house jazz": "Tea House Classics", "Desert blues": "Tea House Classics", "Brass band": "Tea House Classics",
  "Court orchestra": "Tea House Classics", "Lantern-lit jazz": "Tea House Classics", "Moonlit choral": "Tea House Classics",
  "Glacial dream-pop": "Firelight Dance", "Sun Warrior dance": "Firelight Dance", "Theater pop": "Firelight Dance",
  "Glider pop": "Firelight Dance", "Lemur funk": "Firelight Dance", "Wind-chime ambient": "Firelight Dance",
};

export type FestivalSet = {
  artist: string;
  nation: ElementKey;
  blurb: string; // the specific sound
  genre: Genre; // its family, for filtering
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

const SOUNDS: Record<ElementKey, string[]> = {
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

// Slots fill from the top of the bill: 3 at 8:30, then 5, 5, 4, 4, 4. The three headliners
// take one each of 8:30, 7:00, and 5:30.
const BILL: Slot[] = [
  "8:30 PM",
  "7:00 PM",
  "5:30 PM",
  ...Array<Slot>(2).fill("8:30 PM"),
  ...Array<Slot>(4).fill("7:00 PM"),
  ...Array<Slot>(4).fill("5:30 PM"),
  ...Array<Slot>(4).fill("4:00 PM"),
  ...Array<Slot>(4).fill("2:30 PM"),
  ...Array<Slot>(4).fill("1:00 PM"),
];

function buildLineup(): FestivalSet[] {
  const stageLoad = new Map<string, number>();
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

    // Stages: no two artists share a stage in a slot. Home stages are preferred, but a
    // stage that is already busy loses to a quieter one, so every stage ends up with about
    // the same number of sets (the Stage filter depends on that).
    const taken_: Partial<Record<Slot, Set<string>>> = {};
    dealt.forEach(([artist, nation], i) => {
      const time = BILL[i];
      const inSlot = (taken_[time] ??= new Set());
      const stage = STAGES.filter((s) => !inSlot.has(s.name)).reduce((best, s) => {
        const score = (st: Stage) => (stageLoad.get(st.name) ?? 0) - (st.nation === nation ? 3 : 0);
        return score(s) < score(best) ? s : best;
      });
      inSlot.add(stage.name);
      stageLoad.set(stage.name, (stageLoad.get(stage.name) ?? 0) + 1);
      const sounds = SOUNDS[nation];
      const blurb = sounds[(i + DAY_ORDER.indexOf(day)) % sounds.length];
      sets.push({ artist, nation, blurb, genre: FAMILY[blurb], day, time, stage });
    });
  }
  return sets;
}

export const LINEUP = buildLineup();

// 8:30 sets headline; billing comes from the slot.
const HEADLINER_NAMES = new Set(Object.values(HEADLINERS).flatMap((list) => list.map(([artist]) => artist)));

export function isHeadliner(set: FestivalSet) {
  return HEADLINER_NAMES.has(set.artist);
}

// Other saved sets on the same day and in the same slot.
export function clashesWith(set: FestivalSet, saved: FestivalSet[]) {
  return saved.filter((s) => s.artist !== set.artist && s.day === set.day && s.time === set.time);
}

/* The grounds: stages, the gate, and the trails between them ----------------- */

export type Point = { x: number; y: number };
// Somewhere you can stand: the main gate or a stage.
export type Place = Stage["name"] | "gate";

// Map coordinates on a 100 × 64 grid of the festival grounds.
export const GATE: Point = { x: 50, y: 62 };
export const STAGE_POS: Record<Stage["name"], Point> = {
  "Western Air Temple": { x: 14, y: 12 },
  "Spirit Oasis": { x: 84, y: 10 },
  "Wan Shi Tong's Library": { x: 20, y: 40 },
  "Crystal Catacombs": { x: 50, y: 28 },
  "Royal Caldera": { x: 64, y: 56 },
  "Ember Island": { x: 83, y: 45 },
};

// Where trails meet. The river comes in at the top edge, drops through a gorge in the
// cliffs (the cliff path crosses it on a bridge between the two cliff edges), runs under
// the rope bridge into the lake around Ember Island, and leaves by the east edge.
export const LANDMARKS = {
  market: { x: 50, y: 48, label: "Market" },
  teaHouse: { x: 32, y: 24, label: "Tea house" },
  bridge: { x: 70, y: 30, label: "Rope bridge" },
} as const;
export const RIVER = "M59.5 0C60 3 60.2 5 60.3 7.5S61.5 12 62 14C64 20 66 25 70 30S79 36 80 40";
// The river leaves the lake for the east edge.
export const OUTFLOW = "M93 47.5C95 48 97.5 48.4 100 48.6";
// The gorge where the river cuts the cliffs, and the falls just below its bridge.
export const GORGE = { x: 60.3, y: 6.6 };
export const FALLS = { x: 60.6, y: 9.4 };
// Ember Island is an island: the stage sits in a lake the river runs through.
export const LAKE = { x: 83, y: 45.5, rx: 10.8, ry: 7.6 };

type Node = Place | keyof typeof LANDMARKS | "gorge";
const NODE_POS: Record<Node, Point> = { gate: GATE, ...STAGE_POS, ...LANDMARKS, gorge: GORGE };

// Each trail bends a little: `bend` pushes its middle sideways, in map units.
export const TRAILS: { from: Node; to: Node; bend: number; name?: string }[] = [
  { from: "gate", to: "market", bend: 0 },
  { from: "market", to: "Wan Shi Tong's Library", bend: 4 },
  { from: "market", to: "Crystal Catacombs", bend: -2 },
  { from: "market", to: "Ember Island", bend: -2 },
  { from: "Ember Island", to: "Royal Caldera", bend: 2 },
  { from: "Crystal Catacombs", to: "bridge", bend: 3 },
  { from: "bridge", to: "Spirit Oasis", bend: -3 },
  { from: "bridge", to: "Royal Caldera", bend: 2 },
  { from: "Crystal Catacombs", to: "teaHouse", bend: -2 },
  { from: "teaHouse", to: "Western Air Temple", bend: 2 },
  { from: "teaHouse", to: "Wan Shi Tong's Library", bend: 3 },
  { from: "Western Air Temple", to: "gorge", bend: -6, name: "Cliff path" },
  { from: "gorge", to: "Spirit Oasis", bend: -5, name: "Cliff path" },
];

// A trail is a quadratic curve; its control point sits off the midpoint by `bend`.
function control(a: Point, b: Point, bend: number): Point {
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  return { x: (a.x + b.x) / 2 + (-(b.y - a.y) / len) * bend, y: (a.y + b.y) / 2 + ((b.x - a.x) / len) * bend };
}

function along(a: Point, c: Point, b: Point, t: number): Point {
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
}

function curveLength(a: Point, c: Point, b: Point) {
  let length = 0;
  let prev = a;
  for (let i = 1; i <= 24; i++) {
    const p = along(a, c, b, i / 24);
    length += Math.hypot(p.x - prev.x, p.y - prev.y);
    prev = p;
  }
  return length;
}

const EDGES = TRAILS.map((t) => {
  const a = NODE_POS[t.from];
  const b = NODE_POS[t.to];
  const c = control(a, b, t.bend);
  return { ...t, a, b, c, length: curveLength(a, c, b) };
});

// The SVG path for one whole trail, for drawing the grounds.
export function trailPath(t: (typeof TRAILS)[number]) {
  const a = NODE_POS[t.from];
  const b = NODE_POS[t.to];
  const c = control(a, b, t.bend);
  return `M${a.x} ${a.y}Q${c.x.toFixed(2)} ${c.y.toFixed(2)} ${b.x} ${b.y}`;
}

// Evenly spaced points along a trail, from `t0` to `t1` of the way, for drawing beside it.
export function trailPoints(t: (typeof TRAILS)[number], n: number, t0 = 0, t1 = 1): Point[] {
  const a = NODE_POS[t.from];
  const b = NODE_POS[t.to];
  const c = control(a, b, t.bend);
  return Array.from({ length: n }, (_, i) => along(a, c, b, t0 + ((t1 - t0) * i) / (n - 1)));
}

// The shortest way along the trails between two places. The graph is tiny, so a
// plain Dijkstra over a dozen trails is plenty.
function shortest(from: Node, to: Node) {
  const dist = new Map<Node, number>([[from, 0]]);
  const prev = new Map<Node, (typeof EDGES)[number]>();
  const done = new Set<Node>();
  while (true) {
    let here: Node | null = null;
    for (const [n, d] of dist) if (!done.has(n) && (here === null || d < dist.get(here)!)) here = n;
    if (here === null || here === to) break;
    done.add(here);
    for (const e of EDGES) {
      const next = e.from === here ? e.to : e.to === here ? e.from : null;
      if (!next || done.has(next)) continue;
      const d = dist.get(here)! + e.length;
      if (d < (dist.get(next) ?? Infinity)) {
        dist.set(next, d);
        prev.set(next, e);
      }
    }
  }
  const steps: { a: Point; c: Point; b: Point }[] = [];
  for (let n = to; n !== from; ) {
    const e = prev.get(n)!;
    const forward = e.to === n;
    steps.unshift(forward ? { a: e.a, c: e.c, b: e.b } : { a: e.b, c: e.c, b: e.a });
    n = forward ? e.from : e.to;
  }
  return { steps, length: dist.get(to) ?? 0 };
}

// One leg of a day's route, drawn along the trails. Its label sits halfway along the
// leg's longest stretch of trail, clear of the junctions.
export function routeBetween(from: Place, to: Place) {
  const { steps, length } = shortest(from, to);
  const d = steps.length
    ? `M${steps[0].a.x} ${steps[0].a.y}` +
      steps.map((p) => `Q${p.c.x.toFixed(2)} ${p.c.y.toFixed(2)} ${p.b.x} ${p.b.y}`).join("")
    : "";
  const longest = steps.reduce<(typeof steps)[number] | null>(
    (best, p) => (!best || curveLength(p.a, p.c, p.b) > curveLength(best.a, best.c, best.b) ? p : best),
    null,
  );
  const mid = longest ? along(longest.a, longest.c, longest.b, 0.5) : NODE_POS[from];
  // A quadratic's direction at its middle is simply end minus start.
  const span = longest ? Math.hypot(longest.b.x - longest.a.x, longest.b.y - longest.a.y) : 1;
  const dir = longest ? { x: (longest.b.x - longest.a.x) / span, y: (longest.b.y - longest.a.y) / span } : { x: 1, y: 0 };
  return { d, mid, dir, length, minutes: walkMinutes(from, to) };
}

const WALK_PER_UNIT = 0.28; // minutes per map unit of trail

export function walkMinutes(from: Place, to: Place) {
  if (from === to) return 0;
  return Math.max(1, Math.round(shortest(from, to).length * WALK_PER_UNIT));
}

// Sets start every 1.5 hours and run 1 hr 15 min, so back-to-back sets leave a
// 15-minute changeover. A walk that takes longer than that means leaving before the
// set ends: a tight walk, a softer warning than a clash, where two sets share one slot.
export const SET_MINUTES = 75;
export const CHANGEOVER = 15;

// A time like 1215 minutes after midnight as "8:15 PM".
export function clock(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export const setEnd = (time: string) => clock(slotMinutes(time) + SET_MINUTES);
// "7:00–8:15 PM"
export const timeRange = (time: string) => `${time.replace(" PM", "")}–${setEnd(time)}`;

export type Leg =
  | { kind: "stay" }
  | { kind: "walk"; minutes: number; tight: boolean; ends: string; leaveAt: string; early: number }
  | { kind: "free"; minutes: number };

export function legBetween(a: FestivalSet, b: FestivalSet): Leg {
  const end = slotMinutes(a.time) + SET_MINUTES;
  const start = slotMinutes(b.time);
  if (start - end > CHANGEOVER) return { kind: "free", minutes: start - end };
  if (a.stage.name === b.stage.name) return { kind: "stay" };
  const minutes = walkMinutes(a.stage.name, b.stage.name);
  const leave = start - minutes;
  return { kind: "walk", minutes, tight: leave < end, ends: clock(end), leaveAt: clock(Math.min(leave, end)), early: Math.max(0, end - leave) };
}

// "1 hr 45 min"
export function duration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return [h ? `${h} hr` : "", m ? `${m} min` : ""].filter(Boolean).join(" ");
}

// Minutes since midnight for a slot like "7:00 PM".
export function slotMinutes(time: string) {
  const [h, m] = time.replace(" PM", "").split(":").map(Number);
  return (h % 12) * 60 + m + 12 * 60;
}
