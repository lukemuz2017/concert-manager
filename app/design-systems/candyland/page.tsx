import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { contrast, grade } from "@/app/_lib/contrast";
import { fontVariables } from "@/app/_themes/candyland/fonts";
import { LINEUP } from "@/app/_themes/candyland/lineup";
import { color, cssVars, shadow, STAGES, TYPE } from "@/app/_themes/candyland/tokens";
import {
  AddButton,
  Badge,
  Button,
  CheckIcon,
  Checkbox,
  Chip,
  CloseIcon,
  Dot,
  IconButton,
  TextField,
  TextLink,
  Toggle,
} from "@/app/_themes/candyland/ui";

import { LiveComponents } from "./_live";
import { Panel } from "./_parts";

export const metadata: Metadata = {
  title: "Candyland Vibes design system",
};

const LINK =
  "rounded-sm underline decoration-2 underline-offset-4 hover:decoration-4 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--text)";

/* 1 · Color ---------------------------------------------------------------- */

type Check = { on: string; fg: string; bg: string; kind?: "text" | "ui" };

const ROLES: { role: string; name: string; hex: string; use: string; checks: Check[] }[] = [
  {
    role: "Background",
    name: "Cream",
    hex: color.background,
    use: "The page itself.",
    checks: [
      { on: "Cocoa text", fg: color.text, bg: color.background },
      { on: "Mocha text", fg: color.muted, bg: color.background },
    ],
  },
  {
    role: "Surface",
    name: "Icing",
    hex: color.surface,
    use: "Cards, inputs, and panels that sit on the page.",
    checks: [
      { on: "Cocoa text", fg: color.text, bg: color.surface },
      { on: "Mocha text", fg: color.muted, bg: color.surface },
    ],
  },
  {
    role: "Wash",
    name: "Frosting",
    hex: color.wash,
    use: "Groups things: a selected row, an empty state.",
    checks: [
      { on: "Cocoa text", fg: color.text, bg: color.wash },
      { on: "Mocha text", fg: color.muted, bg: color.wash },
    ],
  },
  {
    role: "Text",
    name: "Cocoa",
    hex: color.text,
    use: "Words, icons, focus rings, and anything selected.",
    checks: [
      { on: "On cream", fg: color.text, bg: color.background },
      { on: "On icing", fg: color.text, bg: color.surface },
    ],
  },
  {
    role: "Muted",
    name: "Mocha",
    hex: color.muted,
    use: "Set times, captions, anything secondary.",
    checks: [
      { on: "On cream", fg: color.muted, bg: color.background },
      { on: "On icing", fg: color.muted, bg: color.surface },
    ],
  },
  {
    role: "Border",
    name: "Taffy",
    hex: color.border,
    use: "Edges of inputs, checkboxes, and unselected controls.",
    checks: [
      { on: "Edge on cream", fg: color.border, bg: color.background, kind: "ui" },
      { on: "Edge on icing", fg: color.border, bg: color.surface, kind: "ui" },
    ],
  },
  {
    role: "Accent",
    name: "Cherry",
    hex: color.accent,
    use: `The primary action and nothing else. Hover ${color.accentHover}, edge ${color.accentShadow}.`,
    checks: [
      { on: "White label", fg: "#FFFFFF", bg: color.accent },
      { on: "On hover", fg: "#FFFFFF", bg: color.accentHover },
    ],
  },
];

const LOLLIPOP = STAGES[1];
const ICE_CREAM = STAGES[4];
const LICORICE = STAGES[5];
const failingStages = STAGES.filter((s) => contrast(s.hex, color.background) < 4.5).length;

/* 2 · Type ----------------------------------------------------------------- */

const TYPE_ROLES = [
  {
    role: "Display",
    spec: "Fredoka · Bold 700 · 56 / 56, 40 on phones",
    use: "Page titles, day headings, and headliner names on their cards.",
    sample: <p className={TYPE.display}>Sugar Rush</p>,
  },
  {
    role: "Heading",
    spec: "Fredoka · SemiBold 600 · 24 / 30",
    use: "Section titles and artist names. Buttons use Fredoka 600 at body size.",
    sample: <p className={TYPE.heading}>Thursday at Licorice Castle</p>,
  },
  {
    role: "Body",
    spec: "Nunito · Regular 400, Bold 700 · 16 / 26",
    use: "Everything you read.",
    sample: (
      <p className={`max-w-prose ${TYPE.body}`}>
        Lord Licorice takes the castle at <b>8:30</b>. You&rsquo;re already on the
        shore at Ice Cream Sea, so pick one before the sugar wears off.
      </p>
    ),
  },
  {
    role: "Label",
    spec: "Nunito · ExtraBold 800 · 12 / 16 · caps, +0.16em",
    use: "Set times, badges, form labels.",
    sample: <p className={TYPE.label}>Thu · 7:00 PM · Licorice Castle</p>,
  },
];

