import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { fontVariables } from "@/app/_themes/classical/fonts";
import { color, shadow } from "@/app/_themes/classical/tokens";

import canalettoGrandCanal from "./images/canaletto-grand-canal.jpg";
import chateau from "./images/chateau.jpg";
import engraving from "./images/engraving.jpg";
import gardens from "./images/gardens.jpg";
import lakeVilla from "./images/lake-villa.jpg";
import longhiConcert from "./images/longhi-concert.jpg";
import magnolia from "./images/magnolia.jpg";
import marbleTable from "./images/marble-table.jpg";
import mirrorHall from "./images/mirror-hall.jpg";
import mozartFamily from "./images/mozart-family.jpg";
import terraceQuartet from "./images/terrace-quartet.jpg";
import theSwing from "./images/the-swing.jpg";
import viennaBelvedere from "./images/vienna-belvedere.jpg";
import womanReading from "./images/woman-reading.jpg";
import youngGirlReading from "./images/young-girl-reading.jpg";

export const metadata: Metadata = {
  title: "Timeless Classical mood board",
};

const SERIF = "font-(family-name:--font-playfair)";
const LINK =
  "underline decoration-1 underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F2F2F]";
const TILE = "overflow-hidden rounded-[2px] bg-white";

// Paint chips: the palette as color, without the numbers. The design system has those.
const CHIPS = [
  { name: "Ivory", hex: color.ivory },
  { name: "Linen", hex: color.linen },
  { name: "Sage", hex: color.sage },
  { name: "Dusty blue", hex: color.dustyBlue },
  { name: "Terracotta", hex: color.terracotta },
  { name: "Gilt", hex: color.gold },
  { name: "Forest", hex: color.forest },
];

function Painting({ src, alt, className = "" }: { src: StaticImageData; alt: string; className?: string }) {
  return (
    <div className={`mb-4 break-inside-avoid ${TILE} ${className}`} style={{ boxShadow: shadow.card }}>
      <Image src={src} alt={alt} sizes="(min-width: 1024px) 280px, 50vw" className="h-auto w-full" />
    </div>
  );
}

