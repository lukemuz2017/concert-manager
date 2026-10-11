import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { fontVariables } from "@/app/_themes/avatar/fonts";
import { color } from "@/app/_themes/avatar/tokens";

import banner from "./images/banner.jpg";
import cliffCity from "./images/cliff-city.jpg";
import elementAir from "./images/element-air.jpg";
import elementEarth from "./images/element-earth.jpg";
import elementFire from "./images/element-fire.jpg";
import elementWater from "./images/element-water.jpg";
import eveningFestival from "./images/evening-festival.jpg";
import festivalPoster from "./images/festival-poster.jpg";
import fireNationFleet from "./images/fire-nation-fleet.jpg";
import foodCabbage from "./images/food-cabbage.jpg";
import foodEarth from "./images/food-earth.jpg";
import foodFireGrill from "./images/food-fire-grill.jpg";
import foodWater from "./images/food-water.jpg";
import friends from "./images/friends.jpg";
import inkSketches from "./images/ink-sketches.jpg";
import keepFan from "./images/keep-fan.jpg";
import keepPassport from "./images/keep-passport.jpg";
import keepPins from "./images/keep-pins.jpg";
import map from "./images/map.jpg";
import market from "./images/market.jpg";
import merchBandana from "./images/merch-bandana.jpg";
import sunsetMeadow from "./images/MINE-anime_landscape.webp";
import northernWaterTribe from "./images/MINE-northern-Water-tribe.jpg";
import omashu from "./images/MINE-OMASHU.webp";
import southernAirTemple from "./images/MINE-southern_air_temple.jpg";

export const metadata: Metadata = {
  title: "Four Nations mood board",
};

const ELEMENTS = [
  { src: elementWater, alt: "Water: an island fortress rising from a blue sea" },
  { src: elementEarth, alt: "Earth: a stone citadel on a dusty plain" },
  { src: elementFire, alt: "Fire: a palace before an erupting volcano" },
  { src: elementAir, alt: "Air: a temple floating among clouds" },
];

const TILE = "overflow-hidden rounded-md shadow-[0_1px_2px_rgba(43,43,43,0.08),0_10px_24px_-14px_rgba(43,43,43,0.35)]";

// A photo at its own shape, in the masonry.
function Photo({ src, alt }: { src: StaticImageData; alt: string }) {
  return (
    <div className={`mb-3 break-inside-avoid ${TILE}`}>
      <Image src={src} alt={alt} sizes="(min-width: 1024px) 230px, 50vw" className="h-auto w-full" />
    </div>
  );
}

// A photo cropped to a set shape, when its full frame doesn't suit the wall.
function Cropped({ src, alt, aspect, children }: { src: StaticImageData; alt: string; aspect: string; children?: ReactNode }) {
  return (
    <div className={`relative mb-3 break-inside-avoid ${TILE}`} style={{ aspectRatio: aspect }}>
      {children ?? <Image src={src} alt={alt} fill sizes="230px" className="object-cover object-top" />}
    </div>
  );
}

// Keepsakes are small product shots: shown at their own size on a parchment card.
function Keepsake({ src, alt }: { src: StaticImageData; alt: string }) {
  return (
    <div className={`mb-3 flex break-inside-avoid justify-center bg-[#F1E9DB] px-4 py-6 ${TILE}`}>
      {/* darken lets the photo's own paper background melt into the card */}
      <Image src={src} alt={alt} className="h-auto max-w-full mix-blend-darken" />
    </div>
  );
}

export default function AvatarMoodBoard() {
  return (
    <main
      className={`${fontVariables} min-h-screen px-4 py-10 sm:px-8`}
      style={{ background: color.parchment, color: color.ink, fontFamily: "var(--font-alegreya-sans)" }}
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
          <Link
            href="/"
            className="font-medium underline decoration-2 underline-offset-4 hover:decoration-4 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B2B2B]"
          >
            ← Home
          </Link>
          <p className="text-xs font-medium tracking-[0.25em] text-[#5C5650] uppercase">Mood board 3 of 3 · Four Nations</p>
        </header>

        <h1 className="sr-only">The Four Nations Music Festival</h1>

        {/* The festival poster, at full size, beside the four elements */}
        <section aria-label="The festival" className="grid gap-3 lg:grid-cols-[757fr_503fr]">
          <div className={`relative aspect-[757/383] ${TILE}`}>
            <Image
              src={festivalPoster}
              alt="The Four Nations Music Festival: four elements, one stage. A monk in saffron robes watches a festival stage glowing in a valley below a cliffside castle at sunset."
              fill
              priority
              sizes="(min-width: 1024px) 680px, 100vw"
              className="object-cover"
            />
          </div>
          <div className={`grid grid-cols-4 ${TILE}`}>
            {ELEMENTS.map((e) => (
              <div key={e.alt} className="relative aspect-[125/383] lg:aspect-auto">
                <Image src={e.src} alt={e.alt} fill sizes="125px" className="object-cover object-[center_85%]" />
              </div>
            ))}
          </div>
        </section>

        {/* Everything else, side by side: places, food, and keepsakes */}
        <section aria-label="Mood" className="mt-3 columns-2 gap-3 sm:columns-3 lg:columns-5">
          <Photo src={eveningFestival} alt="A festival at dusk: banners, tents, and a glowing stage below mountain castles" />
          <Photo src={foodCabbage} alt="A grinning merchant holding cabbages at his dumpling stall" />
          <Photo src={southernAirTemple} alt="The Southern Air Temple on its peak above the clouds" />
          <Keepsake src={keepPins} alt="Four enamel pins, one for each element" />
          <Cropped src={omashu} alt="Omashu, a mountain city of sand-colored stone with green tiled roofs" aspect="2 / 3" />
          <Photo src={market} alt="Lanterns and pagoda roofs over a festival market" />
          <Photo src={foodFireGrill} alt="A steaming bowl of noodles at a lantern-lit stall" />
          <Keepsake src={merchBandana} alt="A navy bandana with a water emblem and a patterned border" />
          <Photo src={fireNationFleet} alt="Fire Nation ships and soldiers silhouetted against a red sky" />
          <Photo src={friends} alt="Four friends sitting under a tree, looking over a valley" />
          <Photo src={foodWater} alt="A Water Tribe vendor pouring drinks under blue banners" />
          <Keepsake src={keepFan} alt="A paper fan painted with a pagoda in the mountains" />
          <Photo src={northernWaterTribe} alt="The Northern Water Tribe, a city of ice canals and walls" />
          {/* Drawn 20% taller than its tile so the stock ID along the bottom is cut off. */}
          <Cropped src={sunsetMeadow} alt="A meadow under a pink and gold sunset sky" aspect="455 / 240">
            <div className="absolute inset-x-0 top-0 h-[120%]">
              <Image src={sunsetMeadow} alt="A meadow under a pink and gold sunset sky" fill sizes="230px" className="object-cover object-top" />
            </div>
          </Cropped>
          <Photo src={foodEarth} alt="A smiling vendor beside trays of pastries and buns" />
          <Keepsake src={keepPassport} alt="A leather-bound festival passport with a gold emblem" />
          <Photo src={cliffCity} alt="A castle of towers built into a cliff, waterfalls below" />
          <Photo src={map} alt="An old map of the four nations on a parchment scroll" />
          <Photo src={inkSketches} alt="Ink sketches of an airbender with a staff and a pagoda on a mountain" />
          <Photo src={banner} alt="A red Fire Nation banner on a wooden pole against the sky" />
        </section>
      </div>
    </main>
  );
}
