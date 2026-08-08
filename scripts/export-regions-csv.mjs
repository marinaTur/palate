import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Import regions data
const regionsModule = await import('../src/data/regions.js', { assert: { type: 'json' } })
const { REGIONS } = regionsModule

// Define CSV headers
const headers = [
  'id',
  'name',
  'country',
  'world',
  'tier',
  'grapes',
  'style',
  'story',
  'onLabel',
  'compareTo',
  'compareNote'
]

// Convert regions to CSV rows
const rows = REGIONS.map(region => [
  region.id,
  region.name,
  region.country,
  region.world,
  region.tier,
  region.grapes,
  region.style,
  region.story,
  (region.onLabel || []).join('; '),
  region.compareTo || '',
  region.compareNote || ''
].map(cell => {
  // Escape quotes and wrap in quotes if contains comma or newline
  const str = String(cell || '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}))

// Create CSV content
const csv = [
  headers.join(','),
  ...rows.map(row => row.join(','))
].join('\n')

// Write to file
const outputPath = path.join(__dirname, '..', 'regions_export.csv')
fs.writeFileSync(outputPath, csv, 'utf-8')

console.log(`✓ Regions exported to ${outputPath}`)
console.log(`  ${REGIONS.length} regions, ${headers.length} columns`)
