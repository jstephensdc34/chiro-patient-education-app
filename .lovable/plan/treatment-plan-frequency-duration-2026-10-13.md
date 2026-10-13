# Treatment Plan Frequency & Duration

Add provider-entered treatment frequency and duration to the Treatment Plan section, and render it prominently in both the full and overview reports. Frontend only — no Supabase schema or data-fetching changes.

## Current behavior

- Treatment Plan has four sub-tabs: Care Plan Type, Phase of Care, Treatment Modalities, Treatment Goals.
- Existing free-text fields (Additional Treatment Goals, Estimated Cost) each appear under one specific sub-tab, flow as ephemeral state through `useReportGeneration.ts` into the previews, and are rendered as panels in the report's Treatment Plan category.

## What to build

### 1. State (src/hooks/useReportGeneration.ts)

Add one state object following the existing pattern:

- `treatmentVisitsPerPeriod` (text, e.g. "3")
- `treatmentPeriodUnit` ("week" or "month")
- `treatmentDuration` (text, e.g. "6")
- `treatmentDurationUnit` ("weeks" or "months")

Expose the values and setters from the hook alongside `customTreatmentGoals` / `estimatedCost`.

### 2. Entry form (new component + ReportItemsSelector.tsx)

Create `src/components/report/TreatmentScheduleForm.tsx`:

- Row 1: numeric input for visits per period + a small dropdown (Week / Month).
- Row 2: numeric input for duration + a small dropdown (Weeks / Months).
- Semantic tokens only (no hardcoded colors); helper text like "e.g. 3 visits per week for 6 weeks".

Render it in `ReportItemsSelector.tsx` inside the Treatment Plan tab **only when `activeSubcategory === "care_plan_type"`** (per your choice), passing the values and setters through `ReportBuilder.tsx`.

### 3. Full report (ReportPreview.tsx → ReportCategory.tsx)

- Thread the four values through `ReportPreview` and `ReportCategory` (same pattern as `estimatedCost`).
- In `ReportCategory`, render a new "Treatment Frequency & Duration" panel in the Treatment Plan category, styled like the Estimated Cost panel so it stays prominent across all three report styles (Dossier, Dashboard, Classic, plus the workspace variant). Display text composes the parts, e.g. "3 visits per week for 6 weeks", handling partial entries gracefully.
- Include the panel in the Treatment Plan category visibility condition so the category shows even when only the schedule is filled.

### 4. Overview report (OverviewReport.tsx + generateOverviewReportHtml.ts)

- Add the values to `OverviewReport` props and render a card in the Care Plan grid (matching the existing Estimated Cost card pattern for each report style).
- Add the values to `generateOverviewReportHtml` params and render a matching HTML card for share/legacy parity.

### 5. Shared reports and email (renderReportToHtml.tsx, shareReport.ts, ShareReportActions.tsx)

- Extend `RenderReportParams` / `ShareReportParams` with the new fields and pass them through `ShareReportActions`'s `baseParams`, so shared full/overview reports show the schedule.

### 6. Explicitly NOT changed

- No Supabase schema, tables, or queries touched.
- The schedule is session state only — it is not saved into care plans (care plan payloads keep their current fields).

## Verification

- Build passes (build-errors.log clean).
- Playwright check on /report: fill Patient ID, open Care Plan Type tab, enter 3 / week / 6 / weeks, confirm the preview's Treatment Plan section shows "3 visits per week for 6 weeks" in both Full and Overview previews, and in the shared-report HTML.
