// Central AI service — every call goes through our own Netlify Function,
// never directly to Anthropic. This keeps the API key off the browser entirely.
const ENDPOINT = '/api/ask-sommelier'

const LANGUAGE_NAMES = {
  en: 'English',
  ru: 'Russian',
}

function languageInstruction(lang) {
  const name = LANGUAGE_NAMES[lang] || 'English'
  return `Respond entirely in ${name}. All text in the JSON output — every field — must be written in ${name}, including wine names' descriptive parts, tips, and instructions (keep proper nouns like specific wine/region names in their conventional form).`
}

async function callClaude(systemPrompt, userMessage, maxTokens = 1000) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system: systemPrompt, message: userMessage, maxTokens }),
  })

  if (!res.ok) {
    let detail = ''
    try { detail = (await res.json()).error || '' } catch {}
    throw new Error(detail || `Request failed: ${res.status}`)
  }

  const data = await res.json()
  return data.text
}

// ── Public API ─────────────────────────────────────────────────
// Every function takes an optional `lang` ('en' | 'ru') as its last argument.
// Defaults to 'en' so existing calls don't break.

export async function generateTastingPlan(inputs, lang = 'en') {
  const system = `You are a master sommelier creating a structured wine tasting plan.
Return ONLY valid JSON — no preamble, no markdown fences.
${languageInstruction(lang)}
Schema: {
  "title": string,
  "intro": string (1-2 sentences, plain language),
  "wines": [{
    "order": number,
    "name": string,
    "type": string,
    "region": string,
    "servingTemp": string,
    "why": string (why this order),
    "foods": [string],
    "tasting_prompts": [string] (3 beginner-friendly questions to ask while tasting)
  }],
  "hostingTips": [string],
  "foodPlan": string (overall food strategy, 2-3 sentences)
}`

  const msg = `Create a wine tasting plan for:
${inputs.wines?.length ? `Wines: ${inputs.wines}` : ''}
${inputs.foods ? `Food: ${inputs.foods}` : ''}
${inputs.season ? `Season: ${inputs.season}` : ''}
${inputs.guests ? `Guests: ${inputs.guests}` : ''}
${inputs.notes ? `Notes: ${inputs.notes}` : ''}
Audience: beginners to casual wine drinkers. Keep language accessible.`

  const raw = await callClaude(system, msg, 1500)
  return JSON.parse(raw.replace(/```json|```/g, '').trim())
}

export async function getFirstBottleGuide(wineStyle = 'light red', lang = 'en') {
  const system = `You are a friendly sommelier writing for complete beginners.
Return ONLY valid JSON — no preamble, no markdown fences.
${languageInstruction(lang)}
Schema: {
  "wine": string,
  "region": string,
  "why": string (why this is perfect for beginners, 1-2 sentences),
  "whereToBuy": string,
  "priceRange": string,
  "steps": [{
    "phase": string,
    "instruction": string (plain language, max 2 sentences),
    "tip": string (one honest, practical tip)
  }]
}`
  return JSON.parse(
    (await callClaude(system, `Recommend the perfect first ${wineStyle} bottle for a beginner to practise tasting. Give very practical, plain-language guidance.`, 1000))
    .replace(/```json|```/g, '').trim()
  )
}

export async function askSommelier(question, context = '', lang = 'en') {
  const system = `You are Palate's friendly sommelier — expert but never snobbish.
Answer in plain language, max 3 short paragraphs. No bullet lists.
${languageInstruction(lang)}
${context ? `Context: ${context}` : ''}`
  return callClaude(system, question, 500)
}
