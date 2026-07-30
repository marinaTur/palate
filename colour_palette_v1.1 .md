# Palette v1.1 — Implementation Brief

**Status:** Proposed — awaiting Marina's sign-off (design-system change, per CLAUDE.md safety rules).
**Scope:** Values only. Edit `src/index.css` `:root`. No call-site changes required.
**Supersedes:** the eyeballed values in PROJECT_MEMORY.md §5.
**Constraint honored:** must differ from Vivino (crimson-red on near-white/pink). This palette
keeps the forest-primary identity, which is the project's genuine point of differentiation.

---

## 1. Tokens

Existing token *names* are preserved so no `text-[var(--forest)]` call site changes. Values
change; new tokens are additive. Reference via Tailwind arbitrary values as today
(`bg-[var(--burgundy)]`), NOT via Tailwind theme config.

### Core

| Token             | Hex       | Role                        | Recommended use                                                        |
|-------------------|-----------|-----------------------------|------------------------------------------------------------------------|
| `--forest`        | `#264D3B` | Primary (unchanged)         | Hero gradient start, primary headings, active nav, icon strokes        |
| `--forest-deep`   | `#153025` | Primary shade               | Hero gradient *end* only — gives depth so CTA can recede against it    |
| `--forest-mid`    | `#3E6B54` | Primary tint (mid)          | Borders, dividers, inactive/disabled states, secondary icon strokes    |
| `--forest-tint`   | `#EAF0EC` | Primary surface             | Card/section fills on cream; selected-row background                   |
| `--burgundy`      | `#A02F49` | CTA / action (lifted)       | Primary buttons, key links, "Mark done" — small filled elements only   |
| `--burgundy-deep` | `#7A2038` | CTA shade (old primary hue) | Button pressed/hover, emphasis text on cream                           |
| `--burgundy-tint` | `#F7E9EC` | CTA surface                 | Highlighted callouts tied to an action; replaces old `--burgundy-light`|
| `--gold`          | `#B98A3D` | Decorative (fill only)      | Roman numerals, ornamental rules, dividers, icon accents — NEVER text  |
| `--gold-text`     | `#8A6420` | Text-safe gold              | Any gold-colored *text*: labels, cited-authority lines, small caps     |
| `--gold-tint`     | `#F5EDE0` | Decorative surface          | Warm section backgrounds; keeps the old hex, now unambiguously "gold"  |
| `--cream`         | `#F7F4EF` | Background (unchanged)      | App/page background                                                    |
| `--ink`           | `#1E1E1E` | Text (unchanged)            | Body copy, default text                                                |

### Semantic (new — no true red anywhere, by design)

| Token              | Hex       | Role               | Recommended use                                                       |
|--------------------|-----------|--------------------|-----------------------------------------------------------------------|
| `--attention`      | `#B4552A` | Problem / failure  | Network/API errors, demo-mode notice, "something went wrong"          |
| `--attention-tint` | `#FBEDE4` | Problem surface    | Background of the above notices                                       |
| `--milestone`      | `#8A6420` | Achievement / done | Completion notices, "module complete" — reuses gold-text, not green   |
| `--focus`          | `#3E6B54` | Keyboard focus     | Visible focus ring on all interactive elements (a11y)                 |

### Drop-in `:root`

    :root {
      --forest:#264D3B; --forest-deep:#153025; --forest-mid:#3E6B54; --forest-tint:#EAF0EC;
      --burgundy:#A02F49; --burgundy-deep:#7A2038; --burgundy-tint:#F7E9EC;
      --gold:#B98A3D; --gold-text:#8A6420; --gold-tint:#F5EDE0;
      --cream:#F7F4EF; --ink:#1E1E1E;
      --attention:#B4552A; --attention-tint:#FBEDE4; --milestone:#8A6420; --focus:#3E6B54;
    }

---

## 2. Why this is better

**1. The CTA now separates from the hero.**
Old burgundy `#7A2038` and forest `#264D3B` had ~1.06:1 contrast between them — a burgundy
button on a forest gradient card read as a tonal smudge, and was near-indistinguishable for
red-green color blindness (~8% of men). New burgundy `#A02F49` gives ~1.5:1 separation by
*lightness*, so the button reads as a button regardless of hue perception.

**2. Gold is now usable as text.**
Old gold `#B98A3D` on cream is ~2.8:1 — below WCAG AA body text (4.5:1) and below the large-text
floor (3:1). Any gold display text or cited-authority label was failing. `--gold-text` `#8A6420`
is ~4.9:1 (AA pass). `--gold` is retained strictly for decorative fills where contrast rules
don't apply.

**3. The `--gold-light` / `--burgundy-light` collision is resolved.**
Both were `#F5EDE0` — a documented Known Issue, and a symptom of having no tint ramp. Replaced by
a proper set: `--gold-tint` keeps `#F5EDE0` (correctly "gold"), `--burgundy-tint` becomes the
distinct `#F7E9EC`. Delete the old `--gold-light` / `--burgundy-light` tokens.

