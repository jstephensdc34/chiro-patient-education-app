import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, displayFont, bodyFont } from "../theme";

export const Scene1Intro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markScale = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  const titleY = interpolate(spring({ frame: frame - 12, fps, config: { damping: 200 } }), [0, 1], [60, 0]);
  const titleOpacity = interpolate(frame, [12, 30], [0, 1], { extrapolateRight: "clamp" });
  const subOpacity = interpolate(frame, [30, 48], [0, 1], { extrapolateRight: "clamp" });
  const subY = interpolate(frame, [30, 55], [30, 0], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [20, 45], [0, 320], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          transform: `scale(${markScale})`,
          width: 110,
          height: 110,
          borderRadius: 28,
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: 52,
          boxShadow: `0 24px 60px ${COLORS.primary}55`,
          marginBottom: 40,
        }}
      >
        C+
      </div>
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: 84,
          color: COLORS.ink,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          letterSpacing: -2,
        }}
      >
        Chiro Patient Ed Suite
      </div>
      <div style={{ width: lineW, height: 6, background: COLORS.accent, borderRadius: 3, margin: "28px 0" }} />
      <div
        style={{
          fontFamily: bodyFont,
          fontWeight: 500,
          fontSize: 36,
          color: COLORS.muted,
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
        }}
      >
        Patient reports in minutes, not hours.
      </div>
    </AbsoluteFill>
  );
};
