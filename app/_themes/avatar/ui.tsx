"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

import {
  GATE,
  GENRES,
  FALLS,
  GORGE,
  LAKE,
  OUTFLOW,
  LANDMARKS,
  clock,
  CHANGEOVER,
  duration,
  legBetween,
  LINEUP,
  RIVER,
  routeBetween,
  SLOTS,
  slotMinutes,
  STAGE_POS,
  STAGES,
  timeRange,
  trailPath,
  trailPoints,
  TRAILS,
  walkMinutes,
  type FestivalSet,
  type Place,
} from "./lineup";
import { baseVars, ELEMENT_ORDER, ELEMENTS, elementVars, SHAPE, TYPE, type ElementKey } from "./tokens";

// The Four Nations component library.
//
// Three rules run through it:
//   1. The day's element color is for the next thing to do (the primary action).
//      Ink is for what you already chose (saved, checked, selected).
//   2. Color tells you the day; an emblem tells you the place.
//   3. Everything "bends": hover and press move the way the day's element moves,
//      read from CSS variables, and stand still for reduced-motion users.
//
// Controls take an optional `force` to pin a state for the design system.

export type Force = "hover" | "focus" | "pressed";

// Focus is a 3px ink ring set 3px off the control: 12:1 on parchment, in every mode.
export const FOCUS = "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-(--ink)";
const FOCUSED = "outline-3 outline-offset-3 outline-(--ink)";

// Bending: transform and glow follow the element's motion variables.
const BEND =
  "transition-[transform,background-color,box-shadow,filter] duration-(--el-dur) ease-(--el-ease) enabled:hover:[transform:translateY(var(--el-lift))] enabled:hover:[box-shadow:var(--el-glow)] enabled:active:[transform:var(--el-press)] motion-reduce:transition-none motion-reduce:transform-none!";
const BEND_PINNED = {
  hover: "[transform:translateY(var(--el-lift))]! [box-shadow:var(--el-glow)]!",
  pressed: "[transform:var(--el-press)]!",
};

// Buttons bend big: each element runs its own keyframe animation on hover (water
// rocks, earth quakes, fire flares, air floats) and another when pressed.
const BEND_BIG =
  "transition-[background-color,filter] duration-(--el-dur) ease-(--el-ease) enabled:hover:[animation:var(--el-hover)] enabled:active:[animation:var(--el-press-anim)] motion-reduce:transition-none motion-reduce:[animation:none]!";
const BIG_PINNED = {
  hover: "[animation:var(--el-hover)]!",
  pressed: "[transform:var(--el-press)]!",
};

// Disabled is "unbent": a dotted pencil edge, muted ink, no fill, no motion.
const DISABLED =
  "disabled:cursor-not-allowed disabled:border-dotted disabled:border-(--line)! disabled:bg-transparent! disabled:text-(--ink-muted)! disabled:[box-shadow:none]! disabled:filter-none!";

function pin(extra: { hover: string; pressed: string }, force?: Force, big = false) {
  const base = big ? BIG_PINNED : BEND_PINNED;
  if (force === "focus") return FOCUSED;
  if (force === "hover") return `${base.hover} ${extra.hover}`;
  if (force === "pressed") return `${base.pressed} ${extra.pressed}`;
  return "";
}

/* The day's element, shared down the page ----------------------------------- */

const ElementContext = createContext<{ element: ElementKey; setElement: (e: ElementKey) => void } | null>(null);

export function useElement() {
  const value = useContext(ElementContext);
  if (!value) throw new Error("useElement needs an <ElementScope> above it");
  return value;
}

// Sets every element variable on one wrapper; everything inside re-themes with it.
export function ElementScope({
  initial = "fire",
  className = "",
  style,
  children,
}: {
  initial?: ElementKey;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const [element, setElement] = useState<ElementKey>(initial);
  return (
    <ElementContext.Provider value={{ element, setElement }}>
      <div data-element={element} className={className} style={{ ...baseVars, ...elementVars(element), ...style }}>
        {children}
      </div>
    </ElementContext.Provider>
  );
}

/* Emblems, glyphs, small icons -------------------------------------------- */

// An inward spiral: 1.3 turns from radius 7.5 down to 1, starting at `start` degrees.
function spiral(cx: number, cy: number, start: number) {
  const points = Array.from({ length: 40 }, (_, i) => {
    const t = i / 39;
    const theta = ((start + 180) * Math.PI) / 180 + t * 1.3 * 2 * Math.PI;
    const r = 7.5 - 6.5 * t;
    return `${(cx + r * Math.cos(theta)).toFixed(2)} ${(cy + r * Math.sin(theta)).toFixed(2)}`;
  });
  return `M${points.join("L")}`;
}

const EMBLEMS: Record<ElementKey, ReactNode> = {
  water: (
    <>
      <circle cx="24" cy="24" r="19" />
      <path d="M11 20c3-6 10-8 15-4 3 2.5 1.5 7-2 6.5" />
      <path d="M11 28c3-6 10-8 15-4 3 2.5 1.5 7-2 6.5" />
      <path d="M14 36c6 1 14 0 21-6" />
    </>
  ),
  earth: (
    <>
      <path d="M9 39 16 9h16l7 30Z" />
      <path d="M17 33l4-17h6l4 17Z" />
      <path d="M12 25h24" />
    </>
  ),
  fire: (
    <>
      <path d="M24 4c4 8 14 12 12 24-1.5 9-7 15-12 15s-10.5-6-12-15c-1-7 4-11 6-17 1 5 3 7 5 8-1-6 0-10 1-15Z" />
      <path d="M24 35c-4 0-6-3-5-6s5-4 7-1 0 6-3 5" />
    </>
  ),
  air: (
    <>
      {[-90, 30, 150].map((angle) => {
        const a = (angle * Math.PI) / 180;
        return <path key={angle} d={spiral(24 + 8.5 * Math.cos(a), 24 + 8.5 * Math.sin(a), angle)} />;
      })}
    </>
  ),
};

export function Emblem({ element, className = "h-6 w-6" }: { element: ElementKey; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      {EMBLEMS[element]}
    </svg>
  );
}

// An artist's nation: its emblem in the nation's line color, optionally named.
export function NationMark({
  nation,
  label = false,
  className = "h-5 w-5",
}: {
  nation: ElementKey;
  label?: boolean;
  className?: string;
}) {
  const el = ELEMENTS[nation];
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5" style={{ color: el.line }}>
      <Emblem element={nation} className={className} />
      {label && <span className="text-(--ink)">{el.nation}</span>}
    </span>
  );
}

// Where the set is, as its own labeled line: the stage name is the one thing to find.
export function StageLine({ stage }: { stage: string }) {
  return (
    <p className="mt-3 flex items-baseline gap-3 border-y-[1.5px] border-dashed border-(--line) py-2">
      <span className={`${TYPE.label} w-12 shrink-0 text-(--ink-muted)`}>Stage</span>
      <span className="text-lg leading-tight font-bold">{stage}</span>
    </p>
  );
}

