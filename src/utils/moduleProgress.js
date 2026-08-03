// Computes { done, total } progress for a Learn module, using whichever
// store field that module actually tracks progress in. Each module's
// internal key shape differs (Walkthrough uses stepsViewed, Nose/Wheel/
// Bottle use exerciseProgress with different id patterns) — this is the
// single place that knows how to read each one, so Learn.jsx's directory
// list can show a generic "X of Y" indicator without duplicating any
// module's own step/exercise list.
//
// Returns null for modules with no partial-progress concept (e.g. Regions,
// which has no fixed step count) — callers should fall back to the
// start-here/new/done badge in that case.

const NOSE_EXERCISE_TOTAL = 16
const WHEEL_CATEGORY_IDS = ['fruit', 'floral', 'herbal', 'spice', 'earth', 'oak']
const BOTTLE_TYPE_IDS = ['sparkling', 'white', 'red', 'fortified']
const WALKTHROUGH_STEP_TOTAL = 5

export function getModuleProgress(moduleId, store) {
  switch (moduleId) {
    case 'walkthrough': {
      const viewed = store.stepsViewed?.walkthrough || []
      return { done: viewed.length, total: WALKTHROUGH_STEP_TOTAL }
    }
    case 'nose': {
      const done = Object.keys(store.exerciseProgress || {})
        .filter(id => /^ex\d+$/.test(id)).length
      return { done, total: NOSE_EXERCISE_TOTAL }
    }
    case 'wheel': {
      const done = WHEEL_CATEGORY_IDS.filter(id => store.exerciseProgress?.[`wheel-${id}`]).length
      return { done, total: WHEEL_CATEGORY_IDS.length }
    }
    case 'bottle': {
      const done = BOTTLE_TYPE_IDS.filter(id => store.exerciseProgress?.[`bottle-${id}`]).length
      return { done, total: BOTTLE_TYPE_IDS.length }
    }
    default:
      return null
  }
}
