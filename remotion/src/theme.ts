import { loadFont as loadSora } from "@remotion/google-fonts/Sora";
import { loadFont as loadManrope } from "@remotion/google-fonts/Manrope";

export const { fontFamily: displayFont } = loadSora("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

export const { fontFamily: bodyFont } = loadManrope("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const COLORS = {
  primary: "#00528C",
  accent: "#096DD9",
  emerald: "#059669",
  rose: "#E11D63",
  ink: "#0B1F33",
  bg: "#F6FAFD",
  card: "#FFFFFF",
  muted: "#5B7288",
};
