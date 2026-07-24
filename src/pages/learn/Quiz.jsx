import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'

// ── Question bank — 16 questions drawn from Walkthrough, Nose Training,
// and Wheel. 5 are picked at random each play, so the quiz stays
// replayable rather than becoming memorisable. ─────────────────────

const QUESTION_BANK = [
  {
    source: 'walkthrough',
    q: 'What does "tannin" actually refer to?',
    options: [
      'A sweet, fruity taste on the tip of your tongue',
      'A grippy, drying sensation on your gums and cheeks',
      'The fizzy tingle from carbonation',
      'The warmth from alcohol',
    ],
    correct: 1,
    explain: 'Tannins come from grape skins and oak. They create a drying, gripping sensation — most noticeable in full-bodied reds.',
  },
  {
    source: 'walkthrough',
    q: 'What does a "long finish" indicate?',
    options: [
      'The wine took a long time to ferment',
      'The wine is very sweet',
      'Flavours persist for many seconds after swallowing',
      'The wine has high alcohol content',
    ],
    correct: 2,
    explain: 'A long finish (10+ seconds) is one of the clearest markers of quality — the wine keeps evolving after you swallow.',
  },
  {
    source: 'walkthrough',
    q: 'Why do sommeliers swirl before smelling?',
    options: [
      'To cool the wine down',
      'To check for sediment',
      'To aerate the wine and release more aroma',
      "It's just tradition",
    ],
    correct: 2,
    explain: "Swirling increases surface area, letting oxygen release the wine's aromatic compounds — the ones your nose actually picks up.",
  },
  {
    source: 'walkthrough',
    q: 'What colour shift signals an ageing red wine?',
    options: [
      'Pale yellow to deep gold',
      'Bright purple-ruby to brick-orange at the rim',
      'Clear to cloudy',
      'Light pink to deep red',
    ],
    correct: 1,
    explain: 'As reds age, pigments oxidise and shift toward garnet, then brick-orange — especially at the rim.',
  },
  {
    source: 'walkthrough',
    q: 'Why smell a wine BEFORE swirling it?',
    options: [
      "It doesn't matter, swirling first works too",
      'The most delicate, volatile aromas escape fastest and disappear once you swirl',
      'Swirling makes the wine smell weaker overall',
      "It's only necessary for white wines",
    ],
    correct: 1,
    explain: "Florals and high-pitched fruit notes escape first — a quick first sniff catches what you'd otherwise miss entirely.",
  },
  {
    source: 'walkthrough',
    q: 'Where do you feel sweetness on your tongue?',
    options: [
      'The very tip of your tongue',
      'The back of your throat',
      'The sides of your cheeks',
      "Nowhere — sweetness is only smelled, not tasted",
    ],
    correct: 0,
    explain: 'Sweetness registers right at the tip. Acidity, by contrast, is felt more on the sides.',
  },
  {
    source: 'nose',
    q: 'Do coffee beans reset your nose between wines?',
    options: [
      "Yes, it's the standard professional technique",
      "No — it's a myth. Coffee is strong enough to overwhelm your nose instead",
      'Only dark roast coffee works',
      'Yes, but only during blind tastings',
    ],
    correct: 1,
    explain: "This widespread belief has no scientific backing — coffee's own strong smell can add to fatigue rather than clear it.",
  },
  {
    source: 'nose',
    q: "What's a better palate reset than coffee?",
    options: [
      'Sparkling water',
      'The inside of your own wrist',
      'A slice of lemon',
      'Holding your breath for 10 seconds',
    ],
    correct: 1,
    explain: 'Your skin scent is neutral to your brain, making it an effective reset without introducing a new competing smell.',
  },
  {
    source: 'nose',
    q: 'Rotundone links black pepper to which grape?',
    options: ['Chardonnay', 'Pinot Noir', 'Syrah / Shiraz', 'Sauvignon Blanc'],
    correct: 2,
    explain: "Rotundone is a specific aroma compound found in both black pepper and Syrah's skins — real chemistry, not just a poetic description.",
  },
  {
    source: 'nose',
    q: 'Why is comparing two aromas easier than naming one?',
    options: [
      "It isn't — naming is always easier",
      'Comparison activates relative aroma memory, which is more reliable than absolute recall',
      'Comparison only works for fruit',
      "It's a trick with no real basis",
    ],
    correct: 1,
    explain: "This is the core technique behind WSET's Systematic Approach to Tasting.",
  },
  {
    source: 'nose',
    q: 'In the Hummel smell-training protocol, how long do you smell each scent?',
    options: [
      'About 20 seconds, using short gentle sniffs',
      'A single quick sniff',
      'Two full minutes',
      'Until you can name it',
    ],
    correct: 0,
    explain: 'Short, repeated gentle sniffs work better than one long inhale — your nose adapts quickly.',
  },
  {
    source: 'wheel',
    q: 'Vanilla and toast belong to which aroma category?',
    options: ['Primary', 'Secondary — from the oak barrel, not the grape', 'Tertiary', "They aren't real wine aromas"],
    correct: 1,
    explain: "Oak-derived aromas are a winemaking decision, entirely separate from what the grape itself contributes.",
  },
  {
    source: 'wheel',
    q: 'Which aroma category is mostly found in aged wines?',
    options: ['Primary', 'Secondary', 'Tertiary — earth, leather, dried fruit, mushroom', "None — age doesn't change aroma"],
    correct: 2,
    explain: 'Tertiary aromas develop over years in the bottle or barrel.',
  },
  {
    source: 'wheel',
    q: 'Fruit and floral aromas come from which source?',
    options: ['Primary — the grape itself', 'Secondary', 'Tertiary', 'They are added during bottling'],
    correct: 0,
    explain: 'Primary aromas are what the grape brings to the wine before any winemaking decisions are made.',
  },
  {
    source: 'wheel',
    q: 'Chablis is a classic example of which sub-category?',
    options: ['Baking spice', 'Sweet oak', 'Mineral — wet stone, flint, chalk', 'Tropical fruit'],
    correct: 2,
    explain: 'Chablis is famous for exactly this steely, mineral character.',
  },
  {
    source: 'walkthrough',
    q: 'What creates the sensation of acidity in wine?',
    options: [
      'It is felt on the sides of your tongue and makes you salivate',
      'The alcohol content',
      'The tannin level',
      'The colour of the wine',
    ],
    correct: 0,
    explain: 'Acidity is what makes a wine feel refreshing alongside food.',
  },
]

