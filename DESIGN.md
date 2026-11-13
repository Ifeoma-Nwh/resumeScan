---
name: resumeScan
description: A calm, factual resume scoring tool.
colors:
  primary: "#047857"
  primary-hover: "#065f46"
  accent-focus: "#059669"
  positive: "#10b981"
  surface-page: "#f8fafc"
  surface-raised: "#ffffff"
  surface-muted: "#f1f5f9"
  border: "#e2e8f0"
  border-strong: "#cbd5e1"
  text-primary: "#0f172a"
  text-secondary: "#475569"
  text-muted: "#64748b"
  danger-surface: "#fff1f2"
  danger-border: "#fecdd3"
  danger-text: "#881337"
  danger: "#f43f5e"
  warning-surface: "#fffbeb"
  warning-border: "#fde68a"
  warning-text: "#78350f"
  warning: "#f59e0b"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.5
  micro:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface-raised}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  input-field:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "10px 14px"
  panel:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.xl}"
    padding: "24px"
  chip-missing-required:
    backgroundColor: "{colors.danger-surface}"
    textColor: "{colors.danger-text}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  chip-missing-preferred:
    backgroundColor: "{colors.warning-surface}"
    textColor: "{colors.warning-text}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  chip-matched:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
---

# Design System: resumeScan

## Overview

**Creative North Star: "The Calm Scorecard"**

resumeScan is a working tool, not a marketing surface. The system should feel like a precise scorecard laid on a clean desk: neutral slate surfaces, one green that means action or verification, and numbers that read at a glance. The mood is calm and factual. Nothing celebrates, nothing alarms unless the score itself is alarming.

Density is moderate. Panels hold generous inner padding, fields sit in a single readable column, and the results column repeats a steady rhythm of score, missing keywords, matched keywords, suggestions. Hierarchy comes from weight, color, and spacing rather than size or ornament. The only large element in the product is the score ring, and it earns that by being the answer.

Motion is short and functional: a ring that draws once, color transitions on hover, a pulse while waiting. No decorative animation runs on idle surfaces. Explicitly avoided: gradients, glass, purple-to-blue AI styling, glow around the score, dashboard furniture, and celebration effects.

**Key Characteristics:**
- Flat surfaces separated by 1px slate borders.
- One green accent reserved for action and verification.
- System sans throughout, with weight and color carrying hierarchy.
- Compact radii: 16px containers, 12px controls, full-round chips.
- Score color is state, driven by bands, not brand.

## Colors

A muted slate base with a single verification green and three state bands for score and error feedback.