/* 3 · Spacing and shape ---------------------------------------------------- */

const SPACING = [
  [4, "A dot to its label"],
  [8, "Between chips; a label to its field"],
  [12, "Button padding, top and bottom"],
  [16, "Inside cards"],
  [24, "Between related groups"],
  [48, "Between page sections"],
] as const;

const CORNERS = [
  { name: "6px", use: "Checkboxes", radius: 6 },
  { name: "16px", use: "Buttons, cards, inputs, panels", radius: 16 },
  { name: "Pill", use: "Chips, tabs, badges, toggles", radius: 999 },
];

/* 5 · Control states ------------------------------------------------------- */

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
      <Button key="rest" variant="secondary">Details</Button>,
      <Button key="hover" variant="secondary" force="hover">Details</Button>,
      <Button key="focus" variant="secondary" force="focus">Details</Button>,
      <Button key="pressed" variant="secondary" force="pressed">Details</Button>,
      null,
      <Button key="disabled" variant="secondary" disabled>Details</Button>,
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
      <Chip key="rest" stage={ICE_CREAM} />,
      <Chip key="hover" stage={ICE_CREAM} force="hover" />,
      <Chip key="focus" stage={ICE_CREAM} force="focus" />,
      <Chip key="pressed" stage={ICE_CREAM} force="pressed" />,
      <Chip key="selected" stage={ICE_CREAM} selected />,
      <Chip key="disabled" stage={ICE_CREAM} disabled />,
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
    name: "Toggle",
    cells: [
      <Toggle key="rest" label="Alerts" checked={false} />,
      <Toggle key="hover" label="Alerts" checked={false} force="hover" />,
      <Toggle key="focus" label="Alerts" checked={false} force="focus" />,
      null,
      <Toggle key="selected" label="Alerts" checked />,
      <Toggle key="disabled" label="Alerts" checked={false} disabled />,
    ],
  },
  {
    name: "Text input",
    cells: [
      <TextField key="rest" label="Search" hideLabel placeholder="Artist" />,
      <TextField key="hover" label="Search" hideLabel placeholder="Artist" force="hover" />,
      <TextField key="focus" label="Search" hideLabel placeholder="Artist" force="focus" />,
      null,
      null,
      <TextField key="disabled" label="Search" hideLabel placeholder="Artist" disabled />,
    ],
  },
  {
    name: "Link",
    cells: [
      <TextLink key="rest" href="/mood-boards/candyland">Mood board</TextLink>,
      <TextLink key="hover" href="/mood-boards/candyland" force="hover">Mood board</TextLink>,
      <TextLink key="focus" href="/mood-boards/candyland" force="focus">Mood board</TextLink>,
      null,
      null,
      null,
    ],
  },
];

/* Page --------------------------------------------------------------------- */

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
    <section id={id} aria-labelledby={`${id}-title`} className="mt-12 scroll-mt-8">
      <p className={`${TYPE.label} text-(--muted)`}>{n} of 6</p>
      <h2 id={`${id}-title`} className={`mt-1 ${TYPE.heading}`}>
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-(--muted)">{intro}</p>
      <div className="mt-6">{children}</div>
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

function StateCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <figure className="flex flex-col gap-2">
      <figcaption className={`${TYPE.label} text-(--muted)`}>{title}</figcaption>
      <div className="flex-1">{children}</div>
    </figure>
  );
}

