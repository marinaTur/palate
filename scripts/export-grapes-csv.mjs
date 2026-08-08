// One-off export script — not app code, not imported anywhere. Generates
// grapes_export.csv at the repo root for Marina to review/edit text in
// Excel. Re-run any time after editing src/data/grapes.js to get a fresh
// export; this script does not write back into grapes.js.
import { GRAPES } from '../src/data/grapes.js'
import { writeFileSync } from 'fs'

const FIELDS = [
  'id', 'names', 'grapeType', 'regionIds',
  'body', 'tannin', 'acidity', 'sweetness', 'abv', 'finish', 'colour',
  'primaryAroma', 'secondaryTertiary', 'styleRange',
  'confusedWith', 'confusedWithNote', 'globalPrevalence', 'foodPairing',
]

function csvEscape(value) {
  const str = String(value ?? '')
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

// Structure-chip fields (body/tannin/acidity/colour/abv) also carry a
// `short` display value now — included as its own column per field so it
// can be reviewed/edited alongside the full value, not just the value itself.
const SHORT_FIELDS = ['body', 'tannin', 'acidity', 'colour', 'abv']

const header = [...FIELDS, 'body_confidence', 'tannin_confidence', 'acidity_confidence',
  'sweetness_confidence', 'abv_confidence', 'finish_confidence', 'colour_confidence',
  'primaryAroma_confidence', 'secondaryTertiary_confidence', 'styleRange_confidence',
  'confusedWithNote_confidence', 'globalPrevalence_confidence', 'foodPairing_confidence',
  ...SHORT_FIELDS.map(f => f + '_short')]

const VALUE_FIELDS = ['body', 'tannin', 'acidity', 'sweetness', 'abv', 'finish', 'colour',
  'primaryAroma', 'secondaryTertiary', 'styleRange', 'confusedWithNote', 'globalPrevalence', 'foodPairing']

const rows = GRAPES.map(g => {
  const row = {
    id: g.id,
    names: g.names.join(' / '),
    grapeType: g.grapeType,
    regionIds: g.regionIds.join(', '),
    confusedWith: g.confusedWith.join(', '),
  }
  VALUE_FIELDS.forEach(f => {
    row[f] = g[f].value
    row[f + '_confidence'] = g[f].confidence
  })
  SHORT_FIELDS.forEach(f => {
    row[f + '_short'] = g[f].short || ''
  })
  return header.map(col => csvEscape(row[col])).join(',')
})

const csv = [header.join(','), ...rows].join('\n')
writeFileSync(new URL('../grapes_export.csv', import.meta.url), csv, 'utf8')
console.log(`Wrote grapes_export.csv — ${GRAPES.length} rows, ${header.length} columns.`)
