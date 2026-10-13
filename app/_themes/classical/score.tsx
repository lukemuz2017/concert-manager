"use client";

import { useEffect, useId, useState, type ReactNode } from "react";

import {
  clashesWith,
  DAY_NAMES,
  DAYS,
  PERFORMANCES,
  SLOTS,
  type Day,
  type Performance,
  type Venue,
} from "./programme";
import { TYPE } from "./tokens";
import { AddButton, CheckIcon, ClashMark, FOCUS, VenueIcon } from "./ui";

// The Score: a day as a timetable, venues down the side and the six time slots across,
// like a conductor's score with a staff for each instrument. Two performances saved in
// the same column stand one above the other, so a double engagement is visible, not read.
// Below it, "The order of the day" is a programme book: your saved sets (and whichever
// one you are reading) as numbered lines with dot leaders, each opening in place.

const slug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function Ribbon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
      <path d="M4 1.8h8v12.4L8 11 4 14.2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

// Slots where two or more saved performances overlap on one day.
export function clashSlots(day: Day, saved: Performance[]) {
  return new Set(
    SLOTS.filter((t) => saved.filter((p) => p.day === day && p.time === t).length > 1),
  );
}

/* The timetable ---------------------------------------------------------------- */

// Five hairlines behind every row, so each venue reads as a staff.
const STAFF =
  "repeating-linear-gradient(to bottom, transparent 0 15px, rgba(47,47,47,0.09) 15px 16px)";

