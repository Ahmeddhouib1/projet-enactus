import { Alex_Brush, Fredoka, Lato } from "next/font/google";

/**
 * Body copy: Lato, per the Enactus ENSI graphic charter.
 */
export const bodyFont = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-body-fallback",
  display: "swap",
});

/**
 * Structural heading fallback (page/section titles, buttons, admin UI).
 * "Bon Vivant" is a commercial font not distributable via Google Fonts -
 * no amount of CSS can make text render in it without the licensed font
 * file itself. Fredoka (bold, rounded, friendly) stands in until the real
 * files are added under /public/fonts (see globals.css).
 */
export const headingFallbackFont = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading-fallback",
  display: "swap",
});

/**
 * Tagline/brand-moment script (the splash screen's "We Change The Odds",
 * hero accents) - Bon Vivant is a flowing calligraphic script in the
 * reference the client shared, not a rounded sans, so it gets its own
 * fallback distinct from headingFallbackFont: a script font is right for
 * a hero tagline but would hurt legibility used as every UI heading.
 */
export const taglineFallbackFont = Alex_Brush({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-tagline-fallback",
  display: "swap",
});
