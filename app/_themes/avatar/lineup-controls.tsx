"use client";

import type { ReactNode } from "react";

import { clashesWith, LINEUP, SLOTS, type FestivalSet } from "./lineup";
import { SHAPE, TYPE } from "./tokens";
import {
  Badge,
  Button,
  Checkbox,
  CloseIcon,
  FilterChips,
  filterChips,
  FilterGroups,
  FilterIcon,
  IconButton,
  matchesFilters,
  Modal,
  noFilters,
  Radio,
  SearchIcon,
  Select,
  TextField,
  type ActiveFilter,
  type Filters,
} from "./ui";

// The lineup's search and filters, shared by the site and the design system so the two
// can't drift apart: a search field, a Filters button that opens the full dialog, a live
// count, and the active filters as removable chips.

export type Show = "all" | "journey" | "flagged";
export type LineupQuery = { query: string; filters: Filters; time: string; show: Show; hideClashes: boolean };

export const anyLineup = (): LineupQuery => ({ query: "", filters: noFilters(), time: "any", show: "all", hideClashes: false });

// One test of who matches. Everyone else fades back on the poster.
export function lineupMatcher(q: LineupQuery, saved: Set<string>, flagged: Set<string>) {
  const text = q.query.trim().toLowerCase();
  const savedList = LINEUP.filter((s) => saved.has(s.artist));
  return (s: FestivalSet) =>
    matchesFilters(s, q.filters) &&
    (text === "" || s.artist.toLowerCase().includes(text)) &&
    (q.time === "any" || s.time === q.time) &&
    (q.show === "all" || (q.show === "journey" ? saved.has(s.artist) : flagged.has(s.artist))) &&
    !(q.hideClashes && !saved.has(s.artist) && clashesWith(s, savedList).length > 0);
}

// The filters set in the dialog, as chips. The search has its own field, so it isn't one.
export function lineupChips(q: LineupQuery, onChange: (next: LineupQuery) => void): ActiveFilter[] {
  return [
    ...filterChips(q.filters, (filters) => onChange({ ...q, filters })),
    ...(q.time !== "any" ? [{ key: "time", label: `At ${q.time}`, remove: () => onChange({ ...q, time: "any" }) }] : []),
    ...(q.show !== "all"
      ? [{ key: "show", label: q.show === "journey" ? "Only my journey" : "Only flagged", remove: () => onChange({ ...q, show: "all" as const }) }]
      : []),
    ...(q.hideClashes ? [{ key: "clash", label: "No clashes", remove: () => onChange({ ...q, hideClashes: false }) }] : []),
  ];
}

export const clearedFilters = (q: LineupQuery): LineupQuery => ({ ...anyLineup(), query: q.query });

export function LineupSearchBar({
  lineup,
  onChange,
  chips,
  shownCount,
  onOpenFilters,
}: {
  lineup: LineupQuery;
  onChange: (next: LineupQuery) => void;
  chips: ActiveFilter[];
  shownCount: number;
  onOpenFilters: () => void;
}) {
  const narrowed = chips.length > 0 || lineup.query.trim() !== "";
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 grow basis-60 sm:max-w-md">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-(--ink-muted)" />
          <TextField
            label="Search artists"
            hideLabel
            type="search"
            placeholder="Search artists"
            value={lineup.query}
            onChange={(e) => onChange({ ...lineup, query: e.target.value })}
            style={{ paddingLeft: "2.75rem" }}
          />
        </div>
        <Button
          variant="secondary"
          aria-haspopup="dialog"
          aria-label={chips.length > 0 ? `Filters, ${chips.length} active` : undefined}
          onClick={onOpenFilters}
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
          <FilterChips chips={chips} onClear={() => onChange(clearedFilters(lineup))} />
        </div>
      )}
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

export function FilterDialog({
  open,
  onClose,
  lineup,
  onChange,
  activeCount,
  shownCount,
  savedCount,
  flaggedCount,
  idPrefix = "filters",
}: {
  open: boolean;
  onClose: () => void;
  lineup: LineupQuery;
  onChange: (next: LineupQuery) => void;
  activeCount: number;
  shownCount: number;
  savedCount: number;
  flaggedCount: number;
  idPrefix?: string;
}) {
  const field = (legend: string, children: ReactNode, className = "") => (
    <fieldset className={className}>
      <legend className={`${TYPE.label} text-(--ink-muted)`}>{legend}</legend>
      <div className="mt-3 space-y-2.5">{children}</div>
    </fieldset>
  );
  return (
    <Modal open={open} onClose={onClose} labelledBy={`${idPrefix}-title`} width="w-[min(46rem,calc(100%-2rem))]">
      <div className={`flex max-h-[calc(100dvh-2rem)] flex-col border-[1.5px] border-(--ink) bg-(--paper) ${SHAPE.card}`}>
        <header className="flex items-start justify-between gap-3 border-b-[1.5px] border-dashed border-(--line) px-5 pt-4 pb-3 sm:px-6">
          <div>
            <p className={`${TYPE.label} text-(--ink-muted)`}>The lineup</p>
            <h2 id={`${idPrefix}-title`} className={`mt-1 ${TYPE.heading}`}>
              Filters
            </h2>
          </div>
          <IconButton label="Close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </header>
        <div className="flex-1 space-y-7 overflow-y-auto px-5 py-5 sm:px-6">
          <FilterGroups filters={lineup.filters} onChange={(filters) => onChange({ ...lineup, filters })} />
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="max-w-56">
              <Select label="Time" value={lineup.time} onChange={(e) => onChange({ ...lineup, time: e.target.value })}>
                <option value="any">Any time</option>
                {SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </div>
            {field(
              "Show",
              <>
                <Radio name={`${idPrefix}-show`} value="all" checked={lineup.show === "all"} onChange={() => onChange({ ...lineup, show: "all" })} label="Everyone" />
                <Radio
                  name={`${idPrefix}-show`}
                  value="journey"
                  checked={lineup.show === "journey"}
                  onChange={() => onChange({ ...lineup, show: "journey" })}
                  label={<Counted name="Only my journey" count={savedCount} />}
                />
                <Radio
                  name={`${idPrefix}-show`}
                  value="flagged"
                  checked={lineup.show === "flagged"}
                  onChange={() => onChange({ ...lineup, show: "flagged" })}
                  label={<Counted name="Only flagged" count={flaggedCount} />}
                />
              </>,
            )}
            {field(
              "Clashes",
              <Checkbox
                label="Hide sets that clash with my journey"
                checked={lineup.hideClashes}
                onChange={(e) => onChange({ ...lineup, hideClashes: e.target.checked })}
              />,
            )}
          </div>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t-[1.5px] border-dashed border-(--line) px-5 py-4 sm:px-6">
          <Button variant="secondary" onClick={() => onChange(clearedFilters(lineup))} disabled={activeCount === 0}>
            Clear all
          </Button>
          <Button onClick={onClose}>
            {shownCount === LINEUP.length ? "Show all 100 artists" : `Show ${shownCount} artist${shownCount === 1 ? "" : "s"}`}
          </Button>
        </footer>
      </div>
    </Modal>
  );
}
