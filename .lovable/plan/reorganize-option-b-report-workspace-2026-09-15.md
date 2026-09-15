# Reorganize Option B report workspace

## Change
- In Option B only, move the Report Contents selector into the left column.
- Place it below Patient Information and above Additional Notes.
- Keep the Full/Overview controls, report style controls, and preview in the right column.
- Leave Options A and C unchanged.

## Technical notes
- Reuse the existing Report Items selector rather than duplicating its state or behavior.
- Preserve the existing client-side layout switcher and PDF preview refs.
- Make no Supabase, schema, data-fetching, or PDF-generation changes.

## Verification
- Check Option B at desktop and mobile widths.
- Confirm category selection, search, notes, report-style switching, and both previews remain usable.
- Confirm Options A and C retain their current arrangement.
