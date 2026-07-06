import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'

// ── Data ─────────────────────────────────────────────────────────

const FREQUENCY_MEMO = {
  title: 'Five minutes a day is enough.',
  body: 'Your nose improves through repetition, not effort. A deliberate smell of your morning coffee, the herbs on your windowsill, or the fruit in your bowl counts as training. The goal is to notice — not to perform.',
  schedule: [
    { freq: 'Daily · 5 min',    desc: 'Kitchen exercises — household ingredients only' },
    { freq: 'Weekly · 20 min',  desc: 'Comparison exercises — ingredient pairs' },
    { freq: 'Monthly · 1 hr',   desc: 'Blind sessions — calibration and review' },
  ],
}

const WEEKS = [
  {
    id: 'week1',
    num: 'Week 1',
    title: 'Wake up your nose',
    goal: 'Learn to consciously notice familiar smells. No wine needed.',
    color: '#264D3B',
    bgColor: '#E4EDE0',
    exercises: [
      {
        id: 'ex1',
        day: 'Day 1–2',
        title: 'Slow citrus',
        stars: 1,
        time: '5 min',
        needs: ['Lemon', 'Orange', 'Lime'],
        intro: 'Smell each fruit with your eyes closed. Don\'t try to name them.',
        instructions: [
          'Hold the fruit close and take two slow, gentle sniffs.',
          'Ask yourself: fresh or ripe? Sweet or sharp? Bright or soft?',
          'Describe the smell in your own words — not wine vocabulary.',
          'Move to the next fruit. Notice what\'s different.',
        ],
        why: 'Professional tasters don\'t memorise labels — they build scent memories. Describing without judging is the foundation of all sensory training.',
        wineConnection: 'Sauvignon Blanc · Riesling · Vermentino',
        source: 'WSET · Wine Enthusiast',
        reflection: ['Which felt freshest?', 'Which surprised you?'],
      },
      {
        id: 'ex2',
        day: 'Day 3–4',
        title: 'Herb garden',
        stars: 1,
        time: '5 min',
        needs: ['Fresh mint', 'Basil', 'Rosemary', 'Thyme'],
        intro: 'Rub each leaf gently and smell immediately. Notice which aromas disappear after 10 seconds.',
        instructions: [
          'Rub a leaf between your fingers to release the oils.',
          'Smell within 2 seconds — before the volatile compounds escape.',
          'Wait 10 seconds. Smell again. Notice what\'s faded.',
          'These disappearing top notes are exactly what you catch in the "first sniff before swirling" step.',
        ],
        why: 'Volatile top-note aromas evaporate fastest. Training your nose to catch them quickly is the same skill used in the first sniff of a wine glass.',
        wineConnection: 'Sauvignon Blanc · Cabernet Sauvignon · Syrah',
        source: 'CMS · WSET',
        reflection: ['Which aroma faded fastest?', 'Which stayed longest?'],
        encouragement: {
          icon: '🌿',
          title: 'Good news',
          text: 'If two herbs smelled almost identical today, that\'s completely normal. Your brain improves with repetition. Come back tomorrow.',
        },
      },
      {
        id: 'ex3',
        day: 'Day 5–6',
        title: 'Spice drawer',
        stars: 2,
        time: '5 min',
        needs: ['Cinnamon', 'Black pepper', 'Cloves', 'Vanilla', 'Nutmeg'],
        intro: 'Smell five spices one by one with eyes closed. Wait 20 seconds between each.',
        instructions: [
          'Close your eyes before you begin.',
          'Smell each spice for about 10 seconds.',
          'Wait 20 seconds before the next one — this prevents olfactory blur.',
          'After all five: can you recall which was sharpest? Which was sweetest?',
        ],
        why: 'The 20-second pause between scents is essential. Without it, aromas blur into each other. This rest interval replicates the pacing used in professional aroma kit training.',
        wineConnection: 'Syrah · Grenache · Oaked Chardonnay',
        source: 'Prof. Hummel, Dresden Univ. · CMS',
        reflection: ['Which spice was easiest to identify?', 'Which was hardest?'],
      },
      {
        id: 'ex4',
        day: 'Day 7',
        title: 'The four-scent protocol',
        stars: 1,
        time: '5 min · repeat daily',
        needs: ['Rose essential oil or rose water', 'Lemon', 'Clove', 'Eucalyptus or fresh mint'],
        intro: 'The most scientifically validated nose-training exercise available. Simple. Short. Done twice a day.',
        instructions: [
          'Smell each of the four scents for about 20 seconds.',
          'Use short, gentle sniffs — not one big inhale.',
          'While smelling, close your eyes and visualise the source.',
          'Pause 10 seconds between each scent.',
          'Total time per session: under 2 minutes.',
          'Repeat morning and evening.',
        ],
        why: 'Developed by Prof. Thomas Hummel at Dresden University, this protocol has been validated in multiple clinical studies. Regular smell training supports the brain\'s ability to distinguish and remember scents over time. The four scents represent the major aroma categories: floral, fruity, spicy, resinous.',
        wineConnection: 'Builds the foundational categories used across all wine aroma families',
        source: 'Prof. Hummel, Dresden Univ. (2009) · Tisserand Institute · Wikipedia: Smell Training',
        reflection: ['Which scent felt most vivid?', 'Which was hardest to visualise?'],
      },
    ],
    weekendChallenge: {
      title: 'Fridge walk',
      desc: 'Open your fridge and smell ten ingredients. No notes, no pressure. Just curiosity. You\'ll be surprised how many aromas you\'ve ignored for years.',
    },
    milestone: 'You should already notice that lemon and lime smell different — not just "citrusy." That distinction is your nose beginning to work.',
  },
  {
    id: 'week2',
    num: 'Week 2',
    title: 'Learn to compare',
    goal: 'Compare aromas instead of naming them. Comparison is always easier than identification.',
    color: '#7A2038',
    bgColor: '#F5EDE0',
    encouragementMemo: {
      icon: '🍋',
      title: 'Consistency beats intensity.',
      text: 'Five minutes every day is more valuable than one hour once a month. If you missed a day, just continue. Your brain stores smell memories even when you don\'t notice improvement immediately.',
    },
    exercises: [
      {
        id: 'ex5',
        day: 'Day 8–9',
        title: 'Same family, different fruit',
        stars: 2,
        time: '5 min',
        needs: ['Apple, pear, and quince', 'or Peach, apricot, and plum'],
        intro: 'Choose three fruits from the same family. Smell each. Don\'t identify — compare.',
        instructions: [
          'Smell the first fruit slowly.',
          'Smell the second. Ask: which feels greener? Which feels sweeter?',
          'Smell the third. Where does it sit between the other two?',
          'Comparing two things is always easier than naming one thing in isolation.',
        ],
        why: 'Comparison activates relative aroma memory — your brain\'s most reliable smell mechanism. This is the core technique behind WSET\'s Systematic Approach to Tasting.',
        wineConnection: 'Pinot Gris · Viognier · White Burgundy',
        source: 'WSET · Jancis Robinson',
        reflection: ['Which felt greenest?', 'Which felt richest?'],
      },
      {
        id: 'ex6',
        day: 'Day 10–11',
        title: 'Fresh vs dried',
        stars: 2,
        time: '5 min',
        needs: ['Fresh apricot + dried apricot', 'Fresh plum + prunes', 'Fresh grapes + raisins'],
        intro: 'Compare fresh and dried versions of the same fruit. This difference is one of the most important in wine.',
        instructions: [
          'Smell the fresh fruit first.',
          'Smell the dried version immediately after.',
          'Notice: the dried version smells darker, richer, more concentrated.',
          'That shift — from fresh to dried — is exactly what you\'re detecting when a wine smells "jammy."',
        ],
        why: 'Many wines smell closer to dried fruit than fresh fruit — especially from warm climates or aged bottles. Understanding this difference changes how you read a wine\'s origin and age.',
        wineConnection: 'Amarone · Priorat · Aged Rioja · any warm-climate red',
        source: 'CMS Deductive Tasting Method',
        reflection: ['Which fresh fruit surprised you most?', 'Could you imagine this in a wine?'],
      },
      {
        id: 'ex7',
        day: 'Day 12–13',
        title: 'Temperature changes aroma',
        stars: 3,
        time: '10 min',
        needs: ['Any apple — straight from the fridge'],
        intro: 'Smell an apple cold, then again at room temperature. Notice how many more aromas appear.',
        instructions: [
          'Smell the apple immediately from the fridge.',
          'Write one word about the smell.',
          'Leave it on the counter for 30 minutes.',
          'Smell again. Write one more word.',
          'Compare.',
        ],
        why: 'Cold suppresses aromatic volatiles — the molecules that carry scent. This directly demonstrates why serving wine at the right temperature matters. The same wine smells flat at 6°C and expressive at 14°C.',
        wineConnection: 'Applies to all wines — especially reds served too cold',
        source: 'CMS · WSET Level 2',
        reflection: ['How many more aromas did you notice at room temperature?'],
      },
      {
        id: 'ex8',
        day: 'Day 14',
        title: 'The wrist reset',
        stars: 1,
        time: '5 min',
        needs: ['Any spice', 'Your own wrist'],
        intro: 'Smell a spice. Then smell the inside of your wrist. Then the spice again. Notice the difference.',
        instructions: [
          'Smell a strong spice — black pepper works well.',
          'Immediately smell the inside of your wrist for 5 seconds.',
          'Smell the spice again.',
          'The second smell should feel cleaner and clearer.',
        ],
        why: 'Your skin scent is neutral to your brain — it clears olfactory fatigue without introducing competing aromas. This is why professional sommeliers use their wrist, not coffee beans, as a palate reset. The coffee bean myth is widespread but unsupported.',
        source: 'CMS · WSET · Wine Enthusiast',
        reflection: ['Did the spice smell different the second time?', 'More or less intense?'],
        encouragement: {
          icon: '👃',
          title: 'Nose fatigue is normal',
          text: 'If everything starts smelling the same — stop. Take five minutes. Smell your wrist. Your nose has a short working window. Professionals pace themselves for exactly this reason.',
        },
      },
    ],
    weekendChallenge: {
      title: 'Build your own aroma pairs',
      desc: 'Find three pairs of ingredients that feel related — fresh vs dried herbs, cold vs warm spice, soft fruit vs sharp citrus. Smell each pair back to back and write one sentence about the difference.',
    },
    milestone: 'Comparing aromas should feel easier than naming them. If so, your nose is already learning to work the way professional tasters\' do.',
  },
  {
    id: 'week3',
    num: 'Week 3',
    title: 'Blind recognition',
    goal: 'Identify aromas without visual cues. Solo version — no second person required.',
    color: '#3A1A46',
    bgColor: '#EAE8F0',
    exercises: [
      {
        id: 'ex9',
        day: 'Day 15–16',
        title: 'Blind sniff jars',
        stars: 3,
        time: '10 min',
        needs: ['5 opaque containers', 'Cedar strip (or pencil shavings)', 'Dried currants', 'Orange zest', 'Ground coffee', 'One whole clove'],
        intro: 'Fill opaque containers, label the bottom, shuffle, then identify by smell alone.',
        instructions: [
          'Put one ingredient in each container. Label the bottom — not the top.',
          'Shuffle them so you don\'t know the order.',
          'Close your eyes. Smell each container.',
          'Write your guess. Then flip and check.',
          'The opaque container is essential — when you can\'t see the source, your nose works harder.',
        ],
        why: 'Visual deprivation forces true olfactory engagement. This DIY version replicates the "Le Nez du Vin" aroma kit widely used in wine education. Similar aroma kits are commonly used by wine professionals and students preparing for advanced tasting certifications.',
        wineConnection: 'Red Bordeaux · Côtes du Rhône · Rioja',
        source: 'CMS · WSET',
        reflection: ['Which ingredient surprised you most?', 'Which was easiest? Which was hardest?'],
      },
      {
        id: 'ex10',
        day: 'Day 17–18',
        title: 'Fruit ladder',
        stars: 3,
        time: '10 min',
        needs: ['Green apple', 'Ripe apple', 'Apple cooked in a pan for 2 minutes'],
        intro: 'Arrange fruit from green → ripe → cooked. Smell each stage. This teaches how climate and winemaking change aroma.',
        instructions: [
          'Smell the green apple — notice the sharp, fresh, almost tart character.',
          'Smell the ripe apple — softer, sweeter, rounder.',
          'Smell the cooked apple — jammy, concentrated, dark.',
          'A cool-climate wine sits near step 1. A warm-climate wine sits near step 3.',
        ],
        why: 'Wine aromas evolve exactly like fruit stages. A Chablis smells like the green apple stage. A Californian oaked Chardonnay smells like the baked stage. Once you feel this spectrum in your hands, you can read it in a glass.',
        wineConnection: 'Chablis vs Californian Chardonnay · Loire vs New Zealand Sauvignon Blanc',
        source: 'CMS Deductive Tasting · WSET Level 2',
        reflection: ['Where on the ladder did most wine aromas you know seem to sit?'],
      },
      {
        id: 'ex11',
        day: 'Day 19–20',
        title: 'Timed recognition',
        stars: 4,
        time: '10 min',
        needs: ['8 kitchen ingredients of your choice'],
        intro: 'Give yourself 5 seconds per ingredient. The goal is faster recall — not accuracy.',
        instructions: [
          'Prepare 8 ingredients in a row.',
          'Set a timer for 5 seconds.',
          'Smell each one. Name it before the timer ends.',
          'Move immediately to the next.',
          'Don\'t dwell on mistakes.',
        ],
        why: 'Under time pressure, your brain shifts from analytical to intuitive — which is often more accurate for aroma identification. The CMS blind tasting exam gives candidates 25 minutes for 6 wines. Speed matters. Intuition is trained, not innate.',
        source: 'CMS Deductive Tasting Method',
        reflection: ['Did your first instinct turn out to be right?', 'Which ingredient did you keep second-guessing?'],
        encouragement: {
          icon: '⭐',
          title: 'Trust your nose',
          text: 'Two people can describe the same aroma differently and both be right. Professional sommeliers still disagree about aromas. What matters is that the description helps you recognise it again.',
        },
      },
      {
        id: 'ex12',
        day: 'Day 21',
        title: 'Grocery store walk',
        stars: 2,
        time: '15 min',
        needs: ['A supermarket'],
        intro: 'Walk through the fruit and herb sections and deliberately smell everything. This is wine training without wine.',
        instructions: [
          'Go to the fruit section. Smell peaches, berries, citrus.',
          'Go to the herb section. Smell fresh basil, rosemary, mint.',
          'Stop at the mushrooms. Notice the earthy, forest-floor character.',
          'You are building wine vocabulary with every aisle.',
        ],
        why: 'Professional tasters do this constantly. Wine Enthusiast notes it as one of the most effective ongoing training habits. You\'re not learning new aromas — you\'re cataloguing ones you already have access to every day.',
        source: 'Wine Enthusiast · WSET',
        reflection: ['What one smell will you remember from this walk?'],
      },
    ],
    weekendChallenge: {
      title: 'Memory jar (solo version)',
      desc: 'Put 6 ingredients in opaque containers, labelled underneath. Shuffle. Identify each by smell. Check after each one — don\'t wait until the end. Immediate feedback builds aroma memory faster than delayed feedback.',
    },
    milestone: 'You may still make mistakes, but you\'ll probably recognise familiar smells more quickly than you did in Week 1. Speed of recognition is the metric that matters here.',
  },
  {
    id: 'week4',
    num: 'Week 4',
    title: 'Wine connections',
    goal: 'Connect everything you\'ve trained to actual wine aromas. This is the payoff week.',
    color: '#B98A3D',
    bgColor: '#FFF0DC',
    introBanner: {
      title: 'You\'ve been building this all month.',
      text: 'This week you\'ll open actual wine for the first time in this module. Everything you\'ve practised — citrus, herbs, spice, the difference between fresh and dried fruit — is inside every bottle of wine. You\'re not learning new aromas. You\'re recognising ones you already know.',
    },
    exercises: [
      {
        id: 'ex13',
        day: 'Day 22–23',
        title: 'Citrus → white wine',
        stars: 3,
        time: '10 min',
        needs: ['Lemon zest', 'Grapefruit', 'Lime', 'A glass of Sauvignon Blanc or dry Riesling'],
        intro: 'Smell the citrus family you\'ve trained with. Then open the wine. Find the connection.',
        instructions: [
          'Smell lemon zest, then grapefruit, then lime — deliberately, slowly.',
          'Pour the wine. Before tasting, give it one slow sniff.',
          'Find the citrus family you already know.',
          'You are not learning what Sauvignon Blanc smells like — you are recognising something familiar.',
        ],
        why: 'This is the moment the training clicks. Recognition is not the same as memorisation. When you smell a wine and think "I know that" — that\'s the skill you\'ve been building.',
        wineConnection: 'Sauvignon Blanc · Riesling · Verdejo · Vermentino',
        source: 'WSET · Jancis Robinson blind tasting series',
        reflection: ['What was the first thing you recognised?', 'Did the wine smell the way you expected?'],
      },
      {
        id: 'ex14',
        day: 'Day 24–25',
        title: 'Black pepper → Syrah',
        stars: 3,
        time: '10 min',
        needs: ['Freshly cracked black pepper', 'A glass of Syrah or Shiraz'],
        intro: 'Smell black pepper for 20 full seconds. Then smell the wine. The connection will be immediate.',
        instructions: [
          'Crack fresh black pepper and smell it deliberately for 20 seconds.',
          'Pour the Syrah. Smell it before tasting.',
          'The cracked black pepper character is not a vague metaphor — it is a specific compound called rotundone present in both.',
          'Once you\'ve smelled them side by side, you will never miss it again.',
        ],
        why: 'Rotundone is a sesquiterpene compound found in both black pepper and the skins of Syrah grapes. This is one of the most precisely documented aroma connections in wine science. This isn\'t poetic description — it\'s chemistry you can smell.',
        wineConnection: 'Northern Rhône Syrah · Australian Shiraz · Grüner Veltliner',
        source: 'CMS · Wine Folly · peer-reviewed aroma science',
        reflection: ['How long did the pepper character last on the finish of the wine?'],
        encouragement: {
          icon: '🍷',
          title: 'Wine starts in the grocery store.',
          text: 'The best place to improve your wine vocabulary isn\'t a wine shop. It\'s the fruit aisle. You\'ve been training there all month.',
        },
      },
      {
        id: 'ex15',
        day: 'Day 26–27',
        title: 'Vanilla + cedar → oak',
        stars: 4,
        time: '10 min',
        needs: ['Vanilla extract', 'Cedar strip or pencil shavings', 'An oaked Chardonnay or Rioja Crianza'],
        intro: 'Smell vanilla and cedar. Then open the oaked wine. These are the two dominant aromas oak barrels contribute.',
        instructions: [
          'Smell vanilla extract slowly.',
          'Smell a cedar strip or pencil shavings.',
          'Open the wine. Before tasting, find either vanilla or cedar in the nose.',
          'Understanding oak means understanding a winemaker\'s decision you can now detect.',
        ],
        why: 'Oak barrels contribute specific aromatic compounds to wine — primarily vanillin (vanilla) and guaiacol/eugenol (cedar, spice). This is not a coincidence of description — it is the same chemistry in both the wood and the wine.',
        wineConnection: 'Oaked Chardonnay · Rioja Crianza · Napa Cabernet',
        source: 'CMS · WSET Level 2 · Le Nez du Vin Oak series',
        reflection: ['Could you tell which of the two (vanilla or cedar) dominated the wine?'],
      },
      {
        id: 'ex16',
        day: 'Day 28 · ongoing',
        title: 'Smell before you taste — forever',
        stars: 2,
        time: 'Every bottle',
        needs: ['Any wine'],
        intro: 'Open any wine. Before tasting, write three words about the nose. Find one aroma that reminds you of something you smelled this month.',
        instructions: [
          'Open the wine. Don\'t taste yet.',
          'Smell for 60 seconds.',
          'Write: one fruit, one non-fruit aroma, one word for how it makes you feel.',
          'This is now your permanent habit — not an exercise with an end date.',
        ],
        why: 'This converts four weeks of deliberate training into a lifelong tasting habit. The three-word rule is consistently recommended across CMS, WSET, and Jancis Robinson as the most effective ongoing practice for any level of taster.',
        wineConnection: 'Every wine you open for the rest of your life',
        source: 'CMS · WSET · Jancis Robinson · Wine Enthusiast',
        reflection: ['What one aroma connected to something you trained with this month?'],
      },
    ],
    weekendChallenge: {
      title: 'Smell → wine → write',
      desc: 'Open a bottle. Smell it for 60 seconds before tasting. Write: one fruit, one non-fruit aroma, one word for how it makes you feel. No right answers. This is your new habit.',
    },
    milestone: 'Your wine descriptions will feel more personal and more confident. You\'re not guessing anymore — you\'re recognising.',
  },
]

