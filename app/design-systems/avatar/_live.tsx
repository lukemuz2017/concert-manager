"use client";

import { useState } from "react";

import { clashesWith, LINEUP, STAGES } from "@/app/_themes/avatar/lineup";
import { LineupPoster } from "@/app/_themes/avatar/poster";
import { ELEMENT_ORDER, ELEMENTS, elementVars, SHAPE, TYPE } from "@/app/_themes/avatar/tokens";
import { StageCard } from "@/app/_themes/avatar/gallery";
import { anyLineup, FilterDialog, lineupChips, lineupMatcher, LineupSearchBar, type LineupQuery } from "@/app/_themes/avatar/lineup-controls";
import { JourneySheet } from "@/app/_themes/avatar/site";
import { AddButton, Badge, Button, CloseIcon, Emblem, FlagButton, FOCUS, IconButton, TextLink, useElement } from "@/app/_themes/avatar/ui";

import { Panel } from "./_parts";

const find = (artist: string) => LINEUP.find((s) => s.artist === artist)!;

function toggled(set: Set<string>, key: string) {
  const next = new Set(set);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

/* The mode switcher ---------------------------------------------------------- */

export function ModeSwitcher() {
  const { element, setElement } = useElement();
  return (
    <div className="sticky top-0 z-20 -mx-4 border-b-[1.5px] border-(--ink) bg-(--parchment)/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2">
        <p className={TYPE.label}>Today&rsquo;s element</p>
        <div className="flex flex-wrap gap-2">
          {ELEMENT_ORDER.map((key) => {
            const el = ELEMENTS[key];
            const on = key === element;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => setElement(key)}
                className={`inline-flex cursor-pointer items-center gap-1.5 border-[1.5px] border-(--ink) px-3 py-1.5 text-sm font-medium ${SHAPE.button} ${FOCUS}`}
                style={on ? { background: el.fill, color: el.on } : { background: "var(--paper)" }}
              >
                <Emblem element={key} className="h-5 w-5" />
                {el.day} · {el.name}
              </button>
            );
          })}
        </div>
        <p className="hidden text-sm text-(--ink-muted) md:block">
          The page re-themes and moves like {ELEMENTS[element].name.toLowerCase()}.
        </p>
      </div>
    </div>
  );
}

/* Bending: the motion lab ---------------------------------------------------- */

