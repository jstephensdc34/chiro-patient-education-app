import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, displayFont, bodyFont } from "../theme";

const Icon = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <div
    style={{
      width: 64,
      height: 64,
      borderRadius: 16,
      background: `${color}14`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  </div>
);

const OUTPUTS = [
  {
    icon: <Icon color={COLORS.accent}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 13h6" /><path d="M9 17h6" /></Icon>,
    title: "Full & Overview PDFs",
    desc: "Styled cover page, your clinic logo, one click",
  },
  {
    icon: <Icon color={COLORS.emerald}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></Icon>,
    title: "Shareable report links",
    desc: "Send patients a secure link to their report",
  },
  {
    icon: <Icon color={COLORS.rose}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></Icon>,
    title: "Copy or draft the email",
    desc: "One tap into your own email client",
  },
  {
    icon: <Icon color={COLORS.primary}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Icon>,
    title: "Three report styles",
    desc: "Dossier, Dashboard, or Classic — set your default",
  },
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
              {o.icon}
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
