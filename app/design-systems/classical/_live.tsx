"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { clashesWith, DAY_NAMES, DAYS, PERFORMANCES, SLOTS, VENUES, type Day } from "@/app/_themes/classical/programme";
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
  ItineraryRow,
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
  const [sort, setSort] = useState("time");
  const [show, setShow] = useState("all");
  const [hideClashes, setHideClashes] = useState(false);
  const [warn, setWarn] = useState(true);
  const [detail, setDetail] = useState<string | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const ids = useId();

  const toggle = (title: string) => setSaved((prev) => toggled(prev, title));
  const savedList = PERFORMANCES.filter((p) => saved.has(p.title));
  const clashing = (title: string) => warn && saved.has(title) && clashesWith(find(title), savedList).length > 0;

  const rows = PERFORMANCES.filter(
    (p) =>
      p.day === day &&
      (venues.size === 0 || venues.has(p.venue.name)) &&
      (show === "all" || saved.has(p.title)) &&
      !(hideClashes && !saved.has(p.title) && clashesWith(p, savedList).length > 0) &&
      p.title.toLowerCase().includes(query.trim().toLowerCase()),
  ).sort((a, b) => {
    if (sort === "venue") return VENUES.indexOf(a.venue) - VENUES.indexOf(b.venue);
    if (sort === "title") return a.title.localeCompare(b.title);
    return SLOTS.indexOf(a.time) - SLOTS.indexOf(b.time);
  });

  // Saved performances on this day that share a slot: the double engagement to resolve.
  const clash = warn ? savedList.filter((p) => p.day === day && clashesWith(p, savedList).length > 0) : [];
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
        title="Itinerary: tabs, venue chips, list rows & notice"
        note="Bach Cello Suites is already saved. Save Boccherini Guitar Quintets, also Saturday at 7:00, to cause a double engagement. Click a title for its programme notes."
        className="lg:col-span-2"
      >
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <div className="flex flex-col gap-6">
            <TextField
              label="Search the programme"
              type="search"
              placeholder="Try “Handel”"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Select label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="time">Time</option>
              <option value="venue">Venue</option>
              <option value="title">Title</option>
            </Select>
            <fieldset>
              <legend className={`${TYPE.label} text-(--muted)`}>Show</legend>
              <div className="mt-3 flex flex-col gap-2.5">
                <Radio name={`${ids}-show`} value="all" checked={show === "all"} onChange={() => setShow("all")} label="All performances" />
                <Radio name={`${ids}-show`} value="saved" checked={show === "saved"} onChange={() => setShow("saved")} label="Only my itinerary" />
              </div>
            </fieldset>
            <Checkbox
              label="Hide performances that clash"
              checked={hideClashes}
              onChange={(e) => setHideClashes(e.target.checked)}
            />
            <Toggle label="Warn me about double engagements" checked={warn} onChange={setWarn} />
          </div>

          <div className="min-w-0">
            <div className="mb-6 flex flex-wrap gap-2">
              {VENUES.map((v) => (
                <VenueChip
                  key={v.name}
                  venue={v}
                  selected={venues.has(v.name)}
                  onToggle={() => setVenues((prev) => toggled(prev, v.name))}
                />
              ))}
            </div>
            <Tabs label="Festival day" tabs={DAYS} selected={day} onSelect={(d) => setDay(d as Day)}>
              <div aria-live="polite">
                {clash.length > 1 && (
                  <div className="mt-6">
                    <ClashNotice sets={clash} onKeep={(p) => keep(p.title)} />
                  </div>
                )}
                {rows.length > 0 ? (
                  <ul className="mt-2">
                    {rows.map((p) => (
                      <ItineraryRow
                        key={p.title}
                        performance={p}
                        saved={saved.has(p.title)}
                        clash={clashing(p.title)}
                        onToggle={() => toggle(p.title)}
                        onDetails={() => setDetail(p.title)}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="mt-6 bg-(--linen) p-6 text-center text-(--muted)">
                    Nothing on {DAY_NAMES[day]} matches. Try another venue or day.
                  </p>
                )}
              </div>
            </Tabs>
          </div>
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

        <Panel title="Badges">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
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
