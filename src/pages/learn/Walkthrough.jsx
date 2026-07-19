import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'

const STEPS = [
  {
    id: 'appearance',
    phase: 'See it',
    title: 'Look at the wine',
    icon: 'ti-eye',
    color: '#264D3B',
    intro: 'Tilt the glass slightly against a white background — a napkin or white wall works perfectly. Give yourself 10 seconds just to look.',
    detail: [
      { label: 'Colour depth', text: 'Is it pale and translucent, or deep and almost opaque? Colour depth can offer clues about the grape or winemaking, but never tells the whole story.' },
      { label: 'Hue at the rim', text: 'Look at the very edge where the wine thins out. In reds: bright purple-ruby = young; brick-orange = aged. In whites: near-clear = young; deep gold = aged or oaked.' },
      { label: 'Legs', text: 'Swirl briefly and watch the droplets run down the glass. Slow, thick legs suggest higher alcohol or residual sugar — but legs are more party trick than serious clue.' },
    ],
    tip: 'Younger reds are bright ruby or purple. As they age they shift toward garnet, then brick-orange at the rim. That colour shift is one of the first clues a wine has some age on it.',
  },
  {
    id: 'nose-first',
    phase: 'Smell it',
    title: 'First sniff — before swirling',
    icon: 'ti-wind',
    color: '#7A2038',
    intro: 'Before you swirl, bring your nose to the glass and take two slow, calm inhales. These delicate first aromas disappear the moment you swirl.',
    detail: [
      { label: 'Why before swirling?', text: 'The most volatile, high-pitched compounds — floral notes, delicate citrus, green herbs — evaporate fastest. Swirling accelerates their escape. A quick first sniff catches what you\'d otherwise miss entirely.' },
      { label: 'What to look for', text: 'Florals: violet, rose, jasmine. Fresh fruit: citrus zest, green apple, strawberry. Anything herbal or green. Do not worry if you cannot name it — just notice whether something is there.' },
      { label: 'How to sniff properly', text: 'Short, gentle inhales rather than one big breath. Your nose adapts quickly — multiple short sniffs pick up more than one long one. Pause between each inhale.' },
    ],
    tip: 'Many beginners skip this step entirely. Even a 5-second first sniff trains your nose to notice subtlety. It is the most overlooked part of the tasting ritual.',
  },
  {
    id: 'nose-second',
    phase: 'Smell deeper',
    title: 'Swirl, then smell again',
    icon: 'ti-refresh',
    color: '#B98A3D',
    intro: 'Swirl the glass firmly for 5–10 seconds, then push your nose deep inside and inhale slowly. This is where wine opens up.',
    detail: [
      { label: 'What swirling does', text: 'Swirling wakes the wine up, helping more aromas escape into the glass. It also lets oxygen in, which coaxes out the deeper, more complex scents — fruit, earth, oak, spice — that were sitting underneath.' },
      { label: 'The reset trick', text: 'After your first inhale, breathe out slowly through your mouth, then inhale again. This palate reset helps you smell more layers. Your nose adapts fast — short pauses between sniffs keep it fresh.' },
      { label: 'What to look for now', text: 'Fruit: dark plum, cherry, citrus, tropical. Earth: wet stone, clay, forest floor. Oak: vanilla, cedar, toast, coconut. Spice: black pepper, cinnamon, clove. Name whatever comes to you — wrong answers do not exist.' },
    ],
    tip: 'Smell the inside of your own wrist if your nose goes blind — it is neutral to your brain and acts as a reset. Avoid coffee beans; the myth that they reset your nose has no scientific basis.',
  },
  {
    id: 'palate',
    phase: 'Taste it',
    title: 'Sip and let it sit',
    icon: 'ti-droplet',
    color: '#264D3B',
    intro: 'Take a moderate sip. Do not swallow immediately. Move the wine slowly around your whole mouth for 5–10 seconds and pay attention to five things.',
    detail: [
      { label: 'Sweetness', text: 'Felt at the very tip of your tongue. Most table wines are dry — little to no sweetness. Even fruity-smelling wines are often completely dry on the palate.' },
      { label: 'Acidity', text: 'Felt on the sides of your tongue and cheeks — it makes you salivate. High acidity feels bright, crisp, sometimes sharp. Low acidity feels soft and round. Acidity is what makes wine refreshing with food.' },
      { label: 'Tannin', text: 'That grippy, drying sensation on your gums and the inside of your cheeks — like strong tea. Most noticeable in red wines, though skin-contact whites and oak ageing bring it too. High tannin = bold and structured. Low tannin = silky and approachable.' },
      { label: 'Body', text: 'The weight of the wine in your mouth. Think of the difference between skimmed milk and full-fat cream — wine has a similar range. Light-bodied feels almost watery; full-bodied coats your mouth.' },
      { label: 'Flavour', text: 'What do you actually taste? It should echo what you smelled, but often different facets emerge. Dark fruit, citrus, spice, earth, oak — name anything that comes to you.' },
    ],
    tip: 'Tannin is the most confusing sensation for beginners. It is not bitterness — it is texture, a dryness on the gums. Bordeaux and Barolo have high tannin. Pinot Noir and Beaujolais have very little.',
  },
  {
    id: 'finish',
    phase: 'The finish',
    title: 'Swallow and count',
    icon: 'ti-hourglass',
    color: '#7A2038',
    intro: 'Swallow slowly. Now count — how many seconds can you still taste the wine? That is the finish, and it is one of the most reliable markers of wine quality.',
    detail: [
      { label: 'Reading the finish', text: 'Under 5 seconds = short. 5–10 seconds = medium. 10–20 seconds = long. Over 20 seconds = very long. Great wines linger with evolving flavours — the taste changes even after you swallow.' },
      { label: 'What a good finish feels like', text: 'Not just "I can still taste wine" — the flavours keep moving. A top Bordeaux might show dark fruit first, then shift to cedar and spice, then a mineral note, all within 20–30 seconds.' },
      { label: 'Why it matters', text: 'Great wines don\'t just last longer — they keep changing after you swallow. Cheap wines disappear almost instantly. That evolution is what you\'re looking for.' },
    ],
    tip: 'Write three words immediately after swallowing — your first impressions are always your most honest. No wine journal? Your phone\'s notes app works perfectly.',
  },
]

