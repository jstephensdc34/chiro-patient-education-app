import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../theme";

export const PersistentBackground = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 60) * 20;

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(1200px 700px at ${75 + drift / 4}% 20%, ${COLORS.accent}14, transparent 60%), radial-gradient(900px 600px at 15% 85%, ${COLORS.primary}10, transparent 60%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 420,
          height: 420,
          borderRadius: "50%",
          border: `2px solid ${COLORS.accent}22`,
          transform: `translateY(${drift}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: "50%",
          border: `2px solid ${COLORS.primary}1A`,
          transform: `translateY(${-drift}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
