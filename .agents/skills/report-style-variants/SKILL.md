---
name: report-style-variants
description: Use when adding, changing, or removing visual layout styles (e.g. "dossier", "dashboard", "classic") for the report preview in this chiropractic report app. Triggers on "report style", "layout variant", "new report theme", "change preview style", "default report style".
---

# Report Style Variants

## When to use
- Adding a new visual layout option to the Report Builder's style toggle
- Modifying an existing style's colors, spacing, or card architecture
- Changing which style is the default

## Architecture
Styles are a **frontend-only variant system** — no Supabase schema changes are allowed. Persistence uses the existing flexible `report_settings` table (name/value rows).

Key pieces:
- `src/components/report/reportStyleVariants.ts` — `ReportStyle` union type, `DEFAULT_REPORT_STYLE`, `REPORT_STYLE_OPTIONS` (toggle labels), `REPORT_STYLE_SETTING_NAME` (`default_report_style`), color constants (`DOSSIER_PRIMARY` `#00528c`, `DOSSIER_ACCENT` `#096dd9`), and `isReportStyle` type guard.
- `src/components/report/ReportStyleToggle.tsx` — style buttons + "Set as Default Style" button. Saves via existing `createSetting`/`updateSetting` service functions against `report_settings`.
- Variant-aware renderers: `ReportItem.tsx`, `ReportCategory.tsx`, `ReportSubcategory.tsx`, `OverviewReport.tsx` — each accepts a `reportStyle`/`variant` prop and switches layout classes.
- `ReportBuilder.tsx` — owns `reportStyle` state, initializes it from settings on load, places the toggle **between the Full/Overview tabs list and the preview panes** (user-requested position — do not move it back to the top).

## Workflow to add a new style
1. Extend the `ReportStyle` union in `reportStyleVariants.ts` and add its entry to `REPORT_STYLE_OPTIONS`. Extend `isReportStyle` accordingly.
2. Add color constants for the style in the same file if it introduces new brand colors.
3. Update each variant-aware renderer with the new style's branch:
   - `ReportItem.tsx` — item card appearance per style.
   - `ReportCategory.tsx` / `ReportSubcategory.tsx` — section container classes (e.g. dossier = vertical whitespace flow, dashboard = two-column card grid).
   - `OverviewReport.tsx` — **do not skip**: both `OverviewCard` and `SectionHeader` need style branches, and the outer grid switches between single-column (dossier) and two-column (dashboard/classic). The original bug was the overview preview ignoring the selected style.
4. Confirm `ReportBuilder.tsx` still initializes from `REPORT_STYLE_SETTING_NAME` and falls back to `DEFAULT_REPORT_STYLE` when no setting exists.
5. Style classes must live on the exact preview container refs (`reportPreviewRef`, `overviewReportRef`) passed to `onGeneratePDF`, because html2pdf captures that DOM directly — the PDF must match the on-screen layout.

## Conventions
- Colors come from constants in `reportStyleVariants.ts`, not ad-hoc hex values in components.
- Category accent colors remain: Diagnosis blue, Treatment emerald, Home Care rose — variant styles restyle layout/typography, not these accents.
- Use Lucide icons inline with headers; match icon color to header text color.

## Validation
- Toggle through all styles in the preview and confirm **both** Full Report and Overview Report tabs change appearance.
- Click "Set as Default Style", reload, and confirm the saved style loads on init.
- Generate a PDF and confirm the output matches the selected on-screen style.
