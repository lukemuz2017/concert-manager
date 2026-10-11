import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { fontVariables } from "@/app/_themes/classical/fonts";
import { color, shadow } from "@/app/_themes/classical/tokens";

import chateau from "./images/chateau.jpg";
import engraving from "./images/engraving.jpg";
import gardens from "./images/gardens.jpg";
import lakeVilla from "./images/lake-villa.jpg";
import magnolia from "./images/magnolia.jpg";
import marbleTable from "./images/marble-table.jpg";
import mirrorHall from "./images/mirror-hall.jpg";
import terraceQuartet from "./images/terrace-quartet.jpg";
import womanReading from "./images/woman-reading.jpg";

export const metadata: Metadata = {
  title: "Timeless Classical mood board",
};

const SERIF = "font-(family-name:--font-playfair)";
const CAPS = "text-xs font-semibold uppercase tracking-[0.2em]";
const LINK =
  "underline decoration-1 underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F2F2F]";

const SWATCHES = [
  { name: "Ivory", hex: color.ivory },
  { name: "Sage", hex: color.sage },
  { name: "Dusty blue", hex: color.dustyBlue },
  { name: "Terracotta", hex: color.terracotta },
  { name: "Gold", hex: color.gold },
  { name: "Charcoal", hex: color.charcoal },
  { name: "Forest", hex: color.forest },
];

/* Pieces ----------------------------------------------------------------- */

function Piece({ caption, className = "", children }: { caption: string; className?: string; children: ReactNode }) {
  return (
    <figure className={`flex min-h-0 flex-col gap-2 ${className}`}>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[2px] bg-white" style={{ boxShadow: shadow.card }}>
        {children}
      </div>
      <figcaption className={`${CAPS} text-[#5F5B52]`}>{caption}</figcaption>
    </figure>
  );
}

