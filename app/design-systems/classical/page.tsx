import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { contrast, grade } from "@/app/_lib/contrast";
import { fontVariables } from "@/app/_themes/classical/fonts";
import { PERFORMANCES, VENUES } from "@/app/_themes/classical/programme";
import { color, cssVars, shadow, TYPE } from "@/app/_themes/classical/tokens";
import {
  AddButton,
  Button,
  CheckIcon,
  Checkbox,
  ClashNotice,
  CloseIcon,
  IconButton,
  Ornament,
  Radio,
  TextField,
  TextLink,
  Toggle,
  VenueChip,
  VenueIcon,
} from "@/app/_themes/classical/ui";

import { LiveComponents } from "./_live";
import { Panel } from "./_parts";

export const metadata: Metadata = {
  title: "Timeless Classical design system",
};

const LINK =
  "rounded-[2px] underline decoration-1 underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--charcoal)";

/* I · Color ------------------------------------------------------------------ */

type Check = { on: string; fg: string; bg: string; kind?: "text" | "ui" | "decor" };

const ROLES: { role: string; name: string; hex: string; use: string; checks: Check[] }[] = [
  {
    role: "Background",
    name: "Ivory",
    hex: color.ivory,
    use: "The page itself.",
    checks: [
      { on: "Charcoal text", fg: color.charcoal, bg: color.ivory },
      { on: "Muted text", fg: color.muted, bg: color.ivory },
    ],
  },
  {
    role: "Surface",
    name: "Paper",
    hex: color.paper,
    use: "Cards, inputs, and panels.",
    checks: [
      { on: "Charcoal text", fg: color.charcoal, bg: color.paper },
      { on: "Muted text", fg: color.muted, bg: color.paper },
    ],
  },
  {
    role: "Wash",
    name: "Linen",
    hex: color.linen,
    use: "The selected day, a saved row, an empty state.",
    checks: [
      { on: "Charcoal text", fg: color.charcoal, bg: color.linen },
      { on: "Muted text", fg: color.muted, bg: color.linen },
    ],
  },
  {
    role: "Text",
    name: "Charcoal",
    hex: color.charcoal,
    use: "Every word, and the focus ring.",
    checks: [
      { on: "On ivory", fg: color.charcoal, bg: color.ivory },
      { on: "On paper", fg: color.charcoal, bg: color.paper },
    ],
  },
  {
    role: "Muted",
    name: "Stone",
    hex: color.muted,
    use: "Times, venues, captions, labels.",
    checks: [
      { on: "On ivory", fg: color.muted, bg: color.ivory },
      { on: "On paper", fg: color.muted, bg: color.paper },
    ],
  },
  {
    role: "Border",
    name: "Rule",
    hex: color.rule,
    use: "Edges you must see: inputs, checkboxes, chips.",
    checks: [
      { on: "Edge on ivory", fg: color.rule, bg: color.ivory, kind: "ui" },
      { on: "Edge on paper", fg: color.rule, bg: color.paper, kind: "ui" },
    ],
  },
  {
    role: "Divider",
    name: "Hairline",
    hex: color.hairline,
    use: "Lines between rows. Never the only edge of a control.",
    checks: [{ on: "On ivory", fg: color.hairline, bg: color.ivory, kind: "decor" }],
  },
  {
    role: "Accent",
    name: "Forest",
    hex: color.forest,
    use: `Saving a performance, and anything selected. Hover ${color.forestHover}.`,
    checks: [
      { on: "White label", fg: "#FFFFFF", bg: color.forest },
      { on: "On hover", fg: "#FFFFFF", bg: color.forestHover },
    ],
  },
];

