## Goal
Import the `library_items` CSV into the new Supabase project as shared/system items (no owner), so the FK constraint to `auth.users` no longer fails.

## Approach
Transform the CSV locally to null out the `user_id` column for every row, then import the cleaned CSV via the Supabase dashboard. No schema or app code changes required — the existing RLS policy `Allow public read access for library_items` already lets all users read owner-less items, and the `claim_and_update_library_item` RPC already handles the "first edit clones to current user" flow.

## Steps

1. **User uploads the CSV** to this chat (e.g. `library_items_rows.csv`).
2. **Transform the CSV** with a short Python script:
   - Copy upload to `/tmp/library_items_rows.csv`
   - Load with pandas
   - Set `user_id` column to empty string (NULL on import) for every row
   - Optionally also blank out `id` so Supabase generates fresh UUIDs (avoids collisions if any seed IDs already exist) — confirm with user
   - Write cleaned file to `/mnt/documents/library_items_rows_cleaned.csv`
3. **Deliver the cleaned CSV** as a `presentation-artifact` for download.
4. **User imports** the cleaned CSV in the new Supabase project via Table Editor → `library_items` → Import data from CSV.
5. **Verify**: user signs in to the new project's app and confirms the library items appear and are editable (first edit will claim ownership via the RPC).

## Open question before building
- Should I also blank out the `id` column so Supabase generates new UUIDs on import? Recommended to avoid any conflicts, but skip if you want to preserve the original IDs.

## Technical notes
- `library_items.user_id` is already nullable — no migration needed.
- RLS `Allow public read access for library_items` (USING `true`) covers anonymous-owned rows.
- `claim_and_update_library_item` RPC handles the case `_owner_id IS NULL` by updating in place and setting `user_id` to the editor — perfect for this seed pattern.
- CSV NULL representation: Supabase CSV import treats empty cells as NULL for nullable columns.