const SOURCE_LABEL = { walkthrough: 'Walkthrough', nose: 'Nose Training', wheel: 'Wheel' }
const SOURCE_COLOR = { walkthrough: '#264D3B', nose: '#7A5230', wheel: '#B98A3D' }

const ROUND_SIZE = 5

const SCORE_MESSAGES = [
  "Keep exploring — every question you got wrong is worth revisiting in the lessons.",
  "Good start. A little more time in the modules and this will click fast.",
  "Solid! You're picking up the real vocabulary.",
  "Strong palate intuition — you clearly remember what you've learned.",
  "Perfect score. Time to open a good bottle and put it to the test.",
]

// Fisher-Yates shuffle — used for both picking the round's questions and
// scrambling each question's answer order.
function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function buildRound() {
  const picked = shuffle(QUESTION_BANK).slice(0, ROUND_SIZE)
  return picked.map(q => {
    const order = shuffle(q.options.map((opt, i) => ({ opt, isCorrect: i === q.correct })))
    return {
      source: q.source,
      q: q.q,
      explain: q.explain,
      options: order.map(o => o.opt),
      correctIndex: order.findIndex(o => o.isCorrect),
    }
  })
}

export default function Quiz() {
  const navigate = useNavigate()
  const { quizHighScore, setQuizHighScore } = useAppStore()

  const [phase, setPhase] = useState('start') // 'start' | 'playing' | 'results'
  const [round, setRound] = useState([])
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)

  function startRound() {
    setRound(buildRound())
    setQIndex(0)
    setSelected(null)
    setScore(0)
    setPhase('playing')
  }

  function answer(i) {
    if (selected !== null) return // already answered this question
    setSelected(i)
    if (i === round[qIndex].correctIndex) setScore(s => s + 1)
  }

  function next() {
    if (qIndex < round.length - 1) {
      setQIndex(i => i + 1)
      setSelected(null)
    } else {
      setQuizHighScore(score)
      setPhase('results')
    }
  }

  const current = round[qIndex]

  return (
    <div className="max-w-2xl mx-auto pb-8">

      {/* Hero — same treatment as every other Learn module, kept consistent */}
      <div className="bg-gradient-to-br from-[var(--forest)] to-[var(--forest-dark)] px-5 pt-10 pb-6 md:rounded-b-2xl md:mx-4 mb-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-4 transition-colors">
          <i className="ti ti-arrow-left" aria-hidden="true"></i> Back to home
        </button>
        <p className="text-xs tracking-[0.1em] text-[var(--gold)] uppercase font-medium mb-2">Test what you know</p>
        <h1 className="font-['Cormorant_Garamond'] text-4xl text-white italic leading-tight">Quiz</h1>
      </div>

      <div className="px-4">

        {/* ── START ────────────────────────────────────────────── */}
        {phase === 'start' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[var(--gold-light)] flex items-center justify-center mx-auto mb-5">
              <i className="ti ti-trophy text-[var(--gold)] text-2xl" aria-hidden="true"></i>
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-[var(--ink)] mb-2">5 random questions, every round</h2>
            <p className="text-sm text-[var(--muted)] max-w-xs mx-auto leading-relaxed mb-2">
              Drawn from everything you've learned across Walkthrough, Nose Training, and the Flavour Wheel. Play as many times as you like.
            </p>
            {quizHighScore > 0 && (
              <p className="text-sm font-medium text-[var(--gold)] mb-6">Best score so far: {quizHighScore}/{ROUND_SIZE}</p>
            )}
            <button
              onClick={startRound}
              className="w-full max-w-xs mx-auto block py-3 rounded-xl text-white text-sm font-medium transition-colors bg-[var(--gold)] hover:opacity-90 mt-4"
            >
              Start quiz
            </button>
          </div>
        )}

        {/* ── PLAYING ──────────────────────────────────────────── */}
        {phase === 'playing' && current && (
          <div>
            {/* Progress */}
            <p className="text-xs text-[var(--muted)] mb-2">Question {qIndex + 1} of {round.length}</p>
            <div className="flex gap-1 mb-5">
              {round.map((_, i) => (
                <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                  style={{ background: i <= qIndex ? '#B98A3D' : '#E2DDD6' }} />
              ))}
            </div>

            {/* Question card */}
            <div className="bg-white border border-[var(--border)] rounded-xl p-5 mb-4">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full mb-3 inline-block"
                style={{ background: SOURCE_COLOR[current.source] + '18', color: SOURCE_COLOR[current.source] }}>
                {SOURCE_LABEL[current.source]}
              </span>
              <h2 className="font-['Cormorant_Garamond'] text-xl text-[var(--ink)] mb-4 leading-snug">{current.q}</h2>

              <div className="space-y-2">
                {current.options.map((opt, i) => {
                  const isAnswered = selected !== null
                  const isCorrect = i === current.correctIndex
                  const isPicked = i === selected
                  let cls = 'border-[var(--border)] hover:border-[var(--gold)]'
                  if (isAnswered && isCorrect) cls = 'border-[var(--forest)] bg-[var(--forest-light)]'
                  else if (isAnswered && isPicked && !isCorrect) cls = 'border-red-300 bg-red-50'
                  return (
                    <button
                      key={i}
                      onClick={() => answer(i)}
                      disabled={isAnswered}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${cls} ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className={isAnswered && isCorrect ? 'text-[var(--forest-dark)] font-medium' : 'text-[var(--ink-soft)]'}>{opt}</span>
                        {isAnswered && isCorrect && <i className="ti ti-check text-[var(--forest)] flex-shrink-0" aria-hidden="true"></i>}
                        {isAnswered && isPicked && !isCorrect && <i className="ti ti-x text-red-500 flex-shrink-0" aria-hidden="true"></i>}
                      </span>
                    </button>
                  )
                })}
              </div>

              {selected !== null && (
                <div className="mt-4 pt-4 border-t border-[var(--border-soft)]">
                  <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{current.explain}</p>
                </div>
              )}
            </div>

            {selected !== null && (
              <button
                onClick={next}
                className="w-full py-3 rounded-xl text-white text-sm font-medium transition-colors bg-[var(--gold)] hover:opacity-90"
              >
                {qIndex < round.length - 1 ? 'Next question →' : 'See results'}
              </button>
            )}
          </div>
        )}

        {/* ── RESULTS ──────────────────────────────────────────── */}
        {phase === 'results' && (
          <div className="text-center py-6">
            <div className="w-20 h-20 rounded-full bg-[var(--gold-light)] flex items-center justify-center mx-auto mb-5">
              <span className="font-['Cormorant_Garamond'] text-3xl text-[var(--gold)]">{score}/{ROUND_SIZE}</span>
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-[var(--ink)] mb-2">
              {score === ROUND_SIZE ? 'Perfect score!' : 'Round complete'}
            </h2>
            <p className="text-sm text-[var(--muted)] max-w-xs mx-auto leading-relaxed mb-2">
              {SCORE_MESSAGES[score]}
            </p>
            {quizHighScore > 0 && (
              <p className="text-xs text-[var(--gold)] font-medium mb-6">Best score: {quizHighScore}/{ROUND_SIZE}</p>
            )}
            <div className="space-y-3 max-w-xs mx-auto mt-6">
              <button
                onClick={startRound}
                className="w-full py-3 rounded-xl text-white text-sm font-medium transition-colors bg-[var(--gold)] hover:opacity-90"
              >
                Play again — new questions
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 rounded-xl border border-[var(--border)] text-[var(--ink-soft)] text-sm font-medium hover:border-[var(--forest)] hover:text-[var(--forest)] transition-colors"
              >
                Back to home
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
