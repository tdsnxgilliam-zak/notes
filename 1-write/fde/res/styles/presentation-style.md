# Style guide: "Tactical minimal" exec deck (TD SYNNEX)
Source: *FDE First Project – Opportunity Areas* (Oct 2026)

## 1. Design principles
- **Light mode, lots of white space.** The slide should feel like a clean technical drawing, not a marketing slide.
- **Thin lines, not heavy shapes.** Use hairline rules, thin outlined boxes and small "+" marks, inspired by the graphic design of the game *Marathon*.
- **Only simple shapes for imagery.** No photos, clip art, icons, gradients or drop shadows. Use circles, crosshairs, grids, brackets and arrows.
- **Executive density.** One main point per slide. Headlines state the point. Put the detail in the speaker notes.
- **Every visual is an editable native shape.** Never use pasted images of diagrams.
- **Show unknowns honestly.** Use visible placeholders (`[__%]`, `[ TBD ]`, `SCOPE: TBD`). Never invent numbers.

## 2. Canvas
- 16:9, 13.333" × 7.5".
- Background: solid **#F5F7F7** on every slide.
- Content margin: **0.8"** left and right, so the content width is **11.73"** (0.8" → 12.53").
- Corner marks sit 0.5" from the slide edges.

## 3. Colour palette
| Role | Hex | Use |
|---|---|---|
| Teal (primary) | `#005758` | Micro-labels, big numbers, card outlines, crosshairs, rules, "Defined" fill |
| Cyan (accent) | `#08BED5` | **Sparingly:** the "current / focus" highlight, one crosshair per card, the active node. **Never use it for text** (contrast on light backgrounds is too low). |
| Deep dark | `#002525` | Headlines and body text |
| Slate grey | `#5B6B6B` | Secondary text, metadata, footer, "Concept" outline |
| Mid grey | `#6B7B7B` | Secondary hairlines and marks |
| Hairline grey | `#D5DCDC` | Dividers, future or inactive track lines |
| Surface | `#F5F7F7` | Slide background, tag fill, subordinate panels |
| White | `#FFFFFF` | Card fill; text on teal fills |

**Accent budget:** no more than 1–3 cyan elements per slide. About 80% of each slide should be teal, dark and grey.

## 4. Typography
| Element | Font | Size | Colour | Notes |
|---|---|---|---|---|
| Cover title | Segoe UI Semibold | 44 pt | #002525 | Two lines allowed |
| Cover subtitle | Segoe UI Semibold | 32 pt | #005758 | |
| Slide headline | Segoe UI Semibold | 28 pt | #002525 | Sentence case, states the takeaway, one line |
| Closing / decision statement | Segoe UI Semibold | 36 pt | #002525 | |
| Card / column title | Segoe UI Semibold | 18–20 pt | #002525 | |
| Body | Segoe UI | 14–16 pt | #002525 | Short phrases, not paragraphs |
| Secondary body | Segoe UI | 14 pt | #5B6B6B | |
| Micro-label | Consolas **Bold**, ALL CAPS | 12 pt | #005758 | Letter spacing +1 to +1.5 pt |
| Metadata / footer | Consolas | 12 pt | #5B6B6B | Letter spacing +1 pt |
| Index number (01, 02, 03) | Consolas Bold | 32 pt | #005758 | |
| Hero metric | Consolas Bold | 54–66 pt | #005758 | e.g., 539, 146, [__%] |

- Never use cyan for text. Never go below 12 pt.
- Use `//` as the separator in all micro-labels.

## 5. Slide frame (on every slide)
1. **Corner "+" marks:** four thin crosses, one in each corner, 0.5" in from the edges. Each arm is 0.2" long and 0.5 pt thick, in #005758.
2. **Top-left index label:** `FDE // 03` (deck code `//` two-digit slide number), Consolas, top at y = 0.45".
3. **Top-right reference label:** `SYS.REF FDE-01`, Consolas, right-aligned.
4. **Header rule:** a 0.5 pt teal line across the content width at y = 0.85", with a heavier **0.4" × 1.5 pt** teal segment at its left end.
5. **Section micro-label:** at y = 0.95", e.g. `00 // APPROACH`, `01 // OPERATIONAL EFFICIENCY`, `NEXT // OPEN QUESTIONS & STEPS`.
6. **Headline:** at y = 1.25", height about 0.65".
7. **Content zone:** y ≈ 2.05" to 6.35".
8. **Footer rule:** 0.5 pt teal line across the content width at y = 6.6".
9. **Footer text (left):** `TD SYNNEX | Intelligence & Insights | Draft for discussion`, Consolas 12 pt, slate grey.
10. **Page counter (right):** `04 / 10`, Consolas, right-aligned.

