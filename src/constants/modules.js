// Single source of truth for Learn module ids, badges, and coming-soon state.
// Route paths, i18n keys (`modules.<id>.*`), and store keys all derive from `id`
// at the call site — this file doesn't duplicate those, it's just the id list.
// Quiz is deliberately excluded — it's not a lesson, see CLAUDE.md.
export const LEARN_MODULES = [
  { id: 'walkthrough', badge: 'startHere' },
  { id: 'nose' },
  { id: 'wheel' },
  { id: 'bottle', badge: 'new', comingSoon: true },
  { id: 'regions' },
]
