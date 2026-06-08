import type { MetadataRoute } from "next";
import { allFundamentals } from "@/lib/data/fundamentals";

const SITE_URL = "https://alpha-radar.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/fundamentals`, changeFrequency: "daily", priority: 0.8 },
  ];
  const companyRoutes: MetadataRoute.Sitemap = allFundamentals().map((f) => ({
    url: `${SITE_URL}/fundamentals/${f.code}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));
  return [...staticRoutes, ...companyRoutes];
}
