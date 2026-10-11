import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import { fontVariables } from "@/app/_themes/candyland/fonts";
import { color, shadow, STAGES } from "@/app/_themes/candyland/tokens";

import boardLayout from "./images/candyland_layout.jpg";
import boxCover from "./images/candyland_cover.jpg";
import characters from "./images/candy_land_characters.jpg";
import kingCandy from "./images/king_candy.jpg";
import racers from "./images/wreck_it_ralph_racers.jpg";
import candyCrowds from "./images/candies_2_wir.jpg";
import candyStands from "./images/candies_3_wir.jpg";
import concessions from "./images/candies_wir.jpg";
import candyPlanet from "./images/candy_planet.jpg";

export const metadata: Metadata = {
  title: "Candyland Vibes mood board",
};

const CREAM = color.background;
const INK = color.text;
const [PEPPERMINT, LOLLIPOP, MOLASSES, GUMDROP, ICE_CREAM, LICORICE] = STAGES;

const display = { fontFamily: "var(--font-fredoka)" };

function Tile({
  caption,
  className = "",
  children,
}: {
  caption: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className={`flex min-h-0 flex-col gap-1.5 ${className}`}>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[20px] ring-2 ring-[#3B1F2B]/10">
        {children}
      </div>
      <figcaption className="text-xs font-semibold text-[#6B4A57]">
        {caption}
      </figcaption>
    </figure>
  );
}

// Reference images: real artifacts from the source material, credited in the caption.
function Ref({
  src,
  alt,
  caption,
  className = "",
  fit = "cover",
  position = "center",
}: {
  src: StaticImageData;
  alt: string;
  caption: string;
  className?: string;
  fit?: "cover" | "contain";
  position?: string;
}) {
  return (
    <Tile caption={`Ref · ${caption}`} className={className}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className={fit === "contain" ? "bg-white object-contain" : "object-cover"}
        style={{ objectPosition: position }}
      />
    </Tile>
  );
}

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <Tile caption={`Color · ${name}`}>
      <div className="h-full w-full" style={{ background: hex }} />
      <span
        className="absolute bottom-2 left-2 rounded-full px-2.5 py-1 text-xs font-bold"
        style={{ background: CREAM, color: INK }}
      >
        {hex}
      </span>
    </Tile>
  );
}

// Deterministic "random" so server and client render the same sprinkles.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const rand = seeded(7);
const SPRINKLES = Array.from({ length: 46 }, (_, i) => ({
  x: rand() * 140,
  y: rand() * 140,
  r: rand() * 180,
  c: STAGES[i % STAGES.length].hex,
}));

const PATH_SQUARES = Array.from({ length: 14 }, (_, i) => ({
  x: 8 + i * 21,
  y: 60 + 38 * Math.sin(i * 0.65),
  c: STAGES[i % STAGES.length].hex,
}));

