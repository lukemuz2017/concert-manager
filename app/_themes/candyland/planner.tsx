"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { clashesWith, DAY_NAMES, DAYS, LINEUP, SLOTS, tier, type Day, type FestivalSet } from "./lineup";
import { shadow, STAGES, TYPE } from "./tokens";
import {
  AddButton,
  Badge,
  Button,
  Checkbox,
  Chip,
  CloseIcon,
  Dot,
  FOCUS,
  IconButton,
  Radio,
  TextField,
  Toggle,
  WarningIcon,
} from "./ui";

// The planner, shopped like a store: performers as cards, day by day, each with
// an Add button, and the plan drawer as the cart. The design system shows it in
// a frame (`contained`); the site uses it full page.

function names(sets: FestivalSet[]) {
  return sets.map((s) => s.artist).join(" and ");
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Performer card ------------------------------------------------------------ */

// Big name, stage and time underneath, Add in the corner. Headliners get double
// width and a Display-size name, so billing still reads at a glance.
function PerformerCard({
  set,
  added,
  clashes,
  onToggle,
  onDetails,
}: {
  set: FestivalSet;
  added: boolean;
  clashes: FestivalSet[];
  onToggle: () => void;
  onDetails: (anchor: HTMLElement) => void;
}) {
  const headliner = tier(set) === 1;
  return (
    <article
      className={`flex flex-col rounded-2xl border-l-[10px] bg-(--surface) p-4 sm:p-5 ${headliner ? "sm:col-span-2" : ""} ${added ? "ring-2 ring-(--text)" : ""}`}
      style={{ borderLeftColor: set.stage.hex, boxShadow: shadow.card }}
    >
      <div className="flex min-h-6 flex-wrap items-center justify-between gap-2">
        <p className={`${TYPE.label} text-(--muted)`}>
          {set.time}
          {headliner && " · Headliner"}
        </p>
        {added && clashes.length > 0 && <Badge tone="crash" />}
      </div>
      <h4 className="mt-2">
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={(e) => onDetails(e.currentTarget)}
          className={`cursor-pointer rounded-lg text-left decoration-[3px] underline-offset-4 hover:underline ${headliner ? TYPE.display : TYPE.heading} ${FOCUS}`}
        >
          {set.artist}
        </button>
      </h4>
      <p className="mt-2 flex flex-wrap items-center gap-x-1.5 text-(--muted)">
        <Dot stage={set.stage} />
        <span className="font-bold text-(--text)">{set.stage.name}</span>· {set.genre}
      </p>
      {!added && clashes.length > 0 && (
        <p className="mt-2 flex items-center gap-1.5 text-sm font-bold">
          <WarningIcon className="h-4 w-4" />
          Clashes with {names(clashes)}
        </p>
      )}
      <div className="mt-auto flex justify-end pt-4 pb-[5px]">
        <AddButton added={added} onToggle={onToggle} label="Add" addedLabel="Added" artist={set.artist} />
      </div>
    </article>
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

/* Plan drawer: the cart ------------------------------------------------------ */

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
  onDay,
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
  onDay: (day: Day) => void;
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
  const crashes = alerts ? DAYS.flatMap((d) => SLOTS.filter((t) => planned.filter((s) => s.day === d && s.time === t).length > 1)).length : 0;

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
          <Badge tone="count" count={planned.length} />
          <span className="flex-1">My plan</span>
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
          className={`pointer-events-auto absolute top-6 right-full hidden cursor-pointer flex-col items-center gap-2 rounded-l-2xl border-2 border-r-0 border-(--text) bg-(--surface) px-1 py-3 font-bold shadow-[0_4px_0_var(--text)] hover:bg-(--wash) sm:flex ${FOCUS}`}
        >
          <span className="rotate-180 [writing-mode:vertical-rl]">{open ? "Hide plan" : "My plan"}</span>
          <Badge tone="count" count={planned.length} />
          {crashes > 0 && (
            <>
              <WarningIcon className="h-4 w-4" />
              <span className="sr-only">Sugar Crash</span>
            </>
          )}
        </button>

        <aside
          id={panelId}
          aria-label="My plan"
          inert={!open}
          onKeyDown={(e) => e.key === "Escape" && hide()}
          className="pointer-events-auto flex h-full flex-col border-l-2 border-(--text) bg-(--bg) shadow-[-6px_0_0_rgba(59,31,43,0.15)]"
        >
          <header className="border-b-2 border-[#3B1F2B]/10 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={`${TYPE.label} text-(--muted)`}>My plan · {planned.length} sets</p>
                <h2 className={`mt-1 ${TYPE.heading}`}>{DAY_NAMES[day]}</h2>
              </div>
              <IconButton ref={closeRef} label="Close plan" onClick={hide}>
                <CloseIcon />
              </IconButton>
            </div>
            <div role="group" aria-label="Plan day" className="mt-3 flex gap-1.5">
              {DAYS.map((d) => {
                const count = planned.filter((s) => s.day === d).length;
                return (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={d === day}
                    onClick={() => onDay(d)}
                    className={`flex-1 cursor-pointer rounded-full border-2 px-2 py-1 text-sm font-bold transition duration-75 ${FOCUS} ${d === day ? "border-(--text) bg-(--text) text-(--bg)" : "border-(--border) bg-(--surface) hover:bg-(--wash)"}`}
                  >
                    {d}
                    {count > 0 && <span className="ml-1 tabular-nums opacity-80">{count}</span>}
                  </button>
                );
              })}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-5 py-3">
            {daySets.length === 0 && (
              <p className="mb-2 rounded-2xl bg-(--wash) p-4 text-(--muted)">
                Nothing on {DAY_NAMES[day]} yet. Add a set from the lineup and it lands here.
              </p>
            )}
            <ol>
              {SLOTS.map((slot) => {
                const here = daySets.filter((s) => s.time === slot);
                return (
                  <li key={slot} className="grid grid-cols-[4.5rem_1fr] items-start gap-3 border-b-2 border-[#3B1F2B]/10 py-3 last:border-b-0">
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
  const [plan, setPlan] = useState(() => new Set(initialPlan));
  const [activeDay, setActiveDay] = useState<Day>("Thu");
  const [drawerDay, setDrawerDay] = useState<Day>("Thu");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alerts, setAlerts] = useState(true);
  const [picked, setPicked] = useState<{ set: FestivalSet; anchor: HTMLElement } | null>(null);
  const [query, setQuery] = useState("");
  const [stages, setStages] = useState(() => new Set<string>());
  const [show, setShow] = useState<"all" | "mine">("all");
  const [hideClashes, setHideClashes] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Partial<Record<Day, HTMLElement | null>>>({});
  const id = useId();
  // The drawer opens on its own for the first add, then only when an add causes a Sugar Crash.
  const drawerSeen = useRef(false);

  const planned = LINEUP.filter((s) => plan.has(s.artist));
  const clashFor = (s: FestivalSet) => (alerts ? clashesWith(s, planned) : []);

  // Scroll spy: the day whose section is at the top of the view lights up in the day bar.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActiveDay((e.target as HTMLElement).dataset.day as Day);
      },
      { root: contained ? scrollerRef.current : null, rootMargin: "0px 0px -75% 0px" },
    );
    for (const d of DAYS) {
      const el = sectionRefs.current[d];
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [contained]);

  function jumpTo(day: Day) {
    setActiveDay(day);
    sectionRefs.current[day]?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
  }

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
      setDrawerDay(set.day);
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

  const q = query.trim().toLowerCase();
  const visible = (s: FestivalSet) =>
    s.artist.toLowerCase().includes(q) &&
    (stages.size === 0 || stages.has(s.stage.name)) &&
    (show === "all" || plan.has(s.artist)) &&
    !(hideClashes && !plan.has(s.artist) && clashesWith(s, planned).length > 0);

  return (
    <div
      className={
        contained
          ? "relative h-[46rem] overflow-hidden rounded-[28px] bg-(--bg) ring-2 ring-[#3B1F2B]/10"
          : "pb-24 sm:pb-0"
      }
    >
      <div ref={scrollerRef} className={contained ? "h-full overflow-y-auto px-3 pb-24 sm:px-6" : ""}>
        {/* Filters */}
        <div className="grid gap-5 pt-4 sm:pt-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-md">
            <TextField
              label="Search performers"
              type="search"
              placeholder="Try “mint” or “licorice”"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <fieldset className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <legend className="sr-only">Show</legend>
              <Radio name={`${id}-show`} value="all" checked={show === "all"} onChange={() => setShow("all")} label="Everyone" />
              <Radio name={`${id}-show`} value="mine" checked={show === "mine"} onChange={() => setShow("mine")} label="Only my plan" />
            </fieldset>
            <Checkbox label="Hide clashes" checked={hideClashes} onChange={(e) => setHideClashes(e.target.checked)} />
          </div>
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

        {/* The day bar sticks while the lineup scrolls under it. */}
        <nav
          aria-label="Days"
          className="sticky top-0 z-10 -mx-3 mt-5 border-b-2 border-[#3B1F2B]/10 bg-(--bg)/95 px-3 py-3 backdrop-blur sm:-mx-6 sm:px-6"
        >
          <div className="flex gap-2 overflow-x-auto">
            {DAYS.map((d) => {
              const count = planned.filter((s) => s.day === d).length;
              return (
                <button
                  key={d}
                  type="button"
                  aria-current={d === activeDay ? "true" : undefined}
                  onClick={() => jumpTo(d)}
                  className={`shrink-0 cursor-pointer rounded-full border-2 px-4 py-1.5 font-bold transition duration-75 active:scale-95 ${FOCUS} ${d === activeDay ? "border-(--text) bg-(--text) text-(--bg)" : "border-(--border) bg-(--surface) hover:bg-(--wash)"}`}
                >
                  {DAY_NAMES[d]}
                  {count > 0 && <span className="ml-1.5 tabular-nums opacity-80">· {count}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        {DAYS.map((d) => {
          const daySets = LINEUP.filter((s) => s.day === d && visible(s));
          return (
            <section
              key={d}
              data-day={d}
              ref={(el) => {
                sectionRefs.current[d] = el;
              }}
              aria-labelledby={`${id}-${d}`}
              className="scroll-mt-20 pt-8"
            >
              <h3 id={`${id}-${d}`} className={TYPE.display}>
                {DAY_NAMES[d]}
              </h3>
              {daySets.length === 0 && (
                <p className="mt-4 rounded-2xl bg-(--wash) px-4 py-6 text-center text-(--muted)">
                  Nothing on {DAY_NAMES[d]} matches these filters.
                </p>
              )}
              {SLOTS.map((slot) => {
                const sets = daySets.filter((s) => s.time === slot).sort((a, b) => STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage));
                if (sets.length === 0) return null;
                return (
                  <div key={slot} className="mt-6">
                    <p className={`${TYPE.label} text-(--muted)`}>{slot}</p>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {sets.map((s) => (
                        <PerformerCard
                          key={s.artist}
                          set={s}
                          added={plan.has(s.artist)}
                          clashes={clashFor(s)}
                          onToggle={() => toggle(s)}
                          onDetails={(anchor) => setPicked({ set: s, anchor })}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>

      <DetailPopover
        set={picked?.set ?? null}
        anchor={picked?.anchor ?? null}
        planned={picked ? plan.has(picked.set.artist) : false}
        clashes={picked ? clashFor(picked.set) : []}
        onToggle={() => picked && toggle(picked.set)}
        onClose={() => setPicked(null)}
      />

      <PlanDrawer
        open={drawerOpen}
        onOpenChange={(next) => {
          if (next) {
            drawerSeen.current = true;
            setDrawerDay(activeDay);
          }
          setDrawerOpen(next);
        }}
        day={drawerDay}
        onDay={setDrawerDay}
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
