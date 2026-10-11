import type { ReactNode } from "react";

import { shadow } from "@/app/_themes/candyland/tokens";

// Layout for the design system page itself, not part of the theme's library.
export function Panel({
  title,
  note,
  className = "",
  children,
}: {
  title: string;
  note?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-2xl bg-(--surface) p-4 sm:p-6 ${className}`} style={{ boxShadow: shadow.card }}>
      <h3 className="font-bold">{title}</h3>
      {note && <p className="mt-1 text-(--muted)">{note}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}
