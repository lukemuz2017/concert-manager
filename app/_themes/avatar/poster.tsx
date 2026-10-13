"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { clashesWith, DAY_ORDER, isHeadliner, LINEUP, SLOTS, type FestivalSet } from "./lineup";
import { ELEMENTS, SHAPE, TYPE } from "./tokens";
import { AddButton, CheckIcon, CloseIcon, Emblem, FOCUS, IconButton, NationMark, Seal, StageLine } from "./ui";

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
  clash,
  active,
  onHover,
  onLeave,
  onPick,
}: {
  set: FestivalSet;
  size: "headliner" | "major" | "minor";
  inPlan: boolean;
  clash: boolean;
  active: boolean;
  onHover: (anchor: HTMLElement) => void;
  onLeave: () => void;
  onPick: (anchor: HTMLElement) => void;
}) {
  const el = ELEMENTS[set.nation];
  // Headliners sit at 32px so a name fits on one or two lines; the rest are 20px and 17px.
  const type = {
    headliner: `${TYPE.heading.replace("text-2xl", "text-[28px] sm:text-[34px]")} leading-[1.1]! uppercase md:flex-row-reverse md:text-right`,
    major: "text-base sm:text-xl font-bold uppercase tracking-wide leading-tight",
    minor: "text-sm sm:text-[17px] font-bold uppercase tracking-wide leading-tight",
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
      className={`inline-flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-0.5 text-left underline decoration-[3px] underline-offset-[6px] transition-colors duration-(--el-dur) hover:bg-(--paper) hover:decoration-wavy ${FOCUS} ${active ? "bg-(--paper) decoration-wavy" : ""} ${type}`}
      style={{ textDecorationColor: el.line }}
    >
      <span style={{ color: el.line }} className="self-start pt-[0.2em]">
        <Emblem element={set.nation} className={emblem} />
      </span>
      {set.artist}
      {clash ? <Seal className="h-5 w-5 text-xs" /> : inPlan && <CheckIcon className="h-4 w-4" />}
      {(inPlan || clash) && <span className="sr-only">{clash ? " (clash)" : " (on your journey)"}</span>}
    </button>
  );
}

// The pop-up. A native popover: top layer, Escape and outside clicks close it.
// Opened by hover it never steals focus; opened by click it moves focus inside.
function NamePopover({
  picked,
  saved,
  clashes,
  onToggle,
  onClose,
  onKeepOpen,
  onLeave,
}: {
  picked: Picked | null;
  saved: boolean;
  clashes: FestivalSet[];
  onToggle: () => void;
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

    function place() {
      if (!el) return;
      if (window.matchMedia("(max-width: 639px)").matches) {
        Object.assign(el.style, { left: "0px", right: "0px", top: "auto", bottom: "0px" });
        return;
      }
      const a = anchor.getBoundingClientRect();
      const left = Math.min(Math.max(8, a.left + a.width / 2 - el.offsetWidth / 2), window.innerWidth - el.offsetWidth - 8);
      const below = a.bottom + 6;
      const top = below + el.offsetHeight > window.innerHeight - 8 ? Math.max(8, a.top - el.offsetHeight - 6) : below;
      Object.assign(el.style, { left: `${left}px`, top: `${top}px`, right: "auto", bottom: "auto" });
    }

    place();
    if (picked.via === "click") el.querySelector<HTMLElement>("button[aria-pressed]")?.focus();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
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
      className={`inset-auto m-0 w-full overflow-hidden border-[1.5px] border-(--ink) bg-(--paper) p-0 text-(--ink) sm:w-80 ${SHAPE.card}`}
    >
      {set && day && (
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <p className={`${TYPE.label} pt-2 text-(--ink-muted)`}>
              {day.dayName} · {set.time}
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
          <div className="mt-4">
            <AddButton added={saved} onToggle={onToggle} />
          </div>
        </div>
      )}
    </div>
  );
}

export function LineupPoster({
  saved,
  onToggle,
}: {
  saved: Set<string>;
  onToggle: (artist: string) => void;
}) {
  const [picked, setPicked] = useState<Picked | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
  const hover = (set: FestivalSet, anchor: HTMLElement) => {
    cancelClose();
    setPicked((p) => (p?.via === "click" && p.set === set ? p : { set, anchor, via: "hover" }));
  };

  useEffect(() => () => clearTimeout(closeTimer.current ?? undefined), []);

  const name = (set: FestivalSet, size: "headliner" | "major" | "minor") => (
    <PosterName
      set={set}
      size={size}
      inPlan={saved.has(set.artist)}
      clash={saved.has(set.artist) && clashesWith(set, savedList).length > 0}
      active={picked?.set === set}
      onHover={(anchor) => hover(set, anchor)}
      onLeave={scheduleClose}
      onPick={(anchor) => {
        cancelClose();
        setPicked({ set, anchor, via: "click" });
      }}
    />
  );

  return (
    <div className={`border-[1.5px] border-(--ink) bg-(--parchment) px-4 py-6 sm:px-8 sm:py-8 ${SHAPE.card}`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={TYPE.display}>The Four Nations</p>
          <p className="mt-1 text-sm font-medium tracking-[0.5em] uppercase">Music Festival · Thu–Sun</p>
        </div>
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
            aria-label={`${el.dayName} lineup`}
            className="mt-6 grid gap-x-8 gap-y-4 md:grid-cols-[minmax(0,19rem)_1fr] md:items-center"
          >
            {/* The day, plastered across the top of its band in the day's element color. */}
            <h4
              className={`${TYPE.display} flex items-center justify-between gap-4 px-4 py-1.5 uppercase md:col-span-2`}
              style={{ background: el.fill, color: el.on }}
            >
              {el.dayName}
              <Emblem element={day} className="h-9 w-9 sm:h-11 sm:w-11" />
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
            <ul className="flex flex-wrap content-center items-center gap-x-2 gap-y-2 sm:gap-x-4 sm:gap-y-3">
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
        clashes={picked ? clashesWith(picked.set, savedList) : []}
        onToggle={() => picked && onToggle(picked.set.artist)}
        onClose={() => setPicked(null)}
        onKeepOpen={cancelClose}
        onLeave={scheduleClose}
      />
    </div>
  );
}

