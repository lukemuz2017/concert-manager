"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import elementAir from "@/app/mood-boards/avatar/images/element-air.jpg";
import elementEarth from "@/app/mood-boards/avatar/images/element-earth.jpg";
import elementFire from "@/app/mood-boards/avatar/images/element-fire.jpg";
import elementWater from "@/app/mood-boards/avatar/images/element-water.jpg";
import stagePosters from "@/app/mood-boards/avatar/images/STAGE_POSTERS.png";

import { STAGES, walkMinutes, type Stage } from "./lineup";
import { ELEMENT_ORDER, ELEMENTS, SHAPE, TYPE, type ElementKey } from "./tokens";
import { FOCUS, NationMark, useElement } from "./ui";

// The festival page: what the festival is for, the four nations' banners, and the six
// stages. The banners' source images carry a title along the bottom; the frame crops it
// off. The stages all come from one painted sheet, each cropped out of it by position.

const BANNERS: Record<ElementKey, { image: StaticImageData; alt: string }> = {
  water: { image: elementWater, alt: "A mountain fortress rising from the sea, a sailing ship at anchor below it." },
  earth: { image: elementEarth, alt: "A walled red-brick city beneath smoky mountains." },
  fire: { image: elementFire, alt: "A pagoda before an erupting volcano at sunset." },
  air: { image: elementAir, alt: "A temple floating among the clouds." },
};

// Where each stage's painting sits on the sheet (in its pixels), and its line.
const CROP = { w: 470, h: 250 };
const STAGE_ART: Record<Stage["name"], { x: number; y: number; kind: string; line: string; alt: string }> = {
  "Spirit Oasis": {
    x: 28,
    y: 134,
    kind: "Water Tribe stage",
    line: "Flowing melodies. Open hearts. A place to be in the moment.",
    alt: "A round stage in a pool beneath waterfalls, glowing spirit fish in the air.",
  },
  "Crystal Catacombs": {
    x: 532,
    y: 134,
    kind: "Earth Kingdom stage",
    line: "Deep rhythms. Solid ground. Music that moves you.",
    alt: "A stage in a cavern of violet crystals, lit by braziers, a crowd below.",
  },
  "Wan Shi Tong's Library": {
    x: 1038,
    y: 134,
    kind: "Library stage",
    line: "Ancient sounds. Endless stories. A journey through time.",
    alt: "A stage beneath a great carved owl, among tall bookshelves open to the desert.",
  },
  "Royal Caldera": {
    x: 28,
    y: 557,
    kind: "Fire Nation stage",
    line: "Bold sounds. Fierce energy. Feel the fire.",
    alt: "A stage hung with red banners inside a volcano, lava glowing behind the crowd.",
  },
  "Ember Island": {
    x: 532,
    y: 557,
    kind: "Fire Nation stage",
    line: "Warm winds. Rising beats. A little closer to the sun.",
    alt: "A round beach stage among palm trees and red banners at sunset.",
  },
  "Western Air Temple": {
    x: 1038,
    y: 557,
    kind: "Air Nomad stage",
    line: "Light as clouds. Free as the wind. Let the music lift you.",
    alt: "A white temple floating above the clouds, a round stage on its terrace.",
  },
};

function StageArt({ name }: { name: Stage["name"] }) {
  const art = STAGE_ART[name];
  return (
    <span className="relative block aspect-[470/250] overflow-hidden">
      <Image
        src={stagePosters}
        alt={art.alt}
        sizes="(min-width: 1024px) 1150px, (min-width: 640px) 160vw, 330vw"
        className="absolute max-w-none"
        style={{
          width: `${(stagePosters.width / CROP.w) * 100}%`,
          height: "auto",
          left: `${(-art.x / CROP.w) * 100}%`,
          top: `${(-art.y / CROP.h) * 100}%`,
        }}
      />
    </span>
  );
}

// A stage: its painting, its nation, its line, and how far it is from the gate.
export function StageCard({ stage }: { stage: Stage }) {
  const art = STAGE_ART[stage.name];
  return (
    <div className={`h-full overflow-hidden border-[1.5px] border-(--ink) bg-(--paper) ${SHAPE.card}`}>
      <StageArt name={stage.name} />
      <div className="border-t-[1.5px] border-(--ink) p-5">
        <h3 className={`flex items-center gap-2.5 ${TYPE.heading}`}>
          <NationMark nation={stage.nation} className="h-7 w-7" />
          {stage.name}
        </h3>
        <p className={`mt-1 ${TYPE.label} text-(--ink-muted)`}>{art.kind}</p>
        <p className="mt-3 italic">{art.line}</p>
        <p className="mt-3 text-sm text-(--ink-muted)">{walkMinutes("gate", stage.name)} min walk from the main gate</p>
      </div>
    </div>
  );
}

export function FestivalPage() {
  const { setElement } = useElement();
  return (
    <main className="mx-auto max-w-6xl px-4 pt-10 pb-20 sm:px-8">
      <h1 className={TYPE.display}>The festival</h1>
      <div className="mt-4 max-w-3xl space-y-3 leading-relaxed sm:text-lg">
        <p>
          Four elements. One stage. For four days the nations set their old quarrels down in one valley and
          answer each other in music: the Water Tribe on Thursday, the Earth Kingdom on Friday, the Fire
          Nation on Saturday, and the Air Nomads on Sunday.
        </p>
        <p>Music, community, balance. Come for one nation; leave knowing all four.</p>
      </div>

      <ul aria-label="The four nations" className="mt-10 grid grid-cols-2 justify-items-center gap-x-4 gap-y-10 md:grid-cols-4">
        {ELEMENT_ORDER.map((key) => {
          const el = ELEMENTS[key];
          const banner = BANNERS[key];
          return (
            <li key={key}>
              {/* Pointing at a banner takes on its element; following it opens that day's lineup. */}
              <Link
                href={`/planner#${key}`}
                onMouseEnter={() => setElement(key)}
                onFocus={() => setElement(key)}
                className={`group block rounded-sm ${FOCUS}`}
              >
                <span
                  className={`relative block aspect-[5/13] w-[min(42vw,11rem)] overflow-hidden border-[1.5px] border-(--ink) ${SHAPE.card} transition-transform duration-(--el-dur) ease-(--el-ease) group-hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0`}
                >
                  <Image src={banner.image} alt={banner.alt} fill sizes="(min-width: 768px) 176px, 42vw" className="object-cover object-top" />
                </span>
                <span className={`mt-4 block ${TYPE.label} text-(--ink-muted)`}>{el.dayName}</span>
                <span
                  className="mt-1 block text-lg font-bold underline decoration-2 underline-offset-[6px] group-hover:decoration-wavy group-hover:underline-offset-[8px]"
                  style={{ textDecorationColor: el.line }}
                >
                  {el.nation}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <section aria-labelledby="stages-title" className="mt-20">
        <h2 id="stages-title" className={TYPE.heading}>
          The stages
        </h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STAGES.map((stage) => {
            return (
              <li key={stage.name}>
                <StageCard stage={stage} />
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