// A pennant on a pole. Filled when flagged.
export function FlagIcon({ filled = false, className = "h-4 w-4" }: { filled?: boolean; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
      <path d="M3.5 14V2.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M3.8 2.8c2.4-1.2 4.2 1.2 6.4 0 .9-.5 1.8-.6 2.5-.3v5.8c-.8-.3-1.6-.2-2.5.3-2.200 1.200-4-1.200-6.400 0Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SearchIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
      <circle cx="6.8" cy="6.8" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.3 10.4c1.2 1.1 2.4 2.3 3.5 3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Three sliders: the filters.
export function FilterIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M2 4h12M2 8h12M2 12h12" />
      <circle cx="10.5" cy="4" r="1.7" fill="currentColor" />
      <circle cx="5.5" cy="8" r="1.7" fill="currentColor" />
      <circle cx="9" cy="12" r="1.7" fill="currentColor" />
    </svg>
  );
}

export function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
      <path d="M3 8.5c1.5 1 2.5 2.3 3.3 3.5C8 8.5 10 5.5 13 3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
      <path d="M8 2.8v10.4M2.8 8.2h10.4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
      <path d="M3.5 3.8 12.4 12.3M12.2 3.6 3.7 12.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// The clash seal: a square ink chop with 衝, "collide". Always ink, so no
// element's color can ever be mistaken for a warning.
export function Seal({ className = "h-7 w-7 text-base" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      lang="zh-Hant"
      className={`inline-flex shrink-0 -rotate-6 items-center justify-center rounded-[3px] bg-(--ink) text-(--paper) ${TYPE.glyph} ${className}`}
    >
      衝
    </span>
  );
}

/* Buttons and link ----------------------------------------------------------- */

const BUTTON_BASE = `inline-flex items-center justify-center gap-2 border-[1.5px] px-5 py-2.5 font-medium whitespace-nowrap enabled:cursor-pointer ${SHAPE.button} ${BEND_BIG} ${FOCUS} ${DISABLED}`;

const BUTTON = {
  primary: {
    rest: "border-(--ink) bg-(--el) text-(--el-on) enabled:hover:brightness-[0.9]",
    hover: "brightness-[0.9]!",
    pressed: "brightness-[0.9]!",
  },
  secondary: {
    rest: "border-(--ink) bg-(--paper) text-(--ink) enabled:hover:bg-(--el-wash)",
    hover: "bg-(--el-wash)!",
    pressed: "bg-(--el-wash)!",
  },
  // What you chose turns to ink.
  chosen: {
    rest: "border-(--ink) bg-(--ink) text-(--paper) enabled:hover:brightness-[1.35]",
    hover: "brightness-[1.35]!",
    pressed: "brightness-[1.35]!",
  },
};

export function Button({
  variant = "primary",
  force,
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: "primary" | "secondary"; force?: Force }) {
  const recipe = BUTTON[variant];
  return <button type="button" className={`${BUTTON_BASE} ${recipe.rest} ${pin(recipe, force, true)} ${className}`} {...props} />;
}

// The product's main action. In the day's element until you press it; ink once it's yours.
export function AddButton({
  added,
  onToggle,
  force,
  disabled,
  artist,
  label = "Add to my journey",
  addedLabel = "On your journey",
}: {
  added: boolean;
  onToggle?: () => void;
  force?: Force;
  disabled?: boolean;
  artist?: string;
  label?: string;
  addedLabel?: string;
}) {
  const recipe = added ? BUTTON.chosen : BUTTON.primary;
  return (
    <button
      type="button"
      aria-pressed={added}
      aria-label={artist ? `${added ? addedLabel : label}: ${artist}` : undefined}
      disabled={disabled}
      onClick={onToggle}
      className={`${BUTTON_BASE} ${recipe.rest} ${pin(recipe, force, true)}`}
    >
      {added ? <CheckIcon /> : <PlusIcon />}
      {added ? addedLabel : label}
    </button>
  );
}

// "Interested": a light, non-committal mark that sits beside the primary Add. It never causes
// a clash. A flagged set shows a filled flag; the day's wash tints the button.
export function FlagButton({
  flagged,
  onToggle,
  artist,
  force,
  disabled,
}: {
  flagged: boolean;
  onToggle?: () => void;
  artist?: string;
  force?: Force;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={flagged}
      disabled={disabled}
      aria-label={artist ? `${flagged ? "Remove interest in" : "Interested in"}: ${artist}` : undefined}
      onClick={onToggle}
      className={`${BUTTON_BASE} ${flagged ? "border-(--ink) bg-(--el-wash) text-(--ink)" : "border-(--ink) bg-(--paper) text-(--ink) enabled:hover:bg-(--el-wash)"} ${pin({ hover: "bg-(--el-wash)!", pressed: "bg-(--el-wash)!" }, force, true)}`}
    >
      <FlagIcon filled={flagged} />
      {flagged ? "Interested" : "Interested?"}
    </button>
  );
}

// Links are ink with an underline in the day's element. On hover the line bends into a wave.
const LINK = `rounded-sm font-medium underline decoration-(--el-line) decoration-2 underline-offset-[5px] hover:decoration-wavy hover:underline-offset-[8px] ${FOCUS}`;

export function TextLink({ href, force, children }: { href: string; force?: "hover" | "focus"; children: ReactNode }) {
  const look = force === "hover" ? "decoration-wavy! underline-offset-[8px]!" : force === "focus" ? FOCUSED : "";
  return (
    <Link href={href} className={`${LINK} ${look}`}>
      {children}
    </Link>
  );
}

const ROUND = `inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-(--ink) enabled:cursor-pointer ${BEND} ${FOCUS} ${DISABLED}`;

export function IconButton({
  label,
  force,
  className = "",
  children,
  ...props
}: ComponentProps<"button"> & { label: string; force?: Force }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`${ROUND} bg-(--paper) text-(--ink) enabled:hover:bg-(--el-wash) ${pin({ hover: "bg-(--el-wash)!", pressed: "bg-(--el-wash)!" }, force)} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// The compact add control in lineup rows.
export function SaveToggle({ saved, artist, onToggle }: { saved: boolean; artist: string; onToggle?: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${artist} from your journey` : `Add ${artist} to your journey`}
      onClick={onToggle}
      className={`${ROUND} ${saved ? "bg-(--ink) text-(--paper)" : "bg-(--el) text-(--el-on) enabled:hover:brightness-[0.9]"}`}
    >
      {saved ? <CheckIcon /> : <PlusIcon />}
    </button>
  );
}

/* Chips and badges -------------------------------------------------------- */

