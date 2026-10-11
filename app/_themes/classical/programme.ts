// Venues and a sample of the programme. Venues are told apart by name and an
// engraved icon; the palette is too muted to give six venues six colors.

export const VENUES = [
  { name: "Grand Hall", icon: "hall" },
  { name: "Mirror Gallery", icon: "gallery" },
  { name: "Royal Chapel", icon: "chapel" },
  { name: "Orangery", icon: "orangery" },
  { name: "Palace Gardens", icon: "gardens" },
  { name: "Lakeside Pavilion", icon: "pavilion" },
] as const;
export type Venue = (typeof VENUES)[number];

export const DAYS = ["Thu", "Fri", "Sat", "Sun"] as const;
export type Day = (typeof DAYS)[number];
export const DAY_NAMES: Record<Day, string> = { Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };

export const SLOTS = ["1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM", "7:00 PM", "8:30 PM"] as const;

export type Performance = {
  title: string;
  programme: string;
  day: Day;
  time: (typeof SLOTS)[number];
  venue: Venue;
};

const [HALL, GALLERY, CHAPEL, ORANGERY, GARDENS, PAVILION] = VENUES;

// Bach and Boccherini share Saturday at 7:00, so saving both is a double engagement.
export const PERFORMANCES: Performance[] = [
  { title: "Haydn String Quartet", programme: "Quartet in C major, “Emperor”", day: "Thu", time: "1:00 PM", venue: HALL },
  { title: "Vivaldi’s Four Seasons", programme: "Played outdoors among the parterres", day: "Thu", time: "4:00 PM", venue: GARDENS },
  { title: "Mozart by Candlelight", programme: "Eine kleine Nachtmusik, lit by three hundred candles", day: "Thu", time: "8:30 PM", venue: GALLERY },
  { title: "Handel’s Water Music", programme: "Performed from the water’s edge", day: "Fri", time: "2:30 PM", venue: PAVILION },
  { title: "Scarlatti at the Harpsichord", programme: "Twelve sonatas, one instrument", day: "Fri", time: "5:30 PM", venue: GALLERY },
  { title: "The Magic Flute in Concert", programme: "Mozart’s opera, without the staging", day: "Fri", time: "8:30 PM", venue: HALL },
  { title: "Telemann for Flutes", programme: "Fantasias among the citrus trees", day: "Sat", time: "1:00 PM", venue: ORANGERY },
  { title: "Bach Cello Suites", programme: "All six suites, one cellist", day: "Sat", time: "7:00 PM", venue: CHAPEL },
  { title: "Boccherini Guitar Quintets", programme: "Spanish fire, Italian grace", day: "Sat", time: "7:00 PM", venue: ORANGERY },
  { title: "Handel’s Messiah", programme: "The closing night, with full choir", day: "Sun", time: "8:30 PM", venue: CHAPEL },
];

// Other saved performances at the same day and time.
export function clashesWith(p: Performance, saved: Performance[]) {
  return saved.filter((s) => s.title !== p.title && s.day === p.day && s.time === p.time);
}
