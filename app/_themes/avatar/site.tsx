"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";

import festivalPoster from "@/app/mood-boards/avatar/images/festival-poster.jpg";

import { fontVariables } from "./fonts";
import { clashesWith, LINEUP, SLOTS, type FestivalSet } from "./lineup";
import { LineupPoster } from "./poster";
import { ELEMENT_ORDER, ELEMENTS, SHAPE, TYPE, type ElementKey } from "./tokens";
import {
  BalanceMeter,
  Badge,
  Button,
  Checkbox,
  ClashNotice,
  CloseIcon,
  ElementScope,
  Emblem,
  FilterChips,
  filterChips,
  FilterGroups,
  FilterIcon,
  FlagIcon,
  FOCUS,
  IconButton,
  JourneyMap,
  JourneyPath,
  matchesFilters,
  Modal,
  NationMark,
  NextUp,
  noFilters,
  Radio,
  SaveToggle,
  Seal,
  SearchIcon,
  TextField,
  Toggle,
  useElement,
  type ActiveFilter,
  type Filters,
} from "./ui";

// The Four Nations site. The day in view is the "element", and the whole page takes it on:
// color, emblem, and motion. My journey lives in a drawer that slides over the page.
// The planner's state lives in the shell, which the /planner layout keeps mounted, so a
// journey survives moving between the lineup and the festival page. Nothing is saved beyond that.

type Show = "all" | "journey" | "flagged";

type Planner = {
  saved: Set<string>;
  flagged: Set<string>;
  savedList: FestivalSet[];
  toggle: (artist: string) => void;
  flag: (artist: string) => void;
  query: string;
  setQuery: (q: string) => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  show: Show;
  setShow: (s: Show) => void;
  hideClashes: boolean;
  setHideClashes: (on: boolean) => void;
  // The lineup page tells the header how to bring a day into view.
  registerDayJump: (jump: ((day: ElementKey) => void) | null) => void;
};

const PlannerContext = createContext<Planner | null>(null);

