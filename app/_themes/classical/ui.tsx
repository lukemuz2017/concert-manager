"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  type ComponentProps,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

import { DAY_NAMES, type Performance, type Venue } from "./programme";
import { TYPE } from "./tokens";

// The Classical component library. The design system documents these, and the
// site would be built from them if this theme were chosen.
//
// Controls take an optional `force` to pin them in a state for the design
// system. Pinned classes end in `!` so they win over the live ones.

export type Force = "hover" | "focus" | "pressed";

// Focus is a 2px charcoal ring set 3px off the control: 12.5:1 on ivory.
export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--charcoal)";
const FOCUSED = "outline-2 outline-offset-3 outline-(--charcoal)";

// Disabled fades to a hairline with muted text. It never keeps a fill.
const DISABLED =
  "disabled:cursor-not-allowed disabled:border-(--hairline)! disabled:bg-transparent! disabled:text-(--muted)! disabled:shadow-none!";

function pinned(recipe: { hover: string; pressed: string }, force?: Force) {
  if (force === "focus") return FOCUSED;
  return force ? recipe[force] : "";
}

/* Icons: fine lines, like an engraving ------------------------------------ */

export function Icon({ children, className = "h-6 w-6" }: { children: ReactNode; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      {children}
    </svg>
  );
}

