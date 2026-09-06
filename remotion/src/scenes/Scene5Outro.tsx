import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, displayFont, bodyFont } from "../theme";

export const Scene5Outro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame, fps, config: { damping: 200 } });
  const titleOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const tagOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });
  const tagY = interpolate(frame, [20, 45], [24, 0], { extrapolateRight: "clamp" });
  const breathe = Math.sin(frame / 25) * 4;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          transform: `scale(${interpolate(s, [0, 1], [0.96, 1])}) translateY(${breathe}px)`,
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: 76,
          color: "white",
          letterSpacing: -2,
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Built for chiropractic
        <br />
        physicians.
      </div>
      <div
        style={{
          opacity: tagOpacity,
          transform: `translateY(${tagY}px)`,
          marginTop: 36,
          fontFamily: bodyFont,
          fontWeight: 600,
          fontSize: 30,
          color: "rgba(255,255,255,0.85)",
        }}
      >
        Educate patients. Document care. Save the visit.
      </div>
    </AbsoluteFill>
  );
};