// Plots an easing curve. y runs from -0.15 to 1.45 so fire's overshoot fits.
function Curve({ ease }: { ease: string }) {
  const nums = ease.match(/-?[\d.]+/g)?.map(Number);
  const [x1, y1, x2, y2] = nums && nums.length === 4 ? nums : [0, 0, 1, 1];
  const X = (x: number) => 8 + x * 84;
  const Y = (y: number) => 92 - ((y + 0.15) / 1.6) * 84;
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className="h-24 w-24 shrink-0">
      <path d={`M${X(0)} ${Y(1)}H${X(1)}M${X(0)} ${Y(0)}H${X(1)}`} stroke="var(--line)" strokeWidth="1" strokeDasharray="3 3" />
      <path
        d={`M${X(0)} ${Y(0)}C${X(x1)} ${Y(y1)} ${X(x2)} ${Y(y2)} ${X(1)} ${Y(1)}`}
        fill="none"
        stroke="var(--el-line)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MotionLab() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {ELEMENT_ORDER.map((key) => {
        const el = ELEMENTS[key];
        return (
          // Each card carries its own element, whatever today's element is.
          <div
            key={key}
            className={`flex flex-col border-[1.5px] border-(--ink) bg-(--paper) p-5 ${SHAPE.card}`}
            style={elementVars(key)}
          >
            <div className="flex items-center gap-2" style={{ color: el.line }}>
              <Emblem element={key} className="h-7 w-7" />
              <span className={`${TYPE.glyph} text-2xl`} lang="zh-Hant">
                {el.glyph}
              </span>
            </div>
            <p className={`mt-3 ${TYPE.heading}`}>{el.motion.name}</p>
            <p className={`${TYPE.label} text-(--ink-muted)`}>{el.name}</p>
            <dl className="mt-4 text-sm">
              <dt className={`${TYPE.label} text-(--ink-muted)`}>Hover</dt>
              <dd className="font-bold">{el.motion.hoverLabel}</dd>
              <dt className={`${TYPE.label} mt-3 text-(--ink-muted)`}>Press</dt>
              <dd className="font-bold">{el.motion.pressLabel}</dd>
            </dl>
            <div className="mt-4 flex items-center gap-3">
              <Curve ease={el.motion.ease} />
              <p className="text-sm text-(--ink-muted)">Color and small-control easing, {el.motion.duration}.</p>
            </div>
            <p className="mt-3 flex-1 text-(--ink-muted)">{el.motion.note}</p>
            <div className="mt-6 flex justify-center py-4">
              <Button>Hover, then press</Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Components, working ------------------------------------------------------- */

export function LiveComponents() {
  const [saved, setSaved] = useState(
    () => new Set(["Monk Gyatso", "Kuzon's Crew", "Dragon of the West", "Moon Spirit Choir", "Badgermoles"]),
  );
  const [flagged, setFlagged] = useState(() => new Set(["Bato's Boat", "Whale-Tooth Drums"]));
  const [lineup, setLineup] = useState<LineupQuery>(anyLineup);
  const [filtering, setFiltering] = useState(false);
  const [tab, setTab] = useState<"journey" | "interested">("journey");
  const [warn, setWarn] = useState(true);

  const toggle = (artist: string) => setSaved((prev) => toggled(prev, artist));
  const flag = (artist: string) => setFlagged((prev) => toggled(prev, artist));
  const savedList = LINEUP.filter((s) => saved.has(s.artist));
  const flaggedList = LINEUP.filter((s) => flagged.has(s.artist));
  const keep = (artist: string) =>
    setSaved((prev) => {
      const next = new Set(prev);
      for (const other of clashesWith(find(artist), savedList)) next.delete(other.artist);
      return next;
    });

  const isShown = lineupMatcher(lineup, saved, flagged);
  const shownCount = LINEUP.filter(isShown).length;
  const chips = lineupChips(lineup, setLineup);
  const narrowed = chips.length > 0 || lineup.query.trim() !== "";
  const oasis = STAGES.find((st) => st.name === "Spirit Oasis")!;

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
      <Panel
        title="Lineup: search, filters & poster"
        note="All 100 artists, a band per day, each name in its nation's emblem and underline. Search, or open Filters for nation, stage, genre, time, and clashes; applied filters become chips, and everyone else fades back. Rest on a name, or click it, for the time, the stage, and the add and Interested buttons."
        className="lg:col-span-2"
      >
        <h3 className={TYPE.heading}>The lineup</h3>
        <div className="mt-3 mb-5">
          <LineupSearchBar lineup={lineup} onChange={setLineup} chips={chips} shownCount={shownCount} onOpenFilters={() => setFiltering(true)} />
        </div>
        <LineupPoster titled={false} saved={saved} onToggle={toggle} flagged={flagged} onFlag={flag} shown={narrowed ? isShown : undefined} />
        <FilterDialog
          open={filtering}
          onClose={() => setFiltering(false)}
          lineup={lineup}
          onChange={setLineup}
          activeCount={chips.length}
          shownCount={shownCount}
          savedCount={saved.size}
          flaggedCount={flagged.size}
          idPrefix="ds-filters"
        />
      </Panel>

      <Panel
        title="My journey: tabs, path, map & clash"
        note="What the journey drawer holds. Saturday shows a tight walk: Monk Gyatso ends at 6:45 at the Western Air Temple, but Kuzon's Crew start at 7:00 a 25-minute walk away. Add Bato's Boat on the poster to collide with Kuzon's Crew at 7:00."
      >
        <div className={`flex h-[46rem] flex-col overflow-hidden border-[1.5px] border-(--ink) bg-(--paper) ${SHAPE.card}`}>
          <JourneySheet
            tab={tab}
            onTab={setTab}
            saved={saved}
            savedList={savedList}
            flaggedList={flaggedList}
            warn={warn}
            onWarn={setWarn}
            onToggle={toggle}
            onUnflag={flag}
            onKeep={keep}
          />
        </div>
      </Panel>

      <div className="grid gap-6">
        <Panel title="Card" note="A stage: its painting, its nation, its line, and the walk from the gate.">
          <StageCard stage={oasis} />
        </Panel>

        <Panel title="Buttons, link & badges">
          <div className="flex flex-wrap items-center gap-4">
            <AddButton added={false} />
            <FlagButton flagged={false} />
            <Button variant="secondary">Clear all</Button>
            <IconButton label="Close">
              <CloseIcon />
            </IconButton>
            <TextLink href="/planner/festival">The festival</TextLink>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Badge tone="clash" />
            <Badge tone="tight" count={25} />
            <span className="inline-flex items-center gap-2">
              <Badge tone="count" count={saved.size} />
              <span className="text-(--ink-muted)">On your journey</span>
            </span>
          </div>
        </Panel>
      </div>
    </div>
  );
}