const VENUE_ICONS: Record<Venue["icon"], ReactNode> = {
  hall: <path d="M4 12h24M5 12 16 5l11 7M8 12v12M13 12v12M19 12v12M24 12v12M5 25h22M3 28h26" />,
  gallery: (
    <>
      <path d="M16 3v7M7 12c0 5 18 5 18 0M7 12V9M12 14v-4M16 15v-5M20 14v-4M25 12V9M11 20c2 4 8 4 10 0M16 18v7" />
      <circle cx="16" cy="27" r="1.4" />
    </>
  ),
  chapel: (
    <>
      <path d="M9 28V15a7 7 0 0 1 14 0v13ZM6 28h20M16 8V3M14 5h4" />
      <circle cx="16" cy="16" r="3" />
    </>
  ),
  orangery: (
    <>
      <circle cx="16" cy="11" r="7" />
      <path d="M16 18v5M10 23h12l-2 6h-8Z" />
      <circle cx="13" cy="10" r="1" fill="currentColor" />
      <circle cx="19" cy="12" r="1" fill="currentColor" />
      <circle cx="16" cy="7" r="1" fill="currentColor" />
    </>
  ),
  gardens: (
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
  pavilion: (
    <path d="M16 4v3M7 14c0-6 18-6 18 0M6 14h20M9 14v9M16 14v9M23 14v9M6 23h20M4 27c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0 4 1.5 6 0" />
  ),
};

export function VenueIcon({ venue, className = "h-6 w-6" }: { venue: Venue; className?: string }) {
  return <Icon className={className}>{VENUE_ICONS[venue.icon]}</Icon>;
}

export function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
      <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
      <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
      <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// A small terracotta lozenge: the mark of a double engagement.
export function ClashMark({ className = "h-2.5 w-2.5" }: { className?: string }) {
  return <span aria-hidden="true" className={`inline-block shrink-0 rotate-45 bg-(--terracotta) ${className}`} />;
}

export function Ornament({ className = "" }: { className?: string }) {
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

/* Buttons and link ------------------------------------------------------- */

const BUTTON_BASE = `inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 ${TYPE.label} whitespace-nowrap transition duration-100 enabled:cursor-pointer ${FOCUS} ${DISABLED}`;

const BUTTON = {
  primary: {
    rest: "border-(--forest) bg-(--forest) text-white enabled:hover:border-(--forest-hover) enabled:hover:bg-(--forest-hover) enabled:active:translate-y-px enabled:active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.28)]",
    hover: "border-(--forest-hover)! bg-(--forest-hover)!",
    pressed: "border-(--forest-hover)! bg-(--forest-hover)! translate-y-px! shadow-[inset_0_2px_5px_rgba(0,0,0,0.28)]!",
  },
  secondary: {
    rest: "border-(--charcoal) bg-transparent text-(--charcoal) enabled:hover:bg-(--linen) enabled:active:translate-y-px enabled:active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.12)]",
    hover: "bg-(--linen)!",
    pressed: "bg-(--linen)! translate-y-px! shadow-[inset_0_2px_5px_rgba(0,0,0,0.12)]!",
  },
  // The primary action once it's done: forest on linen, quieter than the invitation.
  added: {
    rest: "border-(--forest) bg-(--linen) text-(--forest) enabled:hover:bg-(--paper)",
    hover: "bg-(--paper)!",
    pressed: "bg-(--paper)! translate-y-px!",
  },
};

export function Button({
  variant = "primary",
  force,
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: "primary" | "secondary"; force?: Force }) {
  const recipe = BUTTON[variant];
  return (
    <button type="button" className={`${BUTTON_BASE} ${recipe.rest} ${pinned(recipe, force)} ${className}`} {...props} />
  );
}

// The product's main action: save a performance to your itinerary.
export function AddButton({
  added,
  onToggle,
  force,
  disabled,
}: {
  added: boolean;
  onToggle?: () => void;
  force?: Force;
  disabled?: boolean;
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
      {added ? "In your itinerary" : "Add to itinerary"}
      {added ? <CheckIcon /> : <PlusIcon />}
    </button>
  );
}

const LINK = `rounded-[2px] underline decoration-1 underline-offset-4 hover:decoration-2 ${FOCUS}`;

export function TextLink({ href, force, children }: { href: string; force?: "hover" | "focus"; children: ReactNode }) {
  const look = force === "hover" ? "decoration-2!" : force === "focus" ? FOCUSED : "";
  return (
    <Link href={href} className={`${LINK} ${look}`}>
      {children}
    </Link>
  );
}

const ROUND_PINNED = { hover: "bg-(--linen)!", pressed: "bg-(--linen)! translate-y-px!" };

// Round icon button: close, and the compact save toggle in itinerary rows.
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
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--rule) bg-(--paper) text-(--charcoal) transition duration-100 enabled:cursor-pointer enabled:hover:bg-(--linen) enabled:active:translate-y-px ${FOCUS} ${DISABLED} ${pinned(ROUND_PINNED, force)} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SaveToggle({ saved, title, onToggle }: { saved: boolean; title: string; onToggle?: () => void }) {
  return (
    <IconButton
      label={saved ? `Remove ${title} from itinerary` : `Add ${title} to itinerary`}
      aria-pressed={saved}
      onClick={onToggle}
      className={saved ? "border-(--forest) bg-(--forest) text-white enabled:hover:bg-(--forest-hover)" : ""}
    >
      {saved ? <CheckIcon /> : <PlusIcon />}
    </IconButton>
  );
}

/* Chips and badges ------------------------------------------------------- */

const CHIP_PINNED = { hover: "bg-(--linen)!", pressed: "bg-(--linen)! translate-y-px!" };

// A venue filter. Selected is forest, like every selected control.
export function VenueChip({
  venue,
  selected = false,
  onToggle,
  force,
  disabled,
}: {
  venue: Venue;
  selected?: boolean;
  onToggle?: () => void;
  force?: Force;
  disabled?: boolean;
}) {
  const look = selected
    ? "border-(--forest) bg-(--forest) text-white"
    : "border-(--rule) bg-(--paper) text-(--charcoal) enabled:hover:bg-(--linen)";
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onToggle}
      className={`inline-flex items-center gap-2 rounded-full border py-1.5 pr-4 pl-3 whitespace-nowrap transition duration-100 enabled:cursor-pointer enabled:active:translate-y-px ${FOCUS} ${DISABLED} ${look} ${pinned(CHIP_PINNED, force)}`}
    >
      <VenueIcon venue={venue} className={`h-5 w-5 ${selected ? "" : "text-(--antique-gold)"}`} />
      {venue.name}
      {selected && <CheckIcon />}
    </button>
  );
}

