"use client";

import { useId, useState } from "react";

import { STAGES, TYPE } from "@/app/_themes/candyland/tokens";
import {
  AddButton,
  ArtistCard,
  Badge,
  Button,
  Checkbox,
  Chip,
  DetailPanel,
  Modal,
  Radio,
  Select,
  SetRow,
  Tabs,
  TextField,
  TextLink,
  Toggle,
} from "@/app/_themes/candyland/ui";

import { Panel } from "./_parts";
import { clashes, DAYS, findSet, SETS } from "./_sample";

const DAY_NAMES: Record<string, string> = { Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };
const SLOTS = ["1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM", "7:00 PM", "8:30 PM"];
const SORTS = [
  ["time", "Time"],
  ["stage", "Stage"],
  ["artist", "Artist"],
] as const;

function toggled(set: Set<string>, key: string) {
  const next = new Set(set);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

// Every component, working. Nothing is saved: it resets on reload.
export function LiveComponents() {
  const [added, setAdded] = useState(() => new Set(["Brain Freeze", "Gumdrop Velvet"]));
  const [day, setDay] = useState("Thu");
  const [stages, setStages] = useState(() => new Set<string>());
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<string>("time");
  const [onlyMine, setOnlyMine] = useState(false);
  const [alerts, setAlerts] = useState(true);
  const [detail, setDetail] = useState<string | null>(null);
  const ids = useId();

  const toggleSet = (artist: string) => setAdded((prev) => toggled(prev, artist));
  const crashing = alerts ? clashes(SETS.filter((s) => added.has(s.artist))) : new Set<string>();

  const rows = SETS.filter(
    (s) =>
      s.day === day &&
      (stages.size === 0 || stages.has(s.stage.name)) &&
      (!onlyMine || added.has(s.artist)) &&
      s.artist.toLowerCase().includes(query.trim().toLowerCase()),
  ).sort((a, b) => {
    if (sort === "stage") return STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage);
    if (sort === "artist") return a.artist.localeCompare(b.artist);
    return SLOTS.indexOf(a.time) - SLOTS.indexOf(b.time);
  });

  const lolly = findSet("Lolly & the Lickables");
  const licorice = findSet("Lord Licorice Big Band");

  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <Panel title="Buttons & link" note="Primary adds a set and stays pressed down while it's on your list.">
        <div className="flex flex-wrap items-center gap-4 pb-[5px]">
          <AddButton added={added.has("Mint Condition")} onToggle={() => toggleSet("Mint Condition")} />
          <Button variant="secondary" onClick={() => setDetail(licorice.artist)}>
            Details
          </Button>
          <TextLink href="/mood-boards/candyland">See the mood board</TextLink>
        </div>
      </Panel>

      <Panel
        title="Card & badges"
        note="Brain Freeze is already on your list at the same time. Add Lolly & the Lickables to cause a Sugar Crash."
      >
        <ArtistCard
          set={lolly}
          added={added.has(lolly.artist)}
          clash={crashing.has(lolly.artist)}
          onToggle={() => toggleSet(lolly.artist)}
          onDetails={() => setDetail(lolly.artist)}
        />
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="inline-flex items-center gap-2">
            <Badge tone="headliner" />
            <span className="text-(--muted)">8:30 PM sets</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <Badge tone="crash" />
            <span className="text-(--muted)">Double-booked</span>
          </span>
        </div>
      </Panel>

      <Panel title="Form controls" note="These drive the list beside them.">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Search artists"
            type="search"
            placeholder="Try “brain”"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Select label="Day" value={day} onChange={(e) => setDay(e.target.value)}>
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {DAY_NAMES[d]}
              </option>
            ))}
          </Select>
        </div>
        <fieldset className="mt-5">
          <legend className={TYPE.label}>Sort by</legend>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
            {SORTS.map(([value, label]) => (
              <Radio
                key={value}
                name={`${ids}-sort`}
                value={value}
                checked={sort === value}
                onChange={() => setSort(value)}
                label={label}
              />
            ))}
          </div>
        </fieldset>
        <div className="mt-5 flex flex-col items-start gap-3">
          <Checkbox
            label="Only show my set list"
            checked={onlyMine}
            onChange={(e) => setOnlyMine(e.target.checked)}
          />
          <Toggle label="Warn me about Sugar Crashes" checked={alerts} onChange={setAlerts} />
        </div>
      </Panel>

      <Panel title="Tabs, filter chips & list rows" note="Pick a day, filter by stage, tick a row to add it.">
        <Tabs label="Day" tabs={DAYS} selected={day} onSelect={setDay}>
          <div className="flex flex-wrap gap-2">
            {STAGES.map((s) => (
              <Chip
                key={s.name}
                stage={s}
                selected={stages.has(s.name)}
                onToggle={() => setStages((prev) => toggled(prev, s.name))}
              />
            ))}
          </div>
          {rows.length > 0 ? (
            <ul className="mt-4 space-y-1">
              {rows.map((s) => (
                <SetRow
                  key={s.artist}
                  set={s}
                  added={added.has(s.artist)}
                  clash={crashing.has(s.artist)}
                  onToggle={() => toggleSet(s.artist)}
                />
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-2xl bg-(--wash) px-4 py-6 text-center text-(--muted)">
              Nothing on {DAY_NAMES[day]} matches these filters.
            </p>
          )}
        </Tabs>
      </Panel>

      <Panel
        title="Detail panel & modal"
        note="Every Details button opens this panel as a modal. Escape or a click outside closes it."
        className="lg:col-span-2"
      >
        <div className="max-w-lg rounded-2xl ring-2 ring-[#3B1F2B]/10">
          <DetailPanel
            set={licorice}
            added={added.has(licorice.artist)}
            onToggle={() => toggleSet(licorice.artist)}
          />
        </div>
      </Panel>

      <Modal open={detail !== null} onClose={() => setDetail(null)} labelledBy={`${ids}-detail`}>
        {detail && (
          <DetailPanel
            set={findSet(detail)}
            titleId={`${ids}-detail`}
            added={added.has(detail)}
            onToggle={() => toggleSet(detail)}
            onClose={() => setDetail(null)}
          />
        )}
      </Modal>
    </div>
  );
}
