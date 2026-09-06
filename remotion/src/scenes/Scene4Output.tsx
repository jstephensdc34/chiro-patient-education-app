import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, displayFont, bodyFont } from "../theme";

const OUTPUTS = [
  { icon: "📄", title: "Full & Overview PDFs", desc: "Styled cover page, your clinic logo, one click" },
  { icon: "🔗", title: "Shareable report links", desc: "Send patients a secure link to their report" },
  { icon: "✉️", title: "Copy or draft the email", desc: "One tap into your own email client" },
  { icon: "🎨", title: "Three report styles", desc: "Dossier, Dashboard, or Classic — set your default" },
];

export const Scene4Output = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const headScale = interpolate(spring({ frame, fps, config: { damping: 200 } }), [0, 1], [0.94, 1]);

  return (
    <AbsoluteFill style={{ padding: "90px 160px", justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: 60,
          color: COLORS.ink,
          letterSpacing: -1.5,
          opacity: headOpacity,
          transform: `scale(${headScale})`,
          marginBottom: 60,
          textAlign: "center",
        }}
      >
        Deliver it your way
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, width: "100%" }}>
        {OUTPUTS.map((o, i) => {
          const s = spring({ frame: frame - 16 - i * 7, fps, config: { damping: 15, stiffness: 160 } });
          const scale = interpolate(s, [0, 1], [0.8, 1]);
          return (
            <div
              key={o.title}
              style={{
                opacity: s,
                transform: `scale(${scale})`,
                background: COLORS.card,
                borderRadius: 22,
                padding: "30px 34px",
                boxShadow: "0 14px 40px rgba(11,31,51,0.08)",
                display: "flex",
                gap: 22,
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 46 }}>{o.icon}</div>
              <div>
                <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 28, color: COLORS.ink, marginBottom: 6 }}>
                  {o.title}
                </div>
                <div style={{ fontFamily: bodyFont, fontWeight: 500, fontSize: 21, color: COLORS.muted }}>{o.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
