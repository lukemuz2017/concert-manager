import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { contrast, grade } from "@/app/_lib/contrast";
import { fontVariables } from "@/app/_themes/avatar/fonts";
import { LINEUP } from "@/app/_themes/avatar/lineup";
import { color, ELEMENT_ORDER, ELEMENTS, elementVars, SHAPE, TYPE } from "@/app/_themes/avatar/tokens";
import {
  AddButton,
  Badge,
  Button,
  Checkbox,
  ClashNotice,
  CloseIcon,
  ElementScope,
  Emblem,
  FlagButton,
  IconButton,
  NationMark,
  Radio,
  Seal,
  RemovableChip,
  TextField,
  TextLink,
  Toggle,
} from "@/app/_themes/avatar/ui";

import { LiveComponents, ModeSwitcher, MotionLab } from "./_live";

export const metadata: Metadata = {
  title: "Four Nations design system",
};

const LINK = `rounded-sm font-medium underline decoration-(--el-line) decoration-2 underline-offset-[5px] hover:decoration-wavy hover:underline-offset-[8px] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-(--ink)`;
const NUMERALS = ["一", "二", "三", "四", "五", "六", "七"];

/* 一 · Color ------------------------------------------------------------------ */

type Check = { on: string; fg: string; bg: string; kind?: "text" | "ui" };

const BASE_ROLES: { role: string; name: string; hex: string; use: string; checks: Check[] }[] = [
  {
    role: "Background",
    name: "Parchment",
    hex: color.parchment,
    use: "The page.",
    checks: [
      { on: "Ink", fg: color.ink, bg: color.parchment },
      { on: "Muted ink", fg: color.inkMuted, bg: color.parchment },
    ],
  },
  {
    role: "Surface",
    name: "Paper",
    hex: color.paper,
    use: "Cards, fields, scrolls.",
    checks: [
      { on: "Ink", fg: color.ink, bg: color.paper },
      { on: "Muted ink", fg: color.inkMuted, bg: color.paper },
    ],
  },
  {
    role: "Text & chosen",
    name: "Ink",
    hex: color.ink,
    use: "Words and linework, and the fill for what you've chosen: the journey button and side tab, applied filters, a set once it's on your journey.",
    checks: [
      { on: "On parchment", fg: color.ink, bg: color.parchment },
      { on: "Paper text on ink", fg: color.paper, bg: color.ink },
    ],
  },
  {
    role: "Muted",
    name: "Faded ink",
    hex: color.inkMuted,
    use: "Times, stages, captions.",
    checks: [{ on: "On parchment", fg: color.inkMuted, bg: color.parchment }],
  },
  {
    role: "Border",
    name: "Pencil line",
    hex: color.line,
    use: "Edges you must see: fields, chips, checkboxes.",
    checks: [
      { on: "On parchment", fg: color.line, bg: color.parchment, kind: "ui" },
      { on: "On paper", fg: color.line, bg: color.paper, kind: "ui" },
    ],
  },
];

/* 二 · Type ------------------------------------------------------------------- */

const TYPE_ROLES = [
  {
    role: "Display",
    spec: "Permanent Marker · 56 / 59, 40 on phones",
    use: "Page titles and the festival name.",
    sample: <p className={TYPE.display}>The Four Nations</p>,
  },
  {
    role: "Heading",
    spec: "Permanent Marker · 24 / 33",
    use: "Artist names, section titles, notices.",
    sample: <p className={TYPE.heading}>The Ember Island Players</p>,
  },
  {
    role: "Body",
    spec: "Alegreya Sans · Regular 400, Medium 500, Bold 700 · 16 / 26",
    use: "Everything you read.",
    sample: (
      <p className={`max-w-prose ${TYPE.body}`}>
        Monk Gyatso plays the Western Air Temple until 6:45, and Kuzon&apos;s Crew start at 7:00 across the grounds.
        Leave <b>ten minutes before the end</b>, or miss the opening.
      </p>
    ),
  },
  {
    role: "Label",
    spec: "Alegreya Sans · Medium 500 · 12 / 16 · caps, +0.25em",
    use: "Days, times, form labels.",
    sample: <p className={TYPE.label}>Sat · 7:00 PM · Ember Island</p>,
  },
  {
    role: "Glyph",
    spec: "Ma Shan Zheng · brush · only the four element characters",
    use: "Element marks and the clash seal. Never words.",
    sample: (
      <p lang="zh-Hant" className={`${TYPE.glyph} text-5xl tracking-[0.2em]`}>
        水土火氣
      </p>
    ),
  },
];

