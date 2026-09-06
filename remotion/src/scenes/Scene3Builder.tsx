import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, displayFont, bodyFont } from "../theme";

const ITEMS = [
  { label: "Cervical strain / sprain", group: "Diagnosis", color: COLORS.accent },
  { label: "Phase of care: Corrective", group: "Treatment", color: COLORS.emerald },
  { label: "Custom treatment goals", group: "Treatment", color: COLORS.emerald },
  { label: "Ice therapy at home", group: "Home Care", color: COLORS.rose },
  { label: "Cervical retraction exercise", group: "Exercises", color: COLORS.primary },
];

export const Scene3Builder = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardS = spring({ frame, fps, config: { damping: 200 } });
  const cardY = interpolate(cardS, [0, 1], [80, 0]);
  const headOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: 58,
          color: COLORS.ink,
          letterSpacing: -1.5,
          opacity: headOpacity,
          marginBottom: 48,
        }}
      >
        Build the report as you go
      </div>
      <div
        style={{
          opacity: cardS,
          transform: `translateY(${cardY}px)`,
          width: 980,
          background: COLORS.card,
          borderRadius: 28,
          padding: "44px 52px",
          boxShadow: "0 30px 80px rgba(11,31,51,0.12)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 30 }}>
          <div>
            <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 20, color: COLORS.muted }}>Patient ID</div>
            <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 30, color: COLORS.ink }}>PT-0417</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 20, color: COLORS.muted }}>Report date</div>
            <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 30, color: COLORS.ink }}>Sep 6, 2026</div>
          </div>
        </div>
        {ITEMS.map((item, i) => {
          const checkS = spring({ frame: frame - 20 - i * 10, fps, config: { damping: 14, stiffness: 200 } });
          return (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "16px 0",
                borderTop: i === 0 ? "none" : "1px solid #E6EEF5",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: item.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 22,
                  fontWeight: 800,
                  transform: `scale(${checkS})`,
                }}
              >
                ✓
              </div>
              <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 26, color: COLORS.ink, flex: 1 }}>
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: bodyFont,
                  fontWeight: 700,
                  fontSize: 17,
                  color: item.color,
                  background: `${item.color}14`,
                  padding: "6px 14px",
                  borderRadius: 999,
                }}
              >
                {item.group}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
