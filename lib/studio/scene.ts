/**
 * Daily "scene" theme for the studio cards — the background + accent + decor and
 * the matching 주식이 mood change with the market. Drives both the on-screen cards
 * and the PNG export so the daily post visually reflects the news (e.g. a bright
 * "rocket" scene on a strong up day, a "storm/rain" scene on a crash).
 */

export type Scene = "rocket" | "sunny" | "flat" | "cloudy" | "storm";
export type CharMood = "up" | "down" | "flat";
export type Decor = "rocket" | "stars" | "rain" | "none";

export interface Theme {
  /** CSS gradient stops (top → bottom) for the on-screen cards. */
  css: [string, string, string];
  /** Canvas gradient stops for the PNG export. */
  canvas: [string, string, string];
  accent: string;
  decor: Decor;
  /** Which 주식이 expression to show. */
  mood: CharMood;
  /** Mood character image (public/). */
  char: string;
}

export function sceneOf(kospiPct: number): Scene {
  if (kospiPct >= 1.5) return "rocket";
  if (kospiPct >= 0.1) return "sunny";
  if (kospiPct > -0.1) return "flat";
  if (kospiPct > -1.5) return "cloudy";
  return "storm";
}

export const THEMES: Record<Scene, Theme> = {
  rocket: {
    css: ["#0d2f3a", "#122a44", "#0c1226"],
    canvas: ["#0d2f3a", "#122a44", "#0c1226"],
    accent: "#34d399",
    decor: "rocket",
    mood: "up",
    char: "/joosik-up.png",
  },
  sunny: {
    css: ["#143329", "#15291f", "#101a14"],
    canvas: ["#143329", "#15291f", "#101a14"],
    accent: "#34d399",
    decor: "stars",
    mood: "up",
    char: "/joosik-sunny.png",
  },
  flat: {
    css: ["#19241f", "#15171c", "#101216"],
    canvas: ["#19241f", "#15171c", "#101216"],
    accent: "#34d399",
    decor: "none",
    mood: "flat",
    char: "/joosik-up.png",
  },
  cloudy: {
    css: ["#1b2230", "#171b24", "#10131a"],
    canvas: ["#1b2230", "#171b24", "#10131a"],
    accent: "#60a5fa",
    decor: "rain",
    mood: "down",
    char: "/joosik-cloudy.png",
  },
  storm: {
    css: ["#231a2e", "#191726", "#0e0c16"],
    canvas: ["#231a2e", "#191726", "#0e0c16"],
    accent: "#818cf8",
    decor: "rain",
    mood: "down",
    char: "/joosik-storm.png",
  },
};
