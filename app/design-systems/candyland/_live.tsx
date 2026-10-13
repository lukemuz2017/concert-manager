"use client";

import { useState } from "react";

import { DAY_NAMES, DAYS } from "@/app/_themes/candyland/lineup";
import { Planner } from "@/app/_themes/candyland/planner";
import { AddButton, Badge, Button, CloseIcon, IconButton, Select, TextLink } from "@/app/_themes/candyland/ui";

import { Panel } from "./_parts";

// Every component, working. Nothing is saved: it resets on reload.
export function LiveComponents() {
  const [added, setAdded] = useState(false);
  const [details, setDetails] = useState(false);
  const [day, setDay] = useState<string>("Sat");

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
      <Panel
        title="Planner: performer cards, filters, popover & plan drawer"
        note="Shop the lineup like a store: scroll day by day, tap Add on a card, and your plan fills the drawer like a cart. Brain Freeze is already in, so adding Lolly & the Lickables (Thursday, 7:00) causes a Sugar Crash. The drawer opens on your first add and on any Sugar Crash; the My plan tab opens and closes it."
        className="lg:col-span-2"
      >
        <Planner contained initialPlan={["Brain Freeze"]} />
      </Panel>

      <Panel title="Buttons, icon button & link" note="Primary adds a set and stays pressed down while it's in your plan.">
        <div className="flex flex-wrap items-center gap-4 pb-[5px]">
          <AddButton added={added} onToggle={() => setAdded(!added)} />
          <IconButton label="Remove Mint Condition" disabled={!added} onClick={() => setAdded(false)}>
            <CloseIcon />
          </IconButton>
          <Button variant="secondary" aria-expanded={details} onClick={() => setDetails(!details)}>
            Details
          </Button>
          <TextLink href="/mood-boards/candyland">See the mood board</TextLink>
        </div>
        {details && <p className="mt-4 text-(--muted)">Mint Condition · Thursday · 1:00 PM · Peppermint Forest</p>}
      </Panel>

      <Panel title="Select & badges" note="The planner switches days with tabs; a select suits longer lists.">
        <div className="max-w-xs">
          <Select label="Day" value={day} onChange={(e) => setDay(e.target.value)}>
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {DAY_NAMES[d]}
              </option>
            ))}
          </Select>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="inline-flex items-center gap-2">
            <Badge tone="crash" />
            <span className="text-(--muted)">Double-booked</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <Badge tone="count" count={3} />
            <span className="text-(--muted)">Sets in the plan</span>
          </span>
        </div>
      </Panel>
    </div>
  );
}