// A stage filter: the stage's nation emblem and its name, in ink. Selected turns to ink.
export function StageChip({
  name,
  nation,
  selected = false,
  onToggle,
  force,
  disabled,
}: {
  name: string;
  nation: ElementKey;
  selected?: boolean;
  onToggle?: () => void;
  force?: Force;
  disabled?: boolean;
}) {
  const look = selected ? "border-(--ink) bg-(--ink) text-(--paper)" : "border-(--line) bg-(--paper) text-(--ink) enabled:hover:bg-(--el-wash)";
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 border-[1.5px] py-1.5 pr-3.5 pl-2 text-sm font-medium whitespace-nowrap enabled:cursor-pointer ${SHAPE.button} ${BEND} ${FOCUS} ${DISABLED} ${look} ${pin({ hover: "bg-(--el-wash)!", pressed: "bg-(--el-wash)!" }, force)}`}
    >
      <Emblem element={nation} className="h-5 w-5" />
      {name}
      {selected && <CheckIcon />}
    </button>
  );
}

function Footsteps({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`shrink-0 ${className}`} fill="currentColor">
      <ellipse cx="5" cy="5" rx="2" ry="3" />
      <ellipse cx="11" cy="10" rx="2" ry="3" />
      <circle cx="5" cy="10.2" r="1.2" />
      <circle cx="11" cy="15" r="1.2" />
    </svg>
  );
}

// Two warning levels. A clash (two sets, one slot) gets the ink seal; a tight
// walk (back-to-back sets far apart) gets a dashed outline: real, but softer.
export function Badge({ tone, count }: { tone: "clash" | "tight" | "count"; count?: number }) {
  if (tone === "tight") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-dashed border-(--ink) px-2.5 py-0.5 whitespace-nowrap ${TYPE.label} tracking-[0.12em]!`}
      >
        <Footsteps className="h-3.5 w-3.5" />
        Tight walk · {count} min
      </span>
    );
  }
  if (tone === "count") {
    return (
      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-(--ink) px-1.5 text-xs font-bold text-(--paper) tabular-nums">
        {count}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap ${TYPE.label} tracking-[0.12em]!`}>
      <Seal className="h-6 w-6 text-sm" />
      Two places at once
    </span>
  );
}

/* Form controls ---------------------------------------------------------- */

const FIELD = `w-full border-[1.5px] border-(--line) bg-(--paper) px-4 py-2.5 text-(--ink) placeholder:text-(--ink-muted) transition-colors duration-(--el-dur) ${SHAPE.field} enabled:hover:border-(--ink) focus-visible:border-(--ink) ${FOCUS} disabled:cursor-not-allowed disabled:border-dotted disabled:bg-transparent disabled:text-(--ink-muted)`;

function fieldPin(force?: "hover" | "focus") {
  if (force === "hover") return "border-(--ink)!";
  if (force === "focus") return `border-(--ink)! ${FOCUSED}`;
  return "";
}

export function TextField({
  label,
  hideLabel,
  force,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hideLabel?: boolean; force?: "hover" | "focus" }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={hideLabel ? "sr-only" : `${TYPE.label} text-(--ink-muted)`}>
        {label}
      </label>
      <input id={id} className={`${FIELD} ${fieldPin(force)}`} {...props} />
    </div>
  );
}

export function Select({
  label,
  force,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; force?: "hover" | "focus" }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={`${TYPE.label} text-(--ink-muted)`}>
        {label}
      </label>
      <div className="relative">
        <select id={id} className={`${FIELD} appearance-none pr-11 enabled:cursor-pointer ${fieldPin(force)}`} {...props}>
          {children}
        </select>
        <svg aria-hidden="true" viewBox="0 0 16 16" className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2">
          <path d="M3.5 6.2c1.6 1.4 3 2.9 4.5 4.3 1.5-1.5 3-3 4.5-4.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

const BOX = `peer h-5 w-5 shrink-0 appearance-none border-[1.5px] border-(--line) bg-(--paper) transition-colors duration-(--el-dur) checked:border-(--ink) enabled:cursor-pointer enabled:hover:border-(--ink) disabled:cursor-not-allowed disabled:border-dotted disabled:bg-transparent ${FOCUS}`;

function boxPin(force?: "hover" | "focus") {
  if (force === "hover") return "border-(--ink)!";
  if (force === "focus") return FOCUSED;
  return "";
}

const CHOICE = "inline-flex cursor-pointer items-center gap-2.5 has-[:disabled]:cursor-not-allowed has-[:disabled]:text-(--ink-muted)";

export function Checkbox({
  label,
  force,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; force?: "hover" | "focus" }) {
  return (
    <label className={CHOICE}>
      <span className="relative inline-flex shrink-0">
        <input type="checkbox" className={`${BOX} rounded-[5px_3px_6px_4px] checked:bg-(--ink) ${boxPin(force)}`} {...props} />
        <CheckIcon className="pointer-events-none absolute inset-0 m-auto hidden h-3.5 w-3.5 text-(--paper) peer-checked:block" />
      </span>
      {label}
    </label>
  );
}

export function Radio({
  label,
  force,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; force?: "hover" | "focus" }) {
  return (
    <label className={CHOICE}>
      <span className="relative inline-flex shrink-0">
        <input type="radio" className={`${BOX} rounded-full ${boxPin(force)}`} {...props} />
        <span className="pointer-events-none absolute inset-0 m-auto hidden h-2.5 w-2.5 rounded-full bg-(--ink) peer-checked:block" />
      </span>
      {label}
    </label>
  );
}

// The knob travels with the day's element motion: it flows, thuds, snaps, or drifts.
export function Toggle({
  label,
  checked,
  onChange,
  force,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange?: (next: boolean) => void;
  force?: "hover" | "focus";
  disabled?: boolean;
}) {
  const track = checked ? "border-(--ink) bg-(--ink)" : `border-(--line) bg-(--paper) group-hover:border-(--ink) ${force === "hover" ? "border-(--ink)!" : ""}`;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`group inline-flex items-center gap-3 rounded-full text-left enabled:cursor-pointer disabled:cursor-not-allowed disabled:text-(--ink-muted) ${FOCUS} ${force === "focus" ? FOCUSED : ""}`}
    >
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full border-[1.5px] transition-colors duration-(--el-dur) group-disabled:border-dotted group-disabled:border-(--line)! group-disabled:bg-transparent! ${track}`}
      >
        <span
          className={`absolute top-[3px] left-[3px] h-5 w-5 rounded-full transition-transform duration-(--el-dur) ease-(--el-ease) motion-reduce:transition-none ${checked ? "translate-x-5 bg-(--paper)" : "bg-(--line)"}`}
        />
      </span>
      {label}
    </button>
  );
}

/* Day tabs ---------------------------------------------------------------- */

