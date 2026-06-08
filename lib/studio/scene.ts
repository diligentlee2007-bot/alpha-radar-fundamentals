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
  /** Scene description for an AI image prompt (English). */
  prompt: string;
}

/** Consistent character + style description for the AI image prompt. */
export const JOOSIK_DESC =
  "the mascot 'Joosik' — a cute cartoon BULL analyst with big round glasses, a navy V-neck sweater over a white collared shirt with a small red tie, friendly expressive face";
export const STYLE_DESC =
  "flat vector cartoon illustration, bold clean black outlines, vibrant saturated colors, dramatic Korean finance YouTube-thumbnail vibe, portrait 4:5 (1080x1350), leave generous empty space in the TOP THIRD for a big bold Korean headline";

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
    prompt:
      "riding a rocket blasting off through outer space among stars and glowing green up-arrows, arms raised in triumph with a huge grin",
  },
  sunny: {
    css: ["#143329", "#15291f", "#101a14"],
    canvas: ["#143329", "#15291f", "#101a14"],
    accent: "#34d399",
    decor: "stars",
    mood: "up",
    char: "/joosik-sunny.png",
    prompt:
      "lounging on a sunny tropical beach in cool sunglasses sipping a cold drink, relaxed and confident, a soft rising green chart in the background",
  },
  flat: {
    css: ["#19241f", "#15171c", "#101216"],
    canvas: ["#19241f", "#15171c", "#101216"],
    accent: "#34d399",
    decor: "none",
    mood: "flat",
    char: "/joosik-up.png",
    prompt:
      "standing in a sleek modern trading office calmly reading a tablet, neutral confident expression, balanced lighting",
  },
  cloudy: {
    css: ["#1b2230", "#171b24", "#10131a"],
    canvas: ["#1b2230", "#171b24", "#10131a"],
    accent: "#60a5fa",
    decor: "rain",
    mood: "down",
    char: "/joosik-cloudy.png",
    prompt:
      "standing under a grey overcast sky looking anxious and wiping sweat with a handkerchief, a dim flickering market board behind",
  },
  storm: {
    css: ["#231a2e", "#191726", "#0e0c16"],
    canvas: ["#231a2e", "#191726", "#0e0c16"],
    accent: "#818cf8",
    decor: "rain",
    mood: "down",
    char: "/joosik-storm.png",
    prompt:
      "crying under a black umbrella in front of a bank at night in heavy pouring rain, gloomy neon city, big red crashing stock charts falling from the sky",
  },
};