/* 三 · Shape ------------------------------------------------------------------ */

const SPACING = [
  [4, "An emblem to its word"],
  [8, "Between chips"],
  [12, "Inside rows"],
  [16, "Inside fields and buttons"],
  [24, "Inside cards"],
  [40, "Between sections"],
] as const;

/* 六 · Control states --------------------------------------------------------- */

const STATE_NAMES = ["Rest", "Hover", "Focus", "Pressed", "Selected", "Disabled"];

const MATRIX: { name: string; cells: (ReactNode | null)[] }[] = [
  {
    name: "Primary button",
    cells: [
      <Button key="rest">Add</Button>,
      <Button key="hover" force="hover">Add</Button>,
      <Button key="focus" force="focus">Add</Button>,
      <Button key="pressed" force="pressed">Add</Button>,
      <AddButton key="selected" added addedLabel="Added" />,
      <Button key="disabled" disabled>Add</Button>,
    ],
  },
  {
    name: "Secondary button",
    cells: [
      <Button key="rest" variant="secondary">Map</Button>,
      <Button key="hover" variant="secondary" force="hover">Map</Button>,
      <Button key="focus" variant="secondary" force="focus">Map</Button>,
      <Button key="pressed" variant="secondary" force="pressed">Map</Button>,
      null,
      <Button key="disabled" variant="secondary" disabled>Map</Button>,
    ],
  },
  {
    name: "Interested flag",
    cells: [
      <FlagButton key="rest" flagged={false} />,
      <FlagButton key="hover" flagged={false} force="hover" />,
      <FlagButton key="focus" flagged={false} force="focus" />,
      <FlagButton key="pressed" flagged={false} force="pressed" />,
      <FlagButton key="selected" flagged />,
      <FlagButton key="disabled" flagged={false} disabled />,
    ],
  },
  {
    name: "Icon button",
    cells: [
      <IconButton key="rest" label="Close"><CloseIcon /></IconButton>,
      <IconButton key="hover" label="Close" force="hover"><CloseIcon /></IconButton>,
      <IconButton key="focus" label="Close" force="focus"><CloseIcon /></IconButton>,
      <IconButton key="pressed" label="Close" force="pressed"><CloseIcon /></IconButton>,
      null,
      <IconButton key="disabled" label="Close" disabled><CloseIcon /></IconButton>,
    ],
  },
  {
    name: "Filter chip",
    cells: [
      <RemovableChip key="rest" label="Fire Nation" />,
      <RemovableChip key="hover" label="Fire Nation" force="hover" />,
      <RemovableChip key="focus" label="Fire Nation" force="focus" />,
      <RemovableChip key="pressed" label="Fire Nation" force="pressed" />,
      null,
      <RemovableChip key="disabled" label="Fire Nation" disabled />,
    ],
  },
  {
    name: "Checkbox",
    cells: [
      <Checkbox key="rest" label="Mine" />,
      <Checkbox key="hover" label="Mine" force="hover" />,
      <Checkbox key="focus" label="Mine" force="focus" />,
      null,
      <Checkbox key="selected" label="Mine" defaultChecked />,
      <Checkbox key="disabled" label="Mine" disabled />,
    ],
  },
  {
    name: "Radio",
    cells: [
      <Radio key="rest" label="All" />,
      <Radio key="hover" label="All" force="hover" />,
      <Radio key="focus" label="All" force="focus" />,
      null,
      <Radio key="selected" label="All" defaultChecked />,
      <Radio key="disabled" label="All" disabled />,
    ],
  },
  {
    name: "Toggle",
    cells: [
      <Toggle key="rest" label="Warn" checked={false} />,
      <Toggle key="hover" label="Warn" checked={false} force="hover" />,
      <Toggle key="focus" label="Warn" checked={false} force="focus" />,
      null,
      <Toggle key="selected" label="Warn" checked />,
      <Toggle key="disabled" label="Warn" checked={false} disabled />,
    ],
  },
  {
    name: "Text input",
    cells: [
      <TextField key="rest" label="Search" hideLabel placeholder="Dragon" />,
      <TextField key="hover" label="Search" hideLabel placeholder="Dragon" force="hover" />,
      <TextField key="focus" label="Search" hideLabel placeholder="Dragon" force="focus" />,
      null,
      null,
      <TextField key="disabled" label="Search" hideLabel placeholder="Dragon" disabled />,
    ],
  },
  {
    name: "Link",
    cells: [
      <TextLink key="rest" href="/mood-boards/avatar">Mood board</TextLink>,
      <TextLink key="hover" href="/mood-boards/avatar" force="hover">Mood board</TextLink>,
      <TextLink key="focus" href="/mood-boards/avatar" force="focus">Mood board</TextLink>,
      null,
      null,
      null,
    ],
  },
];

