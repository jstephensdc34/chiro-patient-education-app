import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, displayFont, bodyFont } from "../theme";

const CATEGORIES = [
  { name: "Diagnosis", color: COLORS.accent, desc: "Cervical, thoracic, lumbopelvic & extremity" },
  { name: "Treatment Plan", color: COLORS.emerald, desc: "Care plans, phases of care, modalities, goals" },
  { name: "Home Care", color: COLORS.rose, desc: "Therapies, ADLs, activity modification" },
  { name: "Therapeutic Exercises", color: COLORS.primary, desc: "Region-specific exercise libraries" },
];

export const Scene2Library = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const headX = interpolate(frame, [0, 25], [-50, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ padding: "90px 140px", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: bodyFont,
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: 6,
          color: COLORS.accent,
          textTransform: "uppercase",
          opacity: headOpacity,
          transform: `translateX(${headX}px)`,
          marginBottom: 14,
        }}
      >
        Your clinical library
      </div>
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: 62,
          color: COLORS.ink,
          opacity: headOpacity,
          transform: `translateX(${headX}px)`,
          letterSpacing: -1.5,
          marginBottom: 56,
        }}
      >
        Four categories. Fully customizable.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        {CATEGORIES.map((cat, i) => {
          const s = spring({ frame: frame - 18 - i * 8, fps, config: { damping: 16, stiffness: 140 } });
          const y = interpolate(s, [0, 1], [70, 0]);
          return (
            <div
              key={cat.name}
              style={{
                opacity: s,
                transform: `translateY(${y}px)`,
                background: COLORS.card,
                borderRadius: 24,
                padding: "32px 36px",
                borderLeft: `10px solid ${cat.color}`,
                boxShadow: "0 14px 40px rgba(11,31,51,0.08)",
              }}
            >
              <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 34, color: COLORS.ink, marginBottom: 8 }}>
                {cat.name}
              </div>
              <div style={{ fontFamily: bodyFont, fontWeight: 500, fontSize: 22, color: COLORS.muted }}>{cat.desc}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