export default function CandylandMoodBoard() {
  return (
    <main
      className={`${fontVariables} min-h-screen px-4 py-10 sm:px-8`}
      style={{ background: CREAM, color: INK, fontFamily: "var(--font-nunito)" }}
    >
      <header className="mx-auto mb-8 max-w-6xl">
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold">
          <Link
            href="/"
            className="underline decoration-2 underline-offset-4 hover:decoration-4 focus-visible:rounded focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#3B1F2B]"
          >
            ← Home
          </Link>
          <Link
            href="/design-systems/candyland"
            className="underline decoration-2 underline-offset-4 hover:decoration-4 focus-visible:rounded focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#3B1F2B]"
          >
            Design system →
          </Link>
        </nav>
        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-[#6B4A57]">
          Mood board 1 of 3 · Candyland
        </p>
        <h1 className="mt-1 text-5xl font-bold sm:text-6xl" style={display}>
          Candyland Vibes
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed">
          A music festival staged inside a candy board game. Six stages, each a
          land on the Candy Land path, each with its own color, the way Sugar
          Rush gives every racer a flavor. The colors mark places; the words
          stay dark on cream so set times still read at 9 PM in a crowd.
        </p>
      </header>

      <section
        aria-label="Mood board tiles"
        className="mx-auto grid max-w-6xl auto-rows-[150px] grid-flow-dense grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6"
      >
        <Ref
          src={boardLayout}
          alt="Classic Candy Land board: a rainbow path of squares winding past Gumdrop Pass, Lollipop Woods and Peppermint Forest"
          caption="Candy Land board, Milton Bradley"
          className="col-span-2 row-span-3"
        />

        {/* Display specimen: striped lettering lifted from the Candy Land box logo */}
        <Tile caption="Type · Fredoka Bold, candy-stripe logo" className="col-span-2 row-span-2">
          <div className="flex h-full flex-col justify-center bg-white px-6">
            <span
              className="text-6xl leading-none font-bold sm:text-7xl"
              style={{
                ...display,
                backgroundImage: `repeating-linear-gradient(115deg, ${PEPPERMINT.hex} 0 7px, #FF8FC4 7px 12px)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextStroke: `1.5px ${INK}`,
              }}
            >
              Sugar
              <br />
              Rush
            </span>
            <span className="mt-4 text-sm font-bold text-[#6B4A57]">
              Thursday – Sunday · 6 lands · 100 sets
            </span>
          </div>
        </Tile>

        <Ref
          src={candyCrowds}
          alt="Rows of candy characters packed into grandstands, from Wreck-It Ralph's Sugar Rush"
          caption="Sugar Rush crowds, Wreck-It Ralph (Disney, 2012)"
          className="row-span-3"
        />

        <Swatch {...PEPPERMINT} />

        <Ref
          src={racers}
          alt="Sugar Rush racers in candy karts on a red and white checkered start line"
          caption="Sugar Rush racers, Wreck-It Ralph"
          className="col-span-2"
        />

        <Swatch {...LOLLIPOP} />

        <Ref
          src={boxCover}
          alt="Current Candy Land box with candy-cane striped logo, a castle, and colored pawns in rainbow slots"
          caption="Candy Land box, Hasbro Games"
          className="col-span-2 row-span-2"
        />

        {/* Candy cane stripe */}
        <Tile caption="Texture · Candy cane">
          <div
            className="h-full w-full"
            style={{
              background: `repeating-linear-gradient(135deg, ${PEPPERMINT.hex} 0 18px, #fff 18px 36px)`,
            }}
          />
        </Tile>

        {/* Peppermint swirl */}
        <Tile caption="Texture · Peppermint swirl">
          <div className="flex h-full items-center justify-center bg-[#FFE3EE]">
            <div
              className="aspect-square h-4/5 rounded-full shadow-[inset_0_-6px_0_rgba(0,0,0,0.12)]"
              style={{
                background: `radial-gradient(circle, #fff 0 14%, transparent 15%), repeating-conic-gradient(${PEPPERMINT.hex} 0 22.5deg, #fff 22.5deg 45deg)`,
              }}
            />
          </div>
        </Tile>

        <Ref
          src={kingCandy}
          alt="King Kandy in a jeweled crown and purple robe, holding a gumball scepter"
          caption="King Kandy, Candy Land"
          className="row-span-2"
          fit="contain"
        />

        {/* Stage chips */}
        <Tile caption="Interface · Stage chips" className="col-span-2">
          <div className="flex h-full flex-wrap content-center gap-2 bg-white p-4">
            {STAGES.map((s) => (
              <span
                key={s.name}
                className="inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-sm font-bold"
                style={{ borderColor: s.hex, background: CREAM }}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.hex }} />
                {s.name}
              </span>
            ))}
          </div>
        </Tile>

        <Swatch {...GUMDROP} />

        <Ref
          src={candyStands}
          alt="Heart-faced peppermint candies lined up on pink bleachers"
          caption="Sugar Rush bleachers, Wreck-It Ralph"
          className="col-span-2"
        />

        {/* Sugar Crash warning */}
        <Tile caption="Interface · Conflict sticker">
          <div className="flex h-full items-center justify-center bg-[#FFE3EE] p-3">
            <div
              className="-rotate-3 rounded-2xl border-[3px] px-3 py-2 shadow-[0_4px_0_#3B1F2B]"
              style={{ background: LOLLIPOP.hex, borderColor: INK }}
            >
              <p className="text-lg leading-tight font-bold" style={display}>
                Sugar Crash!
              </p>
              <p className="text-xs leading-snug font-bold">2 sets at Thu 7:00 PM</p>
            </div>
          </div>
        </Tile>

        <Swatch {...ICE_CREAM} />

        <Ref
          src={characters}
          alt="Grid of classic Candy Land characters: Gloppy, Frostine, King Kandy, Lord Licorice, Plumpy, Lolly, Mr. Mint and more"
          caption="Classic Candy Land cast (via wikiHow)"
          className="col-span-2 row-span-2"
        />

        {/* Artist card */}
        <Tile caption="Interface · Artist card, stage-colored edge" className="col-span-2">
          <div className="flex h-full items-center bg-[#FFE3EE] p-4">
            <div
              className="w-full rounded-2xl border-l-[10px] bg-white p-4 shadow-[0_4px_0_rgba(59,31,43,0.15)]"
              style={{ borderLeftColor: ICE_CREAM.hex }}
            >
              <p className="text-xl leading-tight font-semibold" style={display}>
                Queen Frostine &amp; the Floats
              </p>
              <p className="mt-1 text-sm font-semibold text-[#6B4A57]">
                Ice Cream Sea · Fri 5:30 PM
              </p>
            </div>
          </div>
        </Tile>

        <Swatch {...MOLASSES} />

        {/* Artist names specimen */}
        <Tile caption="Type · Artist names, Fredoka 600" className="row-span-2">
          <ul className="flex h-full flex-col justify-center gap-2.5 bg-white px-4" style={display}>
            {[
              ["Mint Condition", PEPPERMINT.hex],
              ["Lolly & the Lickables", LOLLIPOP.hex],
              ["Slow Molasses", MOLASSES.hex],
              ["Gumdrop Velvet", GUMDROP.hex],
              ["Brain Freeze", ICE_CREAM.hex],
              ["Lord Licorice Big Band", LICORICE.hex],
            ].map(([n, c]) => (
              <li key={n} className="flex items-center gap-2 text-base leading-tight font-semibold">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: c }} />
                {n}
              </li>
            ))}
          </ul>
        </Tile>

        <Ref
          src={concessions}
          alt="Candy concession booths with bunting, striped popcorn boxes and a Rainbow candy stand"
          caption="Sugar Rush concessions, Wreck-It Ralph"
          className="col-span-2 row-span-2"
        />

        {/* Board-square button */}
        <Tile caption="Interface · Primary action" className="col-span-2">
          <div className="flex h-full items-center justify-center bg-white">
            <span
              className="rounded-2xl px-5 py-3 text-lg font-semibold whitespace-nowrap text-white"
              style={{ ...display, background: color.accent, boxShadow: shadow.button }}
            >
              Add to my set list
            </span>
          </div>
        </Tile>

        <Swatch {...LICORICE} />

        <Ref
          src={candyPlanet}
          alt="Candy Planet poster: a girl surrounded by round candy creatures under a pink cotton-candy sky"
          caption="Candy Planet poster"
          className="row-span-2"
        />

        {/* Candy path */}
        <Tile caption="Interface · The path (day timeline)" className="col-span-2">
          <svg viewBox="0 0 300 140" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
            <rect width="300" height="140" fill="#D9F2CF" />
            {PATH_SQUARES.map((p, i) => (
              <rect
                key={i}
                x={p.x}
                y={p.y}
                width="19"
                height="19"
                rx="4"
                fill={p.c}
                stroke="#fff"
                strokeWidth="2.5"
              />
            ))}
          </svg>
        </Tile>

        <Swatch name="Cream (background)" hex={CREAM} />

        {/* Sprinkles */}
        <Tile caption="Texture · Sprinkles">
          <svg viewBox="0 0 140 140" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
            <rect width="140" height="140" fill="#FFE3EE" />
            {SPRINKLES.map((s, i) => (
              <rect
                key={i}
                x={s.x}
                y={s.y}
                width="11"
                height="4"
                rx="2"
                fill={s.c}
                transform={`rotate(${s.r} ${s.x + 5.5} ${s.y + 2})`}
              />
            ))}
          </svg>
        </Tile>

        {/* Body specimen */}
        <Tile caption="Type · Nunito, body" className="col-span-2">
          <div className="flex h-full items-center bg-white px-5">
            <p className="text-base leading-relaxed">
              Lord Licorice takes the castle at 8:30. You&rsquo;re already on
              the shore at Ice Cream Sea, so pick one before the sugar wears off.
            </p>
          </div>
        </Tile>

        <Swatch name="Cocoa (text)" hex={INK} />
      </section>
    </main>
  );
}