/* Page ------------------------------------------------------------------------ */

function Section({
  id,
  n,
  title,
  intro,
  children,
}: {
  id: string;
  n: number;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-16 scroll-mt-24">
      <div className="flex items-end gap-4 border-b-[1.5px] border-(--ink) pb-3">
        <span aria-hidden="true" lang="zh-Hant" className={`${TYPE.glyph} text-5xl text-(--el-line)`}>
          {NUMERALS[n - 1]}
        </span>
        <div>
          <p className={`${TYPE.label} text-(--ink-muted)`}>{n} of 7</p>
          <h2 id={`${id}-title`} className={TYPE.heading}>
            {title}
          </h2>
        </div>
      </div>
      <p className="mt-3 max-w-2xl text-(--ink-muted)">{intro}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Ratio({ fg, bg, kind = "text" }: { fg: string; bg: string; kind?: "text" | "ui" }) {
  const r = contrast(fg, bg);
  return (
    <span className="font-bold tabular-nums">
      <span className="whitespace-nowrap">{r.toFixed(2)}:1</span> · {grade(r, kind)}
    </span>
  );
}

function Card({ className = "", style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <div className={`border-[1.5px] border-(--ink) bg-(--paper) p-5 ${SHAPE.card} ${className}`} style={style}>
      {children}
    </div>
  );
}

export default function FourNationsDesignSystem() {
  const players = LINEUP.find((s) => s.artist === "The Ember Island Players")!;
  const sages = LINEUP.find((s) => s.artist === "Kuzon's Crew")!;
  const healers = LINEUP.find((s) => s.artist === "Bato's Boat")!;

  return (
    <ElementScope initial="fire" className={`${fontVariables} min-h-screen bg-(--parchment) text-(--ink)`} style={{ fontFamily: "var(--font-alegreya-sans)" }}>
      <main className="px-4 pb-20 sm:px-8">
        <ModeSwitcher />

        <div className="mx-auto max-w-6xl">
          <header className="pt-8">
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/" className={LINK}>
                ← Home
              </Link>
              <Link href="/mood-boards/avatar" className={LINK}>
                Mood board
              </Link>
            </nav>
            <p className={`mt-8 ${TYPE.label} text-(--ink-muted)`}>Design system 3 of 3 · Four Nations</p>
            <h1 className={`mt-2 ${TYPE.display}`}>The Four Nations</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed">
              A planner that changes with the day. Each festival day belongs to an element, and the
              interface takes it on: its color, its emblem, and the way everything moves.
            </p>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              <li>
                <Card className="h-full">
                  <p className={TYPE.heading}>The element is for what&rsquo;s next</p>
                  <p className="mt-2 text-(--ink-muted)">
                    The day&rsquo;s color marks the one thing to do. Once it&rsquo;s done, it turns to ink.
                  </p>
                  <div inert className="mt-4 flex flex-wrap gap-3 pb-1">
                    <AddButton added={false} label="Add" />
                    <AddButton added addedLabel="Added" />
                  </div>
                </Card>
              </li>
              <li>
                <Card className="h-full">
                  <p className={TYPE.heading}>Color is the day, the emblem is the nation</p>
                  <p className="mt-2 text-(--ink-muted)">
                    Every artist wears their nation&rsquo;s emblem and an underline in its color. The name
                    itself stays ink, so it can always be read.
                  </p>
                  <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-bold uppercase">
                    {(["Kyoshi Warriors", "Sun Warriors"] as const).map((artist, i) => {
                      const nation = i === 0 ? "earth" : "fire";
                      return (
                        <span
                          key={artist}
                          className="inline-flex items-center gap-1.5 underline decoration-[3px] underline-offset-[6px]"
                          style={{ textDecorationColor: ELEMENTS[nation].line }}
                        >
                          <NationMark nation={nation} className="h-4 w-4" />
                          {artist}
                        </span>
                      );
                    })}
                  </p>
                </Card>
              </li>
              <li>
                <Card className="h-full">
                  <p className={TYPE.heading}>Everything bends</p>
                  <p className="mt-2 text-(--ink-muted)">
                    Water flows, earth thuds, fire strikes, air drifts. Reduced motion stills them all.
                  </p>
                  <div className="mt-4 flex gap-3">
                    {ELEMENT_ORDER.map((key) => (
                      <span key={key} style={{ color: ELEMENTS[key].line }}>
                        <Emblem element={key} className="h-8 w-8" />
                      </span>
                    ))}
                  </div>
                </Card>
              </li>
            </ul>
          </header>

          {/* 一 · Color */}
          <Section
            id="color"
            n={1}
            title="Color"
            intro="Five fixed roles, then four element modes that swap with the day. Every ratio is calculated from the hex values: text needs 4.5:1, lines you must see need 3:1."
          >
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {BASE_ROLES.map((r) => (
                <li key={r.role}>
                  <Card className="flex h-full flex-col p-3!">
                    <div className="h-16 rounded-[10px_8px_12px_9px] border-[1.5px] border-(--ink)" style={{ background: r.hex }} />
                    <div className="flex flex-1 flex-col px-1 pt-3">
                      <p className={`${TYPE.label} text-(--ink-muted)`}>{r.role}</p>
                      <p className="font-bold">
                        {r.name} <span className="font-normal text-(--ink-muted)">{r.hex}</span>
                      </p>
                      <p className="mt-1 mb-3 text-sm text-(--ink-muted)">{r.use}</p>
                      <ul className="mt-auto space-y-1 border-t-[1.5px] border-dashed border-(--line) pt-2 text-sm">
                        {r.checks.map((c) => (
                          <li key={c.on} className="flex justify-between gap-2">
                            <span>{c.on}</span>
                            <Ratio fg={c.fg} bg={c.bg} kind={c.kind} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>

            <h3 className={`mt-12 ${TYPE.heading}`}>Element modes</h3>
            <p className="mt-1 max-w-2xl text-(--ink-muted)">
              Each mode brings a fill for the day&rsquo;s action, a label color chosen by contrast, a line
              for drawing on parchment, and a wash. Air&rsquo;s saffron can&rsquo;t carry white, so it is
              the one mode with ink labels and a deeper saffron line.
            </p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ELEMENT_ORDER.map((key) => {
                const el = ELEMENTS[key];
                return (
                  <li key={key} style={elementVars(key)}>
                    <Card className="h-full">
                      <div className="flex items-center justify-between">
                        <p className={TYPE.heading}>{el.name}</p>
                        <span style={{ color: el.line }}>
                          <Emblem element={key} className="h-8 w-8" />
                        </span>
                      </div>
                      <p className={`${TYPE.label} text-(--ink-muted)`}>
                        {el.dayName} · {el.nation}
                      </p>
                      <div className={`mt-4 flex h-14 items-center justify-center border-[1.5px] border-(--ink) font-medium ${SHAPE.button}`} style={{ background: el.fill, color: el.on }}>
                        Add to my journey
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <span className="flex h-10 items-center justify-center rounded-md border-[1.5px] border-(--ink)" style={{ background: el.wash }}>
                          Wash {el.wash}
                        </span>
                        <span className="flex h-10 items-center justify-center rounded-md border-[3px]" style={{ borderColor: el.line }}>
                          Line {el.line}
                        </span>
                      </div>
                      <ul className="mt-4 space-y-1 border-t-[1.5px] border-dashed border-(--line) pt-2 text-sm">
                        <li className="flex justify-between gap-2">
                          <span>Label on fill</span>
                          <Ratio fg={el.on} bg={el.fill} />
                        </li>
                        <li className="flex justify-between gap-2">
                          <span>Line on parchment</span>
                          <Ratio fg={el.line} bg={color.parchment} kind="ui" />
                        </li>
                        <li className="flex justify-between gap-2">
                          <span>Ink on wash</span>
                          <Ratio fg={color.ink} bg={el.wash} />
                        </li>
                      </ul>
                    </Card>
                  </li>
                );
              })}
            </ul>

            <Card className="mt-6 flex flex-wrap items-center gap-4">
              <Seal className="h-12 w-12 text-3xl" />
              <div className="min-w-0 flex-1">
                <p className={TYPE.heading}>The clash seal is always ink</p>
                <p className="text-(--ink-muted)">
                  A red seal would vanish on a fire day. In ink, a clash looks the same in every mode, and
                  no element&rsquo;s color is ever mistaken for a warning.
                </p>
              </div>
            </Card>
          </Section>

          {/* 二 · Type */}
          <Section
            id="type"
            n={2}
            title="Type"
            intro="A brush marker for names and moments, a calligraphic sans for everything you read, and brush characters for the four elements only."
          >
            <Card className="px-5! py-0! sm:px-8!">
              <ul>
                {TYPE_ROLES.map((t) => (
                  <li
                    key={t.role}
                    className="grid gap-3 border-t-[1.5px] border-dashed border-(--line) py-6 first:border-t-0 sm:grid-cols-[260px_1fr] sm:gap-10"
                  >
                    <div>
                      <p className={`${TYPE.label} text-(--ink-muted)`}>{t.role}</p>
                      <p className="mt-1 font-bold">{t.spec}</p>
                      <p className="text-(--ink-muted)">{t.use}</p>
                    </div>
                    <div className="flex items-center">{t.sample}</div>
                  </li>
                ))}
              </ul>
            </Card>
          </Section>

          {/* 三 · Shape */}
          <Section
            id="shape"
            n={3}
            title="Spacing, shape & line"
            intro="Hand-cut paper and drawn ink. Nothing here is lit: there are no shadows, only lines."
          >
            <div className="grid gap-5 lg:grid-cols-2">
              <Card>
                <h3 className={TYPE.label}>Spacing</h3>
                <ul className="mt-5 space-y-3">
                  {SPACING.map(([px, use]) => (
                    <li key={px} className="grid grid-cols-[2.5rem_3.5rem_1fr] items-center gap-3">
                      <span className="text-right font-bold tabular-nums">{px}</span>
                      <span className="h-3 rounded-full bg-(--ink)" style={{ width: px }} />
                      <span className="text-(--ink-muted)">{use}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card>
                <h3 className={TYPE.label}>Hand-cut corners</h3>
                <p className="mt-2 text-(--ink-muted)">No two corners are the same, like paper torn by hand.</p>
                <div className="mt-5 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className={`h-16 border-[1.5px] border-(--ink) bg-(--parchment) ${SHAPE.card}`} />
                    <p className="mt-2 font-bold">Card</p>
                    <p className="text-(--ink-muted)">18 · 14 · 20 · 12</p>
                  </div>
                  <div>
                    <div className={`h-16 border-[1.5px] border-(--ink) bg-(--parchment) ${SHAPE.button}`} />
                    <p className="mt-2 font-bold">Button &amp; chip</p>
                    <p className="text-(--ink-muted)">22 · 16 · 24 · 18</p>
                  </div>
                  <div>
                    <div className={`h-16 border-[1.5px] border-(--ink) bg-(--parchment) ${SHAPE.field}`} />
                    <p className="mt-2 font-bold">Field</p>
                    <p className="text-(--ink-muted)">10 · 8 · 11 · 9</p>
                  </div>
                </div>
              </Card>
              <Card>
                <h3 className={TYPE.label}>Lines</h3>
                <ul className="mt-5 space-y-4">
                  <li className="flex items-center gap-4">
                    <span className="h-0 w-20 border-t-[1.5px] border-(--ink)" />
                    <span>
                      <b>Ink, 1.5px</b> <span className="text-(--ink-muted)">· drawn edges of cards and buttons</span>
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="h-0 w-20 border-t-[1.5px] border-(--line)" />
                    <span>
                      <b>Pencil, 1.5px</b> <span className="text-(--ink-muted)">· fields and unselected chips</span>
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="h-0 w-20 border-t-[1.5px] border-dashed border-(--line)" />
                    <span>
                      <b>Dashed</b> <span className="text-(--ink-muted)">· between rows; the tight-walk badge</span>
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="h-0 w-20 border-t-[1.5px] border-dotted border-(--line)" />
                    <span>
                      <b>Dotted</b> <span className="text-(--ink-muted)">· disabled: a pencil sketch, not yet drawn</span>
                    </span>
                  </li>
                </ul>
              </Card>
              <Card>
                <h3 className={TYPE.label}>Depth</h3>
                <p className="mt-2 text-(--ink-muted)">The world is drawn, not lit. Layers are paper on paper, outlined in ink.</p>
                <div className="mt-5 grid grid-cols-2 gap-5 text-sm">
                  <div>
                    <div className={`flex h-20 items-center justify-center border-[1.5px] border-(--ink) bg-(--paper) ${SHAPE.card}`}>
                      <span className={TYPE.label}>Drawn</span>
                    </div>
                    <p className="mt-2 font-bold">This</p>
                  </div>
                  <div>
                    <div className="flex h-20 items-center justify-center rounded-xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                      <span className={TYPE.label}>Lit</span>
                    </div>
                    <p className="mt-2 font-bold">Not this</p>
                  </div>
                </div>
              </Card>
            </div>
          </Section>

          {/* 四 · Bending */}
          <Section
            id="motion"
            n={4}
            title="Bending: motion"
            intro="Every element moves its own way. Buttons bend big: water rocks and ripples, earth quakes and slams, fire flares and bursts, air floats and twirls. Hover and press each one. Chips and small controls borrow the same easing, quietly. With reduced motion turned on, nothing moves at all."
          >
            <MotionLab />
          </Section>

          {/* 五 · Components */}
          <Section
            id="components"
            n={5}
            title="Components"
            intro="The live library, built around planning a journey. Everything works; nothing is saved, so it resets on reload."
          >
            <LiveComponents />
          </Section>

          {/* 六 · Control states */}
          <Section
            id="states"
            n={6}
            title="Control states"
            intro="Each control pinned in every state it has, in today's element. Switch the element above and the hover and press states change with it."
          >
            <Card className="px-5! py-0! sm:px-8!">
              <ul inert>
                {MATRIX.map((row) => (
                  <li key={row.name} className="border-t-[1.5px] border-dashed border-(--line) py-7 first:border-t-0">
                    <p className="font-bold">{row.name}</p>
                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-6">
                      {row.cells.map((cell, i) => (
                        <div key={STATE_NAMES[i]} className="flex min-w-0 flex-col gap-3">
                          <p className={`${TYPE.label} text-(--ink-muted)`}>{STATE_NAMES[i]}</p>
                          <div className="flex min-h-11 items-start">{cell ?? <span className="text-(--ink-muted)">n/a</span>}</div>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </Section>

          {/* 七 · UI states */}
          <Section
            id="ui-states"
            n={7}
            title="UI states"
            intro="An empty scroll, ink spreading while the schedule loads, a clash with a way out, and a stamp in your festival passport when it works."
          >
            <div inert className="grid gap-6 lg:grid-cols-2">
              <figure className="flex flex-col gap-3">
                <figcaption className={`${TYPE.label} text-(--ink-muted)`}>Empty</figcaption>
                <div>
                  <div className="h-3.5 rounded-full border-[1.5px] border-(--ink) bg-[#6B4A2E]" />
                  <div className="mx-3 flex flex-col items-center border-x-[1.5px] border-(--ink) bg-(--paper) px-6 py-10 text-center">
                    <span className="flex gap-2 text-(--line)">
                      {ELEMENT_ORDER.map((key) => (
                        <Emblem key={key} element={key} className="h-6 w-6" />
                      ))}
                    </span>
                    <p className={`mt-4 ${TYPE.heading}`}>Your journey hasn&rsquo;t begun</p>
                    <p className="mt-2 max-w-xs text-(--ink-muted)">
                      Pick a day, then add a set. Each one is stamped into your festival passport.
                    </p>
                    <div className="mt-5">
                      <Button variant="secondary">Explore the lineup</Button>
                    </div>
                  </div>
                  <div className="h-3.5 rounded-full border-[1.5px] border-(--ink) bg-[#6B4A2E]" />
                </div>
              </figure>

              <figure className="flex flex-col gap-3">
                <figcaption className={`${TYPE.label} text-(--ink-muted)`}>Loading</figcaption>
                <Card className="flex flex-1 flex-col items-center justify-center gap-5 py-10">
                  <div className="relative h-20 w-20">
                    {[0, 600, 1200].map((delay) => (
                      <span
                        key={delay}
                        className="absolute inset-0 rounded-full bg-(--el) opacity-0 motion-safe:animate-ink"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                    <span className="absolute inset-[34%] rounded-full bg-(--ink)" />
                  </div>
                  <p className={TYPE.heading}>Bending the schedule&hellip;</p>
                </Card>
              </figure>

              <figure className="flex flex-col gap-3">
                <figcaption className={`${TYPE.label} text-(--ink-muted)`}>Error · a clash</figcaption>
                <ClashNotice sets={[sages, healers]} />
              </figure>

              <figure className="flex flex-col gap-3">
                <figcaption className={`${TYPE.label} text-(--ink-muted)`}>Success · on your journey</figcaption>
                <Card className="flex flex-1 flex-col gap-4">
                  <div>
                    <p className={TYPE.heading}>{players.artist}</p>
                    <p className="mt-1 text-(--ink-muted)">
                      {ELEMENTS[players.day].dayName}, {players.time}, {players.stage.name}.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <AddButton added />
                    <span className="inline-flex items-center gap-2 text-sm text-(--ink-muted)">
                      <Badge tone="count" count={1} />
                      in the journey button
                    </span>
                  </div>
                </Card>
              </figure>
            </div>
          </Section>
        </div>
      </main>
    </ElementScope>
  );
}
