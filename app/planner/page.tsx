import type { Metadata } from "next";

import { LineupPage } from "@/app/_themes/avatar/site";

export const metadata: Metadata = {
  title: "The Four Nations Music Festival · Plan your four days",
  description: "One hundred artists from four nations on six stages, Thursday to Sunday.",
};

export default function PlannerPage() {
  return <LineupPage />;
}