export function Score({
  day,
  venues,
  saved,
  selected,
  onSelect,
  dim,
  warn,
}: {
  day: Day;
  venues: readonly Venue[];
  saved: Set<string>;
  selected: string | null;
  onSelect: (title: string | null) => void;
  dim: (p: Performance) => boolean;
  warn: boolean;
}) {
  const savedList = PERFORMANCES.filter((p) => saved.has(p.title));
  const clashing = warn ? clashSlots(day, savedList) : new Set<string>();
  const here = PERFORMANCES.filter((p) => p.day === day);

  return (
    <div
      className="overflow-x-auto border border-(--hairline) bg-(--ivory)"
      tabIndex={0}
      role="region"
      aria-label={`${DAY_NAMES[day]} timetable. Scroll sideways on small screens.`}
    >
      <table className="w-full min-w-[46rem] border-collapse text-left">
        <caption className="sr-only">
          {DAY_NAMES[day]}: venues down the side, time slots across. Choose a performance to read its notes.
        </caption>
        <thead>
          <tr>
            <th scope="col" className="sticky left-0 z-10 w-40 bg-(--ivory) p-2">
              <span className="sr-only">Venue</span>
            </th>
            {SLOTS.map((t) => (
              <th key={t} scope="col" className={`px-1 py-3 text-center ${TYPE.label} text-(--muted)`}>
                <span aria-label={t}>{t.replace(" PM", "")}</span>
                {clashing.has(t) && (
                  <span className="mt-1 flex justify-center">
                    <ClashMark />
                    <span className="sr-only"> double engagement</span>
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {venues.map((v) => (
            <tr key={v.name} className="border-t border-(--hairline)">
              <th scope="row" className="sticky left-0 z-10 bg-(--ivory) p-2 align-middle font-normal">
                <span className="flex items-center gap-2">
                  <VenueIcon venue={v} className="h-5 w-5 text-(--antique-gold)" />
                  <span className="leading-tight">{v.name}</span>
                </span>
              </th>
              {SLOTS.map((t) => {
                const p = here.find((x) => x.venue.name === v.name && x.time === t);
                return (
                  <td
                    key={t}
                    className="h-[86px] w-[8.5rem] p-1 align-top"
                    style={{ backgroundImage: STAFF, backgroundSize: "100% 80px", backgroundPosition: "0 3px" }}
                  >
                    {p ? (
                      <Block
                        p={p}
                        saved={saved.has(p.title)}
                        clash={warn && saved.has(p.title) && clashesWith(p, savedList).length > 0}
                        selected={selected === p.title}
                        dim={dim(p)}
                        onSelect={() => onSelect(selected === p.title ? null : p.title)}
                      />
                    ) : (
                      <span className="sr-only">No performance</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Block({
  p,
  saved,
  clash,
  selected,
  dim,
  onSelect,
}: {
  p: Performance;
  saved: boolean;
  clash: boolean;
  selected: boolean;
  dim: boolean;
  onSelect: () => void;
}) {
  const look = saved
    ? "border-(--forest) bg-(--forest) text-white"
    : "border-(--rule) bg-(--paper) text-(--charcoal) hover:bg-(--linen)";
  return (
    <button
      type="button"
      aria-expanded={selected}
      aria-controls={`prog-${slug(p.title)}`}
      onClick={onSelect}
      className={`flex h-full min-h-[78px] w-full cursor-pointer flex-col justify-between rounded-[2px] border px-2.5 py-2 text-left transition duration-200 ${look} ${clash ? "border-l-[5px] border-l-(--terracotta)" : ""} ${selected ? "ring-2 ring-(--charcoal) ring-offset-2 ring-offset-(--ivory)" : ""} ${dim ? "opacity-30" : ""} ${FOCUS}`}
    >
      <span className="font-(family-name:--font-playfair) text-[15px] leading-tight">{p.title}</span>
      <span className="mt-1 flex items-center gap-1.5 text-xs">
        {saved && <CheckIcon className="h-3.5 w-3.5" />}
        {saved && <span className="sr-only">In your itinerary</span>}
        {clash && (
          <>
            <ClashMark />
            <span className="sr-only">Double engagement</span>
          </>
        )}
      </span>
    </button>
  );
}

/* The order of the day: a programme book ---------------------------------------- */

function ProgrammeRow({
  n,
  p,
  saved,
  open,
  clashes,
  onToggleOpen,
  onToggleSaved,
}: {
  n: number;
  p: Performance;
  saved: boolean;
  open: boolean;
  clashes: Performance[];
  onToggleOpen: () => void;
  onToggleSaved: () => void;
}) {
  const id = slug(p.title);
  return (
    <li className="border-b border-(--hairline) last:border-b-0">
      <h4>
        <button
          type="button"
          id={`prog-btn-${id}`}
          aria-expanded={open}
          aria-controls={`prog-${id}`}
          onClick={onToggleOpen}
          className={`group flex w-full cursor-pointer items-baseline gap-3 px-1 py-3.5 text-left ${FOCUS}`}
        >
          <span className="w-7 shrink-0 font-(family-name:--font-playfair) text-(--muted) italic">{n}.</span>
          <span className="flex shrink items-baseline gap-2">
            {saved ? <Ribbon className="h-4 w-4 translate-y-0.5 text-(--forest)" /> : null}
            <span className="font-(family-name:--font-playfair) text-lg leading-snug">{p.title}</span>
          </span>
          <span aria-hidden="true" className="mb-1 min-w-6 flex-1 border-b-2 border-dotted border-(--rule)" />
          <span className="text-sm whitespace-nowrap tabular-nums">{p.time}</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className={`h-4 w-4 shrink-0 self-center text-(--muted) transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          >
            <path d="M3.5 6l4.5 4.5L12.5 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h4>
      <div
        id={`prog-${id}`}
        role="region"
        aria-labelledby={`prog-btn-${id}`}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="pb-6 pl-10">
            <p className="flex items-center gap-2">
              <VenueIcon venue={p.venue} className="h-5 w-5 text-(--antique-gold)" />
              {p.venue.name}
            </p>
            <p className="mt-2 font-(family-name:--font-playfair) text-base leading-relaxed italic">{p.programme}</p>
            <p className="mt-1 text-sm text-(--muted)">1 hr 30 min · one interval</p>
            {clashes.length > 0 && (
              <p className="mt-3 flex items-start gap-3 border-l-4 border-(--terracotta) bg-(--paper) p-3">
                <span>
                  {saved ? "Double engagement with" : "Also at this hour:"}{" "}
                  <b className="font-semibold">{clashes.map((c) => c.title).join(", ")}</b>.
                </span>
              </p>
            )}
            <div className="mt-4">
              <AddButton added={saved} onToggle={onToggleSaved} />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export function OrderOfTheDay({
  day,
  saved,
  selected,
  onSelect,
  onToggleSaved,
  warn,
}: {
  day: Day;
  saved: Set<string>;
  selected: string | null;
  onSelect: (title: string | null) => void;
  onToggleSaved: (title: string) => void;
  warn: boolean;
}) {
  const savedList = PERFORMANCES.filter((p) => saved.has(p.title));
  const rows = PERFORMANCES.filter((p) => p.day === day && (saved.has(p.title) || p.title === selected)).sort(
    (a, b) => SLOTS.indexOf(a.time) - SLOTS.indexOf(b.time),
  );
  return (
    <section aria-labelledby={`order-${day}`} className="mt-10">
      <h3 id={`order-${day}`} className={TYPE.heading}>
        The order of the day
      </h3>
      <p className="mt-1 text-(--muted)">Your saved performances, in order. Choose a block above to read it here.</p>
      {rows.length === 0 ? (
        <p className="mt-5 bg-(--linen) p-6 text-center text-(--muted)">
          Nothing saved on {DAY_NAMES[day]}. Choose a block in the score to read its programme notes and add it.
        </p>
      ) : (
        <ol className="mt-4 border-t border-(--hairline)">
          {rows.map((p, i) => (
            <ProgrammeRow
              key={p.title}
              n={i + 1}
              p={p}
              saved={saved.has(p.title)}
              open={selected === p.title}
              clashes={warn ? clashesWith(p, savedList) : []}
              onToggleOpen={() => onSelect(selected === p.title ? null : p.title)}
              onToggleSaved={() => onToggleSaved(p.title)}
            />
          ))}
        </ol>
      )}
    </section>
  );
}

/* Turning the page ------------------------------------------------------------------ */

// Changing day turns the page: forward, the current page lifts away from its spine to
// reveal the next; backward, the earlier page settles back on top. Skipped entirely for
// people who prefer reduced motion.
export function PageTurn({ day, render }: { day: Day; render: (day: Day, live: boolean) => ReactNode }) {
  const [view, setView] = useState<{ day: Day; from: Day | null; dir: 1 | -1 }>({ day, from: null, dir: 1 });

  if (view.day !== day) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setView({ day, from: reduce ? null : view.day, dir: DAYS.indexOf(day) > DAYS.indexOf(view.day) ? 1 : -1 });
  }

  const finish = () => setView((v) => ({ ...v, from: null }));

  // Safety net: if the animation never reports back (a background tab pauses animations),
  // remove the turning layer anyway so a page can never be left covering the new one.
  useEffect(() => {
    if (!view.from) return;
    const timer = setTimeout(finish, 1200);
    return () => clearTimeout(timer);
  }, [view.from, view.day]);
  const pages: { day: Day; role: "still" | "under" | "leaving" | "arriving" }[] = view.from
    ? view.dir === 1
      ? [
          { day: view.from, role: "leaving" },
          { day: view.day, role: "under" },
        ]
      : [
          { day: view.from, role: "under" },
          { day: view.day, role: "arriving" },
        ]
    : [{ day: view.day, role: "still" }];

  return (
    <div className="relative overflow-hidden [perspective:2400px]">
      {pages.map(({ day: d, role }) => {
        const turning = role === "leaving" || role === "arriving";
        return (
          <div
            key={d}
            aria-hidden={role === "leaving" || role === "under" ? true : undefined}
            inert={role === "leaving" || role === "under"}
            onAnimationEnd={turning ? finish : undefined}
            className={
              turning
                ? `absolute inset-x-0 top-0 z-10 origin-left bg-(--paper) shadow-[8px_0_24px_-12px_rgba(47,47,47,0.45)] [backface-visibility:hidden] ${role === "leaving" ? "page-turn-away" : "page-turn-back"}`
                : "relative bg-(--paper)"
            }
          >
            {render(d, role === "still" || role === "arriving")}
          </div>
        );
      })}
    </div>
  );
}

// One day's page: any double engagement, the score, and the order of the day.
export function ScoreDay({
  day,
  venues,
  saved,
  selected,
  onSelect,
  onToggleSaved,
  onKeep,
  dim,
  warn,
  live,
  notice,
}: {
  day: Day;
  venues: readonly Venue[];
  saved: Set<string>;
  selected: string | null;
  onSelect: (title: string | null) => void;
  onToggleSaved: (title: string) => void;
  onKeep: (title: string) => void;
  dim: (p: Performance) => boolean;
  warn: boolean;
  live: boolean;
  notice: (sets: Performance[], onKeep: (p: Performance) => void) => ReactNode;
}) {
  const id = useId();
  const savedList = PERFORMANCES.filter((p) => saved.has(p.title));
  const clash = warn ? savedList.filter((p) => p.day === day && clashesWith(p, savedList).length > 0) : [];
  // Several clashing slots can be on one day; show the first so the notice stays readable.
  const firstSlot = clash.length > 0 ? clash[0].time : null;
  const firstClash = firstSlot ? clash.filter((p) => p.time === firstSlot) : [];
  return (
    <div className="p-1" data-live={live ? "true" : "false"} id={id}>
      {firstClash.length > 1 && <div className="mb-5">{notice(firstClash, (p) => onKeep(p.title))}</div>}
      <Score
        day={day}
        venues={venues}
        saved={saved}
        selected={selected}
        onSelect={onSelect}
        dim={dim}
        warn={warn}
      />
      <OrderOfTheDay day={day} saved={saved} selected={selected} onSelect={onSelect} onToggleSaved={onToggleSaved} warn={warn} />
    </div>
  );
}