function usePlanner() {
  const value = useContext(PlannerContext);
  if (!value) throw new Error("usePlanner needs <FourNationsSite> above it");
  return value;
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function toggled(set: Set<string>, key: string) {
  const next = new Set(set);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

export function FourNationsSite({ children }: { children: ReactNode }) {
  return (
    <ElementScope
      initial="water"
      className={`${fontVariables} isolate min-h-screen bg-(--parchment) text-(--ink)`}
      style={{ fontFamily: "var(--font-alegreya-sans)" }}
    >
      <Shell>{children}</Shell>
    </ElementScope>
  );
}

/* The shell: header, footer, the journey drawer, and the planner's state ----------- */

function Shell({ children }: { children: ReactNode }) {
  const { element, setElement } = useElement();
  const router = useRouter();
  const [saved, setSaved] = useState(() => new Set<string>());
  const [flagged, setFlagged] = useState(() => new Set<string>());
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(noFilters);
  const [show, setShow] = useState<Show>("all");
  const [hideClashes, setHideClashes] = useState(false);
  // The drawer only ever opens when you ask for it.
  const [open, setOpen] = useState(false);
  // A clash flag that pops up after an add, then fades.
  const [clashFlag, setClashFlag] = useState<{ id: number; set: FestivalSet; with: FestivalSet[] } | null>(null);
  const [flagShown, setFlagShown] = useState(false);
  const flagTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [tab, setTab] = useState<"journey" | "interested">("journey");
  const [warn, setWarn] = useState(true);
  const journeyButton = useRef<HTMLButtonElement>(null);
  const dayJump = useRef<((day: ElementKey) => void) | null>(null);
  const registerDayJump = useCallback((jump: ((day: ElementKey) => void) | null) => {
    dayJump.current = jump;
  }, []);

  const savedList = LINEUP.filter((s) => saved.has(s.artist));
  const flaggedList = LINEUP.filter((s) => flagged.has(s.artist));
  const clashCount = warn
    ? ELEMENT_ORDER.reduce((n, d) => n + SLOTS.filter((t) => savedList.filter((s) => s.day === d && s.time === t).length > 1).length, 0)
    : 0;

  // On the lineup, a day button scrolls to that day; anywhere else it goes to the lineup.
  function goToDay(day: ElementKey) {
    setElement(day);
    if (dayJump.current) dayJump.current(day);
    else router.push(`/planner#${day}`);
  }

  // Adding never opens the drawer. An add that clashes raises a flag that fades on its own.
  function raiseClashFlag(set: FestivalSet, others: FestivalSet[]) {
    flagTimers.current.forEach(clearTimeout);
    setClashFlag({ id: Date.now(), set, with: others });
    setFlagShown(true);
    flagTimers.current = [setTimeout(() => setFlagShown(false), 4500), setTimeout(() => setClashFlag(null), 5000)];
  }

  function toggle(artist: string) {
    const set = LINEUP.find((s) => s.artist === artist)!;
    if (saved.has(artist)) {
      setSaved((prev) => toggled(prev, artist));
      return;
    }
    const others = warn ? clashesWith(set, savedList) : [];
    setSaved((prev) => toggled(prev, artist));
    setFlagged((prev) => {
      const next = new Set(prev);
      next.delete(artist); // adding to the journey answers "interested"
      return next;
    });
    if (others.length > 0) raiseClashFlag(set, others);
  }

  function keep(artist: string) {
    const set = LINEUP.find((s) => s.artist === artist)!;
    setSaved((prev) => {
      const next = new Set(prev);
      for (const other of clashesWith(set, savedList)) next.delete(other.artist);
      return next;
    });
  }

  function openDrawer(next: boolean, day?: ElementKey) {
    if (next && day) {
      setElement(day);
      setTab("journey");
    }
    setOpen(next);
    if (!next) setTimeout(() => journeyButton.current?.focus());
  }

  const planner: Planner = {
    saved,
    flagged,
    savedList,
    toggle,
    flag: (artist) => setFlagged((p) => toggled(p, artist)),
    query,
    setQuery,
    filters,
    setFilters,
    show,
    setShow,
    hideClashes,
    setHideClashes,
    registerDayJump,
  };

  return (
    <PlannerContext.Provider value={planner}>
      <header className="sticky top-0 z-30 border-b-[1.5px] border-(--ink) bg-(--parchment)/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-3 px-4 py-3 sm:gap-x-6 sm:px-8">
          <Link
            href="/planner"
            className={`${TYPE.heading} block min-w-0 grow basis-0 truncate rounded-sm lg:grow-0 lg:basis-auto ${FOCUS}`}
          >
            The Four Nations
          </Link>
          {/* The four days are the way through the lineup: each jumps to its band, and the one
              you are reading lights up as you scroll. */}
          <nav
            aria-labelledby="lineup-jump"
            className="order-3 flex w-full items-center gap-2 lg:order-2 lg:w-auto lg:flex-1 lg:justify-center"
          >
            <span id="lineup-jump" className={`${TYPE.label} mr-1 shrink-0 tracking-[0.12em]! text-(--ink-muted) sm:tracking-[0.25em]!`}>
              Lineup
            </span>
            {ELEMENT_ORDER.map((key) => {
              const el = ELEMENTS[key];
              const on = key === element;
              return (
                <button
                  key={key}
                  type="button"
                  aria-current={on ? "true" : undefined}
                  aria-label={`${el.dayName}, ${el.name}`}
                  onClick={() => goToDay(key)}
                  className={`inline-flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 border-[1.5px] border-(--ink) px-2 py-1.5 text-sm font-medium transition-colors duration-(--el-dur) lg:flex-none lg:px-3 ${SHAPE.button} ${FOCUS}`}
                  style={on ? { background: el.fill, color: el.on } : { background: "var(--paper)" }}
                >
                  <Emblem element={key} className="h-5 w-5" />
                  <span>{el.day}</span>
                  <span className="hidden xl:inline">· {el.name}</span>
                </button>
              );
            })}
          </nav>
          <button
            ref={journeyButton}
            type="button"
            aria-expanded={open}
            aria-controls="journey-drawer"
            onClick={() => openDrawer(!open)}
            className={`order-2 ml-auto inline-flex shrink-0 cursor-pointer items-center gap-2 border-[1.5px] border-(--ink) bg-(--ink) px-3 py-2 font-medium text-(--paper) hover:brightness-[1.35] sm:px-4 lg:order-3 ${SHAPE.button} ${FOCUS}`}
          >
            My journey
            {/* The count stamps in each time it changes, so an add is felt even with the drawer shut. */}
            <span key={saved.size} className="inline-flex motion-safe:animate-stamp">
              <Badge tone="count" count={saved.size} />
            </span>
            {clashCount > 0 && <Seal className="h-6 w-6 text-sm" />}
            {clashCount > 0 && <span className="sr-only">{clashCount} clash{clashCount > 1 ? "es" : ""}</span>}
          </button>
        </div>
      </header>

      {children}

      <footer className="relative border-t-[1.5px] border-dashed border-(--line) bg-(--parchment) px-4 py-8 text-center text-sm text-(--ink-muted)">
        <p>Nothing is saved: your journey resets when you reload.</p>
        <p className="mt-2 flex flex-wrap items-center justify-center gap-4">
          {[
            ["/planner", "Lineup"],
            ["/planner/festival", "The festival"],
            ["/design-systems/avatar", "Design system"],
            ["/mood-boards/avatar", "Mood board"],
            ["/", "All work"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className={`rounded-sm underline underline-offset-4 ${FOCUS}`}>
              {label}
            </Link>
          ))}
        </p>
      </footer>

      {/* Once something is on your journey, a tab waits on the right edge to open it. */}
      {saved.size > 0 && !open && (
        <button
          type="button"
          aria-controls="journey-drawer"
          aria-expanded={false}
          aria-label={`Open my journey, ${saved.size} set${saved.size === 1 ? "" : "s"}${clashCount > 0 ? `, ${clashCount} clash${clashCount > 1 ? "es" : ""}` : ""}`}
          onClick={() => openDrawer(true)}
          className={`fixed top-1/2 right-0 z-40 flex -translate-y-1/2 cursor-pointer flex-col items-center gap-2 rounded-l-[14px_12px] border-[1.5px] border-r-0 border-(--ink) bg-(--ink) px-2 py-4 text-(--paper) shadow-[-4px_4px_0_rgba(0,0,0,0.12)] hover:brightness-[1.35] motion-safe:animate-stamp ${FOCUS}`}
        >
          <span aria-hidden="true" className="text-sm font-medium [writing-mode:vertical-rl] rotate-180">
            My journey
          </span>
          <span key={saved.size} className="inline-flex motion-safe:animate-stamp">
            <Badge tone="count" count={saved.size} />
          </span>
          {clashCount > 0 && <Seal className="h-6 w-6 text-sm" />}
        </button>
      )}

      {/* The clash flag: pops up after an add that double-books you, then fades away. */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
        {clashFlag && (
          <div
            key={clashFlag.id}
            role="status"
            className={`pointer-events-auto flex max-w-md items-center gap-3 border-[1.5px] border-(--ink) bg-(--paper) py-3 pr-3 pl-4 shadow-[0_6px_0_rgba(0,0,0,0.12)] transition-opacity duration-500 motion-safe:animate-stamp ${SHAPE.card} ${flagShown ? "opacity-100" : "opacity-0"}`}
          >
            <Seal className="h-9 w-9 text-xl" />
            <p className="min-w-0 flex-1 text-sm">
              <b>{clashFlag.set.artist}</b> clashes with <b>{clashFlag.with.map((o) => o.artist).join(", ")}</b> at{" "}
              {clashFlag.set.time} on {ELEMENTS[clashFlag.set.day].dayName}.
            </p>
            <button
              type="button"
              onClick={() => {
                setFlagShown(false);
                setClashFlag(null);
                openDrawer(true, clashFlag.set.day);
              }}
              className={`shrink-0 cursor-pointer rounded-sm text-sm font-medium underline decoration-2 underline-offset-4 ${FOCUS}`}
            >
              See my journey
            </button>
          </div>
        )}
      </div>

      <JourneyDrawer
        open={open}
        focusOnOpen
        onOpenChange={openDrawer}
        tab={tab}
        onTab={setTab}
        saved={saved}
        savedList={savedList}
        flaggedList={flaggedList}
        warn={warn}
        onWarn={setWarn}
        onToggle={toggle}
        onUnflag={(a) => setFlagged((p) => toggled(p, a))}
        onKeep={keep}
      />
    </PlannerContext.Provider>
  );
}

/* The lineup page --------------------------------------------------------------------- */

export function LineupPage() {
  const p = usePlanner();
  const { setElement } = useElement();
  const box = useRef<HTMLDivElement>(null);
  const [filtering, setFiltering] = useState(false);
  const { registerDayJump } = p;

  // Search & filter: one test of who matches. Everyone else fades back on the poster.
  const q = p.query.trim().toLowerCase();
  const isShown = (s: FestivalSet) =>
    matchesFilters(s, p.filters) &&
    (q === "" || s.artist.toLowerCase().includes(q)) &&
    (p.show === "all" || (p.show === "journey" ? p.saved.has(s.artist) : p.flagged.has(s.artist))) &&
    !(p.hideClashes && !p.saved.has(s.artist) && clashesWith(s, p.savedList).length > 0);
  const shownCount = LINEUP.filter(isShown).length;
  const chips: ActiveFilter[] = [
    ...filterChips(p.filters, p.setFilters),
    ...(p.show !== "all"
      ? [{ key: "show", label: p.show === "journey" ? "Only my journey" : "Only flagged", remove: () => p.setShow("all") }]
      : []),
    ...(p.hideClashes ? [{ key: "clash", label: "No clashes", remove: () => p.setHideClashes(false) }] : []),
  ];
  const narrowed = chips.length > 0 || q !== "";
  const clearFilters = () => {
    p.setFilters(noFilters());
    p.setShow("all");
    p.setHideClashes(false);
  };

  // A day button scrolls the lineup frame to that day, and brings the frame into view.
  useEffect(() => {
    const jump = (day: ElementKey) => {
      const frame = box.current;
      const band = frame?.querySelector<HTMLElement>(`section[data-day="${day}"]`);
      if (!frame || !band) return;
      const behavior = reducedMotion() ? "auto" : "smooth";
      frame.scrollTo({ top: band.offsetTop, behavior });
      const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
      const r = frame.getBoundingClientRect();
      if (r.top < headerBottom || r.top > window.innerHeight * 0.6) frame.scrollIntoView({ behavior, block: "start" });
    };
    registerDayJump(jump);
    // Arriving from another page with a day in the address, e.g. /planner#fire.
    const fromHash = window.location.hash.slice(1) as ElementKey;
    const arrive = ELEMENT_ORDER.includes(fromHash)
      ? setTimeout(() => {
          setElement(fromHash);
          jump(fromHash);
        }, 60)
      : undefined;
    return () => {
      clearTimeout(arrive);
      registerDayJump(null);
    };
  }, [registerDayJump, setElement]);

  // Scroll spy: the last band to reach the top fifth of the frame is the page's element.
  // At the very bottom it is the last day, whose band may be too short to reach the top.
  useEffect(() => {
    const frame = box.current;
    if (!frame) return;
    let queued = 0;
    const spy = () => {
      queued = 0;
      const bands = [...frame.querySelectorAll<HTMLElement>("section[data-day]")];
      const atBottom = frame.scrollTop >= frame.scrollHeight - frame.clientHeight - 2;
      const line = frame.scrollTop + frame.clientHeight * 0.2;
      const current = atBottom ? bands.at(-1) : bands.filter((b) => b.offsetTop <= line).at(-1);
      if (current) setElement(current.dataset.day as ElementKey);
    };
    const onScroll = () => {
      if (!queued) queued = requestAnimationFrame(spy);
    };
    frame.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      frame.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(queued);
    };
  }, [setElement]);

  return (
    <>
      {/* The festival painting stays put behind the page; the lineup sheet slides up over it. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-[7.2rem] -z-10 lg:top-[4.25rem]">
        <Image src={festivalPoster} alt="" priority sizes="100vw" className="h-auto w-full" />
      </div>

      <main>
        <div className="h-[30vw] lg:h-[17vw]" />
        <div className="border-t-[1.5px] border-(--ink) bg-(--parchment)">
          <div className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <h1 className={TYPE.display}>Plan your four days</h1>
              <Link
                href="/planner/festival"
                className={`inline-flex items-center gap-2 border-[1.5px] border-(--ink) bg-(--paper) px-4 py-2 font-medium hover:bg-(--el-wash) ${SHAPE.button} ${FOCUS}`}
              >
                The festival
              </Link>
            </div>
            <p className="mt-3 max-w-3xl leading-relaxed sm:text-lg">
              One hundred artists from four nations on six stages, Thursday to Sunday. Water rolls in on
              Thursday, earth shakes on Friday, fire roars on Saturday, and the air carries it all home on
              Sunday.
            </p>

            <section id="lineup" aria-labelledby="lineup-title" className="mt-6 sm:mt-8">
              <h2 id="lineup-title" className={TYPE.heading}>
                The lineup
              </h2>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="relative min-w-0 grow basis-60 sm:max-w-md">
                  <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-(--ink-muted)" />
                  <TextField
                    label="Search artists"
                    hideLabel
                    type="search"
                    placeholder="Search artists"
                    value={p.query}
                    onChange={(e) => p.setQuery(e.target.value)}
                    style={{ paddingLeft: "2.75rem" }}
                  />
                </div>
                <Button
                  variant="secondary"
                  aria-haspopup="dialog"
                  aria-label={chips.length > 0 ? `Filters, ${chips.length} active` : undefined}
                  onClick={() => setFiltering(true)}
                >
                  <FilterIcon className="h-5 w-5" />
                  Filters
                  {chips.length > 0 && <Badge tone="count" count={chips.length} />}
                </Button>
                <p className="text-sm text-(--ink-muted)" aria-live="polite">
                  {!narrowed ? `${LINEUP.length} artists` : shownCount === 0 ? "No artists match" : `${shownCount} of ${LINEUP.length} artists`}
                </p>
              </div>
              {chips.length > 0 && (
                <div className="mt-3">
                  <FilterChips chips={chips} onClear={clearFilters} />
                </div>
              )}
              <div className="mt-5">
                <LineupPoster
                  boxed
                  boxRef={box}
                  saved={p.saved}
                  onToggle={p.toggle}
                  flagged={p.flagged}
                  onFlag={p.flag}
                  shown={narrowed ? isShown : undefined}
                />
              </div>
            </section>
          </div>
        </div>
      </main>

      <Modal open={filtering} onClose={() => setFiltering(false)} labelledBy="filter-title" width="w-[min(46rem,calc(100%-2rem))]">
        <div className={`flex max-h-[calc(100dvh-2rem)] flex-col border-[1.5px] border-(--ink) bg-(--paper) ${SHAPE.card}`}>
          <header className="flex items-start justify-between gap-3 border-b-[1.5px] border-dashed border-(--line) px-5 pt-4 pb-3 sm:px-6">
            <div>
              <p className={`${TYPE.label} text-(--ink-muted)`}>The lineup</p>
              <h2 id="filter-title" className={`mt-1 ${TYPE.heading}`}>
                Filters
              </h2>
            </div>
            <IconButton label="Close" onClick={() => setFiltering(false)}>
              <CloseIcon />
            </IconButton>
          </header>
          <div className="flex-1 space-y-7 overflow-y-auto px-5 py-5 sm:px-6">
            <FilterGroups filters={p.filters} onChange={p.setFilters} />
            <div className="grid gap-6 sm:grid-cols-3">
              <fieldset>
                <legend className={`${TYPE.label} text-(--ink-muted)`}>Show</legend>
                <div className="mt-3 space-y-2.5">
                  <Radio name="show" value="all" checked={p.show === "all"} onChange={() => p.setShow("all")} label="Everyone" />
                  <Radio
                    name="show"
                    value="journey"
                    checked={p.show === "journey"}
                    onChange={() => p.setShow("journey")}
                    label={<Counted name="Only my journey" count={p.saved.size} />}
                  />
                  <Radio
                    name="show"
                    value="flagged"
                    checked={p.show === "flagged"}
                    onChange={() => p.setShow("flagged")}
                    label={<Counted name="Only flagged" count={p.flagged.size} />}
                  />
                </div>
              </fieldset>
              <fieldset className="sm:col-span-2">
                <legend className={`${TYPE.label} text-(--ink-muted)`}>Clashes</legend>
                <div className="mt-3">
                  <Checkbox
                    label="Hide sets that clash with my journey"
                    checked={p.hideClashes}
                    onChange={(e) => p.setHideClashes(e.target.checked)}
                  />
                </div>
              </fieldset>
            </div>
          </div>
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t-[1.5px] border-dashed border-(--line) px-5 py-4 sm:px-6">
            <Button variant="secondary" onClick={clearFilters} disabled={chips.length === 0}>
              Clear all
            </Button>
            <Button onClick={() => setFiltering(false)}>
              {shownCount === LINEUP.length ? "Show all 100 artists" : `Show ${shownCount} artist${shownCount === 1 ? "" : "s"}`}
            </Button>
          </footer>
        </div>
      </Modal>
    </>
  );
}

function Counted({ name, count }: { name: string; count: number }) {
  return (
    <span className="flex items-center gap-2">
      {name}
      <span className="text-sm text-(--ink-muted) tabular-nums">{count}</span>
    </span>
  );
}

/* My journey: the drawer ---------------------------------------------------------- */

function JourneyDrawer({
  open,
  focusOnOpen,
  onOpenChange,
  tab,
  onTab,
  saved,
  savedList,
  flaggedList,
  warn,
  onWarn,
  onToggle,
  onUnflag,
  onKeep,
}: {
  open: boolean;
  focusOnOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tab: "journey" | "interested";
  onTab: (tab: "journey" | "interested") => void;
  saved: Set<string>;
  savedList: FestivalSet[];
  flaggedList: FestivalSet[];
  warn: boolean;
  onWarn: (on: boolean) => void;
  onToggle: (artist: string) => void;
  onUnflag: (artist: string) => void;
  onKeep: (artist: string) => void;
}) {
  const { element, setElement } = useElement();
  const el = ELEMENTS[element];
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const id = useId();

  useEffect(() => {
    if (open && !wasOpen.current && focusOnOpen) closeRef.current?.focus();
    wasOpen.current = open;
  }, [open, focusOnOpen]);

  const daySaved = savedList.filter((s) => s.day === element);
  const clash = warn ? daySaved.filter((s) => clashesWith(s, savedList).length > 0) : [];
  const firstSlot = clash[0]?.time;
  const firstClash = firstSlot ? clash.filter((s) => s.time === firstSlot) : [];

  return (
    <div
      className={`pointer-events-none fixed inset-y-0 right-0 z-50 w-full transition-transform duration-200 ease-out motion-reduce:transition-none sm:w-[440px] ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      <aside
        id="journey-drawer"
        aria-label="My journey"
        inert={!open}
        onKeyDown={(e) => e.key === "Escape" && onOpenChange(false)}
        className="pointer-events-auto flex h-full flex-col border-l-[1.5px] border-(--ink) bg-(--paper)"
      >
        <header className="border-b-[1.5px] border-dashed border-(--line) px-5 pt-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={`${TYPE.label} text-(--ink-muted)`}>
                {saved.size} on your journey · {flaggedList.length} interested
              </p>
              <h2 className={`mt-1 ${TYPE.heading}`}>My journey</h2>
            </div>
            <IconButton ref={closeRef} label="Close my journey" onClick={() => onOpenChange(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <div
            role="tablist"
            aria-label="Journey views"
            className="mt-4 grid grid-cols-2 gap-2"
            onKeyDown={(e) => {
              if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
              const next = tab === "journey" ? "interested" : "journey";
              onTab(next);
              document.getElementById(`${id}-${next}`)?.focus();
            }}
          >
            {(["journey", "interested"] as const).map((t) => (
              <button
                key={t}
                id={`${id}-${t}`}
                type="button"
                role="tab"
                aria-selected={tab === t}
                aria-controls={`${id}-panel`}
                tabIndex={tab === t ? 0 : -1}
                onClick={() => onTab(t)}
                className={`inline-flex cursor-pointer items-center justify-center gap-2 border-[1.5px] border-(--ink) px-3 py-2 font-medium ${SHAPE.button} ${FOCUS} ${tab === t ? "bg-(--ink) text-(--paper)" : "bg-(--paper) hover:bg-(--el-wash)"}`}
              >
                {t === "interested" && <FlagIcon filled={tab === t} />}
                {t === "journey" ? "Journey" : `Interested · ${flaggedList.length}`}
              </button>
            ))}
          </div>
        </header>

        <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${tab}`} className="flex-1 overflow-y-auto px-5 py-5">
          {tab === "journey" ? (
            <div className="space-y-8">
              <section aria-label={`${el.dayName} journey`}>
                <div role="group" aria-label="Day" className="flex gap-1.5">
                  {ELEMENT_ORDER.map((key) => {
                    const count = savedList.filter((s) => s.day === key).length;
                    const e = ELEMENTS[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={key === element}
                        onClick={() => setElement(key)}
                        className={`inline-flex flex-1 cursor-pointer items-center justify-center gap-1 border-[1.5px] border-(--ink) px-1.5 py-1.5 text-sm font-medium ${SHAPE.button} ${FOCUS}`}
                        style={key === element ? { background: e.fill, color: e.on } : { background: "var(--paper)" }}
                      >
                        <Emblem element={key} className="h-4 w-4" />
                        {e.day}
                        {count > 0 && <span className="tabular-nums">{count}</span>}
                      </button>
                    );
                  })}
                </div>
                <h3 className={`mt-5 ${TYPE.heading}`}>{el.dayName}</h3>

                {firstClash.length > 1 && (
                  <div className="mt-4">
                    <ClashNotice sets={firstClash} onKeep={(s) => onKeep(s.artist)} />
                  </div>
                )}
                <div className="mt-5">
                  <JourneyPath day={element} saved={savedList} />
                </div>
                {daySaved.length > 0 && (
                  <div className="mt-6">
                    <p className="mb-2 text-sm text-(--ink-muted)">On the day, with a demo clock set to 6:40 PM:</p>
                    <NextUp day={element} saved={savedList} lineup={LINEUP} />
                  </div>
                )}
                <div className="mt-6">
                  <JourneyMap day={element} saved={savedList} />
                </div>
              </section>

              <section aria-label="Balance" className="border-t-[1.5px] border-dashed border-(--line) pt-6">
                <h3 className={`${TYPE.label} mb-4 text-(--ink-muted)`}>Across the four days</h3>
                <BalanceMeter saved={savedList} />
              </section>
            </div>
          ) : flaggedList.length === 0 ? (
            <div className={`bg-(--el-wash) p-6 text-center ${SHAPE.card}`}>
              <FlagIcon className="mx-auto h-8 w-8" />
              <p className={`mt-3 ${TYPE.heading}`}>Nothing flagged yet</p>
              <p className="mt-2 text-(--ink-muted)">
                Tap a name in the lineup and choose <b>Interested?</b> to keep it on a shortlist without
                committing the hour.
              </p>
            </div>
          ) : (
            <ul className="divide-y-[1.5px] divide-dashed divide-(--line)">
              {flaggedList.map((s) => {
                const clashes = warn ? clashesWith(s, savedList) : [];
                return (
                  <li key={s.artist} className="flex items-center gap-3 py-3.5">
                    <NationMark nation={s.nation} className="h-6 w-6" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{s.artist}</p>
                      <p className="text-sm text-(--ink-muted)">
                        {ELEMENTS[s.day].dayName} · {s.time} · {s.stage.name}
                      </p>
                      {clashes.length > 0 && (
                        <p className="mt-1 flex items-center gap-1.5 text-sm font-bold">
                          <Seal className="h-5 w-5 text-xs" />
                          Clashes with {clashes.map((c) => c.artist).join(", ")}
                        </p>
                      )}
                    </div>
                    <SaveToggle saved={false} artist={s.artist} onToggle={() => onToggle(s.artist)} />
                    <IconButton label={`Remove interest in ${s.artist}`} onClick={() => onUnflag(s.artist)}>
                      <FlagIcon filled />
                    </IconButton>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="border-t-[1.5px] border-dashed border-(--line) px-5 py-4">
          <Toggle label="Warn me about clashes" checked={warn} onChange={onWarn} />
        </footer>
      </aside>
    </div>
  );
}
