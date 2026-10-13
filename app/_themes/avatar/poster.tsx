"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type Ref } from "react";

import { clashesWith, DAY_ORDER, isHeadliner, LINEUP, SLOTS, timeRange, type FestivalSet } from "./lineup";
import { ELEMENTS, elementVars, SHAPE, TYPE } from "./tokens";
import {
  AddButton,
  Button,
  CheckIcon,
  CloseIcon,
  Emblem,
  FlagButton,
  FlagIcon,
  FOCUS,
  IconButton,
  matchesFilters,
  NationMark,
  Seal,
  StageLine,
  filtersActive,
  type Filters,
} from "./ui";

// The lineup as a festival poster, a day per band: the day tag and headliners
// large on the left, everyone else flowing on the right. Every name carries its
// nation's emblem and an underline in the nation's color; the name stays ink so
// it can always be read. Hover a name (or click or press Enter on it) for the
// show time, the stage, and the add button.

type Picked = { set: FestivalSet; anchor: HTMLElement; via: "hover" | "click" };

function PosterName({
  set,
  size,
  inPlan,
  flagged,
  clash,
  active,
  dim,
  onHover,
  onLeave,
  onPick,
}: {
  set: FestivalSet;
  size: "headliner" | "major" | "minor";
  inPlan: boolean;
  flagged: boolean;
  clash: boolean;
  active: boolean;
  dim: boolean;
  onHover: (anchor: HTMLElement) => void;
  onLeave: () => void;
  onPick: (anchor: HTMLElement) => void;
}) {
  const el = ELEMENTS[set.nation];
  // Headliners sit at 32px so a name fits on one or two lines; the rest are 20px and 17px.
  const type = {
    headliner: `${TYPE.heading.replace("text-2xl", "text-[22px] sm:text-[26px]")} leading-[1.5]! uppercase md:flex-row-reverse md:text-right`,
    major: "text-sm sm:text-[17px] font-bold uppercase tracking-wide leading-tight",
    minor: "text-[13px] sm:text-[15px] font-bold uppercase tracking-wide leading-tight",
  }[size];
  const emblem = size === "headliner" ? "h-7 w-7" : size === "major" ? "h-5 w-5" : "h-[18px] w-[18px]";
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={active}
      onMouseEnter={(e) => onHover(e.currentTarget)}
      onMouseLeave={onLeave}
      onClick={(e) => onPick(e.currentTarget)}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-0.5 text-left underline decoration-[3px] underline-offset-[6px] transition-[background-color,opacity] duration-(--el-dur) hover:bg-(--paper) hover:decoration-wavy hover:underline-offset-[10px] hover:opacity-100 ${FOCUS} ${dim ? "opacity-25" : ""} ${active ? "bg-(--paper) decoration-wavy underline-offset-[10px]!" : ""} ${type}`}
      style={{ textDecorationColor: el.line }}
    >
      <span style={{ color: el.line }} className="self-start pt-[0.2em]">
        <Emblem element={set.nation} className={emblem} />
      </span>
      {set.artist}
      {clash ? <Seal className="h-5 w-5 text-xs" /> : inPlan ? <CheckIcon className="h-4 w-4" /> : flagged && <FlagIcon filled className="h-3.5 w-3.5" />}
      {(inPlan || clash || flagged) && (
        <span className="sr-only">{clash ? " (clash)" : inPlan ? " (on your journey)" : " (interested)"}</span>
      )}
    </button>
  );
}

// The pop-up. A native popover: top layer, Escape and outside clicks close it.
// Opened by hover it never steals focus; opened by click it moves focus inside.
function NamePopover({
  picked,
  saved,
  flagged,
  clashes,
  onToggle,
  onFlag,
  onClose,
  onKeepOpen,
  onLeave,
}: {
  picked: Picked | null;
  saved: boolean;
  flagged: boolean;
  clashes: FestivalSet[];
  onToggle: () => void;
  onFlag: () => void;
  onClose: () => void;
  onKeepOpen: () => void;
  onLeave: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  });

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
    if (!picked) {
      if (el.matches(":popover-open")) el.hidePopover();
      return;
    }
    if (!el.matches(":popover-open")) el.showPopover();
    const anchor = picked.anchor;

    // Put the card beside the name and never on it: below, above, right, or left, the first
    // side where the whole card fits. If none does, take the roomier of above and below and
    // let the card scroll inside itself. On a phone it is a sheet at the bottom, or at the
    // top when the name sits low on the screen.
    function place() {
      if (!el) return;
      const GAP = 8;
      const M = 8;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const a = anchor.getBoundingClientRect();
      el.style.maxHeight = "none";
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const roomBelow = vh - a.bottom - GAP;
      const roomAbove = a.top - GAP;

      if (window.matchMedia("(max-width: 639px)").matches) {
        const atTop = h > roomBelow && roomAbove > roomBelow;
        Object.assign(el.style, {
          left: "0px",
          right: "0px",
          top: atTop ? "0px" : "auto",
          bottom: atTop ? "auto" : "0px",
          maxHeight: `${Math.max(160, atTop ? roomAbove : roomBelow)}px`,
        });
        return;
      }

      const clampX = (x: number) => Math.min(Math.max(M, x), vw - w - M);
      const clampY = (y: number) => Math.min(Math.max(M, y), vh - h - M);
      const midX = clampX(a.left + a.width / 2 - w / 2);
      const midY = clampY(a.top + a.height / 2 - h / 2);
      const tallEnough = h <= vh - 2 * M;
      const sides = [
        { fits: roomBelow - M >= h, left: midX, top: a.bottom + GAP },
        { fits: roomAbove - M >= h, left: midX, top: a.top - GAP - h },
        { fits: tallEnough && a.right + GAP + w <= vw - M, left: a.right + GAP, top: midY },
        { fits: tallEnough && a.left - GAP - w >= M, left: a.left - GAP - w, top: midY },
      ];
      const side = sides.find((o) => o.fits);
      if (side) {
        Object.assign(el.style, { left: `${side.left}px`, top: `${side.top}px`, right: "auto", bottom: "auto" });
        return;
      }
      const below = roomBelow >= roomAbove;
      const room = Math.max(120, (below ? roomBelow : roomAbove) - M);
      Object.assign(el.style, {
        left: `${midX}px`,
        top: below ? `${a.bottom + GAP}px` : `${a.top - GAP - Math.min(h, room)}px`,
        right: "auto",
        bottom: "auto",
        maxHeight: `${room}px`,
      });
    }

    place();
    if (picked.via === "click") el.querySelector<HTMLElement>("button[aria-pressed]")?.focus();
    const resized = new ResizeObserver(() => place());
    resized.observe(el.firstElementChild ?? el);
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      resized.disconnect();
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [picked]);

  const set = picked?.set;
  const day = set ? ELEMENTS[set.day] : null;
  return (
    <div
      ref={ref}
      popover="auto"
      role="dialog"
      aria-labelledby={titleId}
      onMouseEnter={onKeepOpen}
      onMouseLeave={onLeave}
      className={`inset-auto m-0 w-full overflow-y-auto overscroll-contain border-[1.5px] border-(--ink) bg-(--paper) p-0 text-(--ink) sm:w-80 ${SHAPE.card}`}
    >
      {set && day && (
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <p className={`${TYPE.label} pt-2 text-(--ink-muted)`}>
              {day.dayName} · {timeRange(set.time)}
            </p>
            <IconButton label="Close" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <h3 id={titleId} className={`mt-1 flex items-start gap-2 ${TYPE.heading}`}>
            <span className="pt-1" style={{ color: ELEMENTS[set.nation].line }}>
              <Emblem element={set.nation} className="h-6 w-6" />
            </span>
            {set.artist}
          </h3>
          <StageLine stage={set.stage.name} />
          <p className="mt-1 text-(--ink-muted)">{set.blurb}</p>
          {clashes.length > 0 && (
            <p className="mt-3 flex items-center gap-2.5">
              <Seal className="h-6 w-6 text-sm" />
              <span>
                {saved ? "Clashes with" : "Also at this hour on your journey:"} <b>{clashes.map((c) => c.artist).join(", ")}</b>
              </span>
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {/* The add button wears the artist's nation: its color and the way it moves. */}
            <span className="contents" style={elementVars(set.nation)}>
              <AddButton added={saved} onToggle={onToggle} />
            </span>
            {saved && (
              <Button variant="secondary" onClick={onToggle} aria-label={`Remove ${set.artist} from your journey`}>
                Remove
              </Button>
            )}
            {/* Interested is lighter than a plan: it marks a set without committing the hour,
                so it only shows until the set is on your journey. */}
            {!saved && <FlagButton flagged={flagged} onToggle={onFlag} artist={set.artist} />}
          </div>
        </div>
      )}
    </div>
  );
}

export function LineupPoster({
  saved,
  onToggle,
  flagged,
  onFlag,
  filters,
  shown,
  boxed = false,
  boxRef,
  titled = !boxed,
}: {
  saved: Set<string>;
  onToggle: (artist: string) => void;
  flagged?: Set<string>;
  onFlag?: (artist: string) => void;
  filters?: Filters;
  // Any wider test of who matches (search, journey, clashes). Non-matches fade back.
  shown?: (set: FestivalSet) => boolean;
  // Boxed: the poster scrolls inside its own frame, each day's banner pins to the top of
  // the frame while you read that day, and the festival title is left to the page.
  boxed?: boolean;
  boxRef?: Ref<HTMLDivElement>;
  // The festival title atop the poster; leave it off where the page already shows it.
  titled?: boolean;
}) {
  const [picked, setPicked] = useState<Picked | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedList = LINEUP.filter((s) => saved.has(s.artist));

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  // Hover-opened pop-ups close shortly after the pointer leaves, so it can travel into them.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setPicked((p) => (p?.via === "hover" ? null : p)), 220);
  };
  const cancelOpen = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = null;
  };
  // Hovering opens the pop-up only once the pointer has rested on a name for half a
  // second, so names passing under the pointer while you scroll stay quiet.
  const hover = (set: FestivalSet, anchor: HTMLElement) => {
    cancelClose();
    cancelOpen();
    openTimer.current = setTimeout(() => {
      openTimer.current = null;
      setPicked((p) => (p?.via === "click" && p.set === set ? p : { set, anchor, via: "hover" }));
    }, 500);
  };
  const leave = () => {
    cancelOpen();
    scheduleClose();
  };

  // Any scroll cancels a pop-up that is still waiting to open.
  useEffect(() => {
    window.addEventListener("scroll", cancelOpen, true);
    return () => {
      window.removeEventListener("scroll", cancelOpen, true);
      clearTimeout(closeTimer.current ?? undefined);
      clearTimeout(openTimer.current ?? undefined);
    };
  }, []);

  const name = (set: FestivalSet, size: "headliner" | "major" | "minor") => (
    <PosterName
      set={set}
      size={size}
      inPlan={saved.has(set.artist)}
      flagged={!!flagged?.has(set.artist)}
      clash={saved.has(set.artist) && clashesWith(set, savedList).length > 0}
      active={picked?.set === set}
      dim={(!!filters && filtersActive(filters) && !matchesFilters(set, filters)) || (!!shown && !shown(set))}
      onHover={(anchor) => hover(set, anchor)}
      onLeave={leave}
      onPick={(anchor) => {
        cancelOpen();
        cancelClose();
        setPicked({ set, anchor, via: "click" });
      }}
    />
  );

  return (
    <div
      ref={boxRef}
      tabIndex={boxed ? 0 : undefined}
      role={boxed ? "region" : undefined}
      aria-label={boxed ? "Lineup" : undefined}
      className={`border-[1.5px] border-(--ink) bg-(--parchment) px-4 py-6 sm:px-8 sm:py-8 ${SHAPE.card} ${boxed ? `relative max-h-[calc(100dvh-19rem)] scroll-mt-[18.5rem] overflow-y-auto [scrollbar-color:var(--line)_transparent] [scrollbar-width:thin] lg:max-h-[calc(100dvh-13rem)] lg:scroll-mt-[12rem] ${FOCUS}` : ""}`}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        {titled && (
          <div>
            <p className={TYPE.display}>The Four Nations</p>
            <p className="mt-1 text-sm font-medium tracking-[0.5em] uppercase">
              Music Festival · <span className="whitespace-nowrap">Thu–Sun</span>
            </p>
          </div>
        )}
        <ul aria-label="Nations" className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium">
          {DAY_ORDER.map((n) => (
            <li key={n}>
              <NationMark nation={n} label className="h-5 w-5" />
            </li>
          ))}
        </ul>
      </div>

      {DAY_ORDER.map((day) => {
        const el = ELEMENTS[day];
        const sets = LINEUP.filter((s) => s.day === day);
        const headliners = sets.filter(isHeadliner);
        const rest = sets.filter((s) => !isHeadliner(s));
        return (
          <section
            key={day}
            data-day={day}
            aria-label={`${el.dayName} lineup`}
            className="mt-5 grid scroll-mt-[18.5rem] lg:scroll-mt-[11.5rem] gap-x-8 gap-y-3 md:grid-cols-[minmax(0,19rem)_1fr] md:items-center"
          >
            {/* The day, plastered across the top of its band in the day's element color. */}
            <h4
              className={`${TYPE.display} text-[30px]! sm:text-[38px]! flex items-center justify-between gap-4 px-4 py-1 uppercase md:col-span-2 ${boxed ? "sticky -top-6 z-10 sm:-top-8" : ""}`}
              style={{ background: el.fill, color: el.on }}
            >
              {el.dayName}
              <Emblem element={day} className="h-7 w-7 sm:h-8 sm:w-8" />
            </h4>
            {/* Headliners share one right edge, like the poster's name column. */}
            <div className="flex flex-col md:items-end">
              <ul className="flex flex-col gap-2.5 md:items-end">
                {headliners.map((s) => (
                  <li key={s.artist} className="md:flex md:justify-end">
                    {name(s, "headliner")}
                  </li>
                ))}
              </ul>
            </div>
            <ul className="flex flex-wrap content-center items-center gap-x-2 gap-y-1.5 sm:gap-x-3.5 sm:gap-y-2">
              {rest
                .sort((a, b) => SLOTS.indexOf(b.time) - SLOTS.indexOf(a.time))
                .map((s) => (
                  <li key={s.artist}>{name(s, s.time === "7:00 PM" || s.time === "5:30 PM" ? "major" : "minor")}</li>
                ))}
            </ul>
          </section>
        );
      })}

      <NamePopover
        picked={picked}
        saved={picked ? saved.has(picked.set.artist) : false}
        flagged={picked ? !!flagged?.has(picked.set.artist) : false}
        clashes={picked ? clashesWith(picked.set, savedList) : []}
        onToggle={() => picked && onToggle(picked.set.artist)}
        onFlag={() => picked && onFlag?.(picked.set.artist)}
        onClose={() => setPicked(null)}
        onKeepOpen={cancelClose}
        onLeave={scheduleClose}
      />
    </div>
  );
}

