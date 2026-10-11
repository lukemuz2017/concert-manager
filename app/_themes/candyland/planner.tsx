"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { clashesWith, DAY_NAMES, DAYS, LINEUP, SLOTS, tier, type Day, type FestivalSet } from "./lineup";
import { shadow, STAGES, TYPE } from "./tokens";
import {
  AddButton,
  Badge,
  Button,
  CheckIcon,
  Checkbox,
  Chip,
  CloseIcon,
  Dot,
  FOCUS,
  IconButton,
  Radio,
  Tabs,
  TextField,
  Toggle,
  WarningIcon,
} from "./ui";

// The planner: a poster per day, a detail popover, search, and the plan drawer.
// The design system shows it in a frame (`contained`); the site uses it full page.

type Status = "planned" | "crash" | null;

function names(sets: FestivalSet[]) {
  return sets.map((s) => s.artist).join(" and ");
}

/* Poster ----------------------------------------------------------------- */

// The festival lockup, with the candy-stripe lettering from the mood board.
function Logo() {
  return (
    <span
      className={`block ${TYPE.display}`}
      style={{
        backgroundImage: "repeating-linear-gradient(115deg, #E63946 0 7px, #FF8FC4 7px 12px)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextStroke: "1.5px var(--text)",
      }}
    >
      Sugar Rush
    </span>
  );
}

// The board's rainbow path. All six stage colors together mean the whole festival, not one stage.
function BoardPath() {
  return (
    // contain:inline-size so the row clips on narrow screens instead of widening the page.
    <div aria-hidden="true" className="mt-10 flex h-8 items-center justify-center gap-1.5 overflow-hidden [contain:inline-size]">
      {Array.from({ length: 22 }, (_, i) => (
        <span
          key={i}
          className="h-4 w-4 shrink-0 rounded-[4px] border-2 border-white"
          style={{ background: STAGES[i % STAGES.length].hex, transform: `translateY(${Math.sin(i * 0.7) * 6}px)` }}
        />
      ))}
    </div>
  );
}

function PosterName({
  set,
  status,
  active,
  onPick,
  className,
}: {
  set: FestivalSet;
  status: Status;
  active: boolean;
  onPick: (set: FestivalSet, anchor: HTMLElement) => void;
  className: string;
}) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={active}
      onClick={(e) => onPick(set, e.currentTarget)}
      className={`inline-flex cursor-pointer items-center gap-[0.25em] rounded-xl px-1.5 py-0.5 transition duration-75 hover:bg-(--surface) active:scale-95 ${FOCUS} ${active ? "bg-(--surface)" : ""} ${className}`}
    >
      {status === "crash" && <WarningIcon className="h-[0.7em] w-[0.7em]" />}
      {status === "planned" && <CheckIcon className="h-[0.75em] w-[0.75em]" />}
      {set.artist}
      {status && <span className="sr-only">{status === "crash" ? " (Sugar Crash)" : " (in your plan)"}</span>}
    </button>
  );
}

// One day's bill. Billing comes from the slot, so type size does the job a
// headliner badge would: 8:30 in Display, 5:30 and 7:00 in Heading, the rest in caps.
export function DayPoster({
  day,
  status,
  activeArtist,
  onPick,
}: {
  day: Day;
  status: (set: FestivalSet) => Status;
  activeArtist: string | null;
  onPick: (set: FestivalSet, anchor: HTMLElement) => void;
}) {
  const id = useId();
  const bill = (t: 1 | 2 | 3) =>
    LINEUP.filter((s) => s.day === day && tier(s) === t).sort(
      (a, b) => SLOTS.indexOf(b.time) - SLOTS.indexOf(a.time) || STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage),
    );
  const name = (s: FestivalSet, className: string) => (
    <PosterName
      set={s}
      status={status(s)}
      active={activeArtist === s.artist}
      onPick={onPick}
      className={className}
    />
  );

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="overflow-hidden rounded-[28px] bg-(--wash) px-3 py-8 text-center sm:px-10 sm:py-12"
    >
      <h2 id={`${id}-title`}>
        <Logo />
        <span className="sr-only">, {DAY_NAMES[day]} lineup</span>
      </h2>
      <p className="mt-2 text-(--muted)">Four days on the Candy Land board · Thu–Sun</p>
      <p className={`mt-6 inline-block rounded-full bg-(--text) px-4 py-1.5 text-(--bg) ${TYPE.label}`}>
        {DAY_NAMES[day]}
      </p>

      <ul className="mt-4 flex flex-col items-center gap-1">
        {bill(1).map((s) => (
          <li key={s.artist}>{name(s, `${TYPE.display} uppercase`)}</li>
        ))}
      </ul>
      <ul className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
        {bill(2).map((s) => (
          <li key={s.artist}>{name(s, TYPE.heading)}</li>
        ))}
      </ul>
      <ul className="mx-auto mt-5 flex max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-1">
        {bill(3).map((s) => (
          <li key={s.artist}>{name(s, "font-extrabold tracking-wide uppercase")}</li>
        ))}
      </ul>
      <BoardPath />
    </section>
  );
}

