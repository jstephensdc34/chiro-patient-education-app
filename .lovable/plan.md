

# Add Custom Treatment Goals Text Field

## Problem
Treatment goals vary widely per patient, making it impractical to pre-create library items for every possible goal. A free-text field specifically for additional treatment goals would be much more efficient.

## Plan

### 1. Add `customTreatmentGoals` state to `useReportGeneration.ts`
- Add a new `customTreatmentGoals` string state alongside `additionalNotes`
- Expose it and its setter in the return value

### 2. Update `ReportBuilder.tsx`
- Pass `customTreatmentGoals` and its setter through as props
- Add a new text area field in the left column (below Notes or above the buttons), labeled "Additional Treatment Goals"

### 3. Create a `CustomTreatmentGoals` component
- Similar to `NotesField` -- a Card with a Textarea
- Labeled "Additional Treatment Goals" with placeholder text like "Enter any custom treatment goals..."

### 4. Update `ReportPreview.tsx`
- Accept `customTreatmentGoals` as a prop
- Render it within or after the Treatment Plan category section (if it has content)

### 5. Update PDF generation (`reportCategoryRenderer.ts` / `generateReportHtml.ts`)
- Pass `customTreatmentGoals` through the PDF generation pipeline
- Render it as a subsection under "Treatment Plan" in the PDF output

### 6. Update Email generation (`emailCategoryRenderer.ts` / `generateEmailHtml.ts`)
- Similarly include `customTreatmentGoals` in the email HTML output under Treatment Plan

### 7. Update types
- Add `customTreatmentGoals` to `PDFReportData` and `EmailReportData` interfaces in `src/types/index.ts`

### Files to modify
- `src/types/index.ts` -- add field to data interfaces
- `src/hooks/useReportGeneration.ts` -- add state
- `src/components/report/ReportBuilder.tsx` -- wire up new field
- New file: `src/components/report/CustomTreatmentGoals.tsx`
- `src/components/report/ReportPreview.tsx` -- display in preview
- `src/utils/pdf/generateReportHtml.ts` -- include in PDF
- `src/utils/pdf/reportCategoryRenderer.ts` -- render in treatment section
- `src/utils/email/generateEmailHtml.ts` -- include in email
- `src/pages/Report.tsx` -- pass through props

No database changes needed -- this is a per-report free-text field, not persisted.

