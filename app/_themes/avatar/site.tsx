"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

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

type Show = "all" | "journey" | "flagged";

function Counted({ name, count }: { name: string; count: number }) {
  return (
    <span className="flex items-center gap-2">
      {name}
      <span className="text-sm text-(--ink-muted) tabular-nums">{count}</span>
    </span>
  );
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function toggled(set: Set<string>, key: string) {
  const next = new Set(set);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

export function FourNationsSite() {
  return (
    <ElementScope
      initial="water"
      className={`${fontVariables} min-h-screen bg-(--parchment) text-(--ink)`}
      style={{ fontFamily: "var(--font-alegreya-sans)" }}
    >
      <Site />
    </ElementScope>
  );
}

function Site() {
  const { element, setElement } = useElement();
  const [saved, setSaved] = useState(() => new Set<string>());
  const [flagged, setFlagged] = useState(() => new Set<string>());
  const [filters, setFilters] = useState<Filters>(noFilters);
  const [query, setQuery] = useState("");
  const [show, setShow] = useState<Show>("all");
  const [hideClashes, setHideClashes] = useState(false);
  const [filtering, setFiltering] = useState(false);
  // "auto" when an add opened it (focus stays put); "user" when the header button did.
  const [open, setOpen] = useState<false | "auto" | "user">(false);
  const [tab, setTab] = useState<"journey" | "interested">("journey");
  const [warn, setWarn] = useState(true);
  const seen = useRef(false);
  const journeyButton = useRef<HTMLButtonElement>(null);

  const savedList = LINEUP.filter((s) => saved.has(s.artist));
  const flaggedList = LINEUP.filter((s) => flagged.has(s.artist));

  // Search & filter: one test of who matches. Everyone else fades back on the poster.
  const q = query.trim().toLowerCase();
  const isShown = (s: FestivalSet) =>
    matchesFilters(s, filters) &&
    (q === "" || s.artist.toLowerCase().includes(q)) &&
    (show === "all" || (show === "journey" ? saved.has(s.artist) : flagged.has(s.artist))) &&
    !(hideClashes && !saved.has(s.artist) && clashesWith(s, savedList).length > 0);
  const shownCount = LINEUP.filter(isShown).length;
  const active: ActiveFilter[] = [
    ...(q ? [{ key: "q", label: `“${query.trim()}”`, remove: () => setQuery("") }] : []),
    ...filterChips(filters, setFilters),
    ...(show !== "all"
      ? [{ key: "show", label: show === "journey" ? "Only my journey" : "Only flagged", remove: () => setShow("all") }]
      : []),
    ...(hideClashes ? [{ key: "clash", label: "No clashes", remove: () => setHideClashes(false) }] : []),
  ];
  const clearAll = () => {
    setQuery("");
    setFilters(noFilters());
    setShow("all");
    setHideClashes(false);
  };
  const clashCount = warn
    ? ELEMENT_ORDER.reduce((n, d) => n + SLOTS.filter((t) => savedList.filter((s) => s.day === d && s.time === t).length > 1).length, 0)
    : 0;

  // Scroll spy: the day whose band is at the top of the view becomes the page's element.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setElement((e.target as HTMLElement).dataset.day as ElementKey);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    document.querySelectorAll<HTMLElement>("section[data-day]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [setElement]);

  function goToDay(day: ElementKey) {
    setElement(day);
    document
      .querySelector(`section[data-day="${day}"]`)
      ?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
  }

  // On wider screens the drawer opens by itself on the first add, and again whenever an add
  // causes a clash. On a phone it would cover the page, so the pop-up shows the clash instead.
  function toggle(artist: string) {
    const set = LINEUP.find((s) => s.artist === artist)!;
    if (saved.has(artist)) {
      setSaved((prev) => toggled(prev, artist));
      return;
    }
    const clash = warn && clashesWith(set, savedList).length > 0;
    setSaved((prev) => toggled(prev, artist));
    setFlagged((prev) => {
      const next = new Set(prev);
      next.delete(artist); // adding to the journey answers "interested"
      return next;
    });
    if (window.matchMedia("(min-width: 640px)").matches && (!seen.current || clash)) {
      seen.current = true;
      setElement(set.day);
      setTab("journey");
      setOpen((o) => o || "auto");
    }
  }

  function keep(artist: string) {
    const set = LINEUP.find((s) => s.artist === artist)!;
    setSaved((prev) => {
      const next = new Set(prev);
      for (const other of clashesWith(set, savedList)) next.delete(other.artist);
      return next;
    });
  }

  function openDrawer(next: boolean) {
    if (next) seen.current = true;
    setOpen(next ? "user" : false);
    if (!next) setTimeout(() => journeyButton.current?.focus());
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b-[1.5px] border-(--ink) bg-(--parchment)/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-3 px-4 py-3 sm:gap-x-6 sm:px-8">
          <p className={`${TYPE.heading} min-w-0 grow basis-0 truncate lg:grow-0 lg:basis-auto`}>The Four Nations</p>
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
            {/* Search & filter closes the bar: the days move through the lineup, this narrows it. */}
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={active.length > 0 ? `Search and filter, ${active.length} active` : "Search and filter"}
              title="Search & filter"
              onClick={() => setFiltering(true)}
              className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 border-[1.5px] border-(--ink) px-2.5 py-1.5 text-sm font-medium ${SHAPE.button} ${FOCUS} ${active.length > 0 ? "bg-(--el-wash)" : "bg-(--paper) hover:bg-(--el-wash)"}`}
            >
              <SearchIcon className="h-5 w-5" />
              <span className="hidden xl:inline">Search &amp; filter</span>
              {active.length > 0 && <Badge tone="count" count={active.length} />}
            </button>
          </nav>
          <button
            ref={journeyButton}
            type="button"
            aria-expanded={!!open}
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

      <main>
        <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-8">
          <Image
            src={festivalPoster}
            alt="The Four Nations Music Festival. Four elements, one stage. A young monk sits on a rock at sunset, looking down on a glowing festival stage and crowds in a valley below a cliffside city."
            priority
            sizes="(min-width: 1152px) 1088px, 100vw"
            className={`h-auto w-full border-[1.5px] border-(--ink) ${SHAPE.card}`}
          />
          <h1 className={`mt-6 ${TYPE.display}`}>Plan your four days</h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed">
            One hundred artists from four nations play across six stages, Thursday to Sunday. Tap a
            name to see when and where. <b>Add</b> it to your journey, or flag it as <b>interested</b>{" "}
            and decide later. We&rsquo;ll warn you if you&rsquo;re booked in two places at once.
          </p>
        </section>

        <section id="lineup" aria-labelledby="lineup-title" className="mx-auto max-w-6xl scroll-mt-28 px-4 pt-14 pb-24 sm:px-8">
          <h2 id="lineup-title" className={TYPE.heading}>
            The lineup
          </h2>
          <p className="mt-1 text-(--ink-muted)" aria-live="polite">
            {active.length === 0
              ? "Tap a name for when and where. To narrow it down, use the search button in the bar above."
              : shownCount === 0
                ? "No one matches all of these. Remove a filter below."
                : `${shownCount} of ${LINEUP.length} artists match. Everyone else fades back.`}
          </p>
          <div className="mt-3 mb-6">
            <FilterChips chips={active} onClear={clearAll} />
          </div>
          <LineupPoster
            saved={saved}
            onToggle={toggle}
            flagged={flagged}
            onFlag={(a) => setFlagged((p) => toggled(p, a))}
            shown={active.length > 0 ? isShown : undefined}
          />
        </section>
      </main>

      <footer className="border-t-[1.5px] border-dashed border-(--line) px-4 py-8 text-center text-sm text-(--ink-muted)">
        <p>Nothing is saved: your journey resets when you reload.</p>
        <p className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className={`rounded-sm underline underline-offset-4 ${FOCUS}`}>
            All work
          </Link>
          <Link href="/design-systems/avatar" className={`rounded-sm underline underline-offset-4 ${FOCUS}`}>
            Design system
          </Link>
          <Link href="/mood-boards/avatar" className={`rounded-sm underline underline-offset-4 ${FOCUS}`}>
            Mood board
          </Link>
        </p>
      </footer>

      <Modal open={filtering} onClose={() => setFiltering(false)} labelledBy="filter-title" width="w-[min(46rem,calc(100%-2rem))]">
        <div className={`flex max-h-[calc(100dvh-2rem)] flex-col border-[1.5px] border-(--ink) bg-(--paper) ${SHAPE.card}`}>
          <header className="flex items-start justify-between gap-3 border-b-[1.5px] border-dashed border-(--line) px-5 pt-4 pb-3 sm:px-6">
            <div>
              <p className={`${TYPE.label} text-(--ink-muted)`}>The lineup</p>
              <h2 id="filter-title" className={`mt-1 ${TYPE.heading}`}>
                Search &amp; filter
              </h2>
            </div>
            <IconButton label="Close" onClick={() => setFiltering(false)}>
              <CloseIcon />
            </IconButton>
          </header>
          <div className="flex-1 space-y-7 overflow-y-auto px-5 py-5 sm:px-6">
            <TextField
              label="Search by artist"
              type="search"
              placeholder="Try “dragon”"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <FilterGroups filters={filters} onChange={setFilters} />
            <div className="grid gap-6 sm:grid-cols-3">
              <fieldset>
                <legend className={`${TYPE.label} text-(--ink-muted)`}>Show</legend>
                <div className="mt-3 space-y-2.5">
                  <Radio name="show" value="all" checked={show === "all"} onChange={() => setShow("all")} label="Everyone" />
                  <Radio
                    name="show"
                    value="journey"
                    checked={show === "journey"}
                    onChange={() => setShow("journey")}
                    label={<Counted name="Only my journey" count={saved.size} />}
                  />
                  <Radio
                    name="show"
                    value="flagged"
                    checked={show === "flagged"}
                    onChange={() => setShow("flagged")}
                    label={<Counted name="Only flagged" count={flagged.size} />}
                  />
                </div>
              </fieldset>
              <fieldset className="sm:col-span-2">
                <legend className={`${TYPE.label} text-(--ink-muted)`}>Clashes</legend>
                <div className="mt-3">
                  <Checkbox
                    label="Hide sets that clash with my journey"
                    checked={hideClashes}
                    onChange={(e) => setHideClashes(e.target.checked)}
                  />
                </div>
              </fieldset>
            </div>
          </div>
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t-[1.5px] border-dashed border-(--line) px-5 py-4 sm:px-6">
            <Button variant="secondary" onClick={clearAll} disabled={active.length === 0}>
              Clear all
            </Button>
            <Button onClick={() => setFiltering(false)}>
              {shownCount === LINEUP.length ? "Show all 100 artists" : `Show ${shownCount} artist${shownCount === 1 ? "" : "s"}`}
            </Button>
          </footer>
        </div>
      </Modal>

      <JourneyDrawer
        open={!!open}
        focusOnOpen={open === "user"}
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
    </>
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

