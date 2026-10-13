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

// Rows are [slot, venue, title, programme]. Slots are 0 = 1:00 PM through 5 = 8:30 PM, and
// venues follow VENUES (0 Grand Hall, 1 Mirror Gallery, 2 Royal Chapel, 3 Orangery,
// 4 Palace Gardens, 5 Lakeside Pavilion). No venue hosts two performances in one slot.
type Row = [slot: number, venue: number, title: string, programme: string];
const day = (d: Day, rows: Row[]): Performance[] =>
  rows.map(([slot, venue, title, programme]) => ({ title, programme, day: d, time: SLOTS[slot], venue: VENUES[venue] }));

// Bach and Boccherini share Saturday at 7:00, so saving both is a double engagement.
export const PERFORMANCES: Performance[] = [
  ...day("Thu", [
    [0, 0, "Haydn String Quartet", "Quartet in C major, “Emperor”"],
    [0, 2, "Pergolesi’s Stabat Mater", "Two voices and strings, in the chapel’s hush"],
    [0, 3, "Boismortier Flute Duets", "Two flutes among the citrus trees"],
    [1, 1, "Couperin at the Clavecin", "Ordres for harpsichord, played in the gallery’s glow"],
    [1, 5, "Corelli Concerti Grossi", "Strings answering strings across the water"],
    [2, 4, "Vivaldi’s Four Seasons", "Played outdoors among the parterres"],
    [2, 0, "Mozart Piano Concerto No. 21", "The slow movement everyone remembers"],
    [3, 2, "Handel’s Dixit Dominus", "A young composer’s thunderous psalm"],
    [3, 3, "Quantz Flute Sonatas", "The flute master of Frederick’s court"],
    [4, 0, "Haydn’s Creation Highlights", "Light breaks over the orchestra"],
    [4, 5, "Rameau’s Indes Galantes", "Dances from the opera-ballet"],
    [5, 1, "Mozart by Candlelight", "Eine kleine Nachtmusik, lit by three hundred candles"],
    [5, 2, "Bach Organ Evening", "Toccata, fugue, and the great chorale preludes"],
  ]),
  ...day("Fri", [
    [0, 3, "Vivaldi Flute Concertos", "Il Gardellino and its birdsong"],
    [0, 1, "Haydn Keyboard Sonatas", "Wit and surprise on the fortepiano"],
    [1, 5, "Handel’s Water Music", "Performed from the water’s edge"],
    [1, 0, "Mozart’s Gran Partita", "Thirteen wind players, one serenade"],
    [1, 4, "Telemann’s Tafelmusik", "Banquet music, played before the banquet"],
    [2, 2, "Bach’s St Matthew Passion", "Excerpts from the great Passion"],
    [2, 3, "Haydn String Trios", "Three players and nowhere to hide"],
    [3, 1, "Scarlatti at the Harpsichord", "Twelve sonatas, one instrument"],
    [3, 5, "Albinoni and the Oboe", "Adagio and the oboe concertos"],
    [4, 4, "Mozart Divertimenti", "Evening serenades for the terrace"],
    [4, 0, "Haydn’s “Surprise” Symphony", "Wait for the chord in the slow movement"],
    [5, 0, "The Magic Flute in Concert", "Mozart’s opera, without the staging"],
    [5, 2, "Pergolesi’s Salve Regina", "A soprano and a small string band"],
  ]),
  ...day("Sat", [
    [0, 3, "Telemann for Flutes", "Fantasias among the citrus trees"],
    [0, 0, "Mozart’s Horn Concertos", "The hunting horn, tamed"],
    [0, 5, "Handel’s Concerti Grossi", "Op. 6, played from first note to last"],
    [1, 1, "Rameau at the Harpsichord", "Pieces for clavecin, in portraits"],
    [1, 4, "Haydn’s Baryton Trios", "The prince’s favorite, a rare instrument"],
    [2, 2, "Vivaldi’s Gloria", "Trumpet-bright and joyful"],
    [2, 0, "Bach’s Goldberg Variations", "Thirty variations, one aria"],
    [3, 5, "Mozart’s Clarinet Quintet", "Autumn light on the lake"],
    [3, 3, "Corelli Trio Sonatas", "Two violins, a cello, and a lute"],
    [4, 2, "Bach Cello Suites", "All six suites, one cellist"],
    [4, 3, "Boccherini Guitar Quintets", "Spanish fire, Italian grace"],
    [4, 1, "Gluck’s Orfeo", "The dance of the blessed spirits"],
    [5, 0, "Mozart’s Requiem", "Unfinished, and unforgettable"],
    [5, 4, "Handel’s Fireworks Music", "Brass and drums over the gardens"],
  ]),
  ...day("Sun", [
    [0, 4, "Telemann’s Brass Fanfares", "A morning call across the parterres"],
    [0, 3, "Mozart’s Flute Quartets", "Four voices, light as breakfast"],
    [1, 0, "Haydn’s Cello Concerto in C", "Rediscovered, and played with relish"],
    [1, 5, "Vivaldi’s Lute Concerto", "Plucked strings by the water"],
    [2, 1, "C.P.E. Bach Fantasias", "Improvisation, written down"],
    [2, 2, "Bach Cantatas", "A selection for the Sunday afternoon"],
    [3, 3, "Haydn’s Divertimenti", "Cheerful music for a small room"],
    [3, 5, "Handel Arias", "Operatic fireworks for one soprano"],
    [4, 0, "Mozart’s Piano Sonatas", "Four sonatas, one pianist"],
    [4, 4, "Rameau’s Pastorales", "Dances for the garden’s last light"],
    [5, 2, "Handel’s Messiah", "The closing night, with full choir"],
    [5, 1, "Haydn’s Farewell Symphony", "The players leave, one by one"],
  ]),
];

// Other saved performances at the same day and time.
export function clashesWith(p: Performance, saved: Performance[]) {
  return saved.filter((s) => s.title !== p.title && s.day === p.day && s.time === p.time);
}
