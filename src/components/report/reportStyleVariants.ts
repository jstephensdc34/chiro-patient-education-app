export type ReportStyle = "dossier" | "dashboard" | "classic";

export const DEFAULT_REPORT_STYLE: ReportStyle = "dossier";

export const REPORT_STYLE_SETTING_NAME = "default_report_style";

export const REPORT_STYLE_OPTIONS: { value: ReportStyle; label: string }[] = [
  { value: "dossier", label: "Modern Clinical Dossier" },
  { value: "dashboard", label: "Modular Dashboard" },
  { value: "classic", label: "Classic Clinical" },
];

export const DOSSIER_PRIMARY = "#00528c";
export const DOSSIER_ACCENT = "#096dd9";

export const isReportStyle = (value: string | undefined): value is ReportStyle =>
  value === "dossier" || value === "dashboard" || value === "classic";