**4. A semantic layer now exists, and it fits the product doctrine.**
There were no error/success/focus tokens, and burgundy had annexed the "red" slot. The new
tokens avoid true red and true green on purpose: the app's stated UX principle is
"no wrong answers, no judgment." Failures use warm clay `--attention`; completion uses gold
`--milestone`. This is cheaper than adding a success-green *and* avoids a green that would fight
the forest primary for meaning.

**5. Identity and Vivino-differentiation are preserved.**
Forest primary is unchanged — the actual escape from Vivino's crimson-on-white. Cormorant +
Inter still fit. The one risk is that lifted burgundy `#A02F49` sits closer to Vivino's crimson;
this is mitigated *structurally* (burgundy stays a small filled element on a forest field, never
a page/card background on white — the opposite of Vivino's layout logic).

---

## 3. Do / Don't

- DO keep burgundy as a small filled accent on forest/cream — never a dominant background.
- DO use `--gold-text` for text and `--gold` for decoration; never swap them.
- DO add `--focus` rings to interactive elements while touching this file.
- DON'T introduce a true red or green feedback color — use `--attention` / `--milestone`.
- DON'T migrate these into Tailwind theme config; keep the CSS-var + arbitrary-value pattern.
- DON'T change typography or layout as part of this — values only.

---

## 4. Rollout

1. Replace `:root` block in `src/index.css` with §1's drop-in.
2. Grep for `--gold-light` and `--burgundy-light`; repoint to `--gold-tint` / `--burgundy-tint`.
3. Verify hero CTA, any gold text, and completion/error notices on: Home, Walkthrough, Nose, Wheel.
4. Add `--focus` outline to interactive elements if not already present.
5. No `persist` version bump needed (no store shape change).
6. Update PROJECT_MEMORY.md §5 and remove the two resolved items from CLAUDE.md Known Issues.

## Appendix — Legal / IP clearance (fonts & colour)

Summary: no font or colour in this palette is legally restricted for Palate's use.
General information only — not legal advice.

### Fonts

Typeface *designs* aren't copyrightable in the US; what matters is the license on the
font software file. Both project fonts are under the SIL Open Font License 1.1 (OFL),
which is OSI/FSF-approved and explicitly permits commercial use, web embedding, and
bundling in sold software.

| Font              | License      | Commercial use | App / web embedding | Cost |
|-------------------|--------------|----------------|---------------------|------|
| Inter             | SIL OFL 1.1  | Yes            | Yes                 | Free |
| Cormorant Garamond| SIL OFL 1.1  | Yes            | Yes                 | Free |

Two OFL compliance conditions to honor (both easy, both likely already met via
Google Fonts / npm):
1. Don't sell the font files on their own (embedding in the app is fine).
2. Ship the OFL license text with the font package, and don't rename the font to a
   "Reserved Font Name" in a modified/derivative version. "Inter" is a trademark of
   Rasmus Andersson — fine to *use* the font, just don't ship a modified fork still
   calling itself "Inter."

Action for the agent: confirm an `OFL.txt` / license notice accompanies the bundled
font assets (or that they're loaded via Google Fonts, which handles this). No fee,
no attribution-in-UI requirement.

### Colours

No hex value can be "owned" outright. A colour can only be a trademark when, in a
*specific* product/service category, consumers strongly associate that exact shade
with one brand ("secondary meaning") AND the colour isn't functional — the standard
from Qualitex Co. v. Jacobson (US, 1995). Protection is always narrow to an industry
(e.g. Owens-Corning pink covers fiberglass insulation only; T-Mobile magenta, UPS
brown, Tiffany blue, Louboutin's red shoe soles are the well-known examples).

Assessment of this palette:
- None of these hues is a known registered colour mark in the wine-education, app,
  or e-learning space.
- Forest green, burgundy, gold and cream are industry-generic wine cues (arguably
  "functional" for a wine context), which is the opposite of trademark-able — that's
  a point in our favour, not against.
- We are NOT near any famous mark: no magenta (T-Mobile), no robin's-egg blue
  (Tiffany), no red shoe-sole use, etc.

The one theoretical watch-item is Vivino itself: it uses a crimson-red as its brand
colour. But (a) Vivino's red is a different hue from our burgundy, (b) our forest-green
primary is the dominant brand colour, not the burgundy, and (c) colour-mark
infringement needs likelihood-of-consumer-confusion, which the whole palette is
deliberately designed to avoid. This is exactly why the brief keeps burgundy as a
small accent on a forest field rather than a red-on-white layout.

Action for the agent: none required. Colour choices are clear to use.

### Caveats
- This is general information, not legal advice; colour-mark law is fact-specific and
  varies by country (e.g. Russia, an active locale for this app, has its own rules).
- If Palate ever registers its OWN trademark or files for brand protection, get a
  proper clearance search from an IP attorney — that's a different exercise from
  "are we free to use these," which is what's answered here.


  