export default function Walkthrough() {
  const navigate = useNavigate()
  const { markModuleComplete, unmarkModuleComplete, completedModules } = useAppStore()

  const [currentStep, setCurrentStep] = useState(0)
  const [expanded, setExpanded] = useState(false)

  // Derived directly from the store — never a separate local flag that could
  // fall out of sync with completedModules (same fix applied to Wheel.jsx).
  const finished = completedModules.includes('walkthrough')

  const step = STEPS[currentStep]
  const isLast = currentStep === STEPS.length - 1
  const isFirst = currentStep === 0

  function next() {
    if (isLast) {
      markModuleComplete('walkthrough')
    } else {
      setCurrentStep(s => s + 1)
      setExpanded(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function prev() {
    if (!isFirst) {
      setCurrentStep(s => s - 1)
      setExpanded(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Resets the module to exactly its first-open state — same pattern as
  // Wheel.jsx's "Start over": un-completes the module and returns to step 1.
  function startOver() {
    unmarkModuleComplete('walkthrough')
    setCurrentStep(0)
    setExpanded(false)
  }

  // ── Main walkthrough — always rendered, never swapped for a separate page ──
  return (
    <div className="max-w-2xl mx-auto pb-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[var(--forest)] to-[var(--forest-dark)] px-5 pt-10 pb-6 md:rounded-b-2xl md:mx-4 mb-6">
        <button onClick={() => navigate('/learn')} className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-4 transition-colors">
          <i className="ti ti-arrow-left" aria-hidden="true"></i> Back to lessons
        </button>
        <p className="text-xs tracking-[0.1em] text-white/45 uppercase mb-2">The 5-step ritual</p>
        <h1 className="font-['Cormorant_Garamond'] text-4xl text-white italic leading-tight">Tasting walkthrough</h1>
      </div>

      <div className="px-4">

        {/* Inline completion notice — NOT a full-page takeover. Everything
            below (progress bar, steps, nav) stays fully visible and interactive. */}
        {finished && (
          <div className="bg-[var(--gold-light)] border border-[var(--gold)]/25 rounded-xl px-4 py-4 mb-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--gold)] flex items-center justify-center flex-shrink-0">
              <i className="ti ti-check text-white text-base" aria-hidden="true"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--ink)] mb-1">Module complete.</p>
              <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-3">
                You know the full 5-step ritual. The best way to deepen it now is to open a bottle and do it for real.
              </p>
              <button
                onClick={startOver}
                className="text-xs font-medium text-[var(--gold)] border border-[var(--gold)]/40 rounded-full px-3 py-1.5 hover:bg-[var(--gold)] hover:text-white transition-colors"
              >
                Start over
              </button>
            </div>
          </div>
        )}

        {/* ── Progress bar — now a consistent card, matching every other
             block on this page in size, rounding, and inset margin. ── */}
        <div className="bg-white border border-[var(--border)] rounded-xl px-4 pt-4 pb-3 mb-4">
          {/* Coloured track — once finished, every segment shows green
              regardless of which step is currently being viewed. Only
              "Start over" (which un-completes the module) reverts this. */}
          <div className="flex gap-1 mb-3">
            {STEPS.map((_, i) => {
              const isDone = finished || i < currentStep
              return (
                <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                  style={{ background: isDone ? '#264D3B' : i === currentStep ? '#B98A3D' : '#E2DDD6' }}
                />
              )
            })}
          </div>
          {/* Step circles + labels */}
          <div className="flex">
            {STEPS.map((s, i) => {
              const isDone = finished || i < currentStep
              return (
                <button key={s.id}
                  onClick={() => { setCurrentStep(i); setExpanded(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    isDone ? 'bg-[var(--forest)]' : i === currentStep ? 'bg-[var(--gold)]' : 'bg-[var(--border)]'
                  }`}>
                    {isDone
                      ? <i className="ti ti-check text-white" style={{ fontSize: 10 }} aria-hidden="true"></i>
                      : <span className="font-['Cormorant_Garamond'] text-white leading-none" style={{ fontSize: 11 }}>
                          {['I','II','III','IV','V'][i]}
                        </span>
                    }
                  </div>
                  <span style={{ fontSize: 9, letterSpacing: '0.04em',
                    color: isDone ? '#264D3B' : i === currentStep ? '#B98A3D' : '#7A6E64' }}>
                    {s.phase}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step counter */}
        <p className="text-xs tracking-[0.09em] text-[var(--muted)] uppercase mb-4">
          Step {currentStep + 1} of {STEPS.length}
        </p>

        {/* Step card */}
        <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden mb-4">

          {/* Phase header */}
          <div className="px-5 pt-5 pb-3 border-b border-[var(--border-soft)] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: step.color + '18' }}>
              <i className={`ti ${step.icon} text-base`} style={{ color: step.color }} aria-hidden="true"></i>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: step.color }}>{step.phase}</p>
              <h2 className="font-['Cormorant_Garamond'] text-2xl text-[var(--ink)] leading-tight">{step.title}</h2>
            </div>
          </div>

          {/* Intro */}
          <div className="px-5 py-4">
            <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{step.intro}</p>
          </div>

          {/* Expandable detail */}
          <div className="border-t border-[var(--border-soft)]">
            <button onClick={() => setExpanded(e => !e)}
              className="w-full px-5 py-3 flex items-center justify-between text-sm font-medium transition-colors hover:bg-[var(--border-soft)]"
              style={{ color: step.color }}>
              <span>{expanded ? 'Less detail' : 'Tell me more'}</span>
              <i className={`ti ${expanded ? 'ti-chevron-up' : 'ti-chevron-down'} text-sm`} aria-hidden="true"></i>
            </button>
            {expanded && (
              <div className="px-5 pb-5 space-y-4 border-t border-[var(--border-soft)]">
                {step.detail.map((d, i) => (
                  <div key={i}>
                    <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">{d.label}</p>
                    <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{d.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Gold tip */}
        <div className="bg-[var(--gold-light)] border border-[var(--gold)]/20 rounded-xl px-4 py-3.5 mb-6 flex items-start gap-3">
          <span className="text-[var(--gold)] text-base mt-0.5 flex-shrink-0">✦</span>
          <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{step.tip}</p>
        </div>

        {/* Nav buttons */}
        <div className="flex gap-3">
          {!isFirst && (
            <button onClick={prev}
              className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--ink-soft)] text-sm font-medium hover:border-[var(--forest)] hover:text-[var(--forest)] transition-colors">
              ← Previous
            </button>
          )}
          <button onClick={next}
            className="flex-1 py-3 rounded-xl text-white text-sm font-medium transition-colors"
            style={{ background: step.color }}>
            {isLast ? 'Complete module ✓' : `Next: ${STEPS[currentStep + 1].phase} →`}
          </button>
        </div>

      </div>
    </div>
  )
}
