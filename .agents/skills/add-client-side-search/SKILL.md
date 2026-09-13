---
name: add-client-side-search
description: Use when the user asks to add a sticky, context-aware client-side search bar to a React/Tailwind/shadcn component that filters items within the active tab or category. Triggers on "search", "search bar", "filter items", "client-side search", "search within tab", "eliminate scrolling".
---

# Add a sticky, context-aware client-side search bar

## When to use
- The user wants to reduce scrolling by adding search to a list of selectable items.
- The list is already rendered client-side and the user wants to filter it without backend changes.
- The component uses tabs, categories, or subcategories and the search must be scoped to the active group.

## Workflow

1. **Identify the target component.**
   - Find the component that renders the tabs/category selector and the item list (e.g., `ReportItemsSelector.tsx`).
   - Confirm the item type has fields worth searching (e.g., `name`, `description`, `definition`).

2. **Add local React state for the query.**
   - Use `useState("")` for the search query.
   - Keep it local to the component; do not lift it to a parent or the URL unless the user asks.

3. **Clear the query on context change.**
   - In the tab/category change handler, reset the search query to `""` so the user sees the full list in the new group.

4. **Create a search filter function.**
   - Filter the already-tab-scoped items by matching the query against relevant fields.
   - Use `toLowerCase()` and `trim()` for case-insensitive matching.
   - Return the original array when the query is empty.

5. **Add the sticky search input below the tabs/category selector and above the item list.**
   - Use `Input` from `@/components/ui/input` and `Search` from `lucide-react`.
   - Wrap the input in a `sticky top-0 z-10` container with a solid background (`bg-card`) and a border so it remains visible while scrolling.
   - Position the icon with absolute positioning inside a relative wrapper: `absolute left-3 top-1/2 -translate-y-1/2`.
   - Add `pl-9` to the input and `aria-hidden="true"` on the decorative icon.
   - Use a context-aware placeholder such as `Search ${categoryName.toLowerCase()}...`.

6. **Wire the filtered list to the existing item renderer.**
   - Pass the searched subset to the existing list component instead of the raw tab-scoped items.
   - Keep selection state unchanged; selected items outside the filtered view remain selected.

7. **Verify no backend changes are needed.**
   - Confirm the search operates on already-fetched data.
   - Do not create new Supabase tables, columns, or RPC functions unless explicitly requested.

## Conventions
- Use semantic Tailwind tokens (`bg-card`, `border-border`, `text-muted-foreground`) instead of hardcoded colors.
- Add an `aria-label` to the search input describing what it searches.
- Keep the existing item list component untouched; only change the data passed into it.

## Validation
- Build passes (`bun run build`).
- Switching tabs clears the search input.
- Typing a query filters only the active tab's items.
- Selected items are preserved when the query changes.
