"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

import { TYPE, type Stage } from "./tokens";

// The Candyland component library. The design system documents these and the
// site is built from them, so a change here shows up in both.
//
// Controls take an optional `force` to pin them in a state, so the design system
// can show hover, focus, and pressed side by side. Pinned classes end in `!` so
// they win over the live ones.

export type Force = "hover" | "focus" | "pressed";

// Focus is always a 3px cocoa ring: 13.8:1 on cream, whatever the control's color.
const FOCUS = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--text)";
const FOCUSED = "outline-3 outline-offset-2 outline-(--text)";

// Disabled is flat with a dashed edge, so it never looks pressable.
const DISABLED =
  "disabled:cursor-not-allowed disabled:border-dashed disabled:border-(--border)! disabled:bg-(--wash) disabled:text-(--muted) disabled:shadow-none";

function pinned(recipe: { hover: string; pressed: string }, force?: Force) {
  if (force === "focus") return FOCUSED;
  return force ? recipe[force] : "";
}

export function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
      <path
        d="M3.5 8.5l3 3 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0">
      <path d="M8 1.8 14.8 14H1.2Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 6.2v3.4M8 11.8v.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Dot({ stage, className = "" }: { stage: Stage; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${className}`}
      style={{ background: stage.hex }}
    />
  );
}

/* Buttons ---------------------------------------------------------------- */

const BUTTON_BASE = `inline-flex items-center justify-center gap-2 rounded-2xl border-2 px-5 py-3 font-(family-name:--font-fredoka) text-base font-semibold whitespace-nowrap select-none transition duration-75 enabled:cursor-pointer ${FOCUS} ${DISABLED}`;

const BUTTON = {
  // Cherry, with a hard edge it sinks onto when pressed.
  primary: {
    rest: "border-transparent bg-(--accent) text-white shadow-[0_5px_0_var(--accent-shadow)] enabled:hover:bg-(--accent-hover) enabled:active:translate-y-[5px] enabled:active:shadow-none",
    hover: "bg-(--accent-hover)!",
    pressed: "bg-(--accent-hover)! translate-y-[5px]! shadow-none!",
  },
  secondary: {
    rest: "border-(--text) bg-(--surface) text-(--text) shadow-[0_4px_0_var(--text)] enabled:hover:bg-(--wash) enabled:active:translate-y-[4px] enabled:active:shadow-none",
    hover: "bg-(--wash)!",
    pressed: "bg-(--wash)! translate-y-[4px]! shadow-none!",
  },
  // The primary action once it's on: cocoa, and it stays pressed down.
  added: {
    rest: "translate-y-[5px] border-(--text) bg-(--text) text-(--bg) enabled:hover:border-(--muted) enabled:hover:bg-(--muted)",
    hover: "border-(--muted)! bg-(--muted)!",
    pressed: "border-(--muted)! bg-(--muted)!",
  },
};

export function Button({
  variant = "primary",
  force,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary"; force?: Force }) {
  const recipe = BUTTON[variant];
  return (
    <button
      type="button"
      className={`${BUTTON_BASE} ${recipe.rest} ${pinned(recipe, force)} ${className}`}
      {...props}
    />
  );
}

// The product's main action. Once pressed it stays down: the set is on your list.
export function AddButton({
  added,
  onToggle,
  force,
  disabled,
  label = "Add to my set list",
  addedLabel = "On my set list",
}: {
  added: boolean;
  onToggle?: () => void;
  force?: Force;
  disabled?: boolean;
  label?: string;
  addedLabel?: string;
}) {
  const recipe = added ? BUTTON.added : BUTTON.primary;
  return (
    <button
      type="button"
      aria-pressed={added}
      disabled={disabled}
      onClick={onToggle}
      className={`${BUTTON_BASE} ${recipe.rest} ${pinned(recipe, force)}`}
    >
      {added && <CheckIcon />}
      {added ? addedLabel : label}
    </button>
  );
}

const LINK = `rounded-sm font-bold underline decoration-2 underline-offset-4 hover:decoration-4 ${FOCUS}`;

export function TextLink({ href, force, children }: { href: string; force?: "hover" | "focus"; children: ReactNode }) {
  const look = force === "hover" ? "decoration-4!" : force === "focus" ? FOCUSED : "";
  return (
    <Link href={href} className={`${LINK} ${look}`}>
      {children}
    </Link>
  );
}

/* Chips, badges ---------------------------------------------------------- */

const CHIP_PINNED = { hover: "bg-(--wash)!", pressed: "bg-(--wash)! scale-95!" };

// A filter chip. Selected means filled cocoa with a check, like every selected control.
export function Chip({
  stage,
  selected = false,
  onToggle,
  force,
  disabled,
}: {
  stage: Stage;
  selected?: boolean;
  onToggle?: () => void;
  force?: Force;
  disabled?: boolean;
}) {
  const look = selected ? "bg-(--text) text-(--bg)" : "bg-(--surface) text-(--text) enabled:hover:bg-(--wash)";
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 font-bold whitespace-nowrap select-none transition duration-75 enabled:cursor-pointer enabled:active:scale-95 ${FOCUS} ${DISABLED} ${look} ${pinned(CHIP_PINNED, force)}`}
      style={{ borderColor: selected ? "var(--text)" : stage.hex }}
    >
      <Dot stage={stage} className={`${selected ? "ring-2 ring-(--bg)" : ""} ${disabled ? "opacity-40" : ""}`} />
      {stage.name}
      {selected && <CheckIcon />}
    </button>
  );
}

// Badges label things; they are never buttons, so they are smaller and set in the label style.
export function Badge({ tone }: { tone: "headliner" | "crash" }) {
  if (tone === "crash") {
    return (
      <span
        className={`inline-flex -rotate-2 items-center gap-1 rounded-full border-2 border-(--text) bg-(--surface) px-2 py-0.5 whitespace-nowrap shadow-[0_2px_0_var(--text)] ${TYPE.label}`}
      >
        <WarningIcon />
        Sugar Crash
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center rounded-full bg-(--wash) px-2 py-0.5 whitespace-nowrap ${TYPE.label}`}>
      Headliner
    </span>
  );
}

