# AGENTS.md

Context for any agent working on this repository.

## What this is

Coursework for **Design, Build, Ship · MPCS 51238 · Autumn 2026**, Assignment 2:
*UI/UX & Visual Design*. Due **Tuesday, October 13, 2026, 5:30 PM**.

One static Next.js + Tailwind project on Vercel. The homepage (`/`) is a hub linking to
three mood boards, three design systems, and the site.

## How to work here

The brief marks one-shot agent output as incomplete, and the student must defend their
design choices in class. So:

- Build in stages. Stop after each change and let the student look and direct the next one.
- Never scaffold several pages in one pass.
- Push back on databases, backends, or packages the project does not need.
- Commit in small steps; the commit history is graded.

## The product

A **concert planner for festival attendees**: you add the artists you want to see, and it
flags when you have double-booked yourself.

- 4 days (Thu–Sun) × 6 stages × 6 slots a day (1:00, 2:30, 4:00, 5:30, 7:00, 8:30 PM;
  1.5-hour sets, no gaps) = 144 slots. 100 artists, one set each, so 44 slots stay empty.
- Every set sits on the same grid, so a conflict is an exact day+slot match.
- **Nothing is saved.** No database, accounts, external APIs, or `localStorage`. React state
  only; it resets on reload.

## Theming

**Each mood board is a world, not a palette.** The theme sets the vocabulary as well as the
look: stage names, artist names, the festival's name, and microcopy down to the warning text.

The source of truth for a theme is its mood board under `app/mood-boards/<theme>/`. Read it
for colors, type, and voice; do not restate those details in this file.

## Deliverables

- **Mood boards** `/mood-boards/<theme>` ×3: a named mood and 25–30 tiles (color, type,
  texture, interface). The three must feel genuinely different.
- **Design systems** `/design-systems/<theme>` ×3, one per mood board:
  color roles with contrast ratios shown; type roles (display, heading, body, label);
  spacing, corners, borders, shadow; components (primary/secondary button, link, text input,
  select, checkbox, radio, toggle, tabs, filter chips, card, list rows, badge, modal);
  control states (rest, hover, focus, pressed, selected, disabled); UI states (empty,
  loading, error, success).
- **The site**, in the one chosen theme: full 100-artist lineup, at least two faked
  interactions, every control in its states, accent color reserved for the primary action,
  responsive.
- **Verify** in a browser at 390px and 1440px, exercise every interaction, then
  keyboard-test.

Graded on: visual hierarchy, few type sizes and weights, a small palette where every color has a
purpose, legible contrast, alignment and grouping, obvious affordances, control states, a
style that is not the agent's default, and nothing extra.

## Conventions

- Windows. PowerShell blocks `npm.ps1`, so run `npm.cmd run dev`. If `node` is not found,
  Node lives in `C:\Program Files\nodejs`.
- Theme reference images live next to their page (e.g. `app/mood-boards/candyland/images/`)
  and are statically imported with `next/image`. Credit the source in the tile caption.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