const ORNAMENT_COLORS: { name: string; hex: string; use: string; kind: "ui" | "decor" }[] = [
  { name: "Gilt", hex: color.gold, use: "Ornaments and frames only", kind: "decor" },
  { name: "Antique gold", hex: color.antiqueGold, use: "Engraved venue icons", kind: "ui" },
  { name: "Terracotta", hex: color.terracotta, use: "The double-engagement mark", kind: "ui" },
  { name: "Sage", hex: color.sage, use: "Paintings and illustration", kind: "decor" },
  { name: "Dusty blue", hex: color.dustyBlue, use: "Paintings and illustration", kind: "decor" },
];

/* II · Type ------------------------------------------------------------------ */

const TYPE_ROLES = [
  {
    role: "Display",
    spec: "Playfair Display · Regular 400 · 56 / 62, 40 on phones",
    use: "Page titles and the festival name.",
    sample: <p className={TYPE.display}>The Atlas</p>,
  },
  {
    role: "Heading",
    spec: "Playfair Display · Regular 400, italic for moments · 24 / 33",
    use: "Performance titles, section titles, notices.",
    sample: (
      <div>
        <p className={TYPE.heading}>Bach Cello Suites</p>
        <p className={`${TYPE.heading} italic`}>You are expected in two salons at once.</p>
      </div>
    ),
  },
  {
    role: "Body",
    spec: "Source Sans 3 · Regular 400, SemiBold 600 · 16 / 26",
    use: "Everything you read.",
    sample: (
      <p className={`max-w-prose ${TYPE.body}`}>
        Haydn in the Grand Hall at <b className="font-semibold">1:00</b>, the gardens all
        afternoon, then Mozart by candlelight in the Mirror Gallery.
      </p>
    ),
  },
  {
    role: "Label",
    spec: "Source Sans 3 · SemiBold 600 · 12 / 16 · caps, +0.2em",
    use: "Days, times, form labels, and buttons.",
    sample: <p className={TYPE.label}>Sat · 7:00 PM · Royal Chapel</p>,
  },
];

/* III · Spacing and shape ---------------------------------------------------- */

const SPACING = [
  [4, "An icon to its word"],
  [8, "Between chips"],
  [16, "Inside rows and fields"],
  [24, "Inside cards"],
  [40, "Between groups"],
  [64, "Between sections"],
] as const;

const CORNERS = [
  { name: "2px", use: "Cards, inputs, panels: almost square, like paper", radius: 2 },
  { name: "Pill", use: "Buttons, chips, toggles", radius: 999 },
  { name: "Circle", use: "Radios and round buttons", radius: 999, square: true },
];

/* V · Control states --------------------------------------------------------- */

const STATE_NAMES = ["Rest", "Hover", "Focus", "Pressed", "Selected", "Disabled"];
const CHAPEL = VENUES[2];

