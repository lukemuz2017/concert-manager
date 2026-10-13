"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { clashesWith, LINEUP, SLOTS, STAGES } from "@/app/_themes/avatar/lineup";
import { LineupPoster } from "@/app/_themes/avatar/poster";
import { ELEMENT_ORDER, ELEMENTS, elementVars, SHAPE, TYPE, type ElementKey } from "@/app/_themes/avatar/tokens";
import {
  AddButton,
  BalanceMeter,
  Badge,
  Button,
  Checkbox,
  ClashNotice,
  CloseIcon,
  DayTabs,
  Emblem,
  FOCUS,
  IconButton,
  JourneyMap,
  JourneyPath,
  LineupRow,
  Modal,
  NextUp,
  Radio,
  ScrollPanel,
  Select,
  SetCard,
  StageChip,
  TextField,
  TextLink,
  Toggle,
  useElement,
} from "@/app/_themes/avatar/ui";
import nightStage from "@/app/mood-boards/avatar/images/night-stage.jpg";
import town from "@/app/mood-boards/avatar/images/town.jpg";

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
  const { element } = useElement();
  const [saved, setSaved] = useState(
    () => new Set(["Bosco the Bear", "Kuzon's Crew", "Dragon of the West", "Moon Spirit Choir", "Badgermoles"]),
  );
  const [stages, setStages] = useState(() => new Set<string>());
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("time");
  const [show, setShow] = useState("all");
  const [hideClashes, setHideClashes] = useState(false);
  const [warn, setWarn] = useState(true);
  const [detail, setDetail] = useState<string | null>(null);
  const [heroAdded, setHeroAdded] = useState(false);
  const ids = useId();

  const toggle = (artist: string) => setSaved((prev) => toggled(prev, artist));
  const savedList = LINEUP.filter((s) => saved.has(s.artist));
  const clashing = (artist: string) => warn && saved.has(artist) && clashesWith(find(artist), savedList).length > 0;

  const rows = LINEUP.filter(
    (s) =>
      s.day === element &&
      (stages.size === 0 || stages.has(s.stage.name)) &&
      (show === "all" || saved.has(s.artist)) &&
      !(hideClashes && !saved.has(s.artist) && clashesWith(s, savedList).length > 0) &&
      s.artist.toLowerCase().includes(query.trim().toLowerCase()),
  ).sort((a, b) => {
    if (sort === "stage") return STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage);
    if (sort === "artist") return a.artist.localeCompare(b.artist);
    return SLOTS.indexOf(a.time) - SLOTS.indexOf(b.time);
  });

  const clash = warn ? savedList.filter((s) => s.day === element && clashesWith(s, savedList).length > 0) : [];
  const keep = (artist: string) =>
    setSaved((prev) => {
      const next = new Set(prev);
      for (const other of clashesWith(find(artist), savedList)) next.delete(other.artist);
      return next;
    });

  const players = find("The Ember Island Players");
  const open = detail ? find(detail) : null;
  const today = ELEMENTS[element as ElementKey];

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
      <Panel
        title="Lineup poster"
        note="All 100 artists, a band per day. Each name wears its nation's emblem and underline. Hover a name, or click it, for the time, the stage, and the add button."
        className="lg:col-span-2"
      >
        <LineupPoster saved={saved} onToggle={toggle} />
      </Panel>

      <Panel
        title="Lineup: day tabs, stage chips, rows & clash"
        note="The day tabs are today's element: pick one and the whole page follows. On Saturday, add Healing Hands to collide with Kuzon's Crew at 7:00."
        className="lg:col-span-2"
      >
        <div className="grid gap-10 lg:grid-cols-[250px_1fr]">
          <div className="flex flex-col gap-6">
            <TextField label="Search the lineup" type="search" placeholder="Try “dragon”" value={query} onChange={(e) => setQuery(e.target.value)} />
            <Select label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="time">Time</option>
              <option value="stage">Stage</option>
              <option value="artist">Artist</option>
            </Select>
            <fieldset>
              <legend className={`${TYPE.label} text-(--ink-muted)`}>Show</legend>
              <div className="mt-3 flex flex-col gap-2.5">
                <Radio name={`${ids}-show`} value="all" checked={show === "all"} onChange={() => setShow("all")} label="The whole lineup" />
                <Radio name={`${ids}-show`} value="saved" checked={show === "saved"} onChange={() => setShow("saved")} label="Only my journey" />
              </div>
            </fieldset>
            <Checkbox label="Hide sets that would clash" checked={hideClashes} onChange={(e) => setHideClashes(e.target.checked)} />
            <Toggle label="Warn me about clashes" checked={warn} onChange={setWarn} />
          </div>

          <div className="min-w-0">
            <div className="mb-6 flex flex-wrap gap-2">
              {STAGES.map((s) => (
                <StageChip
                  key={s.name}
                  name={s.name}
                  nation={s.nation}
                  selected={stages.has(s.name)}
                  onToggle={() => setStages((prev) => toggled(prev, s.name))}
                />
              ))}
            </div>
            <DayTabs>
              <div aria-live="polite">
                {clash.length > 1 && (
                  <div className="mt-5">
                    <ClashNotice sets={clash} onKeep={(s) => keep(s.artist)} />
                  </div>
                )}
                {rows.length > 0 ? (
                  <ul className="mt-2">
                    {rows.map((s) => (
                      <LineupRow
                        key={s.artist}
                        set={s}
                        saved={saved.has(s.artist)}
                        clash={clashing(s.artist)}
                        onToggle={() => toggle(s.artist)}
                        onDetails={() => setDetail(s.artist)}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className={`mt-5 bg-(--el-wash) p-6 text-center text-(--ink-muted) ${SHAPE.card}`}>
                    Nothing on {today.dayName} matches. Try another stage, or another day.
                  </p>
                )}
              </div>
            </DayTabs>
          </div>
        </div>
      </Panel>

      <Panel
        title="Journey: path, map & next up"
        note="Your day as a route. Saturday shows a tight walk: Bosco the Bear plays Ba Sing Se at 5:30, and Kuzon's Crew start at 7:00 on another stage. The clock is set to 6:40 PM."
        className="lg:col-span-2"
      >
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.3fr]">
          <JourneyPath day={element} saved={savedList} />
          <div className="flex flex-col gap-5">
            <JourneyMap day={element} saved={savedList} />
            <NextUp day={element} saved={savedList} lineup={LINEUP} />
          </div>
        </div>
      </Panel>

      <Panel title="Festival hero" note="The opening of the site: the day's element carries the one action that matters.">
        <div className={`overflow-hidden border-[1.5px] border-(--ink) ${SHAPE.card}`}>
          <div className="relative h-56">
            <Image src={town} alt="A festival town of pagodas and red banners below mountain peaks" fill sizes="560px" className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-r from-(--paper) from-35% via-(--paper)/70 via-55% to-transparent" />
            <div className="absolute inset-y-0 left-0 flex max-w-[16rem] flex-col justify-center gap-3 p-5">
              <p className={TYPE.heading}>Four nations. One stage.</p>
              <div>
                <AddButton added={heroAdded} onToggle={() => setHeroAdded(!heroAdded)} label="Start my journey" addedLabel="Journey started" />
              </div>
            </div>
          </div>
          <ul className="grid grid-cols-4 divide-x-[1.5px] divide-dashed divide-(--line) bg-(--paper)">
            {ELEMENT_ORDER.map((key) => (
              <li key={key} className="flex flex-col items-center gap-1 py-3" style={{ color: ELEMENTS[key].line }}>
                <Emblem element={key} className="h-7 w-7" />
                <span className={`${TYPE.label} tracking-[0.12em]! text-(--ink)`}>{ELEMENTS[key].day}</span>
              </li>
            ))}
          </ul>
        </div>
      </Panel>

      <Panel title="Card" note="A set, its stage, and the primary action.">
        <SetCard
          set={players}
          saved={saved.has(players.artist)}
          onToggle={() => toggle(players.artist)}
          onDetails={() => setDetail(players.artist)}
          image={<Image src={nightStage} alt="A festival stage lit up at dusk before a huge crowd" fill sizes="560px" className="object-cover" />}
        />
      </Panel>

      <Panel title="Balance" note="How your journey spreads across the four elements. Add a Sunday set to bring air back in.">
        <BalanceMeter saved={savedList} />
      </Panel>

      <Panel title="Buttons, link & badges">
        <div className="flex flex-wrap items-center gap-4">
          <Button>Explore the lineup</Button>
          <Button variant="secondary">View the map</Button>
          <IconButton label="Close">
            <CloseIcon />
          </IconButton>
          <TextLink href="/mood-boards/avatar">See the mood board</TextLink>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Badge tone="clash" />
          <Badge tone="tight" count={12} />
          <span className="inline-flex items-center gap-2">
            <Badge tone="count" count={saved.size} />
            <span className="text-(--ink-muted)">On your journey</span>
          </span>
        </div>
      </Panel>

      <Modal open={open !== null} onClose={() => setDetail(null)} labelledBy={`${ids}-detail`}>
        {open && (
          <ScrollPanel
            set={open}
            titleId={`${ids}-detail`}
            saved={saved.has(open.artist)}
            clashes={warn ? clashesWith(open, savedList) : []}
            onToggle={() => toggle(open.artist)}
            onClose={() => setDetail(null)}
          />
        )}
      </Modal>
    </div>
  );
}
