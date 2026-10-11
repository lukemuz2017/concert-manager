import { STAGES } from "@/app/_themes/candyland/tokens";
import type { FestivalSet } from "@/app/_themes/candyland/ui";

// A slice of the Sugar Rush lineup for the design system. Lolly & the Lickables
// and Brain Freeze share Thursday at 7:00 PM, so adding both causes a Sugar Crash.

const [PEPPERMINT, LOLLIPOP, MOLASSES, GUMDROP, ICE_CREAM, LICORICE] = STAGES;

export const DAYS = ["Thu", "Fri", "Sat", "Sun"];

export const SETS: FestivalSet[] = [
  {
    artist: "Mint Condition",
    stage: PEPPERMINT,
    day: "Thu",
    time: "1:00 PM",
    blurb: "Crisp, cool guitar pop to clear your head before a long day.",
  },
  {
    artist: "Lolly & the Lickables",
    stage: LOLLIPOP,
    day: "Thu",
    time: "7:00 PM",
    blurb: "Bubblegum punk with a horn section and a serious confetti budget.",
  },
  {
    artist: "Brain Freeze",
    stage: ICE_CREAM,
    day: "Thu",
    time: "7:00 PM",
    blurb: "Icy synth-wave played very, very fast. Bring a jacket.",
  },
  {
    artist: "Slow Molasses",
    stage: MOLASSES,
    day: "Fri",
    time: "2:30 PM",
    blurb: "Sticky, unhurried blues for the hottest hour of the afternoon.",
  },
  {
    artist: "Queen Frostine & the Floats",
    stage: ICE_CREAM,
    day: "Fri",
    time: "8:30 PM",
    blurb: "Shimmering dream-pop from the far shore of the Ice Cream Sea.",
    headliner: true,
  },
  {
    artist: "Gumdrop Velvet",
    stage: GUMDROP,
    day: "Sat",
    time: "5:30 PM",
    blurb: "Soft-focus soul with a sugar-coated falsetto.",
  },
  {
    artist: "Lord Licorice Big Band",
    stage: LICORICE,
    day: "Sat",
    time: "8:30 PM",
    blurb: "Seventeen players, one castle, and the darkest brass on the board.",
    headliner: true,
  },
  {
    artist: "The Gloppy Brothers",
    stage: MOLASSES,
    day: "Sun",
    time: "4:00 PM",
    blurb: "Swamp rock that sounds exactly like its name.",
  },
];

export function findSet(artist: string) {
  return SETS.find((s) => s.artist === artist)!;
}

// A Sugar Crash is two sets on your list in the same day and slot.
export function clashes(sets: FestivalSet[]) {
  const perSlot = new Map<string, number>();
  for (const s of sets) perSlot.set(`${s.day} ${s.time}`, (perSlot.get(`${s.day} ${s.time}`) ?? 0) + 1);
  return new Set(sets.filter((s) => perSlot.get(`${s.day} ${s.time}`)! > 1).map((s) => s.artist));
}
