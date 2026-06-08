import type { Metadata } from "next";
import { StudioContent } from "@/components/studio/studio-content";

export const metadata: Metadata = {
  title: "Content Studio — daily brief & Instagram carousel",
  description:
    "Auto-draft a daily Korea/US market brief and a 5-slide Instagram carousel from live market data. Human-in-the-loop: review and post yourself. Educational, not investment advice.",
};

export default function StudioPage() {
  return <StudioContent />;
}