// Each tab wears its own element; choosing a day re-themes everything below.
export function DayTabs({ label = "Festival day", children }: { label?: string; children: ReactNode }) {
  const { element, setElement } = useElement();
  const id = useId();
  const current = ELEMENT_ORDER.indexOf(element);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = {
      ArrowRight: (current + 1) % 4,
      ArrowLeft: (current + 3) % 4,
      Home: 0,
      End: 3,
    };
    if (!(e.key in moves)) return;
    e.preventDefault();
    setElement(ELEMENT_ORDER[moves[e.key]]);
    document.getElementById(`${id}-tab-${moves[e.key]}`)?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="grid grid-cols-4 border-b-[1.5px] border-(--line)">
        {ELEMENT_ORDER.map((key, i) => {
          const el = ELEMENTS[key];
          const on = key === element;
          return (
            <button
              key={key}
              id={`${id}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`${id}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => setElement(key)}
              className={`-mb-[1.5px] flex cursor-pointer flex-col items-center gap-1 border-b-[3px] px-1 py-2.5 transition-colors duration-(--el-dur) ${FOCUS} ${on ? "" : "border-transparent text-(--ink-muted) hover:bg-(--paper) hover:text-(--ink)"}`}
              style={on ? { borderBottomColor: el.line, background: el.wash } : undefined}
            >
              <span style={on ? { color: el.line } : undefined}>
                <Emblem element={key} className="h-6 w-6" />
              </span>
              <span className={TYPE.label}>{el.day}</span>
              <span className="text-xs">{el.name}</span>
            </button>
          );
        })}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${current}`}>
        {children}
      </div>
    </div>
  );
}

/* Sets: card, row, notice, scroll panel, modal ------------------------------ */

export function SetCard({
  set,
  saved,
  onToggle,
  onDetails,
  image,
}: {
  set: FestivalSet;
  saved: boolean;
  onToggle?: () => void;
  onDetails?: () => void;
  image?: ReactNode;
}) {
  const el = ELEMENTS[set.day];
  return (
    <article className={`overflow-hidden border-[1.5px] border-(--ink) bg-(--paper) ${SHAPE.card}`}>
      {image && <div className="relative h-40 border-b-[1.5px] border-(--ink)">{image}</div>}
      <div className="p-5">
        <p className={`${TYPE.label} text-(--ink-muted)`}>
          {el.dayName} · {set.time}
        </p>
        <h3 className={`mt-2 ${TYPE.heading}`}>{set.artist}</h3>
        <p className="mt-1 text-(--ink-muted)">{set.blurb}</p>
        <StageLine stage={set.stage.name} />
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
          <AddButton added={saved} onToggle={onToggle} />
          {onDetails && (
            <button type="button" onClick={onDetails} className={`cursor-pointer ${LINK}`}>
              Details
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function LineupRow({
  set,
  saved,
  flagged,
  clash,
  onToggle,
  onDetails,
}: {
  set: FestivalSet;
  saved: boolean;
  flagged?: boolean;
  clash?: boolean;
  onToggle?: () => void;
  onDetails?: () => void;
}) {
  return (
    <li
      className={`flex items-center gap-3 border-b-[1.5px] border-dashed border-(--line) px-2 py-3.5 last:border-b-0 sm:gap-4 ${saved ? "bg-(--el-wash)" : ""}`}
    >
      <span className={`w-14 shrink-0 ${TYPE.label} tracking-[0.08em]! text-(--ink-muted)`}>{set.time}</span>
      <NationMark nation={set.nation} className="h-6 w-6" />
      <span className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
        <span className="min-w-0">
          {/* Underlined in the artist's nation color; the line bends into a wave on hover. */}
          <button
            type="button"
            onClick={onDetails}
            className={`block cursor-pointer rounded-sm text-left font-medium underline decoration-2 underline-offset-4 hover:decoration-wavy hover:underline-offset-[8px] ${FOCUS}`}
            style={{ textDecorationColor: ELEMENTS[set.nation].line }}
          >
            {set.artist}
            {flagged && !saved && (
              <>
                <FlagIcon filled className="ml-1.5 inline h-3.5 w-3.5" />
                <span className="sr-only"> (interested)</span>
              </>
            )}
          </button>
          <span className="text-sm text-(--ink-muted)">{set.stage.name}</span>
        </span>
        {clash && <Badge tone="clash" />}
      </span>
      <SaveToggle saved={saved} artist={set.artist} onToggle={onToggle} />
    </li>
  );
}

export function ClashNotice({ sets, onKeep }: { sets: FestivalSet[]; onKeep?: (s: FestivalSet) => void }) {
  return (
    <div role="alert" className={`flex gap-4 border-[1.5px] border-(--ink) bg-(--paper) p-5 ${SHAPE.card}`}>
      <Seal className="h-12 w-12 text-3xl" />
      <div className="min-w-0">
        <p className={TYPE.heading}>Even the Avatar can&rsquo;t be in two places at once.</p>
        <p className="mt-1 text-(--ink-muted)">
          {sets.map((s) => `${s.artist} (${s.stage.name})`).join(" and ")} both start at {sets[0].time}. Keep one.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {sets.map((s) => (
            <Button key={s.artist} variant="secondary" onClick={() => onKeep?.(s)}>
              Keep {s.artist.replace(/^The /, "")}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// A detail panel drawn as a scroll: two rollers and the paper between them.
export function ScrollPanel({
  set,
  saved,
  clashes = [],
  onToggle,
  onClose,
  titleId,
}: {
  set: FestivalSet;
  saved: boolean;
  clashes?: FestivalSet[];
  onToggle?: () => void;
  onClose?: () => void;
  titleId?: string;
}) {
  const el = ELEMENTS[set.day];
  return (
    <div>
      <div className="h-3.5 rounded-full border-[1.5px] border-(--ink) bg-[#6B4A2E]" />
      <div className="mx-3 border-x-[1.5px] border-(--ink) bg-(--paper) px-6 py-6">
        <div className="flex items-start justify-between gap-4">
          <p className={`${TYPE.label} pt-2 text-(--ink-muted)`}>
            {el.dayName} · {set.time}
          </p>
          {onClose && (
            <IconButton label="Close" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </div>
        <h3 id={titleId} className={`mt-1 ${TYPE.heading}`}>
          {set.artist}
        </h3>
        <StageLine stage={set.stage.name} />
        <p className="mt-3">{set.blurb}</p>
        {clashes.length > 0 && (
          <p className="mt-4 flex items-center gap-3">
            <Seal className="h-6 w-6 text-sm" />
            <span>
              {saved ? "Clashes with" : "Also at this hour:"} <b>{clashes.map((c) => c.artist).join(", ")}</b>
            </span>
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <AddButton added={saved} onToggle={onToggle} />
          {onClose && (
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
      <div className="h-3.5 rounded-full border-[1.5px] border-(--ink) bg-[#6B4A2E]" />
    </div>
  );
}

// A native <dialog>: it traps focus, closes on Escape, and hands focus back on close.
export function Modal({
  open,
  onClose,
  labelledBy,
  width = "w-[min(32rem,calc(100%-2rem))]",
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  width?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={`m-auto ${width} overflow-visible bg-transparent p-0 text-(--ink) backdrop:bg-[#2B2B2B]/40 backdrop:backdrop-blur-[4px]`}
    >
      {children}
    </dialog>
  );
}

/* The two signature pieces ---------------------------------------------------- */