// Paintings were generated with ChatGPT and cropped from the original board.
function Painting({
  src,
  alt,
  caption,
  className,
  contain,
}: {
  src: StaticImageData;
  alt: string;
  caption: string;
  className?: string;
  contain?: boolean;
}) {
  return (
    <Piece caption={caption} className={className}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 33vw, 50vw"
        className={contain ? "bg-[#EEE8DB] object-contain" : "object-cover"}
      />
    </Piece>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className={`${CAPS} mb-5 text-[#2F2F2F]`}>{children}</h2>;
}

/* Fine-line icons, drawn like engravings ---------------------------------- */

function Icon({ children, className = "h-8 w-8" }: { children: ReactNode; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

const ICONS: { name: string; draw: ReactNode }[] = [
  {
    name: "Hall",
    draw: <path d="M4 12h24M5 12 16 5l11 7M8 12v12M13 12v12M19 12v12M24 12v12M5 25h22M3 28h26" />,
  },
  {
    name: "Music",
    draw: (
      <>
        <path d="M12 24V8l14-3v16" />
        <path d="M12 12l14-3" />
        <circle cx="9" cy="24" r="3" />
        <circle cx="23" cy="21" r="3" />
      </>
    ),
  },
  {
    name: "Garden",
    draw: (
      <>
        <path d="M8 28C12 21 17 13 26 5" />
        {[
          [11, 22, -20],
          [14, 17, -35],
          [18, 12, -45],
          [22, 8, -55],
        ].map(([x, y, r]) => (
          <g key={x}>
            <ellipse cx={x - 3} cy={y - 1} rx="3.4" ry="1.4" transform={`rotate(${r - 40} ${x - 3} ${y - 1})`} />
            <ellipse cx={x + 2} cy={y + 2} rx="3.4" ry="1.4" transform={`rotate(${r + 30} ${x + 2} ${y + 2})`} />
          </g>
        ))}
      </>
    ),
  },
  {
    name: "Venue",
    draw: (
      <>
        <path d="M16 29s9-8.5 9-15a9 9 0 0 0-18 0c0 6.5 9 15 9 15Z" />
        <circle cx="16" cy="14" r="3.2" />
      </>
    ),
  },
  {
    name: "Calendar",
    draw: (
      <>
        <rect x="5" y="7" width="22" height="20" rx="1.5" />
        <path d="M5 12h22M11 4v6M21 4v6M10 17h2M15 17h2M20 17h2M10 22h2M15 22h2" />
      </>
    ),
  },
  {
    name: "Plan",
    draw: (
      <>
        <circle cx="16" cy="16" r="12" />
        <path d="m20.5 11.5-3 6-6 3 3-6Z" />
      </>
    ),
  },
];

function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 160 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={className}>
      <path d="M4 12h56M100 12h56" />
      <path d="M80 4l6 8-6 8-6-8Z" />
      <path d="M74 12c-4-6-10-6-12 0 2 6 8 6 12 0M86 12c4-6 10-6 12 0-2 6-8 6-12 0" />
      <circle cx="66" cy="12" r="1" fill="currentColor" />
      <circle cx="94" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

/* Page ------------------------------------------------------------------- */

export default function ClassicalMoodBoard() {
  return (
    <main
      className={`${fontVariables} min-h-screen px-4 py-10 sm:px-8`}
      style={{ background: color.ivory, color: color.charcoal, fontFamily: "var(--font-source-sans)" }}
    >
      <div className="mx-auto max-w-6xl">
        <header>
          <Link href="/" className={`text-sm font-semibold ${LINK}`}>
            ← Home
          </Link>
          <div className="mt-10 flex flex-col items-center text-center">
            <Ornament className="w-40 text-[#D4B06A]" />
            <p className={`mt-4 ${CAPS} text-[#5F5B52]`}>Mood board 2 of 3 · Classical</p>
            <h1 className={`${SERIF} mt-3 text-5xl sm:text-6xl`}>Timeless Classical</h1>
            <p className={`${SERIF} mt-4 max-w-xl text-lg text-[#5F5B52] italic`}>
              A chamber-music festival in an 18th-century palace: terraces, gilded
              halls, and formal gardens, lit like an oil painting. Quiet and
              unhurried.
            </p>
          </div>
        </header>

        {/* Paintings and textures */}
        <section className="mt-14">
          <SectionLabel>Paintings &amp; textures</SectionLabel>
          <div className="grid auto-rows-[150px] grid-flow-dense grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            <Painting
              src={terraceQuartet}
              alt="A string quartet playing on a stone terrace above formal gardens and a lake"
              caption="Painting · Quartet on the terrace"
              className="col-span-2 sm:col-span-4"
            />
            <Painting
              src={womanReading}
              alt="A woman in a blue silk gown reading a book on a balcony"
              caption="Painting · The reader"
              className="row-span-2"
            />
            <Painting
              src={mirrorHall}
              alt="A gilded palace hall with chandeliers and tall arched windows"
              caption="Painting · Gilded hall"
              className="row-span-2"
            />
            <Painting
              src={marbleTable}
              alt="A festival programme lying on a marble table beside a vase of white flowers"
              caption="Painting · The programme"
              className="col-span-2"
            />
            <Painting
              src={gardens}
              alt="Formal palace gardens with cypress trees and a lake beyond"
              caption="Painting · Formal gardens"
            />
            <Painting
              src={magnolia}
              alt="A botanical illustration of a white magnolia branch"
              caption="Botanical · Magnolia"
              contain
            />

            <Piece caption="Texture · Marble" className="col-span-2">
              <svg viewBox="0 0 360 150" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
                <filter id="marble-veins">
                  <feTurbulence type="turbulence" baseFrequency="0.006 0.022" numOctaves="5" seed="11" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.47  0 0 0 0 0.45  0 0 0 0 0.42  -2.4 0 0 0 1.05"
                  />
                </filter>
                <rect width="360" height="150" fill="#F1EDE4" />
                <rect width="360" height="150" filter="url(#marble-veins)" opacity="0.55" />
              </svg>
            </Piece>
            <Piece caption="Texture · Laid paper" className="col-span-2">
              <div
                className="flex h-full items-center justify-center"
                style={{
                  backgroundColor: "#F6F1E6",
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(47,47,47,0.035) 0 1px, transparent 1px 5px), repeating-linear-gradient(90deg, rgba(47,47,47,0.06) 0 1px, transparent 1px 38px)",
                }}
              >
                <span className={`${SERIF} text-3xl italic`}>Programme</span>
              </div>
            </Piece>
            <Piece caption="Texture · Gilt frame" className="col-span-2">
              <div className="flex h-full items-center justify-center bg-[#EFEADF] p-3">
                <div className="border-[5px] border-[#D4B06A] p-1 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]">
                  <div className="border border-[#D4B06A] bg-white p-2">
                    <Image src={engraving} alt="Engraving of a palace and its grounds" width={228} height={86} />
                  </div>
                </div>
              </div>
            </Piece>
          </div>
        </section>

        {/* Color, type, icons */}
        <section className="mt-14 grid gap-10 border-y border-[#E3DED2] py-10 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-[#E3DED2]">
          <div className="lg:pr-8">
            <SectionLabel>Color palette</SectionLabel>
            <ul className="grid grid-cols-4 gap-x-3 gap-y-5">
              {SWATCHES.map((s) => (
                <li key={s.name} className="flex flex-col items-center text-center">
                  <span
                    className="h-14 w-14 rounded-full"
                    style={{ background: s.hex, boxShadow: "inset 0 0 0 1px rgba(47,47,47,0.12)" }}
                  />
                  <span className={`mt-2 ${CAPS} tracking-[0.12em]`}>{s.name}</span>
                  <span className="text-xs text-[#5F5B52]">{s.hex}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:px-8">
            <SectionLabel>Typography</SectionLabel>
            <figure>
              <p className={`${SERIF} text-4xl`}>Playfair Display</p>
              <figcaption className={`mt-1 ${CAPS} text-[#5F5B52]`}>Headlines &amp; highlights</figcaption>
            </figure>
            <figure className="mt-6">
              <p className={`${SERIF} text-2xl leading-snug italic`}>Music, History &amp; Beautiful Places</p>
              <figcaption className={`mt-1 ${CAPS} text-[#5F5B52]`}>Playfair italic · moments</figcaption>
            </figure>
            <figure className="mt-6">
              <p className="text-2xl">Source Sans 3</p>
              <p className="mt-1 leading-relaxed">
                Haydn in the Grand Hall at 1:00, the gardens all afternoon, then
                Mozart by candlelight.
              </p>
              <figcaption className={`mt-1 ${CAPS} text-[#5F5B52]`}>Body text &amp; navigation</figcaption>
            </figure>
            <figure className="mt-6">
              <p className={`${CAPS} tracking-[0.3em]`}>The Atlas Classical Music Festival</p>
              <figcaption className={`mt-1 ${CAPS} text-[#5F5B52]`}>Spaced capitals · labels</figcaption>
            </figure>
          </div>

          <div className="lg:pl-8">
            <SectionLabel>Icons &amp; ornament</SectionLabel>
            <ul className="grid grid-cols-3 gap-y-5 text-[#B08A45]">
              {ICONS.map((icon) => (
                <li key={icon.name} className="flex flex-col items-center gap-2">
                  <Icon className="h-9 w-9">{icon.draw}</Icon>
                  <span className={`${CAPS} tracking-[0.12em] text-[#5F5B52]`}>{icon.name}</span>
                </li>
              ))}
            </ul>
            <figure className="mt-8 flex flex-col items-center">
              <Ornament className="w-48 text-[#D4B06A]" />
              <figcaption className={`mt-2 ${CAPS} text-[#5F5B52]`}>Divider · gilt ornament</figcaption>
            </figure>
            <p className="mt-6 text-sm text-[#5F5B52]">
              Six venues, one muted palette: venues are told apart by name and an
              engraved icon, not by bright color.
            </p>
          </div>
        </section>

        {/* Interface */}
        <section className="mt-14">
          <SectionLabel>Interface</SectionLabel>
          <div className="grid gap-6 lg:grid-cols-6">
            <Piece caption="Interface · Website hero" className="lg:col-span-4">
              <div className="flex items-center justify-between gap-4 border-b border-[#E3DED2] px-5 py-3">
                <div className="flex items-center gap-3">
                  <Icon className="h-7 w-7 text-[#B08A45]">{ICONS[1].draw}</Icon>
                  <div>
                    <p className={`${SERIF} text-sm tracking-[0.2em] uppercase`}>The Atlas</p>
                    <p className="text-[10px] tracking-[0.2em] text-[#5F5B52] uppercase">Classical Music Festival</p>
                  </div>
                </div>
                <div className="hidden gap-5 text-sm sm:flex">
                  <span>Performances</span>
                  <span>Plan your visit</span>
                  <span>Venues</span>
                  <span>About</span>
                </div>
              </div>
              <div className="grid sm:grid-cols-[1fr_250px]">
                <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
                  <p className={`${SERIF} text-[34px] leading-tight italic`}>
                    Music, History
                    <br />
                    &amp; Beautiful Places
                  </p>
                  <p className="max-w-xs text-[#5F5B52]">
                    Your guide to four days of 18th-century music in a palace and its gardens.
                  </p>
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#2F4031] px-5 py-2.5 text-xs font-semibold tracking-[0.18em] text-white uppercase">
                    Explore the festival →
                  </span>
                </div>
                <div className="relative min-h-64">
                  <Image
                    src={lakeVilla}
                    alt="A villa beside a lake with mountains behind, seen past a stone urn"
                    fill
                    sizes="250px"
                    className="object-cover"
                  />
                </div>
              </div>
            </Piece>

            <Piece caption="Interface · Performance card" className="lg:col-span-2">
              <div className="relative h-44">
                <Image src={chateau} alt="A château framed by stone columns and trees" fill sizes="360px" className="object-cover" />
              </div>
              <div className="flex items-end justify-between gap-3 p-5">
                <div>
                  <p className={`${CAPS} text-[#5F5B52]`}>Sat · 4:00 PM</p>
                  <p className={`${SERIF} mt-1 text-xl`}>Mozart &amp; His Contemporaries</p>
                  <p className="text-[#5F5B52]">Palace Gardens</p>
                </div>
                <span aria-hidden="true" className="text-2xl text-[#5F5B52]">
                  ›
                </span>
              </div>
            </Piece>

            <Piece caption="Interface · Itinerary" className="lg:col-span-3">
              <div className="p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className={`${SERIF} text-2xl`}>Your Festival Itinerary</p>
                  <span className="text-sm underline underline-offset-4">View full schedule →</span>
                </div>
                <p className="mt-1 text-[#5F5B52]">Save performances and make the most of your weekend.</p>
                <div className="mt-5 grid grid-cols-4 border-b border-[#E3DED2] text-center">
                  {["Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <span
                      key={d}
                      className={`py-2.5 ${CAPS} ${d === "Sat" ? "border-b-2 border-[#2F2F2F] bg-[#F3EFE6]" : "text-[#5F5B52]"}`}
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <ul className="divide-y divide-[#E3DED2]">
                  {[
                    { time: "1:00 PM", icon: ICONS[0].draw, title: "Haydn String Quartet", venue: "Grand Hall", saved: false },
                    { time: "4:00 PM", icon: ICONS[2].draw, title: "Vivaldi's Four Seasons", venue: "Palace Gardens", saved: false },
                    { time: "8:30 PM", icon: ICONS[1].draw, title: "Mozart by Candlelight", venue: "Mirror Gallery", saved: true },
                  ].map((row) => (
                    <li key={row.time} className="flex items-center gap-4 py-4">
                      <span className="w-16 shrink-0 text-sm text-[#5F5B52]">{row.time}</span>
                      <Icon className="h-6 w-6 shrink-0 text-[#B08A45]">{row.icon}</Icon>
                      <span className="min-w-0 flex-1">
                        <span className="block">{row.title}</span>
                        <span className="text-sm text-[#5F5B52]">{row.venue}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm ${row.saved ? "border-[#2F4031] bg-[#2F4031] text-white" : "border-[#9C968A] text-[#5F5B52]"}`}
                      >
                        {row.saved ? "✓" : "+"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Piece>

            <div className="grid gap-6 lg:col-span-3">
              <Piece caption="Interface · Conflict notice">
                <div className="border-l-4 border-[#C97B63] p-5">
                  <p className={`${SERIF} text-lg italic`}>You are expected in two salons at once.</p>
                  <p className="mt-1 text-[#5F5B52]">
                    Bach in the Royal Chapel and Schubert in the Orangery both begin at 7:00 PM.
                    Choose one.
                  </p>
                </div>
              </Piece>
              <Piece caption="Interface · Buttons & link">
                <div className="flex flex-wrap items-center gap-4 p-5">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#2F4031] px-5 py-2.5 text-sm text-white">
                    View performances →
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#2F2F2F] px-5 py-2.5 text-sm">
                    Add to itinerary +
                  </span>
                  <span className="text-sm underline underline-offset-4">View all →</span>
                </div>
              </Piece>
              <div className="grid gap-6 sm:grid-cols-2">
                <Piece caption="Interface · Chips">
                  <div className="flex flex-wrap gap-2 p-5 text-sm">
                    <span className="rounded-full bg-[#E5E9DE] px-3 py-1">Baroque</span>
                    <span className="rounded-full bg-[#E1E8EE] px-3 py-1">Chamber</span>
                    <span className="rounded-full bg-[#F3E2DB] px-3 py-1">Candlelit</span>
                  </div>
                </Piece>
                <Piece caption="Interface · Controls">
                  <div className="flex items-center gap-5 p-5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#2F4031]">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#2F4031]" />
                    </span>
                    <span className="h-5 w-5 rounded-full border border-[#9C968A]" />
                    <span className="relative h-6 w-11 rounded-full bg-[#2F4031]">
                      <span className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-white" />
                    </span>
                    <span className="relative h-6 w-11 rounded-full bg-[#E3DED2]">
                      <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow" />
                    </span>
                  </div>
                </Piece>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-16 flex justify-center">
          <Ornament className="w-40 text-[#D4B06A]" />
        </footer>
      </div>
    </main>
  );
}