/* Form controls ---------------------------------------------------------- */

const FIELD = `w-full rounded-2xl border-2 border-(--border) bg-(--surface) px-4 py-3 text-(--text) placeholder:text-(--muted) transition duration-75 enabled:hover:border-(--text) focus-visible:border-(--text) ${FOCUS} disabled:cursor-not-allowed disabled:border-dashed disabled:bg-(--wash) disabled:text-(--muted)`;

function fieldPin(force?: "hover" | "focus") {
  if (force === "hover") return "border-(--text)!";
  if (force === "focus") return `border-(--text)! ${FOCUSED}`;
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
      <label htmlFor={id} className={hideLabel ? "sr-only" : TYPE.label}>
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
      <label htmlFor={id} className={TYPE.label}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={`${FIELD} appearance-none pr-11 font-bold enabled:cursor-pointer ${fieldPin(force)}`}
          {...props}
        >
          {children}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2"
        >
          <path
            d="M3.5 6l4.5 4.5L12.5 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

const BOX = `peer h-5 w-5 shrink-0 appearance-none border-2 border-(--border) bg-(--surface) transition duration-75 checked:border-(--text) enabled:cursor-pointer enabled:hover:border-(--text) disabled:cursor-not-allowed disabled:border-dashed disabled:bg-(--wash) ${FOCUS}`;

function boxPin(force?: "hover" | "focus") {
  if (force === "hover") return "border-(--text)!";
  if (force === "focus") return FOCUSED;
  return "";
}

// The bare checkbox, shared by Checkbox and the selectable list row.
function Box({ force, ...props }: InputHTMLAttributes<HTMLInputElement> & { force?: "hover" | "focus" }) {
  return (
    <span className="relative inline-flex shrink-0">
      <input type="checkbox" className={`${BOX} rounded-[6px] checked:bg-(--text) ${boxPin(force)}`} {...props} />
      <CheckIcon className="pointer-events-none absolute inset-0 m-auto hidden h-3.5 w-3.5 text-(--bg) peer-checked:block" />
    </span>
  );
}

const CHOICE_LABEL = "inline-flex cursor-pointer items-center gap-2 has-[:disabled]:cursor-not-allowed has-[:disabled]:text-(--muted)";

export function Checkbox({
  label,
  force,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; force?: "hover" | "focus" }) {
  return (
    <label className={CHOICE_LABEL}>
      <Box force={force} {...props} />
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
    <label className={CHOICE_LABEL}>
      <span className="relative inline-flex shrink-0">
        <input type="radio" className={`${BOX} rounded-full ${boxPin(force)}`} {...props} />
        <span className="pointer-events-none absolute inset-0 m-auto hidden h-2.5 w-2.5 rounded-full bg-(--text) peer-checked:block" />
      </span>
      {label}
    </label>
  );
}

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
  const track = checked
    ? "border-(--text) bg-(--text)"
    : `border-(--border) bg-(--surface) group-hover:border-(--text) ${force === "hover" ? "border-(--text)!" : ""}`;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`group inline-flex items-center gap-3 rounded-full text-left font-bold enabled:cursor-pointer disabled:cursor-not-allowed disabled:text-(--muted) ${FOCUS} ${force === "focus" ? FOCUSED : ""}`}
    >
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full border-2 transition duration-100 group-disabled:border-dashed group-disabled:border-(--border)! group-disabled:bg-(--wash)! ${track}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full transition duration-100 ${checked ? "translate-x-5 bg-(--bg)" : "bg-(--border)"}`}
        />
      </span>
      {label}
    </button>
  );
}

/* Tabs ------------------------------------------------------------------- */

// Arrow keys move between tabs, per the WAI-ARIA tabs pattern.
export function Tabs({
  label,
  tabs,
  selected,
  onSelect,
  children,
}: {
  label: string;
  tabs: string[];
  selected: string;
  onSelect: (tab: string) => void;
  children: ReactNode;
}) {
  const id = useId();
  const current = tabs.indexOf(selected);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = {
      ArrowRight: (current + 1) % tabs.length,
      ArrowLeft: (current - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!(e.key in moves)) return;
    e.preventDefault();
    onSelect(tabs[moves[e.key]]);
    document.getElementById(`${id}-tab-${moves[e.key]}`)?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="inline-flex gap-1 rounded-full border-2 border-(--border) bg-(--surface) p-1"
      >
        {tabs.map((tab, i) => {
          const on = i === current;
          return (
            <button
              key={tab}
              id={`${id}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`${id}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => onSelect(tab)}
              className={`cursor-pointer rounded-full px-4 py-1.5 font-bold transition duration-75 ${FOCUS} ${on ? "bg-(--text) text-(--bg)" : "hover:bg-(--wash) active:scale-95"}`}
            >
              {tab}
            </button>
          );
        })}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${current}`} className="mt-4">
        {children}
      </div>
    </div>
  );
}

