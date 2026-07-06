// Hand-curated tasting plans — same JSON shape generateTastingPlan() returns from the AI.
// This lets us demo a fully working Planner with zero API cost, and swap back to
// the real AI call later (see services/ai.js) without touching Planner.jsx at all.

export const SAMPLE_PLANS_EN = [
  {
    id: 'three-reds-classic',
    keywords: ['red', 'bordeaux', 'cabernet', 'rioja', 'syrah', 'shiraz', 'merlot', 'tannic', 'bold', 'steak', 'beef', 'lamb', 'meat', 'winter', 'autumn'],
    plan: {
      title: 'Three reds, light to bold',
      intro: 'A classic progression through red wine styles — perfect for building palate confidence with familiar, food-friendly bottles.',
      wines: [
        {
          order: 1, name: 'Côtes du Rhône', type: 'Red', region: 'Rhône Valley, France', servingTemp: '16°C',
          why: 'Starts the evening light and approachable — soft tannins won\'t overwhelm your palate before the bigger wines arrive.',
          foods: ['charcuterie', 'soft cheese', 'olives'],
          tasting_prompts: ['Does the fruit taste fresh or more dried/jammy?', 'How long does the finish last — count the seconds.', 'Notice the tannin: is it gripping or soft?']
        },
        {
          order: 2, name: 'Rioja Crianza', type: 'Red', region: 'Rioja, Spain', servingTemp: '17°C',
          why: 'A step up in structure and oak influence — you\'ll notice more vanilla and spice compared to the Rhône.',
          foods: ['grilled lamb', 'manchego', 'roasted vegetables'],
          tasting_prompts: ['Can you smell vanilla or coconut? That\'s the oak.', 'Compare the tannin grip to the first wine — stronger?', 'What fruit comes through — cherry, plum, something else?']
        },
        {
          order: 3, name: 'Cabernet Sauvignon', type: 'Red', region: 'Napa Valley, USA', servingTemp: '18°C',
          why: 'The boldest of the three — full body, firm tannins, and dark fruit intensity make a memorable finale.',
          foods: ['ribeye steak', 'aged cheddar', 'dark chocolate'],
          tasting_prompts: ['Notice the weight in your mouth — does it feel "heavier" than the others?', 'Is the tannin drying on your gums right now?', 'How does this compare to where you started the evening?']
        }
      ],
      hostingTips: [
        'Pour smaller measures (75ml) for each wine so guests can finish all three without overdoing it.',
        'Serve wines slightly cooler than "room temperature" — most people serve red wine too warm.',
        'Have plain crackers or bread on hand to reset the palate between pours.'
      ],
      foodPlan: 'Keep food simple and shareable — a board of cheeses, cured meats, and roasted vegetables works across all three wines without competing with any single one.'
    }
  },
  {
    id: 'summer-whites',
    keywords: ['white', 'summer', 'sauvignon', 'chardonnay', 'riesling', 'light', 'fish', 'seafood', 'salad', 'warm', 'spring', 'fresh', 'crisp'],
    plan: {
      title: 'Bright whites for warm weather',
      intro: 'Three crisp, refreshing whites that showcase how acidity and minerality vary even within "light and dry" wines.',
      wines: [
        {
          order: 1, name: 'Sauvignon Blanc', type: 'White', region: 'Marlborough, New Zealand', servingTemp: '9°C',
          why: 'Zesty and aromatic — a vivid starting point that wakes up the palate with citrus and green herb notes.',
          foods: ['goat cheese', 'green salad', 'ceviche'],
          tasting_prompts: ['Do you catch any grassy or herbal notes on the nose?', 'How does the acidity feel — does it make you salivate?', 'Citrus fruit: lemon, lime, or grapefruit?']
        },
        {
          order: 2, name: 'Chablis (unoaked Chardonnay)', type: 'White', region: 'Burgundy, France', servingTemp: '10°C',
          why: 'A study in minerality — notice how different this is from oaked Chardonnay, with a flinty, saline edge.',
          foods: ['oysters', 'grilled fish', 'soft cheese'],
          tasting_prompts: ['Any "wet stone" or chalky character on the nose?', 'Compare the body to the Sauvignon Blanc — lighter or heavier?', 'Is the finish clean and dry, or does it linger sweetly?']
        },
        {
          order: 3, name: 'Dry Riesling', type: 'White', region: 'Mosel, Germany', servingTemp: '9°C',
          why: 'High acidity balanced by ripe stone fruit — Riesling shows that "dry" doesn\'t mean flavourless.',
          foods: ['spicy Thai food', 'pork belly', 'soft cheese'],
          tasting_prompts: ['Notice the aromatics — peach, apricot, or something floral?', 'Despite being dry, does the fruit make it taste slightly sweet?', 'How does the finish compare to the other two wines?']
        }
      ],
      hostingTips: [
        'Serve these wines properly chilled — straight from the fridge is ideal for all three.',
        'Outdoor or garden settings suit this lineup perfectly if the weather allows.',
        'Have sparkling water on hand as a palate cleanser between wines.'
      ],
      foodPlan: 'Light, fresh dishes work best — think salads, grilled fish, and soft cheeses. Avoid heavy cream sauces, which can clash with the high acidity in all three wines.'
    }
  },
  {
    id: 'celebration-sparkling',
    keywords: ['celebration', 'party', 'sparkling', 'champagne', 'prosecco', 'birthday', 'anniversary', 'wedding', 'special', 'occasion', 'toast'],
    plan: {
      title: 'A celebration flight',
      intro: 'Three sparkling wines at different price points and styles, perfect for toasting and comparing what makes each unique.',
      wines: [
        {
          order: 1, name: 'Cava Brut', type: 'Sparkling', region: 'Penedès, Spain', servingTemp: '7°C',
          why: 'An excellent value starting point — crisp and clean, it sets a high bar without breaking the budget.',
          foods: ['almonds', 'jamón', 'light appetizers'],
          tasting_prompts: ['Look at the bubbles — are they fine and persistent, or large and quick to fade?', 'What\'s the dominant fruit — green apple, citrus, something else?', 'How dry does it taste on the finish?']
        },
        {
          order: 2, name: 'Prosecco Superiore', type: 'Sparkling', region: 'Veneto, Italy', servingTemp: '7°C',
          why: 'Softer and fruitier than the Cava — a great illustration of how production method changes the wine\'s character.',
          foods: ['fruit tart', 'prosciutto melon', 'soft cheese'],
          tasting_prompts: ['Notice the bubbles feel softer — less aggressive than the Cava.', 'Pear or peach notes coming through?', 'Is this sweeter or drier than the first wine?']
        },
        {
          order: 3, name: 'Champagne Brut NV', type: 'Sparkling', region: 'Champagne, France', servingTemp: '8°C',
          why: 'The benchmark — complex, toasty, and layered. Tasting it last lets you appreciate the added complexity fully.',
          foods: ['oysters', 'caviar', 'rich canapés'],
          tasting_prompts: ['Do you notice toasty, bready, or biscuity notes? That\'s from aging on lees.', 'How does the texture compare — creamier than the others?', 'Notice the length of the finish compared to the first two wines.']
        }
      ],
      hostingTips: [
        'Chill all bottles thoroughly — at least 3 hours in the fridge or 20 minutes in an ice bucket.',
        'Use proper flutes or tulip glasses to preserve the bubbles longer.',
        'Open Champagne carefully — twist the bottle, not the cork, to avoid a loud pop and lost wine.'
      ],
      foodPlan: 'Small, elegant bites work best with sparkling wine — think canapés, light cheeses, and anything briny like olives or cured fish, which pair beautifully with the acidity.'
    }
  },
  {
    id: 'beginner-friendly',
    keywords: ['beginner', 'new', 'first', 'easy', 'simple', 'learn', 'casual', 'introduction', 'starter'],
    plan: {
      title: 'A gentle introduction',
      intro: 'Three approachable, widely available wines designed to build confidence without overwhelming a new palate.',
      wines: [
        {
          order: 1, name: 'Pinot Grigio', type: 'White', region: 'Veneto, Italy', servingTemp: '9°C',
          why: 'Light, neutral, and easy-drinking — a gentle, low-pressure starting point with nothing intimidating about it.',
          foods: ['light pasta', 'chicken', 'mild cheese'],
          tasting_prompts: ['What\'s the first thing you notice on the nose?', 'Does it feel light or heavy in your mouth?', 'Is there any fruit flavour you can name?']
        },
        {
          order: 2, name: 'Pinot Noir', type: 'Red', region: 'Central Otago, New Zealand', servingTemp: '15°C',
          why: 'The friendliest red grape for beginners — light body and soft tannins mean nothing to fear here.',
          foods: ['roast chicken', 'mushroom dishes', 'soft cheese'],
          tasting_prompts: ['Notice this is much lighter than you might expect from a "red wine".', 'Any red fruit — cherry or strawberry — coming through?', 'Compare the tannin to what you imagined "red wine tannin" would feel like.']
        },
        {
          order: 3, name: 'Moscato d\'Asti', type: 'Sparkling/Sweet', region: 'Piedmont, Italy', servingTemp: '8°C',
          why: 'A delightful, low-alcohol, lightly sweet finish — proves wine doesn\'t always have to be dry and serious.',
          foods: ['fresh fruit', 'light desserts', 'soft cheese'],
          tasting_prompts: ['Notice the gentle fizz — different from Champagne\'s strong bubbles.', 'How sweet does it taste compared to the first two wines?', 'What fruit flavours stand out — peach, grape, orange blossom?']
        }
      ],
      hostingTips: [
        'There\'s no wrong answer in tasting — encourage guests to say whatever they actually taste, even if it\'s "I don\'t know, I just like it".',
        'Keep pours small (50-75ml) so the evening stays relaxed rather than overwhelming.',
        'Have water and plain crackers available throughout.'
      ],
      foodPlan: 'Keep food simple and familiar — nothing too spicy or strongly flavoured, which could mask the wines\' more delicate characteristics for a developing palate.'
    }
  },
  {
    id: 'cheese-pairing',
    keywords: ['cheese', 'cheeseboard', 'board', 'brie', 'cheddar', 'blue cheese', 'gouda'],
    plan: {
      title: 'Wine and cheese, matched properly',
      intro: 'Three wines chosen specifically to complement different cheese styles — showing that "red wine with cheese" is often the wrong default.',
      wines: [
        {
          order: 1, name: 'Chablis', type: 'White', region: 'Burgundy, France', servingTemp: '10°C',
          why: 'High acidity cuts through the creaminess of soft cheeses far better than most reds would.',
          foods: ['brie', 'camembert', 'fresh goat cheese'],
          tasting_prompts: ['Notice how the acidity refreshes your palate after the creamy cheese.', 'Does the pairing make the wine taste fruitier than on its own?', 'Try the cheese alone, then with wine — what changes?']
        },
        {
          order: 2, name: 'Off-dry Riesling', type: 'White', region: 'Alsace, France', servingTemp: '9°C',
          why: 'A touch of sweetness balances salty, tangy cheeses beautifully — a pairing many people are surprised by.',
          foods: ['aged gouda', 'gruyère', 'manchego'],
          tasting_prompts: ['Does the wine taste less sweet when paired with the cheese?', 'Notice any nutty character in the cheese that the wine highlights.', 'How does the finish change with food versus without?']
        },
        {
          order: 3, name: 'Tawny Port', type: 'Fortified', region: 'Douro, Portugal', servingTemp: '14°C',
          why: 'The classic match for blue cheese — sweetness and richness stand up to the cheese\'s intensity rather than being overwhelmed.',
          foods: ['blue cheese', 'stilton', 'gorgonzola'],
          tasting_prompts: ['This is a much bigger, richer wine — notice the difference in weight.', 'Does the sweetness balance the saltiness of the blue cheese?', 'What nutty or dried-fruit notes come through?']
        }
      ],
      hostingTips: [
        'Let cheeses come to room temperature before serving — cold cheese mutes its flavour significantly.',
        'Serve wines in the order above; reds and fortified wines work best last, not first.',
        'Provide plain crackers between pairings, not flavoured ones, to avoid competing tastes.'
      ],
      foodPlan: 'Build the board around three cheese styles — one soft and creamy, one firm and aged, one blue — to match the three wines and clearly demonstrate the pairing principle.'
    }
  }
]

const DEFAULT_PLAN_EN = SAMPLE_PLANS_EN[3].plan // beginner-friendly as the safe fallback

/**
 * Lightweight matcher — scores each sample plan against the free-text inputs
 * and returns the best match. Not real AI, but feels responsive and relevant
 * for demo purposes. No network call, no cost.
 */
export function matchSamplePlan(inputs) {
  const haystack = [inputs.wines, inputs.foods, inputs.season, inputs.guests, inputs.notes]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (!haystack.trim()) return DEFAULT_PLAN_EN

  let best = null
  let bestScore = 0

  for (const sample of SAMPLE_PLANS_EN) {
    const score = sample.keywords.reduce((acc, kw) => acc + (haystack.includes(kw) ? 1 : 0), 0)
    if (score > bestScore) {
      bestScore = score
      best = sample.plan
    }
  }

  return best || DEFAULT_PLAN_EN
}