const MATRIX: { name: string; cells: (ReactNode | null)[] }[] = [
  {
    name: "Primary button",
    cells: [
      <Button key="rest">Save</Button>,
      <Button key="hover" force="hover">Save</Button>,
      <Button key="focus" force="focus">Save</Button>,
      <Button key="pressed" force="pressed">Save</Button>,
      <AddButton key="selected" added />,
      <Button key="disabled" disabled>Save</Button>,
    ],
  },
  {
    name: "Secondary button",
    cells: [
      <Button key="rest" variant="secondary">Notes</Button>,
      <Button key="hover" variant="secondary" force="hover">Notes</Button>,
      <Button key="focus" variant="secondary" force="focus">Notes</Button>,
      <Button key="pressed" variant="secondary" force="pressed">Notes</Button>,
      null,
      <Button key="disabled" variant="secondary" disabled>Notes</Button>,
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
    name: "Venue chip",
    cells: [
      <VenueChip key="rest" venue={CHAPEL} />,
      <VenueChip key="hover" venue={CHAPEL} force="hover" />,
      <VenueChip key="focus" venue={CHAPEL} force="focus" />,
      <VenueChip key="pressed" venue={CHAPEL} force="pressed" />,
      <VenueChip key="selected" venue={CHAPEL} selected />,
      <VenueChip key="disabled" venue={CHAPEL} disabled />,
    ],
  },
  {
    name: "Checkbox",
    cells: [
      <Checkbox key="rest" label="Saved" />,
      <Checkbox key="hover" label="Saved" force="hover" />,
      <Checkbox key="focus" label="Saved" force="focus" />,
      null,
      <Checkbox key="selected" label="Saved" defaultChecked />,
      <Checkbox key="disabled" label="Saved" disabled />,
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
      <TextField key="rest" label="Search" hideLabel placeholder="Handel" />,
      <TextField key="hover" label="Search" hideLabel placeholder="Handel" force="hover" />,
      <TextField key="focus" label="Search" hideLabel placeholder="Handel" force="focus" />,
      null,
      null,
      <TextField key="disabled" label="Search" hideLabel placeholder="Handel" disabled />,
    ],
  },
  {
    name: "Link",
    cells: [
      <TextLink key="rest" href="/mood-boards/classical">Mood board</TextLink>,
      <TextLink key="hover" href="/mood-boards/classical" force="hover">Mood board</TextLink>,
      <TextLink key="focus" href="/mood-boards/classical" force="focus">Mood board</TextLink>,
      null,
      null,
      null,
    ],
  },
];

/* Page ----------------------------------------------------------------------- */

const NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

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
    <section id={id} aria-labelledby={`${id}-title`} className="mt-16 scroll-mt-8 border-t border-(--hairline) pt-12">
      <p className={`${TYPE.label} text-(--muted)`}>Part {NUMERALS[n - 1]}</p>
      <h2 id={`${id}-title`} className={`mt-2 ${TYPE.heading}`}>
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-(--muted)">{intro}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Ratio({ fg, bg, kind = "text" }: { fg: string; bg: string; kind?: "text" | "ui" | "decor" }) {
  const r = contrast(fg, bg);
  return (
    <span className="font-semibold tabular-nums">
      <span className="whitespace-nowrap">{r.toFixed(2)}:1</span> · {kind === "decor" ? "Decorative" : grade(r, kind)}
    </span>
  );
}

function StateCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <figure className="flex flex-col gap-3">
      <figcaption className={`${TYPE.label} text-(--muted)`}>{title}</figcaption>
      <div className="flex-1">{children}</div>
    </figure>
  );
}

