import type { Metadata } from "next";

import { FestivalPage } from "@/app/_themes/avatar/gallery";

export const metadata: Metadata = {
  title: "The festival · The Four Nations Music Festival",
  description: "Four elements, one stage: the four nations and the six stages of the festival.",
};

export default function PlannerFestivalPage() {
  return <FestivalPage />;
}
