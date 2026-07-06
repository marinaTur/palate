# Palate — Wine Tasting Guide

A mobile-first web app for learning to taste and understand wine.

## Stack
- **React + Vite** — fast development, clean production builds
- **React Router** — page navigation (`/`, `/learn/*`, `/planner`, `/journal`)
- **Zustand + persist** — global state saved to localStorage
- **Tailwind CSS** — utility styling with shared CSS variables
- **Anthropic SDK** — AI-powered tasting planner + first bottle guide
- **Vite PWA** — installable on mobile, offline-ready

## Tasting Planner — demo mode vs live AI

**Right now the Planner runs in demo mode** — no Anthropic API key required, no cost.
`src/data/samplePlans.js` contains 5 hand-written, realistic tasting plans (reds, whites,
sparkling, beginner-friendly, cheese pairing), each tagged with keywords. When someone
fills in the form, `matchSamplePlan()` scores their free-text input against those keywords
and returns the closest match — no network call, no API key, completely free to run.

The sample plans use the exact same JSON shape the AI would return, so the rest of
`Planner.jsx` (the results display, print button, hosting tips, etc.) needs zero changes
either way.

**To switch to live AI generation once you have a paid Anthropic API key:**

1. Set up the Netlify Function and `ANTHROPIC_API_KEY` environment variable (see the
   `netlify/functions/ask-sommelier.js` file and Netlify's environment variables settings).
2. In `src/pages/Planner.jsx`, swap the commented-out import and the commented-out
   call inside `generate()` — both are clearly marked with `// Real AI version`.
3. Rebuild and redeploy.

That's the entire migration — the form, state management, and result rendering don't change.

Demo-mode plans currently exist in English only (`samplePlans.js`). When ready to
translate, either hand-write a `samplePlans.ru.js` mirror, or skip straight to live AI
generation — which already handles Russian output automatically via the language
parameter in `services/ai.js`.

## Project structure
```
src/
  components/
    ui/         # Button, Card, Badge — reusable primitives
    Layout.jsx  # Shared nav (bottom mobile / top desktop)
    LanguageSwitcher.jsx  # EN/RU toggle
  pages/
    Home.jsx    # Dashboard + module list
    Learn.jsx   # Education section with sub-routes
    Planner.jsx # Tasting planner (demo mode — see above)
    Journal.jsx # Personal tasting notes
  data/
    samplePlans.js  # Hand-written demo plans + matcher (no API needed)
  services/
    ai.js       # Live AI calls — currently unused, ready for when billing is set up
  store/
    useAppStore.js  # Zustand store with localStorage persistence
  i18n/
    index.js        # i18next config (detects browser lang, persists choice)
    locales/en.json  # English text — master structure
    locales/ru.json  # Russian text — currently mirrors English, ready to translate
  hooks/
    useDocumentLanguage.js  # Keeps <html lang="..."> in sync
  index.css     # Design tokens + global styles
netlify/
  functions/
    ask-sommelier.js  # Serverless proxy for the live AI version (not currently used)
```

## Adding Russian translations

All app text lives in `src/i18n/locales/en.json` and `src/i18n/locales/ru.json`.
Both files have the identical key structure — `ru.json` currently contains English
placeholder text so nothing breaks before translation work begins.

To translate: open `ru.json`, replace each value with its Russian equivalent,
keeping the keys untouched. No component code needs to change — every page
reads from these files via `t('key.path')`.

The AI-generated content (Tasting Planner results) is handled separately:
`src/services/ai.js` passes the current language to Claude and asks it to
respond in that language directly, so no manual translation is needed there.

The language switcher (top-right on both mobile and desktop) lets users
toggle between EN/RU at any time; their choice is saved to localStorage
and restored on their next visit.


## Getting started
```bash
npm install
npm run dev     # localhost:5173
npm run build   # production build → dist/
```

## Deploy
Upload `dist/` to Vercel, Netlify, or any static host.