### Primary
- **Verification Green** (#047857): primary buttons, inline links, focus rings, and positive verification marks. It is the only green that appears as an action surface.
- **Verification Green Deep** (#065f46): hover state for the primary button and emphasized links. Never used at rest.

### Secondary
- **Signal Green** (#10b981): the score ring stroke for strong matches, with **Focus Green** (#059669) reserved for focused field borders. These are feedback colors, not brand surfaces.

### Tertiary
- **Needs-Work Rose** (#f43f5e) and **Tailoring Amber** (#f59e0b): score bands below 50 and from 50 to 74. Their pale surfaces (#fff1f2, #fffbeb) are used for error banners, keyword chips that carry the same meaning, and the verdict block that holds the score ring and verdict copy; emerald's pale surface (#ecfdf5) joins them for the verdict block at scores of 75 and up.

### Neutral
- **Page Slate** (#f8fafc): body background.
- **Raised White** (#ffffff): panels, header, inputs.
- **Muted Slate** (#f1f5f9): matched chips, skeleton blocks, inset notes.
- **Hairline Slate** (#e2e8f0): the default 1px border on every panel, input, and chip.
- **Ink** (#0f172a): headings and primary text.
- **Body Slate** (#475569): supporting sentences and input values.
- **Quiet Slate** (#64748b): hints, counters, and uppercase section labels.

### Named Rules

**The One Green Rule.** Verification Green marks action and verification only: primary buttons, links, focus rings, check marks, and strong scores. It never fills a background for decoration, and no second brand hue is introduced.

**The Band Rule.** Score color is state, not brand: rose below 50, amber from 50 to 74, emerald from 75 up. A single view uses one band only, and that band governs the ring, the verdict text, and its supporting marks together.

**The Muted Chrome Rule.** Everything that is not action or score state stays slate. Rose and amber never appear outside an error, a warning, or a score band.

## Typography

**Display Font:** system sans (ui-sans-serif, system-ui, with the platform fallback)
**Body Font:** system sans (same stack)
**Label/Mono Font:** system sans, with tabular numerals for counters and the score

**Character:** Neutral and unremarkable on purpose. The type carries no personality of its own so the score and the keywords stay the loudest things on screen. Numerals are tabular wherever values change.

### Hierarchy

- **Display** (600, 2.25rem, 1.1 line-height, tight tracking): the score numeral inside the ring, and nothing else.
- **Title** (600, 1rem): panel headers and the product name. Pairs with a 14px muted subtitle where context is needed.
- **Body** (400, 0.875rem, 1.625 line-height): field values, hints, suggestions, and panel copy. Line length stays under about 70 characters.
- **Label** (500, 0.75rem): counters, badge text, and inline metadata.
- **Micro** (400, 0.6875rem): importance and category inside keyword chips.

### Named Rules

**The Quiet Scale Rule.** No display font, no oversized headings. The score numeral is the only type above 16px; every other hierarchy step comes from weight and color.

**The Label Case Rule.** Uppercase appears only on section labels inside the results panel, always at 0.75 to 0.875rem with wide tracking and Quiet Slate. No other text is uppercased.

## Layout

A single centered column, 72rem maximum, with page padding of 16px, 24px at the small breakpoint, and 32px at large. The header is a white band with a single hairline bottom border; content sits on Page Slate beneath it.

From 1024px the main area is a two-column grid: the input form on the left, the results panel on the right, with a 32px gap. The results column sticks 24px from the top while the form scrolls. Below 1024px the columns stack in source order with a 24px gap, and a finished analysis scrolls the results panel into view.

Inner panels use 20 to 24px padding, with a 20px vertical rhythm between fields and 24px between result sections. Spacing stays on the 4px grid: 4, 8, 12, 16, 20, 24, 32. Nothing uses a value off that scale.

### Named Rules

**The Two-Column Rule.** Form left, results right from 1024px up. Below that the page stacks and results follow the form; never place results before the inputs on narrow screens.

## Elevation & Depth

The system is flat with borders. Panels, inputs, chips, and the header are separated by a 1px Hairline Slate border, not by shadow or tonal lift. Depth is conveyed by the border and by the slate page behind white panels. The single exception is the settings dialog, which uses a large ambient shadow and a dimmed backdrop to sit above the page. Skeletons are tonal only.

### Shadow Vocabulary

- **Modal lift** (`box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25)`): the settings dialog only.
- **Backdrop dim** (`background: rgba(15, 23, 42, 0.5)`): behind the dialog via `::backdrop`.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest and separated by borders. Shadow is reserved for the modal; adding a shadow to a card, input, or chip is a regression.

## Shapes

Form language is softly rectangular. Panels and the dialog use a 16px radius, controls and buttons 12px, and chips and badges are fully round. Inset note blocks use 12px, evidence quotes use 6px, and the small copy button uses 8px. Borders are always 1px and always Hairline Slate, except semantic chips and error banners, which take their matching state border. There is no clipping, no cut corner, and no decorative geometry; the score ring is the only circular form.

### Named Rules

**The Two-Radius Rule.** Containers are 16px, controls 12px, chips are full. A role keeps its radius everywhere it appears; do not introduce a third radius for the same role.

## Components

### Buttons

- **Shape:** 12px radius, 1px border only on secondary variants.
- **Primary:** solid Verification Green, white 14px semibold text, 10px by 20px padding, minimum 176px wide, optional leading spinner while working. Hover deepens to Verification Green Deep; disabled drops to 50% opacity with a not-allowed cursor.
- **Secondary:** white surface, 1px Hairline Slate border, Body Slate text, 8px by 16px padding. Hover fills with Page Slate.
- **Text button:** no surface, no border, Verification Green semibold 14px, underline on hover with 4px offset. Used for "Load example" and "Clear".

### Chips

- **Style:** fully round, 1px border, 10px horizontal and 4px vertical padding, 14px text. Missing required chips use the rose surface and border, missing preferred chips use the amber pair, matched chips use Muted Slate with a small Signal Green check. Matched chips may carry a disclosure button that reveals an italic 12px evidence quote on a Muted Slate inset.
- **State:** a missing chip carries an 11px metadata line with importance and category. Required and Optional field badges reuse the round shape at 12px text on a neutral or muted surface.

### Cards / Containers

- **Corner Style:** 16px radius.
- **Background:** raised white on the Page Slate body.
- **Shadow Strategy:** none at rest; see Elevation.
- **Border:** 1px Hairline Slate.
- **Internal Padding:** 20 to 24px, 24px from the large breakpoint up.

### Inputs / Fields

- **Style:** white surface, 1px Hairline Slate border, 12px radius, 10px by 14px padding, 14px Body Slate value text, Quiet Slate placeholder. Textareas are vertically resizable with 1.625 line-height.
- **Focus:** the border shifts to Focus Green; the global focus-visible ring is a 2px Verification Green outline at 2px offset, and the primary button overrides it to Ink for contrast.
- **Error / Disabled:** no inline field error style exists. Errors surface in the results panel as a rose banner; disabled controls drop to 50% opacity.

### Navigation

There is no navigation bar. A single header holds the product mark, a one-line subtitle, and a 40px square settings button with a hairline border and 12px radius that darkens its icon on hover. The dialog itself is a native modal with a dimmed backdrop, a 16px radius, and a 26rem maximum width.

### Signature Component

The score ring is the product's readout: a 160px SVG circle, 68px radius, 12px stroke, with a slate track and a band-colored progress arc that draws over 700ms with a decelerating ease. The numeric score is centered in 36px semibold, with an uppercase 12px "match" label beneath. It is the one place where a large number and a curve are allowed, and it should stay unadorned: no gradient, no glow, no tick marks.

## Do's and Don'ts

### Do:

- **Do** separate panels with 1px Hairline Slate borders on Page Slate; flat is the default.
- **Do** keep Verification Green for actions, links, focus, checks, and scores of 75 or more.
- **Do** drive the score ring, verdict text, and score-related marks from the same band color.
- **Do** hold type at 14px body and 16px titles; reserve 36px for the score numeral.
- **Do** use 16px radius for containers, 12px for controls, and full radius for chips.
- **Do** meet WCAG 2.2 AA: labelled controls, visible focus, keyboard-operable dialog and chips, and contrast checked for every text-on-surface pair.

### Don't:

- **Don't** add gradients, glass, glow, or purple-to-blue AI styling.
- **Don't** use shadows on cards, inputs, or chips; only the modal lifts.
- **Don't** introduce a second accent hue beyond the green action color and the rose, amber, and emerald state bands.
- **Don't** use rose or amber decoratively; they always mean error, warning, or a low score.
- **Don't** upsize headings to create hierarchy; use weight and color instead.
- **Don't** wrap the score in celebration: no confetti, mascots, or celebratory animation.