export default function CandylandDesignSystem() {
  const find = (artist: string) => LINEUP.find((s) => s.artist === artist)!;
  const lolly = find("Lolly & the Lickables");
  const brainFreeze = find("Brain Freeze");
  const gumdrop = find("Gumdrop Velvet");

  return (
    <main
      className={`${fontVariables} min-h-screen bg-(--bg) px-4 py-10 text-(--text) sm:px-8`}
      style={{ ...cssVars, fontFamily: "var(--font-nunito)" }}
    >
      <div className="mx-auto max-w-6xl">
        <header>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold">
            <Link href="/" className={LINK}>
              ← Home
            </Link>
            <Link href="/mood-boards/candyland" className={LINK}>
              Mood board
            </Link>
          </nav>
          <p className={`mt-6 ${TYPE.label} text-(--muted)`}>Design system 1 of 3 · Candyland</p>
          <h1 className={`mt-1 ${TYPE.display}`}>Candyland Vibes</h1>
          <p className={`mt-3 max-w-2xl ${TYPE.body}`}>
            The UI kit for Sugar Rush, built from the mood board. Bright candy
            colors tell you which stage you&rsquo;re looking at. Words stay dark on
            cream so they can always be read.
          </p>
          <nav aria-label="Sections" className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-bold">
            <a href="#color" className={LINK}>Color</a>
            <a href="#type" className={LINK}>Type</a>
            <a href="#shape" className={LINK}>Spacing &amp; shape</a>
            <a href="#components" className={LINK}>Components</a>
            <a href="#states" className={LINK}>Control states</a>
            <a href="#ui-states" className={LINK}>UI states</a>
          </nav>
        </header>

        {/* 1 · Color roles */}
        <Section
          id="color"
          n={1}
          title="Color roles"
          intro="Seven roles carry the interface. Ratios are calculated from the hex values: text needs 4.5:1, control edges need 3:1."
        >
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((r) => (
              <li
                key={r.role}
                className="flex flex-col rounded-2xl bg-(--surface) p-3"
                style={{ boxShadow: shadow.card }}
              >
                <div
                  className="h-20 rounded-xl"
                  style={{ background: r.hex, boxShadow: "inset 0 0 0 2px rgba(59, 31, 43, 0.12)" }}
                />
                <div className="flex flex-1 flex-col px-1 pt-3">
                  <p className={`${TYPE.label} text-(--muted)`}>{r.role}</p>
                  <p className="mt-1 font-bold">
                    {r.name} <span className="font-normal text-(--muted)">{r.hex}</span>
                  </p>
                  <p className="mt-1 mb-3 text-(--muted)">{r.use}</p>
                  <ul className="mt-auto space-y-1 border-t-2 border-[#3B1F2B]/10 pt-3">
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

          <h3 className="mt-10 font-bold">Stage colors are for identity only</h3>
          <p className="mt-1 max-w-2xl text-(--muted)">
            {failingStages} of {STAGES.length} stage colors fail as text on cream, so
            none of them ever carry words. They fill dots, chip edges, and card
            edges, and the stage name sits beside them in cocoa.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <figure className="rounded-2xl bg-(--surface) p-3" style={{ boxShadow: shadow.card }}>
              <div className="flex h-20 items-center rounded-xl bg-(--bg) px-4">
                <span className="text-lg font-bold" style={{ color: LOLLIPOP.hex }}>
                  {LOLLIPOP.name}
                </span>
              </div>
              <figcaption className="mt-3 flex justify-between gap-3 px-1">
                <span>
                  <b>Don&rsquo;t</b> · stage color as text
                </span>
                <Ratio fg={LOLLIPOP.hex} bg={color.background} />
              </figcaption>
            </figure>
            <figure className="rounded-2xl bg-(--surface) p-3" style={{ boxShadow: shadow.card }}>
              <div className="flex h-20 items-center rounded-xl bg-(--bg) px-4">
                <span className="inline-flex items-center gap-1 text-lg font-bold">
                  <Dot stage={LOLLIPOP} className="h-3 w-3" />
                  {LOLLIPOP.name}
                </span>
              </div>
              <figcaption className="mt-3 flex justify-between gap-3 px-1">
                <span>
                  <b>Do</b> · stage-color dot, cocoa name
                </span>
                <Ratio fg={color.text} bg={color.background} />
              </figcaption>
            </figure>
          </div>

          <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {STAGES.map((s) => (
              <li key={s.name} className="rounded-2xl bg-(--surface) p-3" style={{ boxShadow: shadow.card }}>
                <div className="h-12 rounded-xl" style={{ background: s.hex }} />
                <p className="mt-2 leading-tight font-bold">{s.name}</p>
                <p className="text-(--muted)">{s.hex}</p>
                <p className={`mt-2 ${TYPE.label} text-(--muted)`}>As text on cream</p>
                <Ratio fg={s.hex} bg={color.background} />
              </li>
            ))}
          </ul>
        </Section>

        {/* 2 · Type roles */}
        <Section
          id="type"
          n={2}
          title="Type roles"
          intro="Two families, four roles. Fredoka is round and chunky like the board's lettering; Nunito keeps long text easy to read."
        >
          <ul className="rounded-2xl bg-(--surface) px-4 sm:px-6" style={{ boxShadow: shadow.card }}>
            {TYPE_ROLES.map((t) => (
              <li
                key={t.role}
                className="grid gap-3 border-t-2 border-[#3B1F2B]/10 py-6 first:border-t-0 sm:grid-cols-[240px_1fr] sm:gap-8"
              >
                <div>
                  <p className={`${TYPE.label} text-(--muted)`}>{t.role}</p>
                  <p className="mt-1 font-bold">{t.spec}</p>
                  <p className="text-(--muted)">{t.use}</p>
                </div>
                <div className="flex items-center">{t.sample}</div>
              </li>
            ))}
          </ul>
        </Section>

        {/* 3 · Spacing and shape */}
        <Section
          id="shape"
          n={3}
          title="Spacing & shape"
          intro="Everything is round, like candy. Shadows are hard and unblurred, like a game piece sitting on the board."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Spacing scale">
              <ul className="space-y-3">
                {SPACING.map(([px, use]) => (
                  <li key={px} className="grid grid-cols-[2.5rem_3rem_1fr] items-center gap-3">
                    <span className="text-right font-bold tabular-nums">{px}</span>
                    <span className="rounded-sm bg-(--text)" style={{ width: px, height: px }} />
                    <span className="text-(--muted)">{use}</span>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Corners">
              <ul className="grid grid-cols-3 gap-3">
                {CORNERS.map((c) => (
                  <li key={c.name}>
                    <div
                      className="h-16 border-2 border-(--border) bg-(--bg)"
                      style={{ borderRadius: c.radius }}
                    />
                    <p className="mt-2 font-bold">{c.name}</p>
                    <p className="text-(--muted)">{c.use}</p>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Borders">
              <ul className="grid gap-4 sm:grid-cols-3">
                <li>
                  <div className="flex h-16 items-center rounded-2xl border-2 border-(--border) bg-(--surface) px-3 text-(--muted)">
                    Search artists
                  </div>
                  <p className="mt-2 font-bold">2px Taffy</p>
                  <p className="text-(--muted)">Control edges</p>
                </li>
                <li>
                  <div className="flex h-16 items-center">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border-2 bg-(--surface) px-3 py-1 font-bold"
                      style={{ borderColor: ICE_CREAM.hex }}
                    >
                      <Dot stage={ICE_CREAM} />
                      {ICE_CREAM.name}
                    </span>
                  </div>
                  <p className="mt-2 font-bold">2px stage color</p>
                  <p className="text-(--muted)">Stage chips</p>
                </li>
                <li>
                  <div
                    className="flex h-16 items-center rounded-2xl border-l-[10px] bg-(--surface) px-3 font-bold"
                    style={{ borderLeftColor: LICORICE.hex, boxShadow: shadow.card }}
                  >
                    Lord Licorice Big Band
                  </div>
                  <p className="mt-2 font-bold">10px stage edge</p>
                  <p className="text-(--muted)">Artist cards</p>
                </li>
              </ul>
            </Panel>

            <Panel title="Shadows">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
                <li>
                  <div className="h-16 rounded-2xl bg-(--surface) ring-2 ring-[#3B1F2B]/10" style={{ boxShadow: shadow.card }} />
                  <p className="mt-3 font-bold">Card</p>
                  <p className="text-(--muted)">4px, no blur</p>
                </li>
                <li>
                  <div className="h-16 rounded-2xl bg-(--accent)" style={{ boxShadow: shadow.button }} />
                  <p className="mt-3 font-bold">Primary</p>
                  <p className="text-(--muted)">5px Cherry edge</p>
                </li>
                <li>
                  <div className="h-16 rounded-2xl border-2 border-(--text) bg-(--surface) shadow-[0_4px_0_var(--text)]" />
                  <p className="mt-3 font-bold">Secondary</p>
                  <p className="text-(--muted)">4px Cocoa edge</p>
                </li>
                <li>
                  <div className="h-16 translate-y-[5px] rounded-2xl bg-(--accent)" />
                  <p className="mt-3 font-bold">Pressed</p>
                  <p className="text-(--muted)">Sinks onto its edge</p>
                </li>
                <li>
                  <div
                    className="h-16 rounded-2xl bg-(--surface)"
                    style={{ boxShadow: "0 12px 32px rgba(0, 0, 0, 0.14)" }}
                  />
                  <p className="mt-3 font-bold">Not this</p>
                  <p className="text-(--muted)">Soft blur looks like any app</p>
                </li>
              </ul>
            </Panel>
          </div>
        </Section>

        {/* 4 · Components */}
        <Section
          id="components"
          n={4}
          title="Components"
          intro="The live library. Everything works, and the site is built from these same components. Nothing is saved; it resets on reload."
        >
          <LiveComponents />
        </Section>

        {/* 5 · Control states */}
        <Section
          id="states"
          n={5}
          title="Control states"
          intro="Each control pinned in every state it has. Three rules hold everywhere: focus is a cocoa ring, selected is filled cocoa, disabled is flat with a dashed edge."
        >
          <ul
            inert
            className="rounded-2xl bg-(--surface) px-4 sm:px-6"
            style={{ boxShadow: shadow.card }}
          >
            {MATRIX.map((row) => (
              <li key={row.name} className="border-t-2 border-[#3B1F2B]/10 py-6 first:border-t-0">
                <p className="font-bold">{row.name}</p>
                <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 xl:grid-cols-6">
                  {row.cells.map((cell, i) => (
                    <div key={STATE_NAMES[i]} className="flex min-w-0 flex-col gap-2">
                      <p className={`${TYPE.label} text-(--muted)`}>{STATE_NAMES[i]}</p>
                      <div className="flex min-h-12 items-start pb-[5px]">
                        {cell ?? <span className="text-(--muted)">n/a</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* 6 · UI states */}
        <Section
          id="ui-states"
          n={6}
          title="UI states"
          intro="What a screen looks like when it's empty, loading, wrong, or done. A Sugar Crash is the error that matters here. It gets a cocoa outline and a tilted warning sticker rather than a new color, since every hue is already taken."
        >
          <div inert className="grid gap-6 lg:grid-cols-2">
            <StateCard title="Empty">
              <div className="flex h-full flex-col items-center rounded-2xl bg-(--wash) px-6 py-10 text-center">
                <svg aria-hidden="true" viewBox="0 0 64 32" className="h-10 w-20 text-(--muted)">
                  <path
                    d="M18 16 4 6v20Zm28 0 14-10v20Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="18"
                    y="5"
                    width="28"
                    height="22"
                    rx="11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray="5 4"
                  />
                </svg>
                <h3 className={`mt-4 ${TYPE.heading}`}>Your plan is empty</h3>
                <p className="mt-2 max-w-xs text-(--muted)">
                  Tap a name on the poster or search to add sets. They line up here by time.
                </p>
                <div className="mt-5 pb-1">
                  <Button variant="secondary">Browse the lineup</Button>
                </div>
              </div>
            </StateCard>

            <StateCard title="Loading">
              <div className="rounded-2xl bg-(--surface) p-5" style={{ boxShadow: shadow.card }}>
                <div className="flex items-center gap-3">
                  <span
                    className="h-8 w-8 shrink-0 rounded-full motion-safe:animate-spin"
                    style={{
                      background: `repeating-conic-gradient(${color.text} 0 30deg, ${color.wash} 30deg 60deg)`,
                    }}
                  />
                  <p className="font-bold">Unwrapping the lineup…</p>
                </div>
                <ul className="mt-6 space-y-4">
                  {[72, 56, 64].map((width) => (
                    <li key={width} className="flex items-center gap-3">
                      <span className="h-5 w-5 shrink-0 rounded-[6px] bg-(--wash)" />
                      <span className="h-3 w-14 shrink-0 rounded-full bg-(--wash)" />
                      <span
                        className="h-4 rounded-full bg-(--wash) motion-safe:animate-pulse"
                        style={{ width: `${width}%` }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </StateCard>

            <StateCard title="Error · Sugar Crash">
              <div className="h-full rounded-2xl border-[3px] border-(--text) bg-(--surface) p-5">
                <Badge tone="crash" />
                <h3 className={`mt-3 ${TYPE.heading}`}>You&rsquo;re booked twice on Thursday at 7:00 PM</h3>
                <ul className="mt-3 space-y-1">
                  {[lolly, brainFreeze].map((s) => (
                    <li key={s.artist} className="flex flex-wrap items-center gap-x-2">
                      <Dot stage={s.stage} />
                      <b>{s.artist}</b>
                      <span className="text-(--muted)">· {s.stage.name}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-(--muted)">Pick one before the sugar wears off.</p>
                <div className="mt-4 flex flex-wrap gap-3 pb-1">
                  <Button variant="secondary">Keep Lolly</Button>
                  <Button variant="secondary">Keep Brain Freeze</Button>
                </div>
              </div>
            </StateCard>

            <StateCard title="Success">
              <div className="flex items-start gap-3 rounded-2xl bg-(--wash) p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--text) text-(--bg)">
                  <CheckIcon />
                </span>
                <div className="min-w-0 flex-1">
                  <p>
                    <b>{gumdrop.artist}</b> is in your plan.
                  </p>
                  <p className="text-(--muted)">
                    {gumdrop.day} · {gumdrop.time} · {gumdrop.stage.name}
                  </p>
                </div>
                <TextLink href="#ui-states">Undo</TextLink>
              </div>
            </StateCard>
          </div>
        </Section>
      </div>
    </main>
  );
}
