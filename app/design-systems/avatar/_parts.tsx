import type { ReactNode } from "react";

import { SHAPE, TYPE } from "@/app/_themes/avatar/tokens";

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
    <div className={`border-[1.5px] border-(--ink) bg-(--paper) p-5 sm:p-7 ${SHAPE.card} ${className}`}>
      <h3 className={TYPE.label}>{title}</h3>
      {note && <p className="mt-2 text-(--ink-muted)">{note}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}