/* Sets: card, list row, detail panel, modal ------------------------------ */

export type FestivalSet = {
  artist: string;
  stage: Stage;
  day: string;
  time: string;
  blurb: string;
  headliner?: boolean;
};

export function ArtistCard({
  set,
  added,
  clash,
  onToggle,
  onDetails,
}: {
  set: FestivalSet;
  added: boolean;
  clash?: boolean;
  onToggle?: () => void;
  onDetails?: () => void;
}) {
  return (
    <article
      className="flex flex-col rounded-2xl border-l-[10px] bg-(--surface) p-4 shadow-[0_4px_0_rgba(59,31,43,0.15)]"
      style={{ borderLeftColor: set.stage.hex }}
    >
      <div className="flex min-h-6 flex-wrap items-center justify-between gap-2">
        <p className={`${TYPE.label} text-(--muted)`}>
          {set.day} · {set.time}
        </p>
        {clash ? <Badge tone="crash" /> : set.headliner && <Badge tone="headliner" />}
      </div>
      <h3 className={`mt-2 ${TYPE.heading}`}>{set.artist}</h3>
      <p className="mt-1 flex items-center gap-1.5 text-(--muted)">
        <Dot stage={set.stage} />
        {set.stage.name}
      </p>
      <div className="mt-4 flex flex-wrap gap-3 pb-[5px]">
        <AddButton added={added} onToggle={onToggle} />
        {onDetails && (
          <Button variant="secondary" onClick={onDetails}>
            Details
          </Button>
        )}
      </div>
    </article>
  );
}

// A schedule row. The whole row is the checkbox's label, so the row is the hit area.
export function SetRow({
  set,
  added,
  clash,
  onToggle,
}: {
  set: FestivalSet;
  added: boolean;
  clash?: boolean;
  onToggle?: () => void;
}) {
  return (
    <li>
      <label
        className={`flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 transition duration-75 ${added ? "bg-(--wash)" : "hover:bg-(--wash)/50"}`}
      >
        <Box checked={added} onChange={onToggle} />
        <span className={`w-16 shrink-0 ${TYPE.label} text-(--muted)`}>{set.time}</span>
        {/* On narrow screens the badge wraps under the name instead of squeezing it. */}
        <span className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
          <span className="min-w-0">
            <span className="block font-bold">{set.artist}</span>
            <span className="flex items-center gap-1.5 text-(--muted)">
              <Dot stage={set.stage} />
              {set.stage.name}
            </span>
          </span>
          {clash && <Badge tone="crash" />}
        </span>
      </label>
    </li>
  );
}

export function DetailPanel({
  set,
  added,
  onToggle,
  onClose,
  titleId,
}: {
  set: FestivalSet;
  added: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  titleId?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-(--surface)">
      <div className="h-3" style={{ background: set.stage.hex }} />
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={`${TYPE.label} text-(--muted)`}>
            {set.day} · {set.time} · {set.stage.name}
          </p>
          {set.headliner && <Badge tone="headliner" />}
        </div>
        <h3 id={titleId} className={`mt-2 ${TYPE.heading}`}>
          {set.artist}
        </h3>
        <p className={`mt-3 ${TYPE.body}`}>{set.blurb}</p>
        <div className="mt-5 flex flex-wrap gap-3 pb-[5px]">
          <AddButton added={added} onToggle={onToggle} />
          {onClose && (
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// A native <dialog>: it traps focus, closes on Escape, and hands focus back on close.
export function Modal({
  open,
  onClose,
  labelledBy,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
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
      className="m-auto w-[min(30rem,calc(100%-2rem))] rounded-2xl bg-transparent p-0 text-(--text) shadow-[0_6px_0_rgba(59,31,43,0.35)] backdrop:bg-[#3B1F2B]/60"
    >
      {children}
    </dialog>
  );
}