## 6. Components
**Outlined card**
- White fill, **0.75 pt #005758** outline, square corners, no shadow.
- Inner padding about 0.25".
- Order inside: index number (Consolas 32 pt) → title → one-line description → hairline divider → micro-label (`EXAMPLE USE CASES`) → list.
- Put one small **cyan "+"** (0.2", 1 pt) in the card's top-right corner.

**Tag / chip** (e.g., `THE SAFE ROUTE`, `EXAMPLE // FALLBACK`, `INITIAL VIEW — TO VALIDATE`)
- #F5F7F7 fill, 0.75 pt teal outline, Consolas Bold 12 pt teal, centred.
- Place it at the top right, level with the headline.
- If you need two tags, stack them so they touch and read as one unit.

**Status chips** (use qualitative labels only, never scores)
- `DEFINED`: teal fill, white text.
- `PARTIALLY DEFINED`: white fill, teal outline, teal text.
- `CONCEPT`: #F5F7F7 fill, slate-grey (#5B6B6B) outline, slate text.

**Progress path / timeline**
- A horizontal track: **1.5 pt teal** for completed segments and **0.75 pt #D5DCDC** for future ones.
- Each step is a thin "+" node.
- The current step is a **0.5" square with a 1 pt cyan outline and a cyan crosshair**, with a `TODAY'S SESSION` micro-label above it.
- Under each node: a micro-label (`STEP 02 // NOW`) and a two-line title.

**Process flow**
- Outlined boxes joined by small thin arrows (about 0.4" × 0.25").
- Highlight the focus box with a cyan outline and a cyan "+". All other boxes use teal outlines.

**Subordinate lane** (fallback, aside, caveat)
- A full-width #F5F7F7 panel with a grey outline.
- A boxed micro-label on the left (`FALLBACK`), a thin vertical divider, then one line of slate-grey text.

**Contrast pair** (Focus on / Less on)
- Two columns separated by a thin vertical hairline.
- Micro-label header on each column, one line of body text under it.

**Hero metric panel**
- Micro-label (`BSIC // SALES SUPPORT`) → big Consolas number → slate caption → hairline → `COVERS` label → list.

**Matrix / table**
- No filled header row and no vertical grid lines.
- Micro-label column headers, then **0.5 pt #D5DCDC** horizontal rules between rows.
- Add a slate footnote under the last rule stating the basis ("Initial discovery notes only… No scoring.").

**Bracket frame**
- Highlight a diagram area with four L-shaped corner brackets (0.25" arms, 0.5 pt teal) instead of a full box.

**Decision / option list**
- Rows with a small square checkbox, a Consolas index (`01`) and a label.
- End with a result line such as `PROBLEM: [ TBD — from intake ]`.

## 7. Cover slide
- **Left:**
  - micro-label (`INITIAL DISCOVERY // CANDIDATE IDEAS`)
  - 44 pt title over two lines
  - 32 pt teal subtitle
  - one line of context in slate grey
  - a short 2" teal rule
  - a three-line Consolas metadata block: `NAME // TITLE`, `TEAM // TD SYNNEX`, `MONTH YEAR // DRAFT FOR DISCUSSION`
- **Right:** a "target" graphic:
  - a 2.5" circle, with thin horizontal and vertical lines through its centre
  - a 4 × 4 grid of small "+" marks spaced 1" apart
  - a cyan crosshair at the centre
  - a Consolas caption below (`TGT // FIRST PROJECT: TBD`)

## 8. Labelling conventions
- Section: `NN // SECTION NAME`. Use `00` for framing slides; areas are `01`, `02`, `03`.
- Items: `Q.01` (questions), `S.01 // OWNER: TBD` (steps), `UC.01` (use cases), `AGT.01 // ROLE`, `STEP 01 // COMPLETE`.
- Status words: `NOW`, `NEXT`, `THEN`, `COMPLETE`, `FOCUS`, `TBD`.
- Placeholders always appear in brackets: `[__%]`, `[ TBD ]`.

## 9. Writing style
- Headlines are takeaways in sentence case, e.g. "Start with the problem, not the solution" or "Area 01 is most defined today".
- At most 3–5 short lines of body text per block. No full paragraphs on the slide.
- Speaker notes on every slide hold the full reasoning and source detail.
- Use only facts from the source material. Mark anything inferred as "Initial view — to validate".

## 10. Standard storyline (executive decision deck)
1. Cover
2. Context: purpose, today's session, progress path
3. Approach or principle
4. Overview: three outlined columns
5–7. One deep-dive slide per area
8. Readiness or comparison matrix
9. Open questions and next steps
10. Decision requested

## 11. Don'ts
- No dark backgrounds, gradients, shadows, rounded corners, stock photos or emoji.
- No cyan text, and no more than about three cyan accents per slide.
- No line thicker than 1.5 pt (the heavy rule segment and completed track). Hairlines are 0.5–0.75 pt.
- No invented numbers, scores or timelines.
- Don't let tags overlap headlines. Leave at least 0.2" clearance.

## 12. QA checklist
- [ ] Corner marks, index label, header rule, footer and page counter are present and the numbering is correct
- [ ] No text overflows its box; no shapes overlap
- [ ] The cyan accent budget is respected
- [ ] Fonts are only Segoe UI / Segoe UI Semibold / Consolas
- [ ] Every slide has speaker notes
- [ ] All unknowns appear as bracketed placeholders