// Balance: how your journey spreads across the four elements.
export function BalanceMeter({ saved }: { saved: FestivalSet[] }) {
  const counts = ELEMENT_ORDER.map((key) => ({ key, n: saved.filter((s) => s.day === key).length }));
  const most = Math.max(1, ...counts.map((c) => c.n));
  const missing = counts.filter((c) => c.n === 0);
  return (
    <div>
      <div className="grid grid-cols-4 items-end gap-3">
        {counts.map(({ key, n }) => {
          const el = ELEMENTS[key];
          return (
            <div key={key} className="flex flex-col items-center gap-2">
              <span className="text-sm font-bold tabular-nums">{n}</span>
              <div className="flex h-24 w-full items-end overflow-hidden rounded-[6px_4px_7px_5px] border-[1.5px] border-(--ink) bg-(--paper)">
                <div
                  className="w-full transition-[height] duration-(--el-dur) ease-(--el-ease) motion-reduce:transition-none"
                  style={{ height: `${(n / most) * 100}%`, background: el.fill }}
                />
              </div>
              <span style={{ color: el.line }}>
                <Emblem element={key} className="h-6 w-6" />
              </span>
              <span className={`${TYPE.label} tracking-[0.12em]!`}>{el.day}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-(--ink-muted)" aria-live="polite">
        {missing.length === 0
          ? "In balance: something on every day."
          : `${new Intl.ListFormat("en").format(missing.map((m) => ELEMENTS[m.key].name))} ${missing.length > 1 ? "are" : "is"} waiting: nothing on ${new Intl.ListFormat("en", { type: "disjunction" }).format(missing.map((m) => ELEMENTS[m.key].dayName))} yet.`}
      </p>
    </div>
  );
}

// Success: the set is stamped into your festival passport.
export function PassportStamp({ set }: { set: FestivalSet }) {
  const el = ELEMENTS[set.day];
  return (
    <div
      className="flex h-36 w-36 -rotate-8 flex-col items-center justify-center rounded-full border-[3px] text-center outline-[1.5px] outline-offset-[-9px] outline-current motion-safe:animate-stamp"
      style={{ color: el.line }}
    >
      <span className={`${TYPE.glyph} text-3xl`} lang="zh-Hant">
        {el.glyph}
      </span>
      <span className={`mt-1 ${TYPE.label} tracking-[0.18em]!`}>Stamped</span>
      <span className="text-xs font-bold">
        {el.day} · {set.time}
      </span>
    </div>
  );
}

/* Planner widgets: the day as a journey ------------------------------------ */


function sortBySlot(sets: FestivalSet[]) {
  return [...sets].sort((a, b) => SLOTS.indexOf(a.time) - SLOTS.indexOf(b.time));
}

// The day's saved sets as a trail, with what happens between them:
// stay put, walk (and how early to leave), or free time.
export function JourneyPath({
  day,
  saved,
  onRemove,
}: {
  day: ElementKey;
  saved: FestivalSet[];
  // When given, each stop gets a button to take it off the journey.
  onRemove?: (artist: string) => void;
}) {
  const el = ELEMENTS[day];
  const sets = sortBySlot(saved.filter((s) => s.day === day));
  if (sets.length === 0) {
    return (
      <p className={`bg-(--el-wash) p-5 text-(--ink-muted) ${SHAPE.card}`}>
        Nothing saved on {el.dayName} yet. Add a set and your path starts here.
      </p>
    );
  }
  return (
    <ol className="relative ml-3 border-l-[2px] border-dashed border-(--el-line) pl-6">
      {sets.map((s, i) => {
        const next = sets[i + 1];
        const leg = next && next.time !== s.time ? legBetween(s, next) : null;
        const clashed = sets.some((o) => o !== s && o.time === s.time);
        return (
          <li key={s.artist} className={`relative pb-2 ${onRemove ? "pr-11" : ""}`}>
            <span aria-hidden="true" className="absolute top-1.5 -left-[33px] h-4 w-4 rounded-full border-[1.5px] border-(--ink) bg-(--el)" />
            {onRemove && (
              <IconButton label={`Remove ${s.artist} from your journey`} onClick={() => onRemove(s.artist)} className="absolute top-0 right-0">
                <CloseIcon />
              </IconButton>
            )}
            <p className={`${TYPE.label} tracking-[0.1em]! text-(--ink-muted)`}>{timeRange(s.time)}</p>
            <p className="flex flex-wrap items-center gap-x-2 font-medium">
              {s.artist}
              {clashed && <Seal className="h-5 w-5 text-xs" />}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-(--ink-muted)">
              <NationMark nation={s.nation} className="h-4 w-4" />
              {s.stage.name}
            </p>
            {leg && next && (
              <p className="my-3 flex flex-wrap items-center gap-2 text-sm">
                {leg.kind === "stay" && <span className="text-(--ink-muted)">Stay at {s.stage.name}.</span>}
                {leg.kind === "free" && <span className="text-(--ink-muted)">Free for {duration(leg.minutes)}. Time for tea.</span>}
                {leg.kind === "walk" && leg.tight && (
                  <>
                    <Badge tone="tight" count={leg.minutes} />
                    <span>
                      Leave at <b>{leg.leaveAt}</b>, {leg.early} min before it ends, for {next.stage.name}.
                    </span>
                  </>
                )}
                {leg.kind === "walk" && !leg.tight && (
                  <span>
                    Leave when it ends at <b>{leg.ends}</b>, a {leg.minutes} min walk to {next.stage.name}.
                  </span>
                )}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

// Where each landmark's name sits beside its marker, clear of the trails through it.
const LANDMARK_LABEL: Record<string, { dx: number; dy: number; anchor: "start" | "end" }> = {
  Market: { dx: 2.2, dy: 0.8, anchor: "start" },
  "Tea house": { dx: 1.4, dy: -2.6, anchor: "start" },
  "Rope bridge": { dx: -2.6, dy: -3.2, anchor: "end" },
};

// The grounds as a trail map: footpaths between the gate, the landmarks, and the six
// stages. The day's route follows the trails from the gate through each stop in order,
// and every leg says how many minutes it takes on foot. A leg between back-to-back sets
// that takes longer than the 15-minute changeover is a tight walk, so its label turns to ink.
export function JourneyMap({ day, saved }: { day: ElementKey; saved: FestivalSet[] }) {
  const el = ELEMENTS[day];
  const stops: FestivalSet[] = [];
  for (const s of sortBySlot(saved.filter((x) => x.day === day))) {
    if (!stops.some((o) => o.time === s.time)) stops.push(s);
  }
  type Box = { x0: number; y0: number; x1: number; y1: number };
  const legs: { key: string; d: string; mid: { x: number; y: number }; dir: { x: number; y: number }; length: number; minutes: number; tight: boolean; arrival: boolean }[] = [];
  let from: Place = "gate";
  stops.forEach((s, i) => {
    if (s.stage.name !== from) {
      const r = routeBetween(from, s.stage.name);
      const backToBack = i > 0 && SLOTS.indexOf(s.time) - SLOTS.indexOf(stops[i - 1].time) === 1;
      legs.push({ key: `${from}-${s.stage.name}-${i}`, ...r, tight: backToBack && r.minutes > CHANGEOVER, arrival: i === 0 });
    }
    from = s.stage.name;
  });
  const label =
    stops.length === 0
      ? `Festival map. No route on ${el.dayName} yet.`
      : `${el.dayName} route along the trails: from the main gate to ${stops
          .map((s, i) => (i === 0 ? s.stage.name : `${s.stage.name}`))
          .join(", then ")}. ${legs.map((l) => `${l.minutes} min`).join(", ")} on foot.`;
  const halo = { paintOrder: "stroke" as const, stroke: "var(--paper)", strokeWidth: 0.9, strokeLinejoin: "round" as const };

  // The cliff edge follows the cliff path a little below it, closing in to meet the gorge
  // bridge, in two runs either side of the gorge.
  // A fixed scatter (not random, so the map draws the same every time) roughens the rock.
  const rough = (i: number) => ((i * 37) % 11) / 10;
  const [westCliff, eastCliff] = TRAILS.filter((t) => t.name === "Cliff path");
  const edge = [...trailPoints(westCliff, 34, 0.18, 1), ...trailPoints(eastCliff, 26, 0, 0.82)].map((p, i) => {
    const near = Math.min(1, Math.abs(p.x - GORGE.x) / 7);
    return {
      x: p.x,
      y: p.y + 0.6 + near * 2.4 + rough(i) * 0.8,
      drop: 0.7 + rough(i + 4) * 1.7,
      lean: (rough(i + 7) - 0.5) * 0.7,
    };
  });
  const cliff = [edge.filter((p) => p.x < GORGE.x - 2.8), edge.filter((p) => p.x > GORGE.x + 2.8)];

  // Each minutes label slides sideways off its trail to wherever it covers the least:
  // stage circles and names, landmark names, the gate, and the labels already placed.
  const taken: Box[] = [
    ...STAGES.flatMap((s) => {
      const p = STAGE_POS[s.name];
      const w = s.name.length * 1.3;
      return [
        { x0: p.x - 4.4, y0: p.y - 4.4, x1: p.x + 4.4, y1: p.y + 4.4 },
        { x0: p.x - w / 2, y0: p.y + 4.9, x1: p.x + w / 2, y1: p.y + 7.8 },
      ];
    }),
    ...Object.values(LANDMARKS).flatMap((m) => {
      const at = LANDMARK_LABEL[m.label];
      const w = m.label.length * 1.1;
      const x = m.x + at.dx;
      return [
        { x0: m.x - 1.2, y0: m.y - 1.2, x1: m.x + 1.2, y1: m.y + 1.2 },
        { x0: at.anchor === "end" ? x - w : x, y0: m.y + at.dy - 1.8, x1: at.anchor === "end" ? x : x + w, y1: m.y + at.dy + 0.6 },
      ];
    }),
    { x0: GATE.x - 4.5, y0: GATE.y - 2.5, x1: GATE.x + 4.5, y1: GATE.y + 2.5 },
  ];
  const overlap = (a: Box, b: Box) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
  const pills = legs.map((l) => {
    const normal = { x: -l.dir.y, y: l.dir.x };
    const spots = [0, 3.6, -3.6, 6.4, -6.4].map((k) => ({ x: l.mid.x + normal.x * k, y: l.mid.y + normal.y * k }));
    const cost = (p: { x: number; y: number }) => {
      const box = { x0: p.x - 4.4, y0: p.y - 1.9, x1: p.x + 4.4, y1: p.y + 1.9 };
      return taken.reduce((sum, t) => sum + overlap(box, t), 0);
    };
    const best = spots.reduce((a, b) => (cost(b) < cost(a) - 0.01 ? b : a));
    taken.push({ x0: best.x - 4.4, y0: best.y - 1.9, x1: best.x + 4.4, y1: best.y + 1.9 });
    return { ...l, at: best };
  });

  return (
    <figure>
      <svg role="img" aria-label={label} viewBox="0 0 100 68" className={`w-full border-[1.5px] border-(--ink) bg-(--paper) ${SHAPE.card}`}>
        {/* Contour lines, only for the feel of a hand-drawn map. */}
        <g fill="none" stroke="var(--line)" strokeWidth="0.3" opacity="0.5">
          <path d="M2 22c14-6 24 4 38-2s22-12 36-6 18 4 22 2" />
          <path d="M2 56c12 4 20-6 34-2s20 10 34 4 20-6 28-2" />
        </g>
        {/* The lake around Ember Island, with a few ripples, and the island itself. */}
        <ellipse cx={LAKE.x} cy={LAKE.y} rx={LAKE.rx} ry={LAKE.ry} fill={ELEMENTS.water.wash} />
        <ellipse cx={LAKE.x} cy={LAKE.y} rx={LAKE.rx} ry={LAKE.ry} fill="none" stroke={ELEMENTS.water.line} strokeWidth="0.3" opacity="0.6" />
        <g fill="none" stroke={ELEMENTS.water.line} strokeWidth="0.3" strokeLinecap="round" opacity="0.7">
          <path d={`M${LAKE.x - 7.4} ${LAKE.y + 2.4}q1-0.9 2 0t2 0`} />
          <path d={`M${LAKE.x + 4.2} ${LAKE.y - 3.6}q1-0.9 2 0t2 0`} />
          <path d={`M${LAKE.x + 3.2} ${LAKE.y + 4.4}q1-0.9 2 0`} />
        </g>
        <ellipse cx={STAGE_POS["Ember Island"].x} cy={STAGE_POS["Ember Island"].y + 0.2} rx="5" ry="4.9" fill="var(--paper)" stroke="var(--ink-muted)" strokeWidth="0.25" />

        {/* The river, from the top edge, over the falls, under the rope bridge, and out east. */}
        {[RIVER, OUTFLOW].map((d) => (
          <g key={d}>
            <path d={d} fill="none" stroke={ELEMENTS.water.wash} strokeWidth="3.2" />
            <path d={d} fill="none" stroke={ELEMENTS.water.line} strokeWidth="0.3" strokeDasharray="2 2.5" opacity="0.6" />
          </g>
        ))}

        {/* The cliffs: a hatched edge just below the cliff path, broken where the river falls. */}
        <g fill="none" stroke="var(--ink-muted)" strokeWidth="0.3" strokeLinecap="round">
          {cliff.map((run, r) => (
            <g key={r}>
              <path d={`M${run.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join("L")}`} strokeWidth="0.4" />
              {run.map((p, i) => (
                <path
                  key={i}
                  d={`M${(p.x - 0.35).toFixed(2)} ${p.y.toFixed(2)}l${(0.35 + p.lean).toFixed(2)} ${p.drop.toFixed(2)}L${(p.x + 0.35).toFixed(2)} ${p.y.toFixed(2)}Z`}
                  fill="var(--ink-muted)"
                  stroke="none"
                  opacity="0.75"
                />
              ))}
            </g>
          ))}
        </g>
        {/* The falls: white water where the river drops over the edge. */}
        <g stroke="var(--paper)" strokeWidth="0.35" strokeLinecap="round">
          <path d={`M${FALLS.x - 1} ${FALLS.y - 0.6}h2M${FALLS.x - 0.8} ${FALLS.y + 0.6}h1.6M${FALLS.x - 0.6} ${FALLS.y + 1.8}h1.4`} />
        </g>

        {/* Causeways: wherever a trail crosses water, the ground shows through beneath it. */}
        <g fill="none" stroke="var(--paper)" strokeWidth="1.5">
          {TRAILS.map((t) => (
            <path key={`${t.from}-${t.to}`} d={trailPath(t)} />
          ))}
        </g>
        {/* Every trail on the grounds: a dotted footpath. */}
        <g fill="none" stroke="var(--ink-muted)" strokeWidth="0.55" strokeLinecap="round" strokeDasharray="0.1 1.3">
          {TRAILS.map((t) => (
            <path key={`${t.from}-${t.to}`} d={trailPath(t)} />
          ))}
        </g>
        <text x="40" y="2.9" textAnchor="middle" fontSize="2.2" fontStyle="italic" fill="var(--ink-muted)" {...halo}>
          Cliff path
        </text>
        {/* The gorge bridge: rails and planks from one cliff edge to the other, over the falls. */}
        <g stroke="var(--ink)" strokeLinecap="round">
          <path d={`M${GORGE.x - 3.2} ${GORGE.y - 0.8}h6.4M${GORGE.x - 3.2} ${GORGE.y + 0.8}h6.4`} strokeWidth="0.4" />
          <path
            d={[-2.4, -1.2, 0, 1.2, 2.4].map((dx) => `M${GORGE.x + dx} ${GORGE.y - 0.8}v1.6`).join("")}
            strokeWidth="0.3"
          />
        </g>
        {Object.values(LANDMARKS).map((m) => (
          <g key={m.label}>
            <path d={`M${m.x} ${m.y - 1.2}l1.2 1.2-1.2 1.2-1.2-1.2Z`} fill="var(--ink-muted)" />
            <text
              x={m.x + LANDMARK_LABEL[m.label].dx}
              y={m.y + LANDMARK_LABEL[m.label].dy}
              textAnchor={LANDMARK_LABEL[m.label].anchor}
              fontSize="2.2"
              fontStyle="italic"
              fill="var(--ink-muted)"
              {...halo}
            >
              {m.label}
            </text>
          </g>
        ))}

        {/* The day's route: a paper halo under a line in the day's color; the walk in from the gate is dashed. */}
        {legs.map((l) => (
          <path key={`${l.key}-halo`} d={l.d} fill="none" stroke="var(--paper)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {legs.map((l) => (
          <path
            key={l.key}
            d={l.d}
            fill="none"
            stroke="var(--el-line)"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={l.arrival ? "2.4 1.6" : undefined}
          />
        ))}

        {/* The rope bridge: two rails across the water, over any route that uses it. */}
        <path d="M67.5 31.1L71.6 27.8M68.4 32.2L72.5 28.9" stroke="var(--ink)" strokeWidth="0.5" strokeLinecap="round" />

        <rect x={GATE.x - 4.5} y={GATE.y - 2.5} width="9" height="5" rx="1" fill="var(--ink)" />
        <text x={GATE.x} y={GATE.y + 0.9} textAnchor="middle" fontSize="2.4" fill="var(--paper)" fontWeight="700">
          GATE
        </text>
        {STAGES.map((s) => {
          const p = STAGE_POS[s.name];
          const order = stops.findIndex((o) => o.stage.name === s.name);
          const on = order >= 0;
          return (
            <g key={s.name}>
              <circle cx={p.x} cy={p.y} r="4.2" fill={on ? "var(--el)" : "var(--paper)"} stroke="var(--ink)" strokeWidth="0.6" />
              <g transform={`translate(${p.x - 2.6} ${p.y - 2.6}) scale(0.108)`} style={{ color: on ? el.on : "var(--ink)" }}>
                <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  {EMBLEMS[s.nation]}
                </g>
              </g>
              {on && (
                <>
                  <circle cx={p.x + 3.8} cy={p.y - 3.4} r="1.9" fill="var(--ink)" />
                  <text x={p.x + 3.8} y={p.y - 2.65} textAnchor="middle" fontSize="2.2" fontWeight="700" fill="var(--paper)">
                    {order + 1}
                  </text>
                </>
              )}
              <text x={p.x} y={p.y + 7} textAnchor="middle" fontSize="2.6" fontWeight={on ? 700 : 500} fill="var(--ink)" {...halo}>
                {s.name}
              </text>
            </g>
          );
        })}

        {/* Minutes on foot, halfway along each leg. */}
        {pills.map((l) => (
          <g key={`${l.key}-min`}>
            <rect
              x={l.at.x - 4.4}
              y={l.at.y - 1.9}
              width="8.8"
              height="3.8"
              rx="1.9"
              fill={l.tight ? "var(--ink)" : "var(--paper)"}
              stroke="var(--ink)"
              strokeWidth="0.35"
              strokeDasharray={l.tight ? undefined : "0.8 0.5"}
            />
            <text x={l.at.x} y={l.at.y + 0.85} textAnchor="middle" fontSize="2.2" fontWeight="700" fill={l.tight ? "var(--paper)" : "var(--ink)"}>
              {l.minutes} min
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-sm text-(--ink-muted)">
        {stops.length === 0
          ? "Dotted lines are the trails. Add a set and your route appears on them."
          : "Your route follows the trails, dashed from the gate. Minutes are on foot; ink means a tight walk."}
      </figcaption>
    </figure>
  );
}

// At the festival: what's next, how far, and when to leave. The clock is faked.
export function NextUp({
  day,
  saved,
  lineup,
  now = 18 * 60 + 40,
}: {
  day: ElementKey;
  saved: FestivalSet[];
  lineup: FestivalSet[];
  now?: number;
}) {
  const el = ELEMENTS[day];
  const mine = saved.filter((s) => s.day === day).sort((a, b) => slotMinutes(a.time) - slotMinutes(b.time));
  const next = mine.find((s) => slotMinutes(s.time) >= now);
  const before = [...mine].reverse().find((s) => slotMinutes(s.time) < now);
  const from: Place = before ? before.stage.name : "gate";
  const fromName = before ? before.stage.name : "the main gate";

  if (!next) {
    const idea = lineup.find((s) => s.day === day && slotMinutes(s.time) >= now && !saved.includes(s));
    return (
      <div className={`border-[1.5px] border-(--ink) bg-(--paper) p-5 ${SHAPE.card}`}>
        <p className={`${TYPE.label} text-(--ink-muted)`}>
          Next up · {el.dayName} {clock(now)}
        </p>
        <p className={`mt-1 ${TYPE.heading}`}>Nothing else on your {el.dayName.toLowerCase()}.</p>
        {idea && (
          <p className="mt-1 text-(--ink-muted)">
            Still restless? {idea.artist} plays {idea.stage.name} at {idea.time}, a{" "}
            {walkMinutes(from, idea.stage.name)} min walk from {fromName}.
          </p>
        )}
      </div>
    );
  }

  const walk = walkMinutes(from, next.stage.name);
  const start = slotMinutes(next.time);
  const leaveIn = start - walk - now;
  return (
    <div className={`flex flex-wrap items-center gap-5 border-[1.5px] border-(--ink) bg-(--paper) p-5 ${SHAPE.card}`}>
      <div
        className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-[3px]"
        style={{ borderColor: el.line, background: el.wash }}
      >
        <span className="text-2xl leading-none font-bold tabular-nums">{Math.max(0, leaveIn)}</span>
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase">min</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className={`${TYPE.label} text-(--ink-muted)`}>
          Next up · {el.dayName} {clock(now)}
        </p>
        <p className={`mt-1 ${TYPE.heading}`}>{next.artist}</p>
        <p className="text-(--ink-muted)">
          {next.stage.name} at {next.time}: a {walk} min walk from {fromName}, so{" "}
          <b className="text-(--ink)">{leaveIn > 0 ? `leave by ${clock(start - walk)}` : "go now"}</b>.
        </p>
      </div>
    </div>
  );
}

/* Filters: nation, stage, and genre in one compact bar ----------------------- */

export type Filters = { nations: Set<ElementKey>; stages: Set<string>; genres: Set<string> };
export const noFilters = (): Filters => ({ nations: new Set(), stages: new Set(), genres: new Set() });
export const filtersActive = (f: Filters) => f.nations.size + f.stages.size + f.genres.size > 0;

// Within one filter any option may match; across filters every filter must match.
export function matchesFilters(s: FestivalSet, f: Filters) {
  return (
    (f.nations.size === 0 || f.nations.has(s.nation)) &&
    (f.stages.size === 0 || f.stages.has(s.stage.name)) &&
    (f.genres.size === 0 || f.genres.has(s.genre))
  );
}

function toggleIn<T>(set: Set<T>, value: T) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

// One dropdown. It closes on Escape, or when focus or a click leaves it.
function FilterMenu({ label, active, children }: { label: string; active: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  // A click anywhere outside closes the menu, even in browsers that don't focus buttons on click.
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  return (
    <div
      ref={wrap}
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className={`inline-flex cursor-pointer items-center gap-2 border-[1.5px] py-2 pr-3 pl-4 font-medium transition-colors duration-(--el-dur) ${SHAPE.button} ${FOCUS} ${active > 0 ? "border-(--ink) bg-(--el-wash)" : "border-(--line) bg-(--paper) hover:border-(--ink)"}`}
      >
        {label}
        {active > 0 && <Badge tone="count" count={active} />}
        <svg aria-hidden="true" viewBox="0 0 16 16" className={`h-3.5 w-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
          <path d="M3.5 6.2c1.6 1.4 3 2.9 4.5 4.3 1.5-1.5 3-3 4.5-4.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div
          id={id}
          className={`fixed inset-x-3 top-1/4 z-30 max-h-[60vh] overflow-y-auto border-[1.5px] border-(--ink) bg-(--paper) p-4 sm:absolute sm:inset-x-auto sm:top-full sm:left-0 sm:mt-2 sm:max-h-80 sm:w-72 ${SHAPE.card}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function Option({
  checked,
  onChange,
  icon,
  name,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  icon?: ReactNode;
  name: string;
  count: number;
}) {
  return (
    <li>
      <Checkbox
        checked={checked}
        onChange={onChange}
        label={
          <span className="flex items-center gap-2">
            {icon}
            {name}
            <span className="text-sm text-(--ink-muted) tabular-nums">{count}</span>
          </span>
        }
      />
    </li>
  );
}

export function FilterBar({ filters, onChange }: { filters: Filters; onChange: (next: Filters) => void }) {
  const total = LINEUP.length;
  const shown = LINEUP.filter((s) => matchesFilters(s, filters)).length;
  const countBy = (pick: (s: FestivalSet) => string, value: string) => LINEUP.filter((s) => pick(s) === value).length;

  const chips = filterChips(filters, onChange);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <FilterMenu label="Nation" active={filters.nations.size}>
          <ul className="space-y-2.5">
            {ELEMENT_ORDER.map((n) => (
              <Option
                key={n}
                checked={filters.nations.has(n)}
                onChange={() => onChange({ ...filters, nations: toggleIn(filters.nations, n) })}
                icon={<NationMark nation={n} />}
                name={ELEMENTS[n].nation}
                count={countBy((s) => s.nation, n)}
              />
            ))}
          </ul>
        </FilterMenu>
        <FilterMenu label="Stage" active={filters.stages.size}>
          <ul className="space-y-2.5">
            {STAGES.map((st) => (
              <Option
                key={st.name}
                checked={filters.stages.has(st.name)}
                onChange={() => onChange({ ...filters, stages: toggleIn(filters.stages, st.name) })}
                icon={<NationMark nation={st.nation} />}
                name={st.name}
                count={countBy((s) => s.stage.name, st.name)}
              />
            ))}
          </ul>
        </FilterMenu>
        <FilterMenu label="Genre" active={filters.genres.size}>
          <ul className="space-y-2.5">
            {GENRES.map((g) => (
              <Option
                key={g}
                checked={filters.genres.has(g)}
                onChange={() => onChange({ ...filters, genres: toggleIn(filters.genres, g) })}
                name={g}
                count={countBy((s) => s.genre, g)}
              />
            ))}
          </ul>
        </FilterMenu>
        <p className="text-sm text-(--ink-muted)" aria-live="polite">
          {filtersActive(filters) ? `${shown} of ${total} artists` : `${total} artists`}
        </p>
      </div>
      {chips.length > 0 && (
        <div className="mt-3">
          <FilterChips chips={chips} onClear={() => onChange(noFilters())} />
        </div>
      )}
    </div>
  );
}

// The active filters as removable ink chips, ending in "Clear all".
export type ActiveFilter = { key: string; label: string; remove: () => void };

export function filterChips(filters: Filters, onChange: (next: Filters) => void): ActiveFilter[] {
  return [
    ...[...filters.nations].map((n) => ({
      key: `n-${n}`,
      label: ELEMENTS[n].nation,
      remove: () => onChange({ ...filters, nations: toggleIn(filters.nations, n) }),
    })),
    ...[...filters.stages].map((st) => ({
      key: `s-${st}`,
      label: st,
      remove: () => onChange({ ...filters, stages: toggleIn(filters.stages, st) }),
    })),
    ...[...filters.genres].map((g) => ({
      key: `g-${g}`,
      label: g,
      remove: () => onChange({ ...filters, genres: toggleIn(filters.genres, g) }),
    })),
  ];
}

// An applied filter: ink, because you chose it. Press it to take the filter away.
export function RemovableChip({
  label,
  onRemove,
  force,
  disabled,
}: {
  label: string;
  onRemove?: () => void;
  force?: Force;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      disabled={disabled}
      aria-label={`Remove filter: ${label}`}
      className={`inline-flex items-center gap-1.5 border-[1.5px] border-(--ink) bg-(--ink) py-1 pr-2 pl-3 text-sm font-medium text-(--paper) enabled:cursor-pointer enabled:hover:brightness-[1.35] ${SHAPE.button} ${BEND} ${FOCUS} ${DISABLED} ${pin({ hover: "brightness-[1.35]!", pressed: "brightness-[1.35]!" }, force)}`}
    >
      {label}
      <CloseIcon className="h-3.5 w-3.5" />
    </button>
  );
}

export function FilterChips({ chips, onClear }: { chips: ActiveFilter[]; onClear: () => void }) {
  if (chips.length === 0) return null;
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((c) => (
        <li key={c.key}>
          <RemovableChip label={c.label} onRemove={c.remove} />
        </li>
      ))}
      <li>
        <button type="button" onClick={onClear} className={`cursor-pointer text-sm ${LINK}`}>
          Clear all
        </button>
      </li>
    </ul>
  );
}

// Every option at once, for a roomy panel: nation, stage, and genre as checklists with counts.
export function FilterGroups({ filters, onChange }: { filters: Filters; onChange: (next: Filters) => void }) {
  const countBy = (pick: (s: FestivalSet) => string, value: string) => LINEUP.filter((s) => pick(s) === value).length;
  const groups = [
    {
      legend: "Nation",
      options: ELEMENT_ORDER.map((n) => ({
        key: n,
        checked: filters.nations.has(n),
        onChange: () => onChange({ ...filters, nations: toggleIn(filters.nations, n) }),
        icon: <NationMark nation={n} />,
        name: ELEMENTS[n].nation,
        count: countBy((s) => s.nation, n),
      })),
    },
    {
      legend: "Stage",
      options: STAGES.map((st) => ({
        key: st.name,
        checked: filters.stages.has(st.name),
        onChange: () => onChange({ ...filters, stages: toggleIn(filters.stages, st.name) }),
        icon: <NationMark nation={st.nation} />,
        name: st.name,
        count: countBy((s) => s.stage.name, st.name),
      })),
    },
    {
      legend: "Genre",
      options: GENRES.map((g) => ({
        key: g,
        checked: filters.genres.has(g),
        onChange: () => onChange({ ...filters, genres: toggleIn(filters.genres, g) }),
        icon: undefined,
        name: g,
        count: countBy((s) => s.genre, g),
      })),
    },
  ];
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {groups.map((g) => (
        <fieldset key={g.legend} className="min-w-0">
          <legend className={`${TYPE.label} text-(--ink-muted)`}>{g.legend}</legend>
          <ul className="mt-3 space-y-2.5">
            {g.options.map(({ key, ...o }) => (
              <Option key={key} {...o} />
            ))}
          </ul>
        </fieldset>
      ))}
    </div>
  );
}
