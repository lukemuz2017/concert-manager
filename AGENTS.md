# AGENTS.md

Context for any agent working on this repository.

## What this is

A graded coursework submission for **Design, Build, Ship · MPCS 51238 · Autumn 2026**,
Assignment 2: *UI/UX & Visual Design*. **Due Tuesday, October 13, 2026 at 5:30 PM.**

It is one Next.js project deployed on Vercel. The homepage is a hub linking to
everything else. Submission is two URLs (live Vercel hub + GitHub repo) turned in
via Google Classroom.

## Read this before you change anything

**This assignment is explicitly graded against one-shot agent output.** The brief states:
*"A one-shot submission, made by giving this brief to an agent once and turning in the
result, is marked incomplete."* The student must also be able to explain, in class, their
style choice, their design decisions, and **where they pushed back on the agent**.

Therefore:

- Build in stages. Stop and let the user look at the screen and direct the next change.
- Do not scaffold all nine pages in one pass because it is faster.
- Record design decisions and their rationale as they are made, so they can be defended.
- If asked for a database, a backend, or a package the project does not need, push back.
  The brief instructs the student to do exactly this.

## The product

A **concert planner for festival attendees**. Not a lineup display — it has a job:
you add artists you want to see, and it flags when you have double-booked yourself.

### Schedule model

| | |
|---|---|
| Days | Thursday – Sunday (4) |
| Stages | 6 |
| Set length | 1.5 hours, no gaps |
| Slots per day | 6 — 1:00, 2:30, 4:00, 5:30, 7:00, 8:30 PM (last set ends 10:00 PM) |
| Total slots | 4 × 6 × 6 = 144 |
| Artists | 100, one set each |
| Empty slots | 44 — stages are deliberately not always in use |

Because every set sits on the same fixed grid, a hard conflict is an exact
day+slot collision. No partial-overlap math is required.

### Constraints

No database, no accounts, no external APIs, no data storage. Interactions are faked in
the browser and **nothing is saved** — React state only, resets on reload. Do not reach
for `localStorage`; the brief says nothing is saved.

## Theming: the central idea

**Each mood board is a world, not a palette.** The theme drives vocabulary all the way
down — stage names, artist names, the festival's own name, and the microcopy including
warning text. A Pokémon theme would name stages after Gym Leaders; a Candyland theme
names them after board locations.

Content depth required per theme:

| Deliverable | Content needed |
|---|---|
| Mood board ×3 | Visual artifacts only (25–30 tiles); a few names as type specimens |
| Design system ×3 | ~6–10 themed sample items — card, list rows, badge, modal need real in-voice content |
| The site ×1 | Full build: 100 artists, 6 stages, 4 days, in the **one** chosen theme |

Only the chosen theme needs the full 100-artist lineup.

## Deliverables

### 1. Hub — `/`

Links to the three mood boards, the three design systems, and the site. This is the URL
that gets submitted.

### 2. Mood boards — `/mood-boards/<theme>` ×3

Each has a name for the mood and **25–30 artifacts**: color, type, texture, and interface
pieces. No image generator is available in this environment, so artifacts are built as
CSS/SVG tiles unless the user supplies real images. The three must feel genuinely different.

### 3. Design systems — `/design-systems/<theme>` ×3

One per mood board. Each is a UI library in that style:

1. **Color roles** — background, surface, text, muted, border, accent, **with contrast ratios shown**
2. **Type roles** — display, heading, body, label, with sizes and weights, set in real content
3. **Spacing and shape** — spacing scale, corners, borders, shadow
4. **Components** — primary/secondary button, link, text input, select, checkbox, radio,
   toggle, tabs, filter chips, card, list rows, badge, modal/detail panel
5. **Control states** — rest, hover, focus, pressed, selected, disabled
6. **UI states** — empty, loading, error, success

### 4. The site — own route, chosen theme

Needs thoughtful visual hierarchy, **at least two faked interactions**, every control in
its states, the **accent color reserved for the primary action**, and responsive layout.

### 5. Verify — browser pass

Open at **390px (mobile)** and **1440px (desktop)**, exercise every interaction, screenshot,
report what is broken. Then keyboard-test everything.

Chrome tooling is **not connected in the current session**. It requires relaunching with
`claude --continue --chrome` and the Claude in Chrome extension installed. Playwright MCP
is the documented alternative.

## Design requirements (graded)

- **Visual hierarchy** — clear what to look at first
- **Type** — few sizes and weights, used consistently, comfortable to read
- **Color** — small palette, every color has a purpose
- **Accessibility** — text contrast is legible
- **Layout** — intentional alignment, related elements grouped, works desktop and mobile
- **Affordances** — interactions are obvious
- **States** — controls respond to hover, focus, press
- **Visual style** — looks like the chosen style, **not the agent's default**
- **Simplicity** — nothing extra

## Tech stack

Next.js + Tailwind CSS, static. Own GitHub repo with **commit history showing progress**
(a single giant commit undercuts the grade). Vercel free Hobby plan.

## Decisions so far

### Settled

- **Product**: festival concert planner, model above.
- **Theme 1 — Candyland.** Vibrant candy colors; references are Hasbro's Candyland board
  redesign and Sugar Rush from *Wreck-It Ralph*.
  - Stages map to board locations: Peppermint Forest, Gumdrop Mountains, Lollipop Woods,
    Molasses Swamp, Ice Cream Sea, Licorice Castle — each carrying its own color.
  - **Design rationale**: a 6-stage grid needs six instantly distinguishable colors for
    wayfinding. This theme supplies them pre-named. That is the argument for it.
  - **Known tension**: saturated candy colors cannot carry text without failing contrast.
    Resolution is structural — bright colors do *identity* (stage dots, chips, card edges),
    text stays dark-on-cream.

### Open

- Themes 2 and 3 — not yet proposed. Must feel genuinely different from Candyland and
  from each other; something far from "bright and sweet" is wanted.
- Which theme carries through to the actual site.
- Conflict model — whether to flag only hard conflicts (same day+slot) or also
  "tight transitions" (back-to-back sets on far-apart stages) as a softer second warning.
  Two severity levels would give the design system a real reason for two warning states.
- Festival name.
- Repo not yet initialized; nothing scaffolded. The directory was empty at project start.

## Conventions

- Windows environment. Primary shell is PowerShell; a Bash tool is also available.
- Project root: `C:\Users\muzik\projects\concert-manager`

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
