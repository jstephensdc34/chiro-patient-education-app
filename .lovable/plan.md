# Fix: Definition not saved on first library item creation

## Root cause

In `src/hooks/library/useLibraryDialog.ts`, when creating a new item, the `newItemData` object passed to `createItem` is missing the `definition` field. The form captures it, and `createItem` in `itemService.ts` supports it, but it gets dropped in this hook between the form and the service call.

The edit path uses `updateItem` → `claim_and_update_library_item` RPC, which does pass `definition`, which is why editing the item afterward works.

## Change

In `src/hooks/library/useLibraryDialog.ts`, add `definition: item.definition` to the `newItemData` object inside `handleSaveItem`:

```ts
const newItemData: Omit<ReportItem, "id"> = {
  name: item.name,
  definition: item.definition,
  description: item.description,
  infoLink: item.infoLink,
  categoryId: activeCategory,
  subcategoryId: ...
};
```

No other files need to change — types, form, and service layer already support `definition`.
