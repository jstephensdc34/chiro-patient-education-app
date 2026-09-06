/**
 * Portable values for generated HTML and email clients, which cannot resolve
 * the application's CSS custom properties. These mirror the semantic HSL
 * tokens defined in index.css.
 */
export const reportColors = {
  background: "hsl(210 33% 98%)",
  foreground: "hsl(208 65% 12%)",
  card: "hsl(0 0% 100%)",
  border: "hsl(214.3 31.8% 91.4%)",
  muted: "hsl(210 40% 96.1%)",
  mutedForeground: "hsl(211 20% 38%)",
  primary: "hsl(205 100% 27.5%)",
  primaryAccent: "hsl(211 92% 44%)",
  primaryForeground: "hsl(0 0% 100%)",
  success: "hsl(160 84% 30%)",
  warning: "hsl(32 95% 35%)",
  diagnosis: { bg: "hsl(214 100% 97%)", headerBg: "hsl(221 83% 53%)", border: "hsl(213 97% 87%)" },
  extremity: { bg: "hsl(226 100% 97%)", headerBg: "hsl(239 84% 67%)", border: "hsl(228 96% 89%)" },
  treatment: { bg: "hsl(152 81% 96%)", headerBg: "hsl(160 84% 30%)", border: "hsl(152 69% 81%)" },
  carePlan: { bg: "hsl(48 96% 96%)", headerBg: "hsl(32 95% 35%)", border: "hsl(48 97% 77%)" },
  homecare: { bg: "hsl(356 100% 97%)", headerBg: "hsl(347 77% 50%)", border: "hsl(353 96% 90%)" },
  exercises: { bg: "hsl(270 100% 98%)", headerBg: "hsl(271 81% 56%)", border: "hsl(269 100% 92%)" },
} as const;