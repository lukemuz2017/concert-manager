import Link from "next/link";

// The hub: the URL that gets submitted. Deliberately plain so it doesn't
// compete with any of the three themes it links to.

type Item = { name: string; href?: string };

const SECTIONS: { title: string; items: Item[] }[] = [
  {
    title: "Mood boards",
    items: [
      { name: "Candyland Vibes", href: "/mood-boards/candyland" },
      { name: "Timeless Classical", href: "/mood-boards/classical" },
      { name: "Four Nations", href: "/mood-boards/avatar" },
    ],
  },
  {
    title: "Design systems",
    items: [
      { name: "Candyland Vibes", href: "/design-systems/candyland" },
      { name: "Timeless Classical", href: "/design-systems/classical" },
      { name: "Four Nations", href: "/design-systems/avatar" },
    ],
  },
  {
    title: "The site",
    items: [{ name: "Festival planner · Four Nations", href: "/planner" }],
  },
];

export default function Home() {
  return (
    <div className="flex-1 bg-white font-sans text-zinc-900">
      <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-8 sm:py-16">
        <p className="text-sm text-zinc-600">
          Design, Build, Ship · MPCS 51238 · Assignment 2: UI/UX &amp; Visual Design
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Festival concert planner</h1>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Pick the sets you want to see at a four-day, six-stage festival, and the
          planner tells you when you&rsquo;ve double-booked yourself. Three visual
          directions, each with a mood board and a design system. One becomes the site.
        </p>

        {SECTIONS.map((section) => (
          <section key={section.title} className="mt-10">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
              {section.title}
            </h2>
            <ul className="mt-3 divide-y divide-zinc-200 border-y border-zinc-200">
              {section.items.map((item) => (
                <li key={item.name}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex items-center justify-between py-3 font-medium hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                    >
                      {item.name}
                      <span aria-hidden="true">→</span>
                    </Link>
                  ) : (
                    <p className="flex items-center justify-between py-3 text-zinc-500">
                      {item.name}
                      <span className="text-sm">Not started</span>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}
