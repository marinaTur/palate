// Regions module data — 26 wine regions, each anchored to a signature grape.
// Selection system: Grape-First (verified against OIV/Anderson data), organized
// Old World / New World, with a 3-tier suggested-order curriculum layered on top.
// Tiers are a suggestion, never a gate — every region is tappable at any time,
// matching this app's "no judgment, no gating" principle (see Wheel, Nose).
//
// Every fact below was verified against multiple independent sources during
// planning (see the standalone content-plan document for the full source list
// per region). Sources are intentionally not surfaced in the UI — same
// decision already made for Nose Training's WSET/CMS backing.
//
// compareTo: id of another region with a genuinely earned connection (shared
// grape, shared history, or a direct myth-bust). Left null rather than forced
// wherever no real connection exists — about half the regions stand alone.

export const REGIONS = [
  // ── OLD WORLD — TIER 1 ──────────────────────────────────────────
  {
    id: 'bordeaux', name: 'Bordeaux', country: 'France', world: 'old', tier: 1,
    grapes: 'Cabernet Sauvignon-led blends (Left Bank) or Merlot-led (Right Bank)',
    style: 'Left Bank: firm tannins, built to age. Right Bank: plusher, approachable younger.',
    onLabel: ['Médoc', 'Pauillac', 'Margaux', 'Saint-Émilion', 'Pomerol'],
    story: 'Bordeaux spent nearly 300 years under English rule, after Eleanor of Aquitaine married the future King Henry II in 1152. That single marriage is the entire reason the word "claret" exists in English, and why Bordeaux built such a deep trading relationship with Britain specifically.',
    compareTo: 'napa', compareNote: 'A real historical event connects them directly — see Napa.',
  },
  {
    id: 'burgundy', name: 'Burgundy', country: 'France', world: 'old', tier: 1,
    grapes: 'Just two: Pinot Noir (red) and Chardonnay (white)',
    style: 'Obsessively terroir-driven — the same grape from plots meters apart can taste completely different.',
    onLabel: ['Chablis', 'Meursault', 'Gevrey-Chambertin', 'Vosne-Romanée'],
    story: 'This is the literal birthplace of the word "terroir." Burgundy\u2019s mosaic of 1,000+ named vineyard plots (climats) is UNESCO World Heritage-listed. The most extreme example: Romanée-Conti, routinely called the world\u2019s most expensive wine, comes from a single vineyard just 1.8 hectares \u2014 smaller than two soccer pitches \u2014 producing under 500 cases a year.',
    compareTo: null,
  },
  {
    id: 'napa', name: 'Napa Valley', country: 'USA', world: 'new', tier: 1,
    grapes: 'Cabernet Sauvignon-led',
    style: 'Riper and more fruit-forward than Bordeaux, though styles have diversified hugely since the 1970s.',
    onLabel: ['Rutherford', 'Oakville', 'Stags Leap District'],
    story: 'In 1976, at a blind tasting in Paris now called the Judgment of Paris, nine French judges rated a 1973 Napa Cabernet (Stag\u2019s Leap Wine Cellars) and a 1973 Napa Chardonnay (Chateau Montelena) above France\u2019s own top Bordeaux and Burgundy \u2014 with vines that, in one case, were only three years old. It stunned the wine world overnight; both winning bottles now sit in the Smithsonian.',
    compareTo: 'bordeaux', compareNote: 'The strongest pairing here \u2014 a real historical event ties them together.',
  },
  {
    id: 'chianti', name: 'Chianti', country: 'Italy', world: 'old', tier: 1,
    grapes: 'Sangiovese-dominant',
    style: 'High acidity, cherry-forward, built for food \u2014 especially tomato-based dishes.',
    onLabel: ['Chianti Classico', 'the black rooster (Gallo Nero) seal'],
    story: 'In 1716, Chianti became the world\u2019s first legally defined wine region \u2014 predating Bordeaux\u2019s famous 1855 classification by nearly 140 years. And the straw-wrapped "fiasco" bottle many people picture wasn\u2019t about branding \u2014 the straw was cheap packaging that let round-bottomed bottles stand up and survive shipping.',
    compareTo: 'abruzzo', compareNote: 'A myth-bust connects them \u2014 see Abruzzo\u2019s entry.',
  },
  {
    id: 'rioja', name: 'Rioja', country: 'Spain', world: 'old', tier: 1,
    grapes: 'Tempranillo-dominant, often blended with Garnacha',
    style: 'The aging classification tells you the style before you open it: Crianza (youngest) \u2192 Reserva \u2192 Gran Reserva (oldest, most savory).',
    onLabel: ['Crianza', 'Reserva', 'Gran Reserva', 'Rioja Alta', 'Rioja Alavesa'],
    story: 'Rioja\u2019s classic vanilla-and-coconut character actually comes from American oak, not French \u2014 even though barrel-aging itself was a technique borrowed from a trip to Bordeaux. When phylloxera devastated Bordeaux\u2019s vineyards in the 1860s, French winemakers relocated across the Pyrenees into Rioja, helping cement the practice.',
    compareTo: null,
  },
  {
    id: 'champagne', name: 'Champagne', country: 'France', world: 'old', tier: 1,
    grapes: 'Chardonnay, Pinot Noir, Pinot Meunier',
    style: 'Traditional-method sparkling \u2014 legally, only this region can use the name.',
    onLabel: ['Brut', 'Extra Brut', 'Demi-Sec', 'Blanc de Blancs', 'Blanc de Noirs'],
    story: 'The famous tale that a monk named Dom Pérignon "invented" champagne, exclaiming "I am drinking the stars!", is almost certainly false \u2014 that quote doesn\u2019t appear anywhere until a 19th-century advertisement, roughly two centuries after he died. Historians believe he actually spent much of his career trying to get rid of bubbles, which were considered a wine fault at the time.',
    compareTo: 'valdobbiadene', compareNote: 'Same broad category, opposite winemaking philosophy \u2014 see Conegliano Valdobbiadene.',
  },
  {
    id: 'valdobbiadene', name: 'Conegliano Valdobbiadene', country: 'Italy', world: 'old', tier: 1,
    grapes: 'Glera \u2014 the grape behind Prosecco',
    style: 'Fresh, fruity sparkling wine \u2014 white peach, golden apple, pear, acacia blossom.',
    onLabel: ['Prosecco Superiore DOCG', 'Cartizze (the top subzone)'],
    story: 'The grape used to simply be called "Prosecco" too \u2014 until 2009, when this zone was elevated to DOCG status and Italian authorities officially renamed the grape "Glera," deliberately separating the grape\u2019s name from the wine\u2019s name, to protect "Prosecco" as a place-based name the same way Champagne protects its own.',
    compareTo: 'champagne', compareNote: 'Made by the tank (Charmat) method, prioritizing fresh fruit over Champagne\u2019s toasty character \u2014 same category, opposite philosophy.',
  },
  {
    id: 'cotes-du-rhone', name: 'Côtes du Rhône', country: 'France', world: 'old', tier: 1,
    grapes: 'Grenache-led blend with Syrah and Mourvèdre (the "GSM" trio)',
    style: 'Warm, generous red blends \u2014 reds make up roughly 80% of production.',
    onLabel: ['Côtes du Rhône', 'Côtes du Rhône Villages', 'Gigondas', 'Châteauneuf-du-Pape'],
    story: 'The "13 permitted varieties" figure for Châteauneuf-du-Pape that every wine guide quotes actually changed to 18 back in 2019 \u2014 most casual drinkers, and a fair number of wine lists, haven\u2019t caught up. This region is also why Grenache and Mourvèdre get their own entry at all, having previously only been supporting players in other regions\u2019 blends.',
    compareTo: null,
  },
  {
    id: 'marlborough', name: 'Marlborough', country: 'New Zealand', world: 'new', tier: 1,
    grapes: 'Sauvignon Blanc (roughly 80% of regional plantings)',
    style: 'Intensely aromatic \u2014 passionfruit, gooseberry, fresh-cut grass.',
    onLabel: ['Marlborough alone functions almost like a style guarantee'],
    story: 'The region\u2019s first commercial vines weren\u2019t planted until 1973, and it only became internationally famous after one wine: Cloudy Bay\u2019s 1985 debut. Winemaker David Hohnen called the reaction to its intensity "the eyebrow factor" \u2014 watching people\u2019s eyebrows involuntarily lift the second they put their nose in the glass.',
    compareTo: null,
  },
  {
    id: 'mendoza', name: 'Mendoza', country: 'Argentina', world: 'new', tier: 1,
    grapes: 'Malbec',
    style: 'Bold and dark-fruited, with a distinct high-altitude freshness.',
    onLabel: ['Luján de Cuyo', 'Uco Valley'],
    story: 'Malbec is originally French, from Cahors and Bordeaux \u2014 but never became a defining variety there. In Mendoza\u2019s high-altitude vineyards (many over 1,000m), it found a second home where it thrives more than it ever did back home. April 17th is now celebrated globally as Malbec World Day.',
    compareTo: 'cahors', compareNote: 'Same grape, original home vs. adopted one \u2014 with a genuinely surprising twist.',
  },

  // ── OLD WORLD — TIER 2 ──────────────────────────────────────────
  {
    id: 'mosel', name: 'Mosel', country: 'Germany', world: 'old', tier: 2,
    grapes: 'Riesling (roughly 62% of plantings)',
    style: 'Ranges bone-dry to lusciously sweet, always defined by vibrant acidity and a mineral edge from slate soil.',
    onLabel: ['Kabinett', 'Spätlese', 'Auslese'],
    story: 'Mosel has some of the steepest vineyards on Earth \u2014 the Bremmer Calmont, at up to a 68% gradient, is widely cited as Europe\u2019s steepest. Harvesting requires monorail lifts, ropes, or climbing harnesses; tractors simply can\u2019t go there.',
    compareTo: 'wachau', compareNote: 'Same grape, opposite outcome \u2014 see Wachau.',
  },
  {
    id: 'wachau', name: 'Wachau', country: 'Austria', world: 'old', tier: 2,
    grapes: 'Riesling and Grüner Veltliner',
    style: 'Dry, riper, and fuller-bodied than German Riesling \u2014 closer in weight to Alsace than to the Mosel.',
    onLabel: ['Steinfeder (lightest)', 'Federspiel (medium)', 'Smaragd (richest)'],
    story: 'Those tier names are wonderfully strange once you know them: Steinfeder is a feathery wild grass on the terraces, Federspiel a falconry term, and Smaragd ("emerald") is named after the bright green lizard that suns itself on the vineyard walls.',
    compareTo: 'mosel', compareNote: 'German Mosel Riesling tends delicate and sometimes sweet; Austrian Wachau is typically bone-dry and richer \u2014 same grape, opposite result.',
  },
  {
    id: 'puglia', name: 'Puglia', country: 'Italy', world: 'old', tier: 2,
    grapes: 'Primitivo',
    style: 'Ripe, jammy, dark-fruited, often higher in alcohol.',
    onLabel: ['Primitivo di Manduria'],
    story: 'For decades nobody knew where Primitivo came from. In December 2001, DNA testing proved it\u2019s genetically identical to Zinfandel \u2014 California\u2019s self-proclaimed "own" grape \u2014 and to a nearly-extinct Croatian vine. Same grape, three countries, three names, each convinced it was uniquely theirs.',
    compareTo: 'lodi', compareNote: 'The New World half of the exact same grape \u2014 one of the best-documented DNA mysteries in wine.',
  },
  {
    id: 'lodi', name: 'Lodi', country: 'USA', world: 'new', tier: 2,
    grapes: 'Zinfandel',
    style: 'Rich, jammy, dark-fruited \u2014 sturdier and far less sweet than "White Zinfandel."',
    onLabel: ['Old Vine Zinfandel', 'Mokelumne River'],
    story: 'Lodi grows over 40% of California\u2019s premium Zinfandel, much from vines planted before 1900 that survived Prohibition. Its sandy soils naturally resist phylloxera, letting some vines keep growing on their own roots for over 120 years. In October 2025, the city formally declared itself the "Zinfandel Capital of the World."',
    compareTo: 'puglia', compareNote: 'Same grape, different name, different continent.',
  },
  {
    id: 'barossa', name: 'Barossa Valley', country: 'Australia', world: 'new', tier: 2,
    grapes: 'Shiraz-dominant',
    style: 'Powerful, full-bodied, ripe dark fruit.',
    onLabel: ['"Old Vine" language on premium bottlings'],
    story: 'Barossa holds some of the oldest continuously producing Shiraz vines on Earth (some planted in the 1840s) \u2014 because it has never been touched by phylloxera, the louse that destroyed nearly every old vineyard in Europe, including the original Rhône vines these were cut from in 1832.',
    compareTo: null,
  },
  {
    id: 'maipo', name: 'Maipo Valley', country: 'Chile', world: 'new', tier: 2,
    grapes: 'Carmenère and Cabernet Sauvignon',
    style: 'Structured reds; Carmenère shows dark fruit, herbs, and a distinctive green-peppercorn spice note.',
    onLabel: ['Carmenère', 'Maipo Valley'],
    story: 'Carmenère is one of Bordeaux\u2019s own six red grapes \u2014 wiped out there by phylloxera and believed extinct for over a century. It had secretly survived in Chile the whole time, planted as "Merlot," until a French ampelographer noticed the vines\u2019 twisted stamens in 1994. Chile now holds over 90% of the world\u2019s Carmenère.',
    compareTo: 'chinon', compareNote: 'Carménère is a genetic offspring of Cabernet Franc, already covered via Chinon.',
  },
  {
    id: 'stellenbosch', name: 'Stellenbosch', country: 'South Africa', world: 'new', tier: 2,
    grapes: 'Cabernet Sauvignon leads; Chenin Blanc and Pinotage close behind',
    style: 'Structured reds; Chenin ranges from crisp to richly oaked.',
    onLabel: ['Stellenbosch', 'Pinotage'],
    story: 'Pinotage isn\u2019t a naturally occurring grape \u2014 it was deliberately bred in 1924\u201325 by Abraham Izak Perold, Stellenbosch University\u2019s first professor of viticulture, crossing Pinot Noir with Cinsault. It\u2019s the only wine grape South Africa can claim as genuinely its own.',
    compareTo: null,
  },
  {
    id: 'alsace', name: 'Alsace', country: 'France', world: 'old', tier: 2,
    grapes: 'Gewürztraminer and Pinot Gris',
    style: 'Gewürztraminer: intensely aromatic, lychee and rose. Pinot Gris here: rich and full-bodied, often just off-dry.',
    onLabel: ['Alsace Grand Cru', 'Vendanges Tardives'],
    story: 'Gewürztraminer is named for Tramin, a village in northern Italy, yet Alsace holds over a quarter of the world\u2019s plantings. Pinot Gris tells a stranger story: it\u2019s the exact same grape as Italy\u2019s Pinot Grigio \u2014 not a cousin, genetically identical \u2014 tasting almost nothing alike purely because of harvest timing and winemaking choice.',
    compareTo: null,
  },
  {
    id: 'asti', name: 'Asti', country: 'Italy', world: 'old', tier: 2,
    grapes: 'Muscat Blanc à Petits Grains and Barbera',
    style: 'Muscat: light, gently sparkling, sweet. Barbera: dry, high-acid, food-friendly red.',
    onLabel: ['Moscato d\u2019Asti', 'Barbera d\u2019Asti DOCG', 'Nizza'],
    story: 'Muscat may be the oldest domesticated wine grape family on Earth, tracing to ancient Egypt and Persia. Barbera\u2019s story is the opposite: dismissed for centuries as Piedmont\u2019s everyday wine in Nebbiolo\u2019s shadow, until Giacomo Bologna proved in the 1960s-70s it could be genuinely serious.',
    compareTo: null,
  },

  // ── OLD WORLD — TIER 3 ──────────────────────────────────────────
  {
    id: 'cahors', name: 'Cahors', country: 'France', world: 'old', tier: 3,
    grapes: 'Malbec (locally Côt), often blended with Merlot or Tannat',
    style: 'Deep, dense, and tannic \u2014 historically nicknamed "the Black Wine."',
    onLabel: ['Cahors AOC (minimum 70% Malbec)'],
    story: 'Long before Argentina, this was Malbec\u2019s home. By the 12th century, "the black wine of Cahors" was famous enough to be served at Eleanor of Aquitaine\u2019s 1152 wedding \u2014 the very same wedding that shaped Bordeaux\u2019s own story. Peter the Great later loved it so much he ordered it used as Russian Orthodox communion wine.',
    compareTo: 'mendoza', compareNote: 'Same grape, original home vs. adopted one.',
  },
  {
    id: 'vinho-verde', name: 'Vinho Verde', country: 'Portugal', world: 'old', tier: 3,
    grapes: 'Loureiro, traditionally blended with Alvarinho, Arinto, and Trajadura',
    style: 'High acidity, low alcohol, a light natural spritz.',
    onLabel: ['Vinho Verde DOC', 'Alvarinho'],
    story: 'Alvarinho is the exact same grape as Albariño, grown just across the border in Spain \u2014 same vine, two names, one river valley straddling the frontier. Vinho Verde was officially demarcated in 1908, one of the oldest defined wine regions anywhere.',
    compareTo: null,
  },
  {
    id: 'burgenland', name: 'Burgenland', country: 'Austria', world: 'old', tier: 3,
    grapes: 'Zweigelt (Austria\u2019s most-planted red grape)',
    style: 'Deeply colored, bright cherry and raspberry fruit, soft tannins.',
    onLabel: ['Neusiedlersee'],
    story: 'Zweigelt\u2019s two parent grapes each had a weakness \u2014 one feared frost, the other feared rain. The 1922 cross solved both. Its name has its own mystery too: originally called "Rotburger," it caused decades of confusion with an unrelated German grape called "Rotberger," not resolved until the 1970s.',
    compareTo: null,
  },
  {
    id: 'chinon', name: 'Chinon', country: 'France', world: 'old', tier: 3,
    grapes: 'Cabernet Franc, unblended',
    style: 'Cool-climate and elegant \u2014 red pepper, raspberry, violet.',
    onLabel: ['Chinon AOC', '"Breton" (local nickname)'],
    story: 'Most people assume Cabernet Sauvignon came first. It\u2019s the opposite \u2014 DNA confirmed in 1997 that Cabernet Franc is one of Cabernet Sauvignon\u2019s actual parents, and it\u2019s also a parent of Merlot and Carménère. This one grape is the ancestor behind Bordeaux, Napa, and Maipo Valley all at once.',
    compareTo: 'bordeaux', compareNote: 'Genetic ancestor of Bordeaux\u2019s Cabernet Sauvignon and Merlot, and of Maipo Valley\u2019s Carménère.',
  },
  {
    id: 'cognac', name: 'Cognac', country: 'France', world: 'old', tier: 3,
    grapes: 'Ugni Blanc (called Trebbiano in Italy)',
    style: 'Deliberately neutral, high-acid, low-alcohol \u2014 built to be distilled, not enjoyed as still wine.',
    onLabel: ['Rarely appears on a wine label at all'],
    story: 'This may be the most planted grape almost nobody who drinks wine has heard of \u2014 it\u2019s actually France\u2019s single most-planted grape, ahead of Chardonnay, yet 95%+ of it becomes brandy, never bottled wine.',
    compareTo: null,
  },
  {
    id: 'abruzzo', name: 'Abruzzo', country: 'Italy', world: 'old', tier: 3,
    grapes: 'Montepulciano',
    style: 'Deep-colored, robust, high in acidity and tannin.',
    onLabel: ['Montepulciano d\u2019Abruzzo DOC', 'Cerasuolo d\u2019Abruzzo'],
    story: 'A genuinely useful trap to know: this grape has essentially nothing to do with the Tuscan town of Montepulciano. That town\u2019s own famous wine, Vino Nobile di Montepulciano, is actually made from Sangiovese \u2014 the same grape as Chianti. Same name, two completely unrelated wines.',
    compareTo: 'chianti', compareNote: 'The town people confuse this grape with makes a wine from Chianti\u2019s own grape, not this one.',
  },
  {
    id: 'priorat', name: 'Priorat', country: 'Spain', world: 'old', tier: 3,
    grapes: 'Carignan (locally Cariñena), typically blended with Grenache (locally Garnacha)',
    style: 'Concentrated, dark-fruited, mineral-driven.',
    onLabel: ['Priorat DOQa', 'Montsant'],
    story: 'For most of the 20th century, Carignan was the most-planted grape in both France\u2019s Languedoc and, remarkably, California \u2014 almost entirely for cheap bulk wine. Old, low-yield vines in Priorat\u2019s slate soils tell a completely different story: some of Spain\u2019s most sought-after reds.',
    compareTo: null,
  },
  {
    id: 'tuscany-white', name: 'Tuscany (white)', country: 'Italy', world: 'old', tier: 3,
    grapes: 'Trebbiano Toscano — the same grape as France’s Ugni Blanc',
    style: 'Light, simple, high-acid, made for immediate drinking — honestly more everyday table wine than a prestige style.',
    onLabel: ['Bianco di Pitigliano DOC', 'Montecarlo Bianco DOC', 'Vin Santo del Chianti DOC'],
    story: 'For most of the 20th century, this grape was quietly blended into red Chianti itself — up to 10%, a required part of the legal recipe. Since 1996, Chianti Classico DOCG has required 100% Sangiovese, banning Trebbiano from the blend entirely. In France, the same grape becomes Ugni Blanc, the deliberately neutral base wine behind Cognac.',
    compareTo: null,
  },
]

export const WORLD_LABEL = { old: 'Old World', new: 'New World' }
export const TIER_LABEL = {
  1: 'Meet these first',
  2: 'Once the basics feel solid',
  3: 'Deeper cuts',
}
export const REGION_KEYS = REGIONS.map(r => `region-${r.id}`)