function Tile({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mb-4 break-inside-avoid ${TILE} ${className}`} style={{ boxShadow: shadow.card }}>
      {children}
    </div>
  );
}

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

export default function ClassicalMoodBoard() {
  return (
    <main
      className={`${fontVariables} min-h-screen px-4 py-10 sm:px-8`}
      style={{ background: color.ivory, color: color.charcoal, fontFamily: "var(--font-source-sans)" }}
    >
      <div className="mx-auto max-w-6xl">
        <header>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            <Link href="/" className={LINK}>
              ← Home
            </Link>
            <Link href="/design-systems/classical" className={LINK}>
              Design system →
            </Link>
          </nav>
          <div className="mt-10 flex flex-col items-center text-center">
            <Ornament className="w-40 text-[#D4B06A]" />
            <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-[#5F5B52] uppercase">Mood board 2 of 3 · Classical</p>
            <h1 className={`${SERIF} mt-3 text-5xl sm:text-6xl`}>Timeless Classical</h1>
            <p className={`${SERIF} mt-4 max-w-xl text-lg text-[#5F5B52] italic`}>
              A chamber-music festival in an 18th-century palace: terraces, gilded halls, and formal
              gardens, lit like an oil painting. Quiet and unhurried.
            </p>
          </div>
        </header>

        {/* The palace and its city */}
        <div className={`relative mt-12 aspect-[16/9] sm:aspect-[2/1] ${TILE}`} style={{ boxShadow: shadow.card }}>
          <Image
            src={viennaBelvedere}
            alt="Vienna seen from the terrace of the Belvedere palace: formal gardens, fountains, and strolling figures below a wide evening sky"
            fill
            priority
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="object-cover object-[center_70%]"
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[2fr_1fr]">
          <div className={`relative aspect-[733/180] ${TILE}`} style={{ boxShadow: shadow.card }}>
            <Image
              src={terraceQuartet}
              alt="A string quartet playing on a stone terrace above formal gardens and a lake"
              fill
              sizes="(min-width: 768px) 760px, 100vw"
              className="object-cover"
            />
          </div>
          <div className={`relative aspect-[733/180] md:aspect-auto ${TILE}`} style={{ boxShadow: shadow.card }}>
            <Image
              src={marbleTable}
              alt="A festival programme lying on a marble table beside a vase of white flowers"
              fill
              sizes="(min-width: 768px) 380px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Everything else, hung together like a salon wall */}
        <section aria-label="Paintings and textures" className="mt-4 columns-2 gap-4 sm:columns-3 lg:columns-4">
          <Painting src={womanReading} alt="A woman in a blue silk gown reading on a balcony" />
          <Painting src={theSwing} alt="Fragonard's The Swing: a woman in a pink dress swinging high in a leafy garden" />
          <Painting src={gardens} alt="Formal palace gardens with cypress trees and a lake beyond" />
          <Painting src={longhiConcert} alt="Longhi's The Concert: three violinists in a candlelit Venetian salon while others play cards" />
          <Tile className="bg-[#EEE8DB]!">
            <Image src={magnolia} alt="A botanical illustration of a white magnolia branch" className="mx-auto h-auto w-full max-w-[260px]" />
          </Tile>
          <Painting src={canalettoGrandCanal} alt="Canaletto's entrance to the Grand Canal in Venice, with gondolas and the domed church of the Salute" />
          <Painting src={mirrorHall} alt="A gilded palace hall with chandeliers and tall arched windows" />
          <Tile className="bg-[#F3EFE6]!">
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <Ornament className="w-24 text-[#D4B06A]" />
              <p className={`${SERIF} mt-4 text-2xl leading-snug italic`}>Timeless music. Unforgettable places.</p>
            </div>
          </Tile>
          <Painting src={mozartFamily} alt="Carmontelle's watercolor of young Mozart at the harpsichord with his father on violin and his sister singing" />
          <Painting src={chateau} alt="A château framed by stone columns and trees" />
          <Tile>
            <svg aria-label="Marble" role="img" viewBox="0 0 300 200" className="block h-auto w-full">
              <filter id="marble-veins">
                <feTurbulence type="turbulence" baseFrequency="0.006 0.022" numOctaves="5" seed="11" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.47  0 0 0 0 0.45  0 0 0 0 0.42  -2.4 0 0 0 1.05" />
              </filter>
              <rect width="300" height="200" fill="#F1EDE4" />
              <rect width="300" height="200" filter="url(#marble-veins)" opacity="0.55" />
            </svg>
          </Tile>
          <Painting src={youngGirlReading} alt="Fragonard's Young Girl Reading: a girl in a yellow dress absorbed in a small book" />
          <Painting src={lakeVilla} alt="A villa beside a lake with mountains behind, seen past a stone urn" />
          <Tile className="bg-[#EFEADF]!">
            <div className="flex items-center justify-center p-5">
              <div className="border-[5px] border-[#D4B06A] p-1 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]">
                <div className="border border-[#D4B06A] bg-white p-2">
                  <Image src={engraving} alt="Engraving of a palace and its grounds in a gilt frame" className="h-auto w-full" />
                </div>
              </div>
            </div>
          </Tile>
          <Tile>
            <div
              aria-label="Laid paper"
              role="img"
              className="aspect-[4/3]"
              style={{
                backgroundColor: "#F6F1E6",
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(47,47,47,0.035) 0 1px, transparent 1px 5px), repeating-linear-gradient(90deg, rgba(47,47,47,0.06) 0 1px, transparent 1px 38px)",
              }}
            />
          </Tile>
        </section>

        {/* Paint chips */}
        <ul aria-label="Colors" className="mt-8 grid grid-cols-4 gap-4 sm:grid-cols-7">
          {CHIPS.map((c) => (
            <li key={c.name}>
              <div
                className="aspect-[3/4] rounded-[2px]"
                style={{
                  background: `linear-gradient(170deg, rgba(255,255,255,0.18), rgba(0,0,0,0.06)), ${c.hex}`,
                  boxShadow: `${shadow.card}, inset 0 0 0 1px rgba(47,47,47,0.08)`,
                }}
              />
              <p className={`${SERIF} mt-2 text-center italic`}>{c.name}</p>
            </li>
          ))}
        </ul>

        <footer className="mt-16 flex flex-col items-center gap-4 text-center">
          <Ornament className="w-40 text-[#D4B06A]" />
          <p className="max-w-xl text-sm text-[#5F5B52]">
            Paintings by Bernardo Bellotto, Jean-Honoré Fragonard, Pietro Longhi, Canaletto, and
            Louis Carrogis Carmontelle, in the public domain via Wikimedia Commons.
          </p>
        </footer>
      </div>
    </main>
  );
}
