# Match the "More Information" link style from Patient Report Generator 1.0

Today, when a library item has an info link, the report shows a small italic line of raw URL text ("For more information: https://…"). In the other project this is a proper colored button labelled "More Information" with a small external-link arrow icon, tinted to match the section color (blue for diagnosis, emerald for treatment, rose for home care, etc.).

## What changes

Replace the italic URL line with the button in all four places a report is rendered:

1. Full report on screen — item cards
2. Overview report on screen — item cards
3. Full report HTML/PDF output
4. Overview report HTML/PDF output

The button opens the link in a new tab, same as today. The small `[info]` link in each card header stays as-is.

## Technical detail

- `src/components/report/ReportItem.tsx` — swap the `<p className="text-xs ... italic">For more information: …</p>` block for an anchor styled `inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:opacity-90` plus `style.headerBg`, containing the text "More Information" and an inline 12x12 external-link SVG.
- `src/components/report/OverviewReport.tsx` — same replacement inside `OverviewCard`.
- `src/utils/pdf/reportItemRenderer.ts` — replace the `item-link` paragraph with the equivalent inline-styled anchor using `colors.headerBg` as background and white text.
- `src/utils/generateOverviewReportHtml.ts` — same replacement in `renderCard`; bump the definition paragraph's bottom margin to 12px when a link is present.
- Any now-unused `.item-link` rule in `src/utils/pdf/reportStyles.ts` gets removed if it is no longer referenced.

No data model, service, or PDF layout changes.
