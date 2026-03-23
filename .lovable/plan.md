

# Shareable Patient Report via HTML Page

## Overview
Create a feature that saves the report as an HTML page to Supabase Storage, generating a shareable public link you can send to patients.

## How It Works
1. When you click "Share Report Link", the app generates a self-contained HTML page (similar to what's already used for PDF generation) and uploads it to a Supabase Storage bucket
2. A unique URL is generated and displayed — you can copy it and share with the patient
3. The link opens a clean, styled HTML page viewable on any device

## Plan

### 1. Create Supabase Storage bucket
- Migration to create a `shared-reports` public bucket
- Set up a permissive insert policy for authenticated users and public read access

### 2. Create a share report utility (`src/utils/shareReport.ts`)
- Reuse `generateReportHtml()` to produce the HTML content
- Also create a version based on the Overview Report layout for the card-based style
- Upload the HTML file to `shared-reports` bucket with a unique filename (e.g., `report-{uuid}.html`)
- Return the public URL

### 3. Add share functionality to `useReportGeneration.ts`
- Add `handleShareReport` function with loading state
- Calls the share utility, returns the URL

### 4. Add UI in `ReportBuilder.tsx`
- Add a "Share Report Link" button alongside the existing PDF and Email buttons
- On click, generates and uploads the report, then shows a dialog with the copyable link
- Include a copy-to-clipboard button

### 5. Create `ShareReportDialog.tsx`
- Simple dialog showing the generated link
- Copy button with toast confirmation
- Loading state while generating/uploading

### Files to create/modify
- New migration: create `shared-reports` storage bucket + policies
- New: `src/utils/shareReport.ts`
- New: `src/components/report/ShareReportDialog.tsx`
- Edit: `src/hooks/useReportGeneration.ts` — add share handler
- Edit: `src/components/report/ReportBuilder.tsx` — add share button
- Edit: `src/integrations/supabase/types.ts` — if needed

