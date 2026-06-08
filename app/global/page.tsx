import type { Metadata } from "next";
import { GlobalContent } from "@/components/market/global-content";

export const metadata: Metadata = {
  title: "Global markets — US / Nasdaq overview",
  description:
    "US and Nasdaq market overview (NASDAQ, S&P 500, Dow, Russell 2000, USD/KRW) plus a US watchlist demo with live delayed prices. Price-only; US fundamentals are a future extension. Not investment advice.",
};

export default function GlobalPage() {
  return <GlobalContent />;
}
