export type ReportStyle = "dossier" | "dashboard" | "workspace" | "classic";

export const DEFAULT_REPORT_STYLE: ReportStyle = "dossier";

export const REPORT_STYLE_SETTING_NAME = "default_report_style";

export const REPORT_STYLE_OPTIONS: { value: ReportStyle; label: string }[] = [
  { value: "dossier", label: "Option A: Dossier" },
  { value: "dashboard", label: "Option B: Modular Cards" },
  { value: "workspace", label: "Option C: Pro Workspace" },
];

export const DOSSIER_PRIMARY = "hsl(var(--primary))";
export const DOSSIER_ACCENT = "hsl(var(--primary-accent))";
export const DOSSIER_PRIMARY_SOFT = "hsl(var(--primary) / 0.2)";
export const DOSSIER_ACCENT_SOFT = "hsl(var(--primary-accent) / 0.2)";

export const isReportStyle = (value: string | undefined): value is ReportStyle =>
  value === "dossier" || value === "dashboard" || value === "workspace" || value === "classic";