// Badges label status. They are never buttons, so they are small and quiet.
export function Badge({ tone, count }: { tone: "clash" | "count"; count?: number }) {
  if (tone === "count") {
    return (
      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-(--forest) px-1.5 text-xs font-semibold text-white tabular-nums">
        {count}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-(--terracotta) bg-(--paper) px-2.5 py-1 whitespace-nowrap ${TYPE.label} tracking-[0.12em]!`}
    >
      <ClashMark className="h-2 w-2" />
      Double engagement
    </span>
  );
}

/* Form controls ---------------------------------------------------------- */

const FIELD = `w-full rounded-[2px] border border-(--rule) bg-(--paper) px-4 py-3 text-(--charcoal) placeholder:text-(--muted) transition duration-100 enabled:hover:border-(--charcoal) focus-visible:border-(--charcoal) ${FOCUS} disabled:cursor-not-allowed disabled:border-(--hairline) disabled:bg-(--linen) disabled:text-(--muted)`;

function fieldPin(force?: "hover" | "focus") {
  if (force === "hover") return "border-(--charcoal)!";
  if (force === "focus") return `border-(--charcoal)! ${FOCUSED}`;
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
      <label htmlFor={id} className={hideLabel ? "sr-only" : `${TYPE.label} text-(--muted)`}>
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
      <label htmlFor={id} className={`${TYPE.label} text-(--muted)`}>
        {label}
      </label>
      <div className="relative">
        <select id={id} className={`${FIELD} appearance-none pr-11 enabled:cursor-pointer ${fieldPin(force)}`} {...props}>
          {children}
        </select>
        <svg aria-hidden="true" viewBox="0 0 16 16" className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2">
          <path d="M3.5 6l4.5 4.5L12.5 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

const BOX = `peer h-[18px] w-[18px] shrink-0 appearance-none border border-(--rule) bg-(--paper) transition duration-100 checked:border-(--forest) enabled:cursor-pointer enabled:hover:border-(--charcoal) disabled:cursor-not-allowed disabled:border-(--hairline) disabled:bg-(--linen) ${FOCUS}`;

function boxPin(force?: "hover" | "focus") {
  if (force === "hover") return "border-(--charcoal)!";
  if (force === "focus") return FOCUSED;
  return "";
}

const CHOICE = "inline-flex cursor-pointer items-center gap-2.5 has-[:disabled]:cursor-not-allowed has-[:disabled]:text-(--muted)";

export function Checkbox({
  label,
  force,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; force?: "hover" | "focus" }) {
  return (
    <label className={CHOICE}>
      <span className="relative inline-flex shrink-0">
        <input type="checkbox" className={`${BOX} rounded-[2px] checked:bg-(--forest) ${boxPin(force)}`} {...props} />
        <CheckIcon className="pointer-events-none absolute inset-0 m-auto hidden h-3.5 w-3.5 text-white peer-checked:block" />
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
        <span className="pointer-events-none absolute inset-0 m-auto hidden h-2 w-2 rounded-full bg-(--forest) peer-checked:block" />
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
    ? "border-(--forest) bg-(--forest)"
    : `border-(--rule) bg-(--paper) group-hover:border-(--charcoal) ${force === "hover" ? "border-(--charcoal)!" : ""}`;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`group inline-flex items-center gap-3 rounded-full text-left enabled:cursor-pointer disabled:cursor-not-allowed disabled:text-(--muted) ${FOCUS} ${force === "focus" ? FOCUSED : ""}`}
    >
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full border transition duration-150 group-disabled:border-(--hairline)! group-disabled:bg-(--linen)! ${track}`}
      >
        <span
          className={`absolute top-[3px] left-[3px] h-4 w-4 rounded-full transition duration-150 group-disabled:bg-(--hairline)! ${checked ? "translate-x-5 bg-white" : "bg-(--rule)"}`}
        />
      </span>
      {label}
    </button>
  );
}

/* Tabs ------------------------------------------------------------------- */

