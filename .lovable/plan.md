# UI/UX Audit and Optimization Proposal

Two parallel reviews are complete: one of the app's own screens and styling, one of current professional-software design standards. No code has been changed.

## 1. Current weaknesses

**Colors are hand-written everywhere.** Around 230 hardcoded color choices across 35 files (white, five shades of grey, a bespoke blue, plus one-off reds and ambers). The app already has a proper central color system set up but nothing uses it. Consequences: colors drift between screens, dark mode can't work, and a rebrand would mean editing every screen.

**Headings have no consistent scale.** Page titles range from large-and-bold to medium-and-semibold; section titles use five different size/weight/case combinations for the same job. The Report and Library pages have no page title at all.

**Three different tab styles on one screen.** The Report page stacks page-level tabs, report-format tabs, and category tabs — each styled differently — so a first-time user reads them as one confusing set.

**Delete buttons are risky and unlabeled.** Saved care plans can be permanently deleted in one click with no confirmation, unlike library items, which do confirm. Several icon-only buttons have no accessible name for screen readers.

**Spacing is inconsistent.** Navbar width doesn't match page width, page top/bottom padding varies with no rule, similar card grids use three different gap/breakpoint combos, and two oversized buttons sit next to normal-sized ones.

**Contrast risks.** Small grey uppercase labels and pastel badges sit near the accessibility minimum; the colored section headers were never contrast-checked.

## 2. Three direction options

**A. Modern Clinical Dossier** — A document-first look: a centered reading column (roughly 900px), warm off-white page, one deep clinical blue reserved for actions, borders instead of heavy shadows, formal section labels, aligned numerals. Feels like a signed medical record and matches the printed PDF most closely.

**B. Modular Dashboard Cards** — Persistent left sidebar, each clinical area as its own card in a 2–3 column grid with a bold small-caps header and status badge, and the report preview in a slide-out panel. Cool neutral palette, one accent, status colors only on badges. Most familiar to anyone who uses modern software; best for scanning many areas quickly.

**C. High-Density Pro Workspace** — Split screen: compact form on the left, live report preview on the right with a draggable divider, plus a sticky action bar always visible. Smaller type, tight rhythm, near-monochrome with the accent reserved for the primary action. Built for high patient volume and side-by-side checking.

## 3. Quick wins (low effort, high impact)

1. Replace hardcoded whites/greys with the central color roles app-wide (mechanical, biggest payoff).
2. Move the brand blue into the central color system so theming and dark mode become possible.
3. Add accessible names to all icon-only buttons.
4. Add a delete confirmation for saved care plans, matching the library's pattern.
5. Pick one heading scale and apply it everywhere; add missing page titles to Report and Library.
6. Use the standard "destructive" button style instead of raw reds/ambers.
7. Normalize page padding (one value for app pages, larger only for the home hero) and align navbar width with page width.
8. Rebuild the care plans panel on the standard card component for consistent padding.
9. Differentiate the three tab systems on the Report page (main tabs underlined, nested tabs smaller/pill).
10. Standardize Lucide icons: 16px inline, 18–20px in nav and buttons, always paired with a label.
11. Mark decorative icons on the home page as hidden from screen readers.
12. Use aligned (tabular) numerals for costs, dates, and any numeric values.

## Technical notes

- Token work: define brand blue and all category accents as HSL variables in `src/index.css`, expose them in `tailwind.config.ts`, and migrate components off `bg-white` / `text-gray-*` / `bg-medical-*` to `bg-card` / `text-muted-foreground` / `bg-primary`.
- Report output styling (`reportStyleVariants.ts`, PDF renderers) must stay visually locked to the on-screen preview; any variant change applies to both.
- Standards referenced: shadcn semantic token rules, Refactoring UI hierarchy/elevation guidance, WCAG 2.2 AA (4.5:1 text, 3:1 UI elements), Lucide icon guidelines, NN/g data-dense tool guidance.

## Suggested sequence

Approve a direction (A, B, or C), then: quick wins 1–8 first (safe, mechanical), then the chosen layout direction, then a contrast pass across report section colors.
