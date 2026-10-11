import { STAGES, type Stage } from "./tokens";

// The full Sugar Rush lineup: 4 days × 6 stages × 6 slots = 144 slots, 100 sets.
// Each day uses 25 slots. Only two stages run at 8:30, so each day has two
// headliners; the other 44 slots are dark on purpose.

export const DAYS = ["Thu", "Fri", "Sat", "Sun"] as const;
export type Day = (typeof DAYS)[number];
export const DAY_NAMES: Record<Day, string> = {
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

export const SLOTS = ["1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM", "7:00 PM", "8:30 PM"] as const;
export type Slot = (typeof SLOTS)[number];

export type FestivalSet = {
  artist: string;
  genre: string;
  day: Day;
  time: Slot;
  stage: Stage;
};

// Stage index: 0 Peppermint Forest, 1 Lollipop Woods, 2 Molasses Swamp,
// 3 Gumdrop Mountains, 4 Ice Cream Sea, 5 Licorice Castle.
const RAW: [Day, Slot, number, string, string][] = [
  ["Thu", "1:00 PM", 0, "Mint Condition", "Crisp guitar pop"],
  ["Thu", "1:00 PM", 2, "Bog Fudge", "Sludge rock"],
  ["Thu", "1:00 PM", 3, "Gumball Rally", "Garage rock"],
  ["Thu", "1:00 PM", 4, "Sorbet Sisters", "Folk harmonies"],
  ["Thu", "2:30 PM", 1, "Taffy Pullers", "Surf rock"],
  ["Thu", "2:30 PM", 2, "Treacle", "Dream folk"],
  ["Thu", "2:30 PM", 4, "Float Theory", "Math rock"],
  ["Thu", "2:30 PM", 5, "Black Jellybean", "Goth pop"],
  ["Thu", "4:00 PM", 0, "Candy Cane Mutiny", "Sea-shanty punk"],
  ["Thu", "4:00 PM", 1, "Pop Rocks Orchestra", "Chamber pop"],
  ["Thu", "4:00 PM", 2, "Caramel Drag", "Shoegaze"],
  ["Thu", "4:00 PM", 3, "Pass the Gumdrops", "Indie folk"],
  ["Thu", "4:00 PM", 5, "Anise & the Snakes", "Post-punk"],
  ["Thu", "5:30 PM", 0, "Spearmint Rhinos", "Ska"],
  ["Thu", "5:30 PM", 1, "Sour Power", "Riot grrrl"],
  ["Thu", "5:30 PM", 3, "The Jelly Rolls", "Swing"],
  ["Thu", "5:30 PM", 4, "Rainbow Sherbet", "Disco"],
  ["Thu", "5:30 PM", 5, "Licorice Twist", "Rock 'n' roll"],
  ["Thu", "7:00 PM", 0, "Hard Candy Club", "Electroclash"],
  ["Thu", "7:00 PM", 1, "Lolly & the Lickables", "Bubblegum punk"],
  ["Thu", "7:00 PM", 2, "Molasses Moon", "Slowcore"],
  ["Thu", "7:00 PM", 4, "Brain Freeze", "Icy synth-wave"],
  ["Thu", "7:00 PM", 5, "Dark Chocolate Society", "Synth-goth"],
  ["Thu", "8:30 PM", 0, "Rock Candy Mountain", "Arena rock"],
  ["Thu", "8:30 PM", 3, "Gumdrop Galaxy", "Space disco"],

  ["Fri", "1:00 PM", 1, "Lemon Drop Kicks", "Pop punk"],
  ["Fri", "1:00 PM", 2, "Mudpie Mavericks", "Bluegrass"],
  ["Fri", "1:00 PM", 4, "Gelato Social Club", "Bossa nova"],
  ["Fri", "1:00 PM", 5, "Raven Gummies", "Darkwave"],
  ["Fri", "2:30 PM", 0, "Candy Stripers", "Power pop"],
  ["Fri", "2:30 PM", 2, "Slow Molasses", "Sticky blues"],
  ["Fri", "2:30 PM", 3, "Fruit Chew Choir", "Gospel pop"],
  ["Fri", "2:30 PM", 4, "Root Beer Float", "Yacht rock"],
  ["Fri", "4:00 PM", 0, "Wintergreen", "Synth-pop"],
  ["Fri", "4:00 PM", 1, "Sugar Ring Royalty", "Hyperpop"],
  ["Fri", "4:00 PM", 3, "Gummy Bear Market", "Lo-fi house"],
  ["Fri", "4:00 PM", 4, "Neapolitan Trio", "Jazz trio"],
  ["Fri", "4:00 PM", 5, "The Bitter Ends", "Emo"],
  ["Fri", "5:30 PM", 0, "Mint Julep Jukebox", "Country"],
  ["Fri", "5:30 PM", 1, "Sugar Glass", "Art pop"],
  ["Fri", "5:30 PM", 2, "Fudge Factory", "Funk"],
  ["Fri", "5:30 PM", 3, "Jujube Junction", "Afrobeat"],
  ["Fri", "5:30 PM", 5, "Castle Crunch", "Thrash metal"],
  ["Fri", "7:00 PM", 0, "Peppermint Bark", "Hardcore punk"],
  ["Fri", "7:00 PM", 1, "The Lollipop Guild", "Barbershop pop"],
  ["Fri", "7:00 PM", 2, "Butterscotch Brass", "Brass band"],
  ["Fri", "7:00 PM", 3, "Gumdrop Girls", "Girl-group soul"],
  ["Fri", "7:00 PM", 4, "Sprinkle Theory", "Indie electronic"],
  ["Fri", "8:30 PM", 4, "Queen Frostine & the Floats", "Dream-pop"],
  ["Fri", "8:30 PM", 5, "Lady Licorice", "Torch-song goth"],

  ["Sat", "1:00 PM", 0, "Candy Floss Collective", "Freak folk"],
  ["Sat", "1:00 PM", 1, "Sherbet Lemons", "Ska-pop"],
  ["Sat", "1:00 PM", 3, "Gumball Machine", "Drum & bass"],
  ["Sat", "1:00 PM", 5, "Crow & Clove", "Folk noir"],
  ["Sat", "2:30 PM", 1, "Lolly Gagger", "Slacker rock"],
  ["Sat", "2:30 PM", 2, "Muddy Fudge", "Delta blues"],
  ["Sat", "2:30 PM", 3, "Marzipan Pigs", "Polka punk"],
  ["Sat", "2:30 PM", 5, "Wraith & Wrapper", "Dark ambient"],
  ["Sat", "4:00 PM", 0, "Stripe Hype", "Dance-punk"],
  ["Sat", "4:00 PM", 1, "Lickety Split", "Bluegrass breakdown"],
  ["Sat", "4:00 PM", 2, "Bayou Brittle", "Zydeco"],
  ["Sat", "4:00 PM", 4, "Snow Cone Syndicate", "Chillwave"],
  ["Sat", "4:00 PM", 5, "Moat Pop", "Dream pop"],
  ["Sat", "5:30 PM", 1, "Sunny Sucker", "Indie pop"],
  ["Sat", "5:30 PM", 2, "The Pralines", "Doo-wop"],
  ["Sat", "5:30 PM", 3, "Gumdrop Velvet", "Soft soul"],
  ["Sat", "5:30 PM", 4, "Banana Split Personality", "Prog rock"],
  ["Sat", "5:30 PM", 5, "Castle Keep", "Folk metal"],
  ["Sat", "7:00 PM", 0, "Peppermint Riot", "Punk"],
  ["Sat", "7:00 PM", 1, "Rainbow Swirl", "Psych pop"],
  ["Sat", "7:00 PM", 2, "Molasses Mile", "Southern rock"],
  ["Sat", "7:00 PM", 3, "Fizz Whizzers", "Electro-funk"],
  ["Sat", "7:00 PM", 4, "Frostbite Boys", "Hip-hop"],
  ["Sat", "8:30 PM", 0, "Sweet Tooth", "Stadium pop"],
  ["Sat", "8:30 PM", 5, "Lord Licorice Big Band", "Big band"],

  ["Sun", "1:00 PM", 0, "Mint Sauce", "Chiptune"],
  ["Sun", "1:00 PM", 2, "Sorghum", "Americana"],
  ["Sun", "1:00 PM", 3, "Gummy Worms", "Garage pop"],
  ["Sun", "1:00 PM", 4, "Milkshake Mafia", "Lounge"],
  ["Sun", "2:30 PM", 0, "Candygram", "R&B"],
  ["Sun", "2:30 PM", 1, "Sucker Punch", "Punk"],
  ["Sun", "2:30 PM", 4, "Freezer Burn", "Noise rock"],
  ["Sun", "2:30 PM", 5, "Bitter Root", "Folk"],
  ["Sun", "4:00 PM", 0, "Peppermint Parade", "Marching band"],
  ["Sun", "4:00 PM", 1, "Sugar Rushmore", "Stoner rock"],
  ["Sun", "4:00 PM", 2, "The Gloppy Brothers", "Swamp rock"],
  ["Sun", "4:00 PM", 3, "Gumdrop Kickflip", "Skate punk"],
  ["Sun", "4:00 PM", 5, "Drawbridge Choir", "Chamber folk"],
  ["Sun", "5:30 PM", 0, "Candy Striped Strangers", "Country rock"],
  ["Sun", "5:30 PM", 1, "Bubblegum Bandit", "Hip-hop"],
  ["Sun", "5:30 PM", 3, "Drop Gardens", "Ambient house"],
  ["Sun", "5:30 PM", 4, "Waffle Cone Wonders", "Jazz-pop"],
  ["Sun", "5:30 PM", 5, "Raven & the Ropes", "Blues rock"],
  ["Sun", "7:00 PM", 0, "Peppermint Pirates", "Folk punk"],
  ["Sun", "7:00 PM", 1, "Sunshine Suckers", "Yacht pop"],
  ["Sun", "7:00 PM", 2, "Caramel Swamp Choir", "Gospel"],
  ["Sun", "7:00 PM", 3, "Jelly Bean Machine", "House"],
  ["Sun", "7:00 PM", 5, "Black Taffy", "Stoner metal"],
  ["Sun", "8:30 PM", 1, "Lolly Supreme", "Diva pop"],
  ["Sun", "8:30 PM", 4, "The Sundaes", "Britpop"],
];

export const LINEUP: FestivalSet[] = RAW.map(([day, time, stage, artist, genre]) => ({
  artist,
  genre,
  day,
  time,
  stage: STAGES[stage],
}));

// Billing comes from the slot: 8:30 headlines, 5:30 and 7:00 are second on the bill.
export function tier(set: FestivalSet): 1 | 2 | 3 {
  if (set.time === "8:30 PM") return 1;
  if (set.time === "7:00 PM" || set.time === "5:30 PM") return 2;
  return 3;
}

// Other planned sets in the same day and slot. A Sugar Crash is any non-empty result.
export function clashesWith(set: FestivalSet, planned: FestivalSet[]) {
  return planned.filter((p) => p.artist !== set.artist && p.day === set.day && p.time === set.time);
}
