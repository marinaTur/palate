// First Bottle Guide module data — one flight, four wine types.
// Selection principle: pick the single most beginner-forgiving example per
// type (light tannin, minimal oak/skin contact, tank-method fizz, lower-ABV
// end of fortified) rather than the most famous or most expensive example —
// same "accessible over prestigious" reasoning as the rest of this module.
//
// order: the sourced light-to-rich tasting sequence (sparkling/white first,
// fortified last, since its intensity and alcohol flatten the palate for
// anything lighter tasted afterward). Informational only — the array itself
// is already in this order, which is why the UI's glass row reads
// sparkling → white → red → fortified left to right without any extra logic.
//
// pairing.mode: 'complement' (matching intensity/flavour) or 'contrast'
// (opposing qualities balancing each other) — the one shared principle
// every pairing hint below is an example of.

export const WINE_TYPES = [
  {
    id: 'sparkling',
    order: 1,
    name: 'Sparkling',
    pick: 'Prosecco or Cava',
    pickNote: 'Tank-method (Charmat) fizz — fresher and more fruit-forward than Champagne’s bread/nutty character, and a gentler first bubbly.',
    feel: {
      heading: 'Feel for: the mousse, not just the fruit',
      body: 'Two things don’t exist in still wine: the bubbles themselves (how fine, how long they last) and a sweetness level chosen after fermentation is already done. Watch the bead in the glass before you even taste — fine, persistent bubbles usually mean a better-made wine.',
    },
    servingTempC: '6–8°C',
    servingNote: 'Straight from the fridge. Too warm and the bubbles blow off fast — you lose the mousse within minutes.',
    pairing: {
      food: 'Cured ham, fried food, or a mixed appetizer spread',
      mode: 'contrast',
      why: 'The carbonation and acidity physically cut through salt and fat, resetting your palate between bites rather than adding more richness.',
    },
  },
  {
    id: 'white',
    order: 2,
    name: 'White',
    pick: 'Pinot Grigio or an off-dry Riesling',
    pickNote: 'Little to no oak or skin contact — keeps the acidity lesson clean, without a tannic edge confusing the picture.',
    feel: {
      heading: 'Feel for: brightness, not grip',
      body: 'You’re checking a different thing than you will with the red — not a weaker version of the same check. Notice the mouth-watering, tongue-tingling sensation on the sides of your tongue. That’s acidity, and it’s the backbone of every white wine’s freshness.',
    },
    servingTempC: '7–10°C',
    servingNote: 'Chilled, but not icy — too cold mutes the aroma before you even get a chance to notice it.',
    pairing: {
      food: 'Light seafood, or a spicy dish if your Riesling is off-dry',
      mode: 'complement / contrast',
      why: 'A dry, delicate white complements delicate fish without overpowering it. An off-dry Riesling instead contrasts spice — its touch of sweetness cools the heat rather than matching it.',
    },
  },
  {
    id: 'red',
    order: 3,
    name: 'Red',
    pick: 'Pinot Noir',
    pickNote: 'The lightest-tannin red most sommeliers recommend starting with — easy to drink young, no big investment needed to try a good one.',
    feel: {
      heading: 'Feel for: grip, not bitterness',
      body: 'Tannin is a drying, gripping sensation on your gums and the inside of your cheeks — like strong black tea — not a bitter taste. Take a sip, let it sit a second, then notice your cheeks. Pinot Noir’s tannin is gentle, so this is the easiest place to first learn to recognise the feeling.',
    },
    servingTempC: '16–18°C',
    servingNote: 'Cellar-cool, not literal room temperature — most people serve red wine too warm, which makes the alcohol stand out more than the fruit.',
    pairing: {
      food: 'Salmon or roast chicken',
      mode: 'complement',
      why: 'Low tannin and bright acidity mean it won’t overpower a delicate protein, and its earthy notes echo umami-rich sides like mushrooms.',
    },
  },
  {
    id: 'fortified',
    order: 4,
    name: 'Fortified',
    pick: 'A dry Fino or Amontillado Sherry',
    pickNote: 'Lower-ABV end of the category (~15–17%, vs. up to 22% for Port), sold in normal wine bottles, and the clearest single new concept to taste: biological (Fino) vs. oxidative (Amontillado) aging.',
    feel: {
      heading: 'Feel for: oxidative character and alcohol warmth',
      body: 'This is the one wine here made to taste of deliberate air exposure — nutty, bread-dough, sometimes caramelized notes that would be a flaw in any of the other three. At 15–17% alcohol (vs. ~12–13.5% for the rest), also notice real warmth on the finish — that’s worth registering, not ignoring.',
    },
    servingTempC: '12–15°C',
    servingNote: 'Warmer than the white, on purpose — over-chilling a delicate Fino mutes the same aromatics over-chilling would mute in any white. Pour smaller too: 60–90ml, not a full glass.',
    pairing: {
      food: 'Fino: olives, anchovies, cured ham, fried seafood. Amontillado: roast chicken, richer tapas.',
      mode: 'complement',
      why: 'Fino’s saline dryness echoes salty, briny food directly. Amontillado’s nutty, oxidative depth gives it enough weight for richer dishes without ever tipping sweet. The producers’ own rule of thumb: "if it flies, Amontillado."',
    },
  },
]

export const BOTTLE_KEYS = WINE_TYPES.map(w => `bottle-${w.id}`)
