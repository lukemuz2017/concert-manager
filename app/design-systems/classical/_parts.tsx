import type { ReactNode } from "react";

import { shadow, TYPE } from "@/app/_themes/classical/tokens";

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
    <div className={`rounded-[2px] bg-(--paper) p-5 sm:p-8 ${className}`} style={{ boxShadow: shadow.card }}>
      <h3 className={TYPE.label}>{title}</h3>
      {note && <p className="mt-2 text-(--muted)">{note}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}
