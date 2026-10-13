"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { clashesWith, DAY_NAMES, DAYS, PERFORMANCES, VENUES, type Day, type Performance } from "@/app/_themes/classical/programme";
import { PageTurn, ScoreDay } from "@/app/_themes/classical/score";
import { TYPE } from "@/app/_themes/classical/tokens";
import {
  AddButton,
  Badge,
  Button,
  Checkbox,
  ClashNotice,
  CloseIcon,
  DetailPanel,
  IconButton,
  Modal,
  PerformanceCard,
  Radio,
  Select,
  Tabs,
  TextField,
  TextLink,
  Toggle,
  VenueChip,
} from "@/app/_themes/classical/ui";
import terraceQuartet from "@/app/mood-boards/classical/images/terrace-quartet.jpg";

import { Panel } from "./_parts";

const find = (title: string) => PERFORMANCES.find((p) => p.title === title)!;

function toggled(set: Set<string>, key: string) {
  const next = new Set(set);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

// Every component, working. Nothing is saved: it resets on reload.
export function LiveComponents() {
  const [saved, setSaved] = useState(() => new Set(["Bach Cello Suites"]));
  const [day, setDay] = useState<Day>("Sat");
  const [venues, setVenues] = useState(() => new Set<string>());
  const [query, setQuery] = useState("");
  const [show, setShow] = useState("all");
  const [hideClashes, setHideClashes] = useState(false);
  const [warn, setWarn] = useState(true);
  const [detail, setDetail] = useState<string | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>("Bach Cello Suites");
  const ids = useId();

  const toggle = (title: string) => setSaved((prev) => toggled(prev, title));
  const savedList = PERFORMANCES.filter((p) => saved.has(p.title));

  const q = query.trim().toLowerCase();
  // Blocks that don't match fade back, so the timetable keeps its shape.
  const dim = (p: Performance) =>
    (q !== "" && !p.title.toLowerCase().includes(q)) ||
    (show === "saved" && !saved.has(p.title)) ||
    (hideClashes && !saved.has(p.title) && clashesWith(p, savedList).length > 0);
  const shownVenues = venues.size === 0 ? VENUES : VENUES.filter((v) => venues.has(v.name));

  const changeDay = (d: Day) => {
    setDay(d);
    setSelected(null);
  };

  const keep = (title: string) =>
    setSaved((prev) => {
      const next = new Set(prev);
      for (const other of clashesWith(find(title), savedList)) next.delete(other.title);
      return next;
    });

  const haydn = find("Haydn String Quartet");
  const mozart = find("Mozart by Candlelight");
  const open = detail ? find(detail) : null;

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
      <Panel
        title="The Score: timetable, programme notes & page turn"
        note="Venues down the side, time across: a double engagement shows as two blocks in one column. Choose a block to read it in the order of the day below. Bach Cello Suites is saved; save Boccherini Guitar Quintets (Saturday, 7:00) to cause one. Change day to turn the page."
        className="lg:col-span-2"
      >
        <div className="grid gap-x-10 gap-y-6 md:grid-cols-[minmax(0,18rem)_1fr]">
          <TextField
            label="Search the programme"
            type="search"
            placeholder="Try “Handel”"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            <fieldset>
              <legend className={`${TYPE.label} text-(--muted)`}>Show</legend>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2.5">
                <Radio name={`${ids}-show`} value="all" checked={show === "all"} onChange={() => setShow("all")} label="All performances" />
                <Radio name={`${ids}-show`} value="saved" checked={show === "saved"} onChange={() => setShow("saved")} label="Only my itinerary" />
              </div>
            </fieldset>
            <Checkbox label="Hide performances that clash" checked={hideClashes} onChange={(e) => setHideClashes(e.target.checked)} />
            <Toggle label="Warn me about double engagements" checked={warn} onChange={setWarn} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {VENUES.map((v) => (
            <VenueChip
              key={v.name}
              venue={v}
              selected={venues.has(v.name)}
              onToggle={() => setVenues((prev) => toggled(prev, v.name))}
            />
          ))}
        </div>

        <div className="mt-8">
          <Tabs label="Festival day" tabs={DAYS} selected={day} onSelect={(d) => changeDay(d as Day)}>
            <div className="mt-6" aria-live="polite">
              <PageTurn
                day={day}
                render={(d, live) => (
                  <ScoreDay
                    day={d}
                    venues={shownVenues}
                    saved={saved}
                    selected={live ? selected : null}
                    onSelect={setSelected}
                    onToggleSaved={toggle}
                    onKeep={keep}
                    dim={dim}
                    warn={warn}
                    live={live}
                    notice={(sets, onKeep) => <ClashNotice sets={sets} onKeep={onKeep} />}
                  />
                )}
              />
            </div>
          </Tabs>
        </div>
      </Panel>

      <Panel title="Card" note="A performance with its painting, programme, venue, and the primary action.">
        <div className="max-w-sm">
          <PerformanceCard
            performance={haydn}
            saved={saved.has(haydn.title)}
            onToggle={() => toggle(haydn.title)}
            onDetails={() => setDetail(haydn.title)}
            image={
              <Image
                src={terraceQuartet}
                alt="A string quartet playing on a stone terrace"
                fill
                sizes="384px"
                className="object-cover"
              />
            }
          />
        </div>
      </Panel>

      <div className="grid gap-6">
        <Panel title="Buttons, icon button & link" note="Forest is kept for the action that matters most: saving a performance.">
          <div className="flex flex-wrap items-center gap-4">
            <AddButton added={saved.has(mozart.title)} onToggle={() => toggle(mozart.title)} />
            <Button variant="secondary" aria-expanded={notesOpen} onClick={() => setNotesOpen(!notesOpen)}>
              Programme notes
            </Button>
            <IconButton label="Hide programme notes" disabled={!notesOpen} onClick={() => setNotesOpen(false)}>
              <CloseIcon />
            </IconButton>
            <TextLink href="/mood-boards/classical">See the mood board</TextLink>
          </div>
          {notesOpen && (
            <p className="mt-5 font-(family-name:--font-playfair) text-(--muted) italic">
              {mozart.title} · {mozart.programme}
            </p>
          )}
        </Panel>

        <Panel title="Select & badges" note="A select is the compact way to change day on a narrow screen, and it turns the same page.">
          <div className="max-w-xs">
            <Select label="Go to day" value={day} onChange={(e) => changeDay(e.target.value as Day)}>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {DAY_NAMES[d]}
                </option>
              ))}
            </Select>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Badge tone="clash" />
            <span className="inline-flex items-center gap-2">
              <Badge tone="count" count={saved.size} />
              <span className="text-(--muted)">Saved performances</span>
            </span>
          </div>
        </Panel>
      </div>

      <Modal open={open !== null} onClose={() => setDetail(null)} labelledBy={`${ids}-detail`}>
        {open && (
          <DetailPanel
            performance={open}
            titleId={`${ids}-detail`}
            saved={saved.has(open.title)}
            clashes={warn ? clashesWith(open, savedList) : []}
            onToggle={() => toggle(open.title)}
            onClose={() => setDetail(null)}
          />
        )}
      </Modal>
    </div>
  );
}