export default function ClassicalDesignSystem() {
  const bach = PERFORMANCES.find((p) => p.title === "Bach Cello Suites")!;
  const boccherini = PERFORMANCES.find((p) => p.title === "Boccherini Guitar Quintets")!;
  const failingIcon = contrast(color.gold, color.ivory);

  return (
    <main
      className={`${fontVariables} min-h-screen bg-(--ivory) px-4 py-10 text-(--charcoal) sm:px-8`}
      style={{ ...cssVars, fontFamily: "var(--font-source-sans)" }}
    >
      <div className="mx-auto max-w-6xl">
        <header>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            <Link href="/" className={LINK}>
              ← Home
            </Link>
            <Link href="/mood-boards/classical" className={LINK}>
              Mood board
            </Link>
          </nav>
          <div className="mt-10 flex flex-col items-center text-center">
            <Ornament className="w-40 text-(--gold)" />
            <p className={`mt-4 ${TYPE.label} text-(--muted)`}>Design system 2 of 3 · Classical</p>
            <h1 className={`mt-3 ${TYPE.display}`}>Timeless Classical</h1>
            <p className="mt-4 max-w-xl font-(family-name:--font-playfair) text-(--muted) italic">
              The interface kit for The Atlas, a festival of 18th-century music.
              Quiet surfaces, soft light, and one green for the thing that matters.
            </p>
            <nav aria-label="Sections" className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold">
              <a href="#color" className={LINK}>Color</a>
              <a href="#type" className={LINK}>Type</a>
              <a href="#shape" className={LINK}>Spacing &amp; shape</a>
              <a href="#components" className={LINK}>Components</a>
              <a href="#states" className={LINK}>Control states</a>
              <a href="#ui-states" className={LINK}>UI states</a>
            </nav>
          </div>
        </header>

        {/* I · Color roles */}
        <Section
          id="color"
          n={1}
          title="Color roles"
          intro="Eight roles carry the interface. Ratios are calculated from the hex values: text needs 4.5:1, edges you must see need 3:1."
        >
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((r) => (
              <li key={r.role} className="flex flex-col rounded-[2px] bg-(--paper) p-3" style={{ boxShadow: shadow.card }}>
                <div className="h-20" style={{ background: r.hex, boxShadow: "inset 0 0 0 1px rgba(47,47,47,0.1)" }} />
                <div className="flex flex-1 flex-col px-1 pt-4">
                  <p className={`${TYPE.label} text-(--muted)`}>{r.role}</p>
                  <p className="mt-1">
                    <span className="font-semibold">{r.name}</span> <span className="text-(--muted)">{r.hex}</span>
                  </p>
                  <p className="mt-1 mb-4 text-(--muted)">{r.use}</p>
                  <ul className="mt-auto space-y-1 border-t border-(--hairline) pt-3">
                    {r.checks.map((c) => (
                      <li key={c.on} className="flex justify-between gap-3">
                        <span>{c.on}</span>
                        <Ratio fg={c.fg} bg={c.bg} kind={c.kind} />
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="mt-12 font-semibold">Gold is for ornament</h3>
          <p className="mt-1 max-w-2xl text-(--muted)">
            Gilt is {failingIcon.toFixed(2)}:1 on ivory, too faint for words or for an icon you need to
            read. It frames and divides. Venue icons use a deeper antique gold, always beside the
            venue&rsquo;s name.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <figure className="rounded-[2px] bg-(--paper) p-3" style={{ boxShadow: shadow.card }}>
              <div className="flex h-20 items-center gap-2 bg-(--ivory) px-4 text-lg text-(--gold)">
                <VenueIcon venue={CHAPEL} className="h-6 w-6" />
                Royal Chapel
              </div>
              <figcaption className="mt-3 flex justify-between gap-3 px-1">
                <span>
                  <b className="font-semibold">Don&rsquo;t</b> · gilt for a name
                </span>
                <Ratio fg={color.gold} bg={color.ivory} />
              </figcaption>
            </figure>
            <figure className="rounded-[2px] bg-(--paper) p-3" style={{ boxShadow: shadow.card }}>
              <div className="flex h-20 items-center gap-2 bg-(--ivory) px-4 text-lg">
                <VenueIcon venue={CHAPEL} className="h-6 w-6 text-(--antique-gold)" />
                Royal Chapel
              </div>
              <figcaption className="mt-3 flex justify-between gap-3 px-1">
                <span>
                  <b className="font-semibold">Do</b> · antique-gold icon, charcoal name
                </span>
                <Ratio fg={color.charcoal} bg={color.ivory} />
              </figcaption>
            </figure>
          </div>
          <ul className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {ORNAMENT_COLORS.map((c) => (
              <li key={c.name} className="rounded-[2px] bg-(--paper) p-3" style={{ boxShadow: shadow.card }}>
                <div className="h-12" style={{ background: c.hex }} />
                <p className="mt-3 font-semibold">{c.name}</p>
                <p className="text-(--muted)">{c.hex}</p>
                <p className="mt-1 text-(--muted)">{c.use}</p>
                <p className="mt-2 text-sm">
                  <Ratio fg={c.hex} bg={color.ivory} kind={c.kind} />
                </p>
              </li>
            ))}
          </ul>
        </Section>

        {/* II · Type roles */}
        <Section
          id="type"
          n={2}
          title="Type roles"
          intro="A serif for the music, a sans for the information. Playfair is never bolded; emphasis comes from italics and size."
        >
          <ul className="rounded-[2px] bg-(--paper) px-5 sm:px-8" style={{ boxShadow: shadow.card }}>
            {TYPE_ROLES.map((t) => (
              <li
                key={t.role}
                className="grid gap-3 border-t border-(--hairline) py-7 first:border-t-0 sm:grid-cols-[260px_1fr] sm:gap-10"
              >
                <div>
                  <p className={`${TYPE.label} text-(--muted)`}>{t.role}</p>
                  <p className="mt-1 font-semibold">{t.spec}</p>
                  <p className="text-(--muted)">{t.use}</p>
                </div>
                <div className="flex items-center">{t.sample}</div>
              </li>
            ))}
          </ul>
        </Section>

        {/* III · Spacing and shape */}
        <Section
          id="shape"
          n={3}
          title="Spacing & shape"
          intro="Generous spacing, like a printed programme. Corners are nearly square, and shadows are soft daylight."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Spacing scale">
              <ul className="space-y-3">
                {SPACING.map(([px, use]) => (
                  <li key={px} className="grid grid-cols-[2.5rem_4rem_1fr] items-center gap-4">
                    <span className="text-right font-semibold tabular-nums">{px}</span>
                    <span className="bg-(--charcoal)" style={{ width: px, height: 6 }} />
                    <span className="text-(--muted)">{use}</span>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Corners">
              <ul className="grid grid-cols-3 gap-4">
                {CORNERS.map((c) => (
                  <li key={c.name}>
                    <div
                      className={`h-14 border border-(--rule) bg-(--ivory) ${c.square ? "w-14" : ""}`}
                      style={{ borderRadius: c.radius }}
                    />
                    <p className="mt-3 font-semibold">{c.name}</p>
                    <p className="text-(--muted)">{c.use}</p>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Borders">
              <ul className="grid gap-6 sm:grid-cols-2">
                <li>
                  <div className="flex h-14 items-center border-b border-(--hairline)">Haydn String Quartet</div>
                  <p className="mt-3 font-semibold">1px hairline</p>
                  <p className="text-(--muted)">Between rows</p>
                </li>
                <li>
                  <div className="flex h-14 items-center rounded-[2px] border border-(--rule) bg-(--paper) px-4 text-(--muted)">
                    Search the programme
                  </div>
                  <p className="mt-3 font-semibold">1px rule</p>
                  <p className="text-(--muted)">Control edges</p>
                </li>
                <li>
                  <div className="flex h-14 items-center border-l-4 border-(--terracotta) bg-(--paper) px-4">
                    Two at 7:00 PM
                  </div>
                  <p className="mt-3 font-semibold">4px terracotta</p>
                  <p className="text-(--muted)">A double engagement</p>
                </li>
                <li>
                  <div className="flex h-14 items-center justify-center border-[4px] border-(--gold) p-0.5">
                    <div className="flex h-full w-full items-center justify-center border border-(--gold)">
                      <Ornament className="w-20 text-(--gold)" />
                    </div>
                  </div>
                  <p className="mt-3 font-semibold">Gilt double frame</p>
                  <p className="text-(--muted)">Ornament only</p>
                </li>
              </ul>
            </Panel>

            <Panel title="Shadows">
              <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
                <li>
                  <div className="h-16 bg-(--paper)" style={{ boxShadow: shadow.card }} />
                  <p className="mt-3 font-semibold">Card</p>
                  <p className="text-(--muted)">Soft and low</p>
                </li>
                <li>
                  <div className="h-16 bg-(--paper)" style={{ boxShadow: shadow.raised }} />
                  <p className="mt-3 font-semibold">Raised</p>
                  <p className="text-(--muted)">The modal</p>
                </li>
                <li>
                  <div className="h-16 rounded-full bg-(--forest-hover) shadow-[inset_0_2px_5px_rgba(0,0,0,0.28)]" />
                  <p className="mt-3 font-semibold">Pressed</p>
                  <p className="text-(--muted)">A soft inset</p>
                </li>
                <li>
                  <div className="h-16 border border-(--charcoal) bg-(--paper) shadow-[0_5px_0_var(--charcoal)]" />
                  <p className="mt-3 font-semibold">Not this</p>
                  <p className="text-(--muted)">A hard edge looks like a toy</p>
                </li>
              </ul>
            </Panel>
          </div>
        </Section>

        {/* IV · Components */}
        <Section
          id="components"
          n={4}
          title="Components"
          intro="The live library. Everything works; nothing is saved, so it resets on reload."
        >
          <LiveComponents />
        </Section>

        {/* V · Control states */}
        <Section
          id="states"
          n={5}
          title="Control states"
          intro="Each control pinned in every state it has. Three rules hold throughout: focus is a charcoal ring set off from the control, selected is forest, and disabled fades to a hairline."
        >
          <ul inert className="rounded-[2px] bg-(--paper) px-5 sm:px-8" style={{ boxShadow: shadow.card }}>
            {MATRIX.map((row) => (
              <li key={row.name} className="border-t border-(--hairline) py-7 first:border-t-0">
                <p className="font-semibold">{row.name}</p>
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-6">
                  {row.cells.map((cell, i) => (
                    <div key={STATE_NAMES[i]} className="flex min-w-0 flex-col gap-3">
                      <p className={`${TYPE.label} text-(--muted)`}>{STATE_NAMES[i]}</p>
                      <div className="flex min-h-11 items-start">
                        {cell ?? <span className="text-(--muted)">n/a</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* VI · UI states */}
        <Section
          id="ui-states"
          n={6}
          title="UI states"
          intro="Empty, loading, wrong, and done. The double engagement is the error that matters, so it gets the terracotta rule and a way out."
        >
          <div inert className="grid gap-8 lg:grid-cols-2">
            <StateCard title="Empty">
              <div className="flex h-full flex-col items-center bg-(--linen) px-6 py-12 text-center">
                <Ornament className="w-28 text-(--gold)" />
                <p className={`mt-5 ${TYPE.heading}`}>Your itinerary is empty</p>
                <p className="mt-2 max-w-xs text-(--muted)">
                  Choose a performance and it will be kept here, in the order of the day.
                </p>
                <div className="mt-6">
                  <Button variant="secondary">Browse the programme</Button>
                </div>
              </div>
            </StateCard>

            <StateCard title="Loading">
              <div className="h-full bg-(--paper) p-6" style={{ boxShadow: shadow.card }}>
                <p className="font-(family-name:--font-playfair) text-(--muted) italic">Preparing the programme…</p>
                <ul className="mt-6 space-y-5">
                  {[70, 55, 62].map((w) => (
                    <li key={w} className="flex items-center gap-4">
                      <span className="h-3 w-14 bg-(--linen)" />
                      <span className="h-6 w-6 rounded-full bg-(--linen)" />
                      <span className="h-4 bg-(--linen) motion-safe:animate-pulse" style={{ width: `${w}%` }} />
                    </li>
                  ))}
                </ul>
              </div>
            </StateCard>

            <StateCard title="Error · Double engagement">
              <ClashNotice sets={[bach, boccherini]} />
            </StateCard>

            <StateCard title="Success">
              <div className="flex items-start gap-4 bg-(--paper) p-6" style={{ boxShadow: shadow.card }}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--forest) text-white">
                  <CheckIcon />
                </span>
                <div className="min-w-0 flex-1">
                  <p>
                    <span className={TYPE.heading}>{bach.title}</span>
                  </p>
                  <p className="text-(--muted)">is in your Saturday itinerary, 7:00 PM, {bach.venue.name}.</p>
                </div>
                <TextLink href="#ui-states">Undo</TextLink>
              </div>
            </StateCard>
          </div>
        </Section>

        <footer className="mt-20 flex justify-center">
          <Ornament className="w-40 text-(--gold)" />
        </footer>
      </div>
    </main>
  );
}