// Day tabs, underlined like a printed programme. Arrow keys move between them.
export function Tabs({
  label,
  tabs,
  selected,
  onSelect,
  children,
}: {
  label: string;
  tabs: readonly string[];
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
        className="grid border-b border-(--hairline)"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
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
              className={`-mb-px cursor-pointer border-b-2 py-3 transition duration-100 ${TYPE.label} ${FOCUS} ${on ? "border-(--forest) bg-(--linen) text-(--charcoal)" : "border-transparent text-(--muted) hover:bg-(--linen) hover:text-(--charcoal)"}`}
            >
              {tab}
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

/* Performances: card, row, notice, detail, modal ------------------------- */

export function PerformanceCard({
  performance: p,
  saved,
  onToggle,
  onDetails,
  image,
}: {
  performance: Performance;
  saved: boolean;
  onToggle?: () => void;
  onDetails?: () => void;
  image?: ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-[2px] bg-(--paper) shadow-[0_1px_2px_rgba(47,47,47,0.06),0_12px_28px_-16px_rgba(47,47,47,0.28)]">
      {image && <div className="relative h-40">{image}</div>}
      <div className="p-5">
        <p className={`${TYPE.label} text-(--muted)`}>
          {DAY_NAMES[p.day]} · {p.time}
        </p>
        <h3 className={`mt-2 ${TYPE.heading}`}>{p.title}</h3>
        <p className="mt-1 text-(--muted) italic">{p.programme}</p>
        <p className="mt-3 flex items-center gap-2">
          <VenueIcon venue={p.venue} className="h-5 w-5 text-(--antique-gold)" />
          {p.venue.name}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
          <AddButton added={saved} onToggle={onToggle} />
          {onDetails && (
            <button type="button" onClick={onDetails} className={`cursor-pointer ${LINK}`}>
              Programme notes
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// One line of the itinerary: time, venue icon, title, and a round save toggle.
export function ItineraryRow({
  performance: p,
  saved,
  clash,
  onToggle,
  onDetails,
}: {
  performance: Performance;
  saved: boolean;
  clash?: boolean;
  onToggle?: () => void;
  onDetails?: () => void;
}) {
  return (
    <li className={`flex items-center gap-4 border-b border-(--hairline) px-2 py-4 last:border-b-0 ${saved ? "bg-(--linen)" : ""}`}>
      <span className="w-16 shrink-0 text-sm text-(--muted) tabular-nums">{p.time}</span>
      <VenueIcon venue={p.venue} className="h-6 w-6 text-(--antique-gold)" />
      <span className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
        <span className="min-w-0">
          {/* A dotted underline marks the title as the way into the programme notes. */}
          <button
            type="button"
            onClick={onDetails}
            className={`block cursor-pointer rounded-[2px] text-left underline decoration-(--rule) decoration-dotted decoration-1 underline-offset-4 hover:decoration-(--charcoal) hover:decoration-solid ${FOCUS}`}
          >
            {p.title}
          </button>
          <span className="text-sm text-(--muted)">{p.venue.name}</span>
        </span>
        {clash && <Badge tone="clash" />}
      </span>
      <SaveToggle saved={saved} title={p.title} onToggle={onToggle} />
    </li>
  );
}

// The double engagement, spelled out with a way to resolve it.
export function ClashNotice({
  sets,
  onKeep,
}: {
  sets: Performance[];
  onKeep?: (p: Performance) => void;
}) {
  return (
    <div role="alert" className="border-l-4 border-(--terracotta) bg-(--paper) p-5">
      <p className={`${TYPE.heading} italic`}>You are expected in two salons at once.</p>
      <p className="mt-1 text-(--muted)">
        {sets.map((s) => `${s.title} in the ${s.venue.name}`).join(" and ")} both begin at {sets[0].time}. Choose one.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {sets.map((s) => (
          <Button key={s.title} variant="secondary" onClick={() => onKeep?.(s)}>
            Keep {s.title.split(" ")[0]}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function DetailPanel({
  performance: p,
  saved,
  clashes = [],
  onToggle,
  onClose,
  titleId,
}: {
  performance: Performance;
  saved: boolean;
  clashes?: Performance[];
  onToggle?: () => void;
  onClose?: () => void;
  titleId?: string;
}) {
  return (
    <div className="bg-(--paper) p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <p className={`${TYPE.label} pt-2 text-(--muted)`}>
          {DAY_NAMES[p.day]} · {p.time}
        </p>
        {onClose && (
          <IconButton label="Close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </div>
      <h3 id={titleId} className={`mt-2 ${TYPE.heading}`}>
        {p.title}
      </h3>
      <p className="mt-2 flex items-center gap-2">
        <VenueIcon venue={p.venue} className="h-5 w-5 text-(--antique-gold)" />
        {p.venue.name}
      </p>
      <Ornament className="my-5 w-32 text-(--gold)" />
      <p className={`${TYPE.label} text-(--muted)`}>Programme</p>
      <p className="mt-1 font-(family-name:--font-playfair) text-base leading-relaxed italic">{p.programme}</p>
      {clashes.length > 0 && (
        <p className="mt-5 flex items-start gap-3 border-l-4 border-(--terracotta) bg-(--ivory) p-3">
          <span>
            {saved ? "Double engagement with" : "Also at this hour:"} <b className="font-semibold">{clashes.map((c) => c.title).join(", ")}</b>.
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
      className="m-auto w-[min(32rem,calc(100%-2rem))] overflow-hidden rounded-[2px] bg-transparent p-0 text-(--charcoal) shadow-[0_2px_4px_rgba(47,47,47,0.08),0_24px_48px_-20px_rgba(47,47,47,0.4)] backdrop:bg-[#2F2F2F]/50"
    >
      {children}
    </dialog>
  );
}
