import type { Metadata } from "next";

import { FourNationsSite } from "@/app/_themes/avatar/site";

export const metadata: Metadata = {
  title: "The Four Nations Music Festival · Plan your four days",
  description: "Add the artists you want to see across four days and six stages, and see when you have double-booked yourself.",
};

export default function PlannerPage() {
  return <FourNationsSite />;
}