const COMPLETION_TEXT = {
  title: 'Your nose is already better.',
  body: 'If you\'ve completed these exercises, you\'ve spent more time consciously smelling everyday ingredients than most wine drinkers ever do.\n\nThe next time you open a bottle, don\'t try to identify ten aromas. Find just one that reminds you of something you smelled this month.\n\nThat\'s how professional tasters improve — one memory at a time.',
}

// ── Sub-components ────────────────────────────────────────────────

function Difficulty({ count }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-[var(--muted)]">Difficulty</span>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="rounded-full flex-shrink-0"
            style={{
              width: 6, height: 6,
              background: i < count ? 'var(--gold)' : 'var(--border)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

function EncouragementCard({ card }) {
  return (
    <div className="bg-[var(--gold-light)] border border-[var(--gold)]/20 rounded-xl px-4 py-3.5 flex items-start gap-3 my-4">
      <span className="text-xl flex-shrink-0">{card.icon}</span>
      <div>
        <p className="text-sm font-medium text-[var(--ink)] mb-1">{card.title}</p>
        <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{card.text}</p>
      </div>
    </div>
  )
}

function ExerciseCard({ ex, weekColor, isCompleted, onToggle }) {
  const [expanded, setExpanded] = useState(false)
  const [showReflection, setShowReflection] = useState(false)

  return (
    <div className={`bg-white border rounded-xl overflow-hidden mb-3 transition-colors ${
      isCompleted ? 'border-[var(--forest)]/30' : 'border-[var(--border)]'
    }`}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[var(--muted)]">{ex.day}</span>
            <span className="text-xs text-[var(--muted)]">·</span>
            <span className="text-xs text-[var(--muted)]">{ex.time}</span>
          </div>
        </div>
        <h3 className="font-medium text-[var(--ink)] text-base leading-tight mb-2">{ex.title}</h3>
        <div className="flex items-center justify-between gap-3">
          <Difficulty count={ex.stars} />
          {/* Done button — explicit text, not an ambiguous icon */}
          <button
            onClick={onToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
              isCompleted
                ? 'bg-[var(--forest)] text-white'
                : 'border border-[var(--border)] text-[var(--muted)] hover:border-[var(--forest)] hover:text-[var(--forest)]'
            }`}
          >
            {isCompleted && <i className="ti ti-check" style={{ fontSize: 12 }} aria-hidden="true"></i>}
            {isCompleted ? 'Done' : 'Mark done'}
          </button>
        </div>
      </div>

      {/* You'll need */}
      <div className="px-4 pb-3">
        <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1.5">You'll need</p>
        <div className="flex flex-wrap gap-1">
          {ex.needs.map((n, i) => (
            <span key={i} className="text-xs bg-[var(--border-soft)] text-[var(--ink-soft)] px-2 py-0.5 rounded-full">{n}</span>
          ))}
        </div>
      </div>

      {/* Intro */}
      <div className="px-4 pb-3 border-t border-[var(--border-soft)] pt-3">
        <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{ex.intro}</p>
      </div>

      {/* Instructions */}
      <div className="px-4 pb-3">
        <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-2">Instructions</p>
        <ol className="space-y-2">
          {ex.instructions.map((step, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-[var(--ink-soft)]">
              <span className="font-['Cormorant_Garamond'] text-base leading-tight flex-shrink-0" style={{ color: weekColor }}>
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Expandable: Why it works + Wine connection + Source */}
      <div className="border-t border-[var(--border-soft)]">
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-medium transition-colors hover:bg-[var(--border-soft)]"
          style={{ color: weekColor }}
        >
          <span>{expanded ? 'Less detail' : 'Why it works'}</span>
          <i className={`ti ${expanded ? 'ti-chevron-up' : 'ti-chevron-down'} text-xs`} aria-hidden="true"></i>
        </button>
        {expanded && (
          <div className="px-4 pb-4 pt-2 space-y-3 border-t border-[var(--border-soft)]">
            <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{ex.why}</p>
            {ex.wineConnection && (
              <div>
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">Wine connection</p>
                <p className="text-sm text-[var(--ink-soft)]">{ex.wineConnection}</p>
              </div>
            )}
            <p className="text-xs text-[var(--muted)] italic">{ex.source}</p>
          </div>
        )}
      </div>

      {/* Reflection */}
      <div className="border-t border-[var(--border-soft)]">
        <button
          onClick={() => setShowReflection(r => !r)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-medium text-[var(--muted)] hover:bg-[var(--border-soft)] transition-colors"
        >
          <span>Reflection questions</span>
          <i className={`ti ${showReflection ? 'ti-chevron-up' : 'ti-chevron-down'} text-xs`} aria-hidden="true"></i>
        </button>
        {showReflection && (
          <div className="px-4 pb-4 pt-2 border-t border-[var(--border-soft)] space-y-2">
            {ex.reflection.map((q, i) => (
              <p key={i} className="text-sm text-[var(--ink-soft)] flex gap-2">
                <span className="text-[var(--gold)] flex-shrink-0">·</span>{q}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────

export default function Nose() {
  const navigate = useNavigate()
  const { markModuleComplete, completedModules, exerciseProgress, toggleExercise, modulePosition, setModulePosition, seenIntroCards, markIntroCardSeen } = useAppStore()
  const activeWeek = modulePosition['nose'] ?? 0
  const setActiveWeek = (updater) => {
    const current = modulePosition['nose'] ?? 0
    const next = typeof updater === 'function' ? updater(current) : updater
    setModulePosition('nose', next)
  }
  const [finished, setFinished] = useState(completedModules.includes('nose'))
  const hasSeenFrequencyMemo = !!seenIntroCards['nose-frequency-memo']
  const [memoExpanded, setMemoExpanded] = useState(!hasSeenFrequencyMemo)

  // Mark as seen the moment this page mounts — so it only ever auto-expands
  // on the genuine first visit, not every time until manually collapsed.
  useEffect(() => {
    if (!hasSeenFrequencyMemo) {
      markIntroCardSeen('nose-frequency-memo')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalExercises = WEEKS.reduce((acc, w) => acc + w.exercises.length, 0)
  const allExerciseIds = WEEKS.flatMap(w => w.exercises.map(ex => ex.id))
  const doneCount = allExerciseIds.filter(id => exerciseProgress[id]).length
  const allDone = doneCount === totalExercises

  function completeModule() {
    markModuleComplete('nose')
    setFinished(true)
  }

  // ── Completion screen ──────────────────────────────────────────
  if (finished) {
    return (
      <div className="max-w-2xl mx-auto pb-6">
        <div className="bg-gradient-to-br from-[var(--forest)] to-[var(--forest-dark)] px-5 pt-10 pb-6 md:rounded-b-2xl md:mx-4 mb-6">
          <button onClick={() => navigate('/learn')} className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-4 transition-colors">
            <i className="ti ti-arrow-left" aria-hidden="true"></i> Back to lessons
          </button>
          <h1 className="font-['Cormorant_Garamond'] text-4xl text-white italic">Train your nose</h1>
        </div>
        <div className="px-4 text-center py-10">
          <div className="w-20 h-20 rounded-full bg-[var(--forest-light)] flex items-center justify-center mx-auto mb-5">
            <i className="ti ti-trophy text-[var(--forest)] text-3xl" aria-hidden="true"></i>
          </div>
          <h2 className="font-['Cormorant_Garamond'] text-3xl text-[var(--ink)] mb-4">{COMPLETION_TEXT.title}</h2>
          <p className="text-[var(--muted)] text-sm mb-8 max-w-xs mx-auto leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
            {COMPLETION_TEXT.body}
          </p>
          <div className="space-y-3 max-w-xs mx-auto">
            <button onClick={() => { setFinished(false); setActiveWeek(0) }}
              className="w-full py-3 rounded-xl border border-[var(--border)] text-[var(--ink-soft)] text-sm font-medium hover:border-[var(--forest)] hover:text-[var(--forest)] transition-colors">
              Review exercises
            </button>
            <button onClick={() => navigate('/learn')}
              className="w-full py-3 rounded-xl bg-[var(--forest)] hover:bg-[var(--forest-dark)] text-white text-sm font-medium transition-colors">
              Back to lessons
            </button>
          </div>
        </div>
      </div>
    )
  }

  const week = WEEKS[activeWeek]

  return (
    <div className="max-w-2xl mx-auto pb-8">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[var(--forest)] to-[var(--forest-dark)] px-5 pt-10 pb-6 md:rounded-b-2xl md:mx-4 mb-6">
        <button onClick={() => navigate('/learn')} className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-4 transition-colors">
          <i className="ti ti-arrow-left" aria-hidden="true"></i> Back to lessons
        </button>
        <p className="text-xs tracking-[0.1em] text-white/45 uppercase mb-2">30-day programme</p>
        <h1 className="font-['Cormorant_Garamond'] text-4xl text-white italic leading-tight mb-3">Train your nose</h1>
        <p className="text-white/55 text-sm font-light leading-relaxed mb-4">
          Learn to smell like a sommelier. Five minutes a day, ordinary ingredients.
        </p>
        {/* Overall progress bar */}
        <div className="flex gap-1">
          {Array.from({ length: totalExercises }).map((_, i) => (
            <div key={i} className="flex-1 h-0.5 rounded-full transition-all duration-300"
              style={{ background: i < doneCount ? '#fff' : 'rgba(255,255,255,.2)' }} />
          ))}
        </div>
        <p className="text-xs text-white/40 mt-1.5">{doneCount} of {totalExercises} exercises complete</p>
      </div>

      <div className="px-4">

        {/* Frequency memo — expanded on first visit, compact thereafter */}
        <div className="bg-[var(--forest-light)] border border-[var(--forest)]/15 rounded-xl overflow-hidden mb-6">
          <button
            onClick={() => setMemoExpanded(e => !e)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
          >
            <span className="text-xs font-medium text-[var(--forest)] uppercase tracking-wide">Before you begin</span>
            <i className={`ti ${memoExpanded ? 'ti-chevron-up' : 'ti-chevron-down'} text-sm text-[var(--forest)] flex-shrink-0`} aria-hidden="true"></i>
          </button>
          {memoExpanded && (
            <div className="px-4 pb-4">
              <p className="text-sm font-medium text-[var(--ink)] mb-2">{FREQUENCY_MEMO.title}</p>
              <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-3">
                {FREQUENCY_MEMO.body}
              </p>
              <div className="space-y-1.5">
                {FREQUENCY_MEMO.schedule.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="font-medium text-[var(--forest)] flex-shrink-0 min-w-[100px]">{s.freq}</span>
                    <span className="text-[var(--muted)]">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Week tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {WEEKS.map((w, i) => (
            <button
              key={w.id}
              onClick={() => setActiveWeek(i)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeWeek === i
                  ? 'text-white'
                  : 'bg-white border border-[var(--border)] text-[var(--muted)] hover:border-[var(--forest)]'
              }`}
              style={activeWeek === i ? { background: w.color } : {}}
            >
              {w.num}
            </button>
          ))}
        </div>

        {/* Week header */}
        <div className="rounded-xl px-4 py-3.5 mb-5" style={{ background: week.bgColor }}>
          <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: week.color }}>{week.num}</p>
          <h2 className="font-['Cormorant_Garamond'] text-2xl text-[var(--ink)] mb-1">{week.title}</h2>
          <p className="text-sm text-[var(--ink-soft)] leading-relaxed italic">{week.goal}</p>
        </div>

        {/* Week 4 intro banner */}
        {week.introBanner && (
          <div className="bg-[var(--gold-light)] border border-[var(--gold)]/20 rounded-xl px-4 py-4 mb-4">
            <p className="text-sm font-medium text-[var(--ink)] mb-1.5">✦ {week.introBanner.title}</p>
            <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{week.introBanner.text}</p>
          </div>
        )}

        {/* Week encouragement memo */}
        {week.encouragementMemo && (
          <EncouragementCard card={week.encouragementMemo} />
        )}

        {/* Exercises */}
        {week.exercises.map((ex, i) => (
          <div key={ex.id}>
            <ExerciseCard
              ex={ex}
              weekColor={week.color}
              isCompleted={!!exerciseProgress[ex.id]}
              onToggle={() => toggleExercise(ex.id)}
            />
            {ex.encouragement && <EncouragementCard card={ex.encouragement} />}
          </div>
        ))}

        {/* Weekend challenge */}
        <div className="border border-dashed border-[var(--border-strong)] rounded-xl px-4 py-4 mb-5">
          <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">Weekend challenge</p>
          <p className="text-sm font-medium text-[var(--ink)] mb-1">{week.weekendChallenge.title}</p>
          <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{week.weekendChallenge.desc}</p>
        </div>

        {/* Milestone */}
        <div className="bg-white border border-[var(--border)] rounded-xl px-4 py-3.5 mb-6 flex items-start gap-3">
          <span className="text-[var(--gold)] flex-shrink-0 mt-0.5">✦</span>
          <div>
            <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">What you should notice now</p>
            <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{week.milestone}</p>
          </div>
        </div>

        {/* Week navigation */}
        <div className="flex gap-3 mb-6">
          {activeWeek > 0 && (
            <button onClick={() => { setActiveWeek(w => w - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--ink-soft)] text-sm font-medium hover:border-[var(--forest)] transition-colors">
              ← {WEEKS[activeWeek - 1].num}
            </button>
          )}
          {activeWeek < WEEKS.length - 1 ? (
            <button onClick={() => { setActiveWeek(w => w + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="flex-1 py-3 rounded-xl text-white text-sm font-medium transition-colors"
              style={{ background: week.color }}>
              {WEEKS[activeWeek + 1].num}: {WEEKS[activeWeek + 1].title} →
            </button>
          ) : (
            <button
              onClick={completeModule}
              className="flex-1 py-3 rounded-xl text-white text-sm font-medium transition-colors bg-[var(--forest)] hover:bg-[var(--forest-dark)]">
              Complete module ✓
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