/* Detail popover --------------------------------------------------------- */

// Native Popover API: it sits in the top layer, closes on Escape or a click
// outside, and hands focus back to the name. On phones it becomes a bottom sheet.
export function DetailPopover({
  set,
  anchor,
  planned,
  clashes,
  onToggle,
  onClose,
}: {
  set: FestivalSet | null;
  anchor: HTMLElement | null;
  planned: boolean;
  clashes: FestivalSet[];
  onToggle: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Light dismiss (Escape, click outside) closes the popover natively; tell the parent.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onToggleEvent = (e: Event) => {
      if ((e as Event & { newState?: string }).newState === "closed") onCloseRef.current();
    };
    el.addEventListener("toggle", onToggleEvent);
    return () => el.removeEventListener("toggle", onToggleEvent);
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!set || !anchor) {
      if (el.matches(":popover-open")) el.hidePopover();
      return;
    }
    if (!el.matches(":popover-open")) el.showPopover();

    function place() {
      if (!el || !anchor) return;
      if (window.matchMedia("(max-width: 639px)").matches) {
        Object.assign(el.style, { left: "0px", right: "0px", top: "auto", bottom: "0px" });
        return;
      }
      const a = anchor.getBoundingClientRect();
      const left = Math.min(Math.max(8, a.left + a.width / 2 - el.offsetWidth / 2), window.innerWidth - el.offsetWidth - 8);
      const below = a.bottom + 8;
      const top = below + el.offsetHeight > window.innerHeight - 8 ? Math.max(8, a.top - el.offsetHeight - 8) : below;
      Object.assign(el.style, { left: `${left}px`, top: `${top}px`, right: "auto", bottom: "auto" });
    }

    place();
    el.querySelector<HTMLElement>("button[aria-pressed]")?.focus();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [set, anchor]);

  return (
    <div
      ref={ref}
      popover="auto"
      role="dialog"
      aria-labelledby={titleId}
      className="inset-auto m-0 max-h-[85vh] w-full overflow-y-auto rounded-t-3xl border-2 border-(--text) bg-(--surface) p-0 text-(--text) shadow-[0_6px_0_rgba(59,31,43,0.25)] sm:w-80 sm:rounded-2xl"
    >
      {set && (
        <>
          <div className="h-3" style={{ background: set.stage.hex }} />
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <p className={`${TYPE.label} pt-2 text-(--muted)`}>
                {DAY_NAMES[set.day]} · {set.time}
              </p>
              <IconButton label="Close" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </div>
            <h3 id={titleId} className={`mt-1 ${TYPE.heading}`}>
              {set.artist}
            </h3>
            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-(--muted)">
              <Dot stage={set.stage} />
              {set.stage.name} · {set.genre}
            </p>
            {clashes.length > 0 && (
              <p className="mt-4 flex gap-2 rounded-xl bg-(--wash) p-3">
                <WarningIcon className="mt-1 h-4 w-4" />
                <span>
                  {planned ? "Sugar Crash with" : "Clashes with"} <b>{names(clashes)}</b>, also at {set.time}.
                </span>
              </p>
            )}
            <div className="mt-4 pb-[5px]">
              <AddButton added={planned} onToggle={onToggle} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* Add to plan: search ---------------------------------------------------- */

const SORTS = [
  ["time", "Time"],
  ["stage", "Stage"],
  ["name", "Name"],
] as const;
type Sort = (typeof SORTS)[number][0];

function SearchResult({
  set,
  sameDay,
  planned,
  clashes,
  onToggle,
  onGoToDay,
}: {
  set: FestivalSet;
  sameDay: boolean;
  planned: boolean;
  clashes: FestivalSet[];
  onToggle: () => void;
  onGoToDay: () => void;
}) {
  return (
    <li
      className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border-l-[6px] bg-(--surface) p-3 pl-4"
      style={{ borderLeftColor: set.stage.hex, boxShadow: shadow.card }}
    >
      <div className="min-w-0 flex-1 basis-48">
        <p className="font-bold">{set.artist}</p>
        <p className="flex flex-wrap items-center gap-x-1.5 text-(--muted)">
          {set.day} · {set.time} · <Dot stage={set.stage} />
          {set.stage.name}
        </p>
        {sameDay && clashes.length > 0 && (
          <p className="mt-1 flex items-center gap-1.5 font-bold">
            <WarningIcon className="h-4 w-4" />
            {planned ? "Sugar Crash with" : "Clashes with"} {names(clashes)}
          </p>
        )}
      </div>
      {sameDay ? (
        <div className="pb-[5px]">
          <AddButton added={planned} onToggle={onToggle} label="Add" addedLabel="Added" artist={set.artist} />
        </div>
      ) : (
        <Button variant="secondary" onClick={onGoToDay}>
          Go to {DAY_NAMES[set.day]}
        </Button>
      )}
    </li>
  );
}

function AddToPlan({
  day,
  plan,
  planned,
  alerts,
  onToggle,
  onGoToDay,
}: {
  day: Day;
  plan: Set<string>;
  planned: FestivalSet[];
  alerts: boolean;
  onToggle: (set: FestivalSet) => void;
  onGoToDay: (day: Day) => void;
}) {
  const [query, setQuery] = useState("");
  const [stages, setStages] = useState(() => new Set<string>());
  const [sort, setSort] = useState<Sort>("time");
  const [hideClashes, setHideClashes] = useState(false);
  const id = useId();

  const q = query.trim().toLowerCase();
  const searching = q.length > 0 || stages.size > 0;
  const clashFor = (s: FestivalSet) => (alerts ? clashesWith(s, planned) : []);

  // A query searches every day; stage chips alone show the current day.
  const results = LINEUP.filter(
    (s) =>
      (q ? s.artist.toLowerCase().includes(q) : s.day === day) &&
      (stages.size === 0 || stages.has(s.stage.name)) &&
      !(hideClashes && !plan.has(s.artist) && clashesWith(s, planned).length > 0),
  ).sort((a, b) => {
    if (sort === "name") return a.artist.localeCompare(b.artist);
    const byTime = DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || SLOTS.indexOf(a.time) - SLOTS.indexOf(b.time);
    if (sort === "stage") return STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage) || byTime;
    return byTime;
  });
  const today = results.filter((s) => s.day === day);
  const otherDays = results.filter((s) => s.day !== day);

  const list = (sets: FestivalSet[]) => (
    <ul className="mt-3 space-y-3">
      {sets.map((s) => (
        <SearchResult
          key={s.artist}
          set={s}
          sameDay={s.day === day}
          planned={plan.has(s.artist)}
          clashes={clashFor(s)}
          onToggle={() => onToggle(s)}
          onGoToDay={() => onGoToDay(s.day)}
        />
      ))}
    </ul>
  );

  return (
    <section aria-labelledby={`${id}-title`} className="mt-10">
      <h2 id={`${id}-title`} className={TYPE.heading}>
        Add to your plan
      </h2>
      <p className="mt-1 text-(--muted)">
        Tap a name on the poster, search every artist, or pick stages to see who plays there on{" "}
        {DAY_NAMES[day]}.
      </p>

      <div className="mt-5 max-w-xl">
        <TextField
          label="Search artists"
          type="search"
          placeholder="Try “mint” or “licorice”"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {STAGES.map((s) => (
          <Chip
            key={s.name}
            stage={s}
            selected={stages.has(s.name)}
            onToggle={() =>
              setStages((prev) => {
                const next = new Set(prev);
                if (next.has(s.name)) next.delete(s.name);
                else next.add(s.name);
                return next;
              })
            }
          />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3">
        <fieldset className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <legend className="sr-only">Sort results by</legend>
          <span aria-hidden="true" className={`${TYPE.label} text-(--muted)`}>
            Sort by
          </span>
          {SORTS.map(([value, label]) => (
            <Radio
              key={value}
              name={`${id}-sort`}
              value={value}
              checked={sort === value}
              onChange={() => setSort(value)}
              label={label}
            />
          ))}
        </fieldset>
        <Checkbox
          label="Hide artists that would clash"
          checked={hideClashes}
          onChange={(e) => setHideClashes(e.target.checked)}
        />
      </div>

      <div aria-live="polite">
        {!searching ? null : results.length === 0 ? (
          <p className="mt-5 rounded-2xl bg-(--surface) p-5 text-(--muted)" style={{ boxShadow: shadow.card }}>
            No artists match{q ? ` “${query.trim()}”` : " those stages"}.
          </p>
        ) : (
          <div className="mt-5">
            {today.length > 0 && (
              <>
                <p className={`${TYPE.label} text-(--muted)`}>{DAY_NAMES[day]}</p>
                {list(today)}
              </>
            )}
            {otherDays.length > 0 && (
              <>
                <p className={`${TYPE.label} mt-6 text-(--muted)`}>On other days</p>
                {list(otherDays)}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* Plan drawer ------------------------------------------------------------ */

function PlanItem({
  set,
  onRemove,
  onKeep,
}: {
  set: FestivalSet;
  onRemove?: () => void;
  onKeep?: () => void;
}) {
  if (onKeep) {
    // Inside a Sugar Crash: the two sets side by side, each with a way to keep it.
    return (
      <div className="flex min-w-0 flex-col rounded-xl border-l-[6px] bg-(--bg) p-2.5" style={{ borderLeftColor: set.stage.hex }}>
        <p className="leading-snug font-bold">{set.artist}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-(--muted)">
          <Dot stage={set.stage} />
          <span className="min-w-0">{set.stage.name}</span>
        </p>
        <div className="mt-auto pt-2.5 pb-1">
          <Button variant="secondary" onClick={onKeep} aria-label={`Keep ${set.artist}`} className="px-3! py-1.5!">
            Keep
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div
      className="flex items-center gap-3 rounded-xl border-l-[6px] bg-(--surface) p-2.5"
      style={{ borderLeftColor: set.stage.hex, boxShadow: shadow.card }}
    >
      <div className="min-w-0 flex-1">
        <p className="leading-snug font-bold">{set.artist}</p>
        <p className="flex items-center gap-1.5 text-(--muted)">
          <Dot stage={set.stage} />
          {set.stage.name}
        </p>
      </div>
      <IconButton label={`Remove ${set.artist}`} onClick={onRemove}>
        <CloseIcon />
      </IconButton>
    </div>
  );
}

// Slides over the page and never squeezes it. A tab on the right edge opens and
// collapses it on wider screens; on phones a bar along the bottom does the same.
export function PlanDrawer({
  open,
  onOpenChange,
  day,
  planned,
  alerts,
  onAlerts,
  onRemove,
  onKeep,
  contained = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  day: Day;
  planned: FestivalSet[];
  alerts: boolean;
  onAlerts: (on: boolean) => void;
  onRemove: (set: FestivalSet) => void;
  onKeep: (set: FestivalSet) => void;
  contained?: boolean;
}) {
  const panelId = useId();
  const handleRef = useRef<HTMLButtonElement>(null);
  const barRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const focusOnOpen = useRef(false);
  const pos = contained ? "absolute" : "fixed";

  const daySets = planned.filter((s) => s.day === day);
  const crashes = alerts ? SLOTS.filter((t) => daySets.filter((s) => s.time === t).length > 1).length : 0;

  useEffect(() => {
    if (open && focusOnOpen.current) {
      focusOnOpen.current = false;
      closeRef.current?.focus();
    }
  }, [open]);

  function show() {
    focusOnOpen.current = true;
    onOpenChange(true);
  }
  function hide() {
    onOpenChange(false);
    // After React re-renders: the tab on wide screens, the bottom bar on phones.
    setTimeout(() => (handleRef.current?.offsetParent ? handleRef.current : barRef.current)?.focus());
  }

  return (
    <>
      {!open && planned.length > 0 && (
        <button
          ref={barRef}
          type="button"
          aria-controls={panelId}
          aria-expanded={false}
          onClick={show}
          className={`${pos} inset-x-3 bottom-3 z-20 flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-(--text) bg-(--surface) px-4 py-3 text-left font-bold shadow-[0_4px_0_var(--text)] active:translate-y-[4px] active:shadow-none sm:hidden ${FOCUS}`}
        >
          <Badge tone="count" count={daySets.length} />
          <span className="flex-1">{DAY_NAMES[day]} plan</span>
          {crashes > 0 && <Badge tone="crash" />}
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
            <path d="M3.5 10l4.5-4.5 4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <div
        className={`${pos} inset-y-0 right-0 z-30 w-full transition-transform duration-200 ease-out motion-reduce:transition-none sm:w-[380px] ${open ? "translate-x-0" : "translate-x-full"} pointer-events-none`}
      >
        <button
          ref={handleRef}
          type="button"
          aria-controls={panelId}
          aria-expanded={open}
          onClick={() => (open ? hide() : show())}
          className={`pointer-events-auto absolute top-6 right-full hidden cursor-pointer flex-col items-center gap-2 rounded-l-2xl border-2 border-r-0 border-(--text) bg-(--surface) px-2 py-3 font-bold shadow-[0_4px_0_var(--text)] hover:bg-(--wash) sm:flex ${FOCUS}`}
        >
          <span className="rotate-180 [writing-mode:vertical-rl]">{open ? "Hide plan" : "Plan"}</span>
          <Badge tone="count" count={daySets.length} />
          {crashes > 0 && (
            <>
              <WarningIcon className="h-4 w-4" />
              <span className="sr-only">Sugar Crash</span>
            </>
          )}
        </button>

        <aside
          id={panelId}
          aria-label={`Your ${DAY_NAMES[day]} plan`}
          inert={!open}
          onKeyDown={(e) => e.key === "Escape" && hide()}
          className="pointer-events-auto flex h-full flex-col border-l-2 border-(--text) bg-(--bg) shadow-[-6px_0_0_rgba(59,31,43,0.15)]"
        >
          <header className="flex items-start justify-between gap-3 border-b-2 border-[#3B1F2B]/10 px-5 py-4">
            <div>
              <p className={`${TYPE.label} text-(--muted)`}>Your plan</p>
              <h2 className={`mt-1 ${TYPE.heading}`}>{DAY_NAMES[day]}</h2>
            </div>
            <IconButton ref={closeRef} label="Close plan" onClick={hide}>
              <CloseIcon />
            </IconButton>
          </header>

          <div className="flex-1 overflow-y-auto px-5 py-3">
            {daySets.length === 0 && (
              <p className="mb-2 rounded-2xl bg-(--wash) p-4 text-(--muted)">
                Nothing on {DAY_NAMES[day]} yet. Tap a name on the poster to add it.
              </p>
            )}
            <ol>
              {SLOTS.map((slot) => {
                const here = daySets.filter((s) => s.time === slot);
                return (
                  <li
                    key={slot}
                    className="grid grid-cols-[4.5rem_1fr] items-start gap-3 border-b-2 border-[#3B1F2B]/10 py-3 last:border-b-0"
                  >
                    <span className={`${TYPE.label} pt-3 text-(--muted)`}>{slot}</span>
                    {here.length === 0 ? (
                      <p className="py-2.5 text-(--muted)">Free</p>
                    ) : alerts && here.length > 1 ? (
                      <div className="rounded-2xl border-[3px] border-(--text) bg-(--surface) p-2.5">
                        <Badge tone="crash" />
                        <div className="mt-2.5 grid grid-cols-2 gap-2">
                          {here.map((s) => (
                            <PlanItem key={s.artist} set={s} onKeep={() => onKeep(s)} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {here.map((s) => (
                          <PlanItem key={s.artist} set={s} onRemove={() => onRemove(s)} />
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          <footer className="border-t-2 border-[#3B1F2B]/10 px-5 py-4">
            <Toggle label="Warn me about Sugar Crashes" checked={alerts} onChange={onAlerts} />
          </footer>
        </aside>
      </div>
    </>
  );
}

/* Planner ---------------------------------------------------------------- */

// Everything together. Nothing is saved: React state only, so it resets on reload.
export function Planner({ initialPlan = [], contained = false }: { initialPlan?: string[]; contained?: boolean }) {
  const [day, setDay] = useState<Day>("Thu");
  const [plan, setPlan] = useState(() => new Set(initialPlan));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alerts, setAlerts] = useState(true);
  const [picked, setPicked] = useState<{ set: FestivalSet; anchor: HTMLElement } | null>(null);
  // The drawer opens on its own for the first add, then only when an add causes a Sugar Crash.
  const drawerSeen = useRef(false);

  const planned = LINEUP.filter((s) => plan.has(s.artist));
  const status = (s: FestivalSet): Status =>
    !plan.has(s.artist) ? null : alerts && clashesWith(s, planned).length > 0 ? "crash" : "planned";

  function toggle(set: FestivalSet) {
    if (plan.has(set.artist)) {
      setPlan((prev) => {
        const next = new Set(prev);
        next.delete(set.artist);
        return next;
      });
      return;
    }
    const crash = alerts && clashesWith(set, planned).length > 0;
    setPlan((prev) => new Set(prev).add(set.artist));
    if (!drawerSeen.current || crash) {
      drawerSeen.current = true;
      setDrawerOpen(true);
    }
  }

  function keep(set: FestivalSet) {
    setPlan((prev) => {
      const next = new Set(prev);
      for (const other of clashesWith(set, planned)) next.delete(other.artist);
      return next;
    });
  }

  function chooseDay(next: Day) {
    setPicked(null);
    setDay(next);
  }

  return (
    <div
      className={
        contained
          ? "relative overflow-hidden rounded-[28px] bg-(--bg) p-3 pb-24 ring-2 ring-[#3B1F2B]/10 sm:p-6 sm:pr-16"
          : "pb-24 sm:pr-14 sm:pb-0"
      }
    >
      <Tabs label="Festival day" tabs={[...DAYS]} selected={day} onSelect={(d) => chooseDay(d as Day)}>
        <DayPoster
          day={day}
          status={status}
          activeArtist={picked?.set.artist ?? null}
          onPick={(set, anchor) => setPicked({ set, anchor })}
        />
        <AddToPlan
          day={day}
          plan={plan}
          planned={planned}
          alerts={alerts}
          onToggle={toggle}
          onGoToDay={chooseDay}
        />
      </Tabs>

      <DetailPopover
        set={picked?.set ?? null}
        anchor={picked?.anchor ?? null}
        planned={picked ? plan.has(picked.set.artist) : false}
        clashes={picked && alerts ? clashesWith(picked.set, planned) : []}
        onToggle={() => picked && toggle(picked.set)}
        onClose={() => setPicked(null)}
      />

      <PlanDrawer
        open={drawerOpen}
        onOpenChange={(next) => {
          if (next) drawerSeen.current = true;
          setDrawerOpen(next);
        }}
        day={day}
        planned={planned}
        alerts={alerts}
        onAlerts={setAlerts}
        onRemove={toggle}
        onKeep={keep}
        contained={contained}
      />
    </div>
  );
}
