import type { ReactNode } from "react";

import { FourNationsSite } from "@/app/_themes/avatar/site";

// The shell (header, journey drawer, and the planner's state) stays mounted while you move
// between the lineup and the gallery, so a journey survives the trip.
export default function PlannerLayout({ children }: { children: ReactNode }) {
  return <FourNationsSite>{children}</FourNationsSite>;
